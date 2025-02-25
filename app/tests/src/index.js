describe('AdaLite Test Suite', () => {
  require('./common/setup-test-config')

  describe('CBOR', () => {
    require('./cbor')
  })
  describe('Blockchain Explorer', () => {
    require('./blockchain-explorer')
  })
  describe('Byron Address Manager', () => {
    require('./address-manager')
  })
  describe('Import/Export Wallet as JSON', () => {
    require('./keypass-json')
  })
  describe('Actions', () => {
    require('./actions/actions')
  })
  describe('Shelley testnet', () => {
    require('./shelley')
  })
  describe('Address manager', () => {
    require('./wallet/address-manager')
  })
  describe('Account manager', () => {
    require('./wallet/account-manager')
  })
  describe('Account', () => {
    require('./wallet/account/account')
  })
  describe('Token bundle', () => {
    require('./tokenBundle')
  })
  describe('Token registry api', () => {
    require('./tokenRegistry')
  })
  describe('Transaction planning', () => {
    require('./transaction-planner')
  })
  describe('Change computing', () => {
    require('./computeChange')
  })
  describe('Ada parsing', () => {
    require('./helpers/parseCoins')
  })
  describe('Miscellaneous', () => {
    require('./miscellaneous')
  })
})
