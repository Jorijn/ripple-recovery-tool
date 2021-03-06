'use strict'; // eslint-disable-line strict

var _ = require('lodash');
var assert = require('assert');
var utils = require('./utils');
var parseAmount = require('./amount');
var txFlags = utils.txFlags;

function isNoDirectRipple(tx) {
  return (tx.Flags & txFlags.Payment.NoRippleDirect) !== 0;
}

function isQualityLimited(tx) {
  return (tx.Flags & txFlags.Payment.LimitQuality) !== 0;
}

function removeGenericCounterparty(amount, address) {
  return amount.counterparty === address ? _.omit(amount, 'counterparty') : amount;
}

function parsePayment(tx) {
  assert(tx.TransactionType === 'Payment');

  var source = {
    address: tx.Account,
    maxAmount: removeGenericCounterparty(parseAmount(tx.SendMax || tx.Amount), tx.Account),
    tag: tx.SourceTag
  };

  var destination = {
    address: tx.Destination,
    amount: removeGenericCounterparty(parseAmount(tx.Amount), tx.Destination),
    tag: tx.DestinationTag
  };

  return utils.removeUndefined({
    source: utils.removeUndefined(source),
    destination: utils.removeUndefined(destination),
    memos: utils.parseMemos(tx),
    invoiceID: tx.InvoiceID,
    paths: tx.Paths ? JSON.stringify(tx.Paths) : undefined,
    allowPartialPayment: utils.isPartialPayment(tx) || undefined,
    noDirectRipple: isNoDirectRipple(tx) || undefined,
    limitQuality: isQualityLimited(tx) || undefined
  });
}

module.exports = parsePayment;