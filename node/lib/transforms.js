const { TickerResponse, TickerInfo } = require('./datatypes');

// stringToAlphaNumericString :: String -> String
const stringToAlphaNumericString = (string = '') =>
  string.replace(/[^0-9a-z ]/gi, '');

// tickerResponseToTickerInfo :: TickerReponse -> TickerInfo
const tickerResponseToTickerInfo = (
  { symbolTicker, instrumentName } = new TickerResponse()
) =>
  new TickerInfo(
    stringToAlphaNumericString(symbolTicker),
    stringToAlphaNumericString(instrumentName)
  );

module.exports = {
  tickerResponseToTickerInfo,
};
