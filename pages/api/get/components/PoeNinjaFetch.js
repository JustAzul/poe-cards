// eslint-disable-next-line import/no-extraneous-dependencies
import got from 'got';
// eslint-disable-next-line import/no-extraneous-dependencies
import { sleep } from 'azul-tools';
import { duration } from 'moment';

async function RequestItemOverview(League, Type) {
  const searchParams = {
    league: League,
    type: Type,
  };

  const o = {
    url: 'https://proxy.justazul.workers.dev',
    headers: {
      url: 'https://poe.ninja/api/data/itemoverview',
      params: JSON.stringify(searchParams),
    },
    responseType: 'json',
  };

  try {
    const { body } = await got(o);
    return body.lines;
  } catch (err) {
    await sleep(duration(1, 'second'));
    // eslint-disable-next-line prefer-rest-params
    return RequestItemOverview(...arguments);
  }
}

async function RequestCurrencyOverview(League) {
  const searchParams = {
    league: League,
    type: 'Currency',
  };

  const o = {
    url: 'https://proxy.justazul.workers.dev',
    headers: {
      url: 'https://poe.ninja/api/data/currencyoverview',
      params: JSON.stringify(searchParams),
    },
    responseType: 'json',
  };

  try {
    const { body: data } = await got(o);

    const CurrencyOverview = data.lines;
    const CurrencyDetails = data.currencyDetails;

    const Response = {
      Overview: CurrencyOverview,
      Details: CurrencyDetails,
    };

    return Response;
  } catch (err) {
    await sleep(duration(5, 'seconds'));
    return RequestCurrencyOverview(League);
  }
}

function GetItemOverview(Database, Name, Class, Corrupted = false, Links = 0, gemLevel = 0) {
  // if(Legacy) Class = 9;

  return new Promise((resolve) => {
    const o = {
      name: Name,
      links: Links,
      itemClass: Class,
      corrupted: Corrupted,
      gemLevel,
    };

    // eslint-disable-next-line consistent-return
    Database.find(o, (err, result) => {
      if (err) throw err;
      if (result.length === 0) return resolve(null);

      resolve(result[0]);
    });
  });
}

module.exports = {
  GetItemOverview,
  RequestCurrencyOverview,
  RequestItemOverview,
};
