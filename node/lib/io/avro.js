const {
  createFileEncoder,
  Type,
  streams: { BlockDecoder },
} = require('avsc');
const { TickerInfo } = require('../datatypes');
const { createReadStream } = require('fs');

const tickerAvroSchema = {
  type: 'record',
  name: 'ticker',
  fields: [
    { name: 'ticker', type: 'string' },
    { name: 'description', type: 'string' },
  ],
};

const writeAvroTickers = async (items = [new TickerInfo()], filepath = '') => {
  const writeItem = (item = new TickerInfo()) =>
    new Promise((resolve, reject) => {
      const result = type.isValid(item, {
        errorHook: (err) => {
          err.forEach((key) => {
            console.log('Invalid field name: ' + key);
            console.log(
              'Invalid field content:' + JSON.stringify(item[key], null, 2)
            );
          });
          reject();
        },
      });
      if (result) {
        encoder.write(item, resolve);
      }
    });

  const encoder = createFileEncoder(filepath, tickerAvroSchema);
  const type = Type.forSchema(tickerAvroSchema);
  await Promise.all(items.map(writeItem));
  encoder.end();
};

const streamToTickerInfoCollection = (stream) => {
  const tickerInfoCollection = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (data = new TickerInfo()) =>
      tickerInfoCollection.push(data)
    );
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(tickerInfoCollection));
  });
};

const readAvroTickers = async () => {
  const stream = createReadStream('./tickers.avro').pipe(new BlockDecoder());
  const tickerInfoCollection = await streamToTickerInfoCollection(stream);
  return tickerInfoCollection;
};

module.exports = {
  writeAvroTickers,
  readAvroTickers,
};
