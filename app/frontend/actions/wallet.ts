import {NETWORKS, WANTED_DELEGATOR_STAKING_ADDRESSES} from '../wallet/constants'
import {CryptoProviderType} from '../wallet/types'
import ShelleyCryptoProviderFactory from '../wallet/shelley/shelley-crypto-provider-factory'
import {ShelleyWallet} from '../wallet/shelley-wallet'
import mnemonicToWalletSecretDef from '../wallet/helpers/mnemonicToWalletSecretDef'

import debugLog from '../helpers/debugLog'
import getConversionRates from '../helpers/getConversionRates'

import {ADALITE_CONFIG} from '../config'
import {AccountInfo, Lovelace, AssetFamily, AuthMethodType, LedgerTransportType} from '../types'
import {initialState} from '../store'
import {State, Store} from '../state'
import errorActions from './error'
import loadingActions from './loading'

import {saveAs} from '../libs/file-saver'
import {exportWalletSecretDef} from '../wallet/keypass-json'

// TODO: (refactor), this should not call "setState" as it is not action
const fetchConversionRates = async (conversionRates, setState) => {
  try {
    setState({
      conversionRates: await conversionRates,
    })
  } catch (e) {
    debugLog('Could not fetch conversion rates.')
    setState({
      conversionRates: null,
    })
  }
}

// TODO: we may be able to remove this, kept for backwards compatibility
const getShouldShowSaturatedBanner = (accountsInfo: Array<AccountInfo>) =>
  accountsInfo.some(({poolRecommendation}) => poolRecommendation.shouldShowSaturatedBanner)

type Wallet = ReturnType<typeof ShelleyWallet>
let wallet: Wallet
export const setWallet = (w: Wallet) => {
  wallet = w
}
export const getWallet = (): Wallet => wallet

const accountsIncludeStakingAddresses = (
  accountsInfo: Array<AccountInfo>,
  soughtAddresses: Array<string>
): boolean => {
  const stakingAddresses = accountsInfo.map((accountInfo) => accountInfo.stakingAddress)
  return stakingAddresses.some((address) => soughtAddresses.includes(address))
}

export default (store: Store) => {
  const {loadingAction} = loadingActions(store)
  const {setError} = errorActions(store)
  const {setState} = store

  const loadWallet = async (
    state: State,
    {
      cryptoProviderType,
      walletSecretDef,
      ledgerTransportType,
      shouldExportPubKeyBulk,
    }: {
      cryptoProviderType: CryptoProviderType
      walletSecretDef?: any // TODO: until now, arguments came in freestyle combinations, refactor
      ledgerTransportType?: LedgerTransportType
      shouldExportPubKeyBulk: boolean
    }
  ) => {
    loadingAction(state, 'Loading wallet data...')
    setState({walletLoadingError: undefined})
    const isShelleyCompatible = !(walletSecretDef && walletSecretDef.derivationScheme.type === 'v1')
    const config = {
      ...ADALITE_CONFIG,
      isShelleyCompatible,
      shouldExportPubKeyBulk,
      ledgerTransportType,
    }
    try {
      loadingAction(
        state,
        'Please allow access to your device. Select your device in dropdown and then click Connect.'
      )
      const cryptoProvider = await ShelleyCryptoProviderFactory.getCryptoProvider(
        cryptoProviderType,
        {
          walletSecretDef,
          network: NETWORKS[ADALITE_CONFIG.ADALITE_NETWORK],
          config,
        }
      )
      loadingAction(state, 'Loading wallet data...')

      setWallet(
        await ShelleyWallet({
          config,
          cryptoProvider,
        })
      )

      const validStakepoolDataProvider = await wallet.getStakepoolDataProvider()
      const accountsInfo = await wallet.getAccountsInfo(validStakepoolDataProvider)
      const shouldShowSaturatedBanner = getShouldShowSaturatedBanner(accountsInfo)

      const conversionRatesPromise = getConversionRates(state)
      const usingHwWallet = wallet.isHwWallet()
      const maxAccountIndex = wallet.getMaxAccountIndex()
      const shouldShowWantedAddressesModal = accountsIncludeStakingAddresses(
        accountsInfo,
        WANTED_DELEGATOR_STAKING_ADDRESSES
      )
      const hwWalletName = usingHwWallet ? wallet.getWalletName() : null
      if (usingHwWallet) loadingAction(state, `Waiting for ${hwWalletName}...`)
      const demoRootSecret = (
        await mnemonicToWalletSecretDef(ADALITE_CONFIG.ADALITE_DEMO_WALLET_MNEMONIC)
      ).rootSecret
      const isDemoWallet = walletSecretDef && walletSecretDef.rootSecret.equals(demoRootSecret)
      setState({
        validStakepoolDataProvider,
        accountsInfo,
        maxAccountIndex,
        shouldShowSaturatedBanner,
        walletIsLoaded: true,
        loading: false,
        mnemonicAuthForm: {
          mnemonicInputValue: '',
          mnemonicInputError: null,
          formIsValid: false,
        },
        hwWalletName,
        isDemoWallet,
        shouldShowNonShelleyCompatibleDialog: !isShelleyCompatible,
        shouldShowWantedAddressesModal,
        shouldShowGenerateMnemonicDialog: false,
        shouldShowAddressVerification: usingHwWallet,
        // send form
        sendAmount: {assetFamily: AssetFamily.ADA, fieldValue: '', coins: 0 as Lovelace},
        sendAddress: {fieldValue: ''},
        // shelley
        isShelleyCompatible,
      })
      await fetchConversionRates(conversionRatesPromise, setState)
    } catch (e) {
      setState({
        loading: false,
      })
      setError(state, {errorName: 'walletLoadingError', error: e})
      setState({
        shouldShowWalletLoadingErrorModal: true,
      })
      return false
    }
    return true
  }

  const reloadWalletInfo = async (state: State) => {
    loadingAction(state, 'Reloading wallet info...')
    try {
      const accountsInfo = await wallet.getAccountsInfo(state.validStakepoolDataProvider)
      const conversionRates = getConversionRates(state)

      // timeout setting loading state, so that loading shows even if everything was cached
      setTimeout(() => setState({loading: false}), 500)
      setState({
        accountsInfo,
        shouldShowSaturatedBanner: getShouldShowSaturatedBanner(accountsInfo),
      })
      await fetchConversionRates(conversionRates, setState)
    } catch (e) {
      setState({
        loading: false,
      })
      setError(state, {errorName: 'walletLoadingError', error: e})
      setState({
        shouldShowWalletLoadingErrorModal: true,
      })
    }
  }

  const loadDemoWallet = (state: State) => {
    setState({
      mnemonicAuthForm: {
        mnemonicInputValue: ADALITE_CONFIG.ADALITE_DEMO_WALLET_MNEMONIC,
        mnemonicInputError: null,
        formIsValid: true,
      },
      walletLoadingError: undefined,
      shouldShowWalletLoadingErrorModal: false,
      authMethod: AuthMethodType.MNEMONIC,
    })
  }

  const logout = (state: State) => {
    setWallet(null)
    setState(
      {
        ...initialState,
        displayWelcome: false,
        autoLogin: false,
      },
      // @ts-ignore (we don't have types for forced state overwrite)
      true
    ) // force overwriting the state
    window.history.pushState({}, '/', '/')
  }

  const exportJsonWallet = async (state, password, walletName) => {
    const walletExport = JSON.stringify(
      await exportWalletSecretDef(getWallet().getWalletSecretDef(), password, walletName)
    )

    const blob = new Blob([walletExport], {
      type: 'application/json;charset=utf-8',
    })
    saveAs(blob, `${walletName}.json`)
  }

  return {
    loadWallet,
    reloadWalletInfo,
    loadDemoWallet,
    logout,
    getShouldShowSaturatedBanner,
    exportJsonWallet,
  }
}
