'use strict'; // eslint-disable-line strict

var _ = require('lodash');
var assert = require('assert');
var utils = require('./utils');
var parseAmount = require('./amount');

function parseEscrowCreation(tx) {
  assert(tx.TransactionType === 'EscrowCreate');

  return utils.removeUndefined({
    amount: parseAmount(tx.Amount).value,
    destination: tx.Destination,
    memos: utils.parseMemos(tx),
    condition: tx.Condition,
    allowCancelAfter: utils.parseTimestamp(tx.CancelAfter),
    allowExecuteAfter: utils.parseTimestamp(tx.FinishAfter),
    sourceTag: tx.SourceTag,
    destinationTag: tx.DestinationTag
  });
}

module.exports = parseEscrowCreation;