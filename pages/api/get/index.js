
import { sleep } from 'azul-tools';
import { duration } from 'moment';
import Datastore from 'nedb';

import { GetCurrencyValue, GenerateFlipTable } from './components/Helper';
import { RequestCurrencyOverview, RequestItemOverview } from './components/PoeNinjaFetch';

export default async function(req, res) {
    const { query } = req;

    const List = JSON.parse(query['list']);
    const League = query['league'];
    
    res.statusCode = 200;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'max-age=0');

    let DB = new Datastore();

    for(const i in List) {
        const Type = List[i];
        
        const Result = await RequestItemOverview(League, Type);
        await DB.insert(Result);
        await sleep(duration(500, 'milliseconds'));
    }

    const { Overview, Details } = await RequestCurrencyOverview(League);

    await DB.insert(Overview);
    await DB.insert(Details);

    const ExaltValue = await GetCurrencyValue(DB, "Exalted Orb");
    const TableData = await GenerateFlipTable(DB, ExaltValue);
    const MirrorValue = await GetCurrencyValue(DB, "Mirror of Kalandra");

    const CurrencyData = {
        ExaltValue,
        MirrorValue,
        XMirrorValue: Math.round(MirrorValue / ExaltValue),
        DivineValue: await GetCurrencyValue(DB, "Divine Orb"),
        AnullValue: await GetCurrencyValue(DB, "Orb of Annulment"),
    }

    const o = {
        CurrencyData,
        TableData
    };

    res.end(JSON.stringify(o));

}