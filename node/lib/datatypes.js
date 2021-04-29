class AxiosRequest {
  constructor(method = '', url = '', data = {}) {
    this.method = method;
    this.url = url;
    this.data = data;
  }
}

// TickerResponse :: Return object for each ticker from NYSE API
class TickerResponse {
  constructor(
    total = '',
    url = '',
    exchangeId = '',
    instrumentType = '',
    symbolTicker = '',
    symbolExchangeTicker = '',
    normalizedTicker = '',
    symbolEsignalTicker = '',
    instrumentName = '',
    micCode = ''
  ) {
    this.total = total;
    this.url = url;
    this.exchangeId = exchangeId;
    this.instrumentType = instrumentType;
    this.symbolTicker = symbolTicker;
    this.symbolExchangeTicker = symbolExchangeTicker;
    this.normalizedTicker = normalizedTicker;
    this.symbolEsignalTicker = symbolEsignalTicker;
    this.instrumentName = instrumentName;
    this.micCode = micCode;
  }
}

// TickerResponse :: Pared down object to be written to file
class TickerInfo {
  constructor(ticker = '', description = '') {
    this.ticker = ticker;
    this.description = description;
  }
}

module.exports = {
  AxiosRequest,
  TickerResponse,
  TickerInfo,
};
