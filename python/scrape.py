import requests
import argparse
import re
import pandas as pd
import os
import json
import etf_pb2


def get_tickers():
    """makes POST request to NYSE's API to get all ETF ticker data"""

    url = 'https://www.nyse.com/api/quotes/filter'
    headers = {
        'Content-Type': 'application/json'
    }
    all_tickers = []

    page_number = 1
    per_page = 300
    while (True):
        body = {
            "instrumentType": "EXCHANGE_TRADED_FUND",
            "pageNumber": page_number,
            "sortColumn": "NORMALIZED_TICKER",
            "sortOrder": "ASC",
            "maxResultsPerPage": per_page,
            "filterToken": ""
        }

        response = requests.post(url, data=json.dumps(body), headers=headers)
        tickers = response.json()
        all_tickers += tickers
        print(f'page: {page_number} | ticker count: {len(tickers)}')
        if len(tickers) < per_page:
            break
        else:
            page_number += 1

    return all_tickers


def remove_non_alphanumeric(s):
    return re.sub(r'\W+ ', '', s)


def transform_tickers(tickers):
    """transforms raw data from API to output format."""

    transformed_tickers = []
    for ticker in tickers:
        transformed_ticker = {}

        symbol = remove_non_alphanumeric(ticker['symbolTicker'])
        description = remove_non_alphanumeric(ticker['instrumentName'])

        transformed_ticker['ticker'] = symbol
        transformed_ticker['description'] = description

        transformed_tickers.append(transformed_ticker)

    return transformed_tickers


def export_tickers(tickers, output_type, output_dir):
    """exports ticker data into either csv, protobuf, or avro"""
    if output_type == 'csv':
        output_path = f'{output_dir}/etf_tickers.csv'
        pd.DataFrame.from_records(tickers).to_csv(output_path, index=False)
        print(f'outputted tickers to {output_path}')
    elif output_type == 'protobuf':
        for ticker in tickers:
            ticker_symbol = ticker['ticker']
            description = ticker['description']

            etf = etf_pb2.Etf()
            etf.ticker = ticker_symbol
            etf.description = description

            output_path = f'{output_dir}/{ticker_symbol}.pb'
            with open(output_path, 'wb') as f:
                f.write(etf.SerializeToString())
        print(f"outputed pb's to {output_dir}")
    elif output_type == 'avro':
        print("not developed")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="parses ETF tickers and its description from NYSE")
    parser.add_argument("--output_type", default='csv', help="output filetype. currently only supports csv, protobuf")
    parser.add_argument("--output_dir", default='.', help="output directory")
    args = parser.parse_args()

    output_type = args.output_type
    output_dir = args.output_dir

    # arg validation
    # valid_output_types = ('avro', 'csv', 'protobuf')
    valid_output_types = ('csv', 'protobuf')
    if output_type not in valid_output_types:
        print("not a valid output type")
        exit()
    
    if not os.path.isdir(output_dir):
        print("not a valid output path")
        exit()

    tickers = get_tickers()
    transformed_tickers = transform_tickers(tickers)
    export_tickers(transformed_tickers, output_type, output_dir)