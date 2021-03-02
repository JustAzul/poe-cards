// eslint-disable-next-line import/no-extraneous-dependencies
import { sleep } from 'azul-tools';
import { duration } from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import Datastore from 'nedb';

// eslint-disable-next-line import/named
import { GetCurrencyValue, GenerateFlipTable } from './components/Helper';
// eslint-disable-next-line import/named
import { RequestCurrencyOverview, RequestItemOverview } from './components/PoeNinjaFetch';

import List from './data/FetchList';

export default async function (req, res) {
  const { query } = req;
  const League = query.league;

  res.statusCode = 200;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'max-age=0');

  const DB = new Datastore();

  for (let i = 0; i < List.length; i++) {
    const Type = List[i];

    // eslint-disable-next-line no-await-in-loop
    const Result = await RequestItemOverview(League, Type);
    DB.insert(Result);
    // eslint-disable-next-line no-await-in-loop
    await sleep(duration(500, 'milliseconds'));
  }

  const { Overview, Details } = await RequestCurrencyOverview(League);

  await DB.insert(Overview);
  await DB.insert(Details);

  const ExaltValue = await GetCurrencyValue(DB, 'Exalted Orb');
  const TableData = await GenerateFlipTable(DB, ExaltValue);
  const MirrorValue = await GetCurrencyValue(DB, 'Mirror of Kalandra');

  const CurrencyData = {
    ExaltValue,
    MirrorValue,
    XMirrorValue: Math.round(MirrorValue / ExaltValue),
    DivineValue: await GetCurrencyValue(DB, 'Divine Orb'),
    AnullValue: await GetCurrencyValue(DB, 'Orb of Annulment'),
  };

  const o = {
    CurrencyData,
    TableData,
  };

  res.end(JSON.stringify(o));
}
