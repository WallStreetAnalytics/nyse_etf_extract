const { TickerInfoCollection, jsonToCSV } = require('./lib/io');
const { writeAvroTickers } = require('./lib/io/avro');
const { existsSync } = require('fs');

const argv = require('yargs/yargs')(process.argv.slice(2))
  .usage('Usage: node $0 -o <directory-to-write-to> --ft csv')
  .alias('v', 'version')
  .alias('h', 'help')
  .alias('o', 'outputDir')
  .describe('o', 'The directory in which to write the output file')
  .default('o', process.cwd())
  .check(({ o }, options) => existsSync(o))
  .alias('ft', 'fileType')
  .describe('ft', 'The type of file to write the results to')
  .default('ft', 'csv')
  .choices('ft', ['csv', 'avro']).argv;

const main = async () => {
  const { o, ft } = argv;
  const filepath = (extension = '') => `${o}/etf_tickers.${extension}`;

  const tickerInfoCollection = await TickerInfoCollection();

  if (ft === 'csv') jsonToCSV(tickerInfoCollection, filepath('csv'));
  if (ft === 'avro')
    await writeAvroTickers(tickerInfoCollection, filepath('avro'));
};

main();
