export enum InternalErrorReason {
  SendAddressInvalidAddress = 'SendAddressInvalidAddress',
  SendAddressPoolId = 'SendAddressPoolId',
  SendAmountIsNan = 'SendAmountIsNan',
  SendAmountIsNotPositive = 'SendAmountIsNotPositive',
  SendAmountInsufficientFunds = 'SendAmountInsufficientFunds',
  SendAmountCantSendAnyFunds = 'SendAmountCantSendAnyFunds',
  SendAmountPrecisionLimit = 'SendAmountPrecisionLimit',
  SendAmountIsTooBig = 'SendAmountIsTooBig',
  TokenAmountOnlyWholeNumbers = 'TokenAmountOnlyWholeNumbers',
  TokenSendAmountPrecisionLimit = 'TokenSendAmountPrecisionLimit',
  TokenAmountInsufficientFunds = 'TokenAmountInsufficientFunds',
  SendTokenNotMinimalLovelaceAmount = 'SendTokenNotMinimalLovelaceAmount',
  DonationAmountTooLow = 'DonationAmountTooLow',
  DonationInsufficientBalance = 'DonationInsufficientBalance',
  InvalidStakepoolIdentifier = 'InvalidStakepoolIdentifier',
  TickerSearchDisabled = 'TickerSearchDisabled',
  DelegationBalanceError = 'DelegationBalanceError',
  RewardsBalanceTooLow = 'RewardsBalanceTooLow',
  InvalidMnemonic = 'InvalidMnemonic',
  TransactionRejectedByNetwork = 'TransactionRejectedByNetwork',
  TransactionRejectedWhileSigning = 'TransactionRejectedWhileSigning',
  TransactionNotFoundInBlockchainAfterSubmission = 'TransactionNotFoundInBlockchainAfterSubmission',
  TransactionSubmissionTimedOut = 'TransactionSubmissionTimedOut',
  TxSerializationError = 'TxSerializationError',
  TrezorSignTxError = 'TrezorSignTxError',
  TrezorError = 'TrezorError',
  LedgerOperationError = 'LedgerOperationError',
  CoinAmountError = 'CoinAmountError',
  OutputTooSmall = 'OutputTooSmall',
  ChangeOutputTooSmall = 'ChangeOutputTooSmall',
  TxTooBig = 'TxTooBig',
  OutputTooBig = 'OutputTooBig',
  SendAmountTooLow = 'SendAmountTooLow',
  SendAmountBalanceTooLow = 'SendAmountBalanceTooLow',
  CryptoProviderError = 'CryptoProviderError',
  NetworkError = 'NetworkError',
  ServerError = 'ServerError',
  EpochBoundaryUnderway = 'EpochBoundaryUnderway',
  BitBox02OutdatedFirmwareError = 'BitBox02OutdatedFirmwareError',
  BitBox02MultiAssetNotSupported = 'BitBox02MultiAssetNotSupported',
  LedgerMultiAssetNotSupported = 'LedgerMultiAssetNotSupported',
  LedgerOutdatedCardanoAppError = 'LedgerOutdatedCardanoAppError',
  LedgerWithdrawalNotSupported = 'LedgerWithdrawalNotSupported',
  LedgerPoolRegNotSupported = 'LedgerPoolRegNotSupported',
  LedgerCatalystNotSupported = 'LedgerCatalystNotSupported',
  LedgerBulkExportNotSupported = 'LedgerBulkExportNotSupported',
  TrezorPoolRegNotSupported = 'TrezorPoolRegNotSupported',
  TrezorMultiAssetNotSupported = 'TrezorMultiAssetNotSupported',
  PoolRegIncorrectBufferLength = 'PoolRegIncorrectBufferLength',
  PoolRegDuplicateOwners = 'PoolRegDuplicateOwners',
  PoolRegInvalidMargin = 'PoolRegInvalidMargin',
  PoolRegInvalidRelay = 'PoolRegInvalidRelay',
  PoolRegInvalidMetadata = 'PoolRegInvalidMetadata',
  PoolRegNoHwWallet = 'PoolRegNoHwWallet',
  PoolRegTxParserError = 'PoolRegTxParserError',
  MissingOwner = 'MissingOwner',
  Error = 'Error',
  TransactionCorrupted = 'TransactionCorrupted', // TODO: i dont think this should be expected
  BitBox02Error = 'BitBox02Error',
}
