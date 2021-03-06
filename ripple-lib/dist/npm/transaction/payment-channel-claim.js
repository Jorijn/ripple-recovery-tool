'use strict'; // eslint-disable-line strict

var utils = require('./utils');
var ValidationError = utils.common.errors.ValidationError;
var claimFlags = utils.common.txFlags.PaymentChannelClaim;
var _utils$common = utils.common,
    validate = _utils$common.validate,
    xrpToDrops = _utils$common.xrpToDrops;


function createPaymentChannelClaimTransaction(account, claim) {
  var txJSON = {
    Account: account,
    TransactionType: 'PaymentChannelClaim',
    Channel: claim.channel,
    Flags: 0
  };

  if (claim.balance !== undefined) {
    txJSON.Balance = xrpToDrops(claim.balance);
  }
  if (claim.amount !== undefined) {
    txJSON.Amount = xrpToDrops(claim.amount);
  }

  if (Boolean(claim.signature) !== Boolean(claim.publicKey)) {
    throw new ValidationError('"signature" and "publicKey" fields on' + ' PaymentChannelClaim must only be specified together.');
  }

  if (claim.signature !== undefined) {
    txJSON.Signature = claim.signature;
  }
  if (claim.publicKey !== undefined) {
    txJSON.PublicKey = claim.publicKey;
  }

  if (claim.renew === true && claim.close === true) {
    throw new ValidationError('"renew" and "close" flags on PaymentChannelClaim' + ' are mutually exclusive');
  }

  if (claim.renew === true) {
    txJSON.Flags |= claimFlags.Renew;
  }
  if (claim.close === true) {
    txJSON.Flags |= claimFlags.Close;
  }

  return txJSON;
}

function preparePaymentChannelClaim(address, paymentChannelClaim) {
  var instructions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  validate.preparePaymentChannelClaim({ address: address, paymentChannelClaim: paymentChannelClaim, instructions: instructions });
  var txJSON = createPaymentChannelClaimTransaction(address, paymentChannelClaim);
  return utils.prepareTransaction(txJSON, this, instructions);
}

module.exports = preparePaymentChannelClaim;