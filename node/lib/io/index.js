const axios = require('axios');
const { AxiosRequest } = require('../datatypes');
const { tickerResponseToTickerInfo } = require('../transforms');
const { writeFileSync } = require('fs');
const Papa = require('papaparse');

const NYSE_API_URL = 'https://www.nyse.com/api/quotes/filter';

const TickerInfoCollection = async () => {
  const tickerRequestBody = {
    instrumentType: 'EXCHANGE_TRADED_FUND',
    pageNumber: 0,
    sortColumn: 'NORMALIZED_TICKER',
    sortOrder: 'ASC',
    maxResultsPerPage: 3000,
    filterToken: '',
  };

  const tickerInfoCollection = [];

  while (true) {
    const response = await axios(
      new AxiosRequest('post', NYSE_API_URL, tickerRequestBody)
    );
    tickerInfoCollection.push(...response.data.map(tickerResponseToTickerInfo));
    tickerRequestBody.pageNumber += 1;
    if (response.data.length < 3000) break;
  }

  return tickerInfoCollection;
};

const dataToFile = (data = '', filepath = '') => writeFileSync(filepath, data);

const jsonToCSV = (data = {}, filepath = '') =>
  dataToFile(Papa.unparse(data), filepath);

module.exports = {
  TickerInfoCollection,
  jsonToCSV,
};
