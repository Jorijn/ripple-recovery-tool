'use strict'; // eslint-disable-line strict

var common = require('../common');


function isConnected() {
  return this.connection.isConnected();
}

function getLedgerVersion() {
  return this.connection.getLedgerVersion();
}

function connect() {
  return this.connection.connect();
}

function disconnect() {
  return this.connection.disconnect();
}

function getServerInfo() {
  return common.serverInfo.getServerInfo(this.connection);
}

function getFee() {
  var cushion = this._feeCushion || 1.2;
  return common.serverInfo.getFee(this.connection, cushion);
}

function formatLedgerClose(ledgerClose) {
  return {
    baseFeeXRP: common.dropsToXrp(ledgerClose.fee_base),
    ledgerHash: ledgerClose.ledger_hash,
    ledgerVersion: ledgerClose.ledger_index,
    ledgerTimestamp: common.rippleTimeToISO8601(ledgerClose.ledger_time),
    reserveBaseXRP: common.dropsToXrp(ledgerClose.reserve_base),
    reserveIncrementXRP: common.dropsToXrp(ledgerClose.reserve_inc),
    transactionCount: ledgerClose.txn_count,
    validatedLedgerVersions: ledgerClose.validated_ledgers
  };
}

module.exports = {
  connect: connect,
  disconnect: disconnect,
  isConnected: isConnected,
  getServerInfo: getServerInfo,
  getFee: getFee,
  getLedgerVersion: getLedgerVersion,
  formatLedgerClose: formatLedgerClose
};