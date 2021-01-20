const got = require("got");
const moment = require("moment");
const Datastore = require('nedb');

const {Log, sleep} = require("azul-tools");

const RequestList = require("./list.js");

let Database = {};
let UpdateDate = {};

module.exports = {
    "RequestLeagues": RequestLeagues,
    "checkLeague": checkLeague,
    "UpdateLeagueDatabase": UpdateLeagueDatabase,
    "GetItemOverview": GetItemOverview,
    "GetCurrencyValue": GetCurrencyValue,
    "GetLeagueUpdateDate": GetLeagueUpdateDate
}

function checkLeague(League) {
    return Database.hasOwnProperty(League);
}

async function RequestLeagues() {
    Log(`Requesting leagues from PoE API.`);

    const o = {
        "url": "https://api.pathofexile.com/leagues",
        "searchParams": {
            "type": "main",
            "compact": 1
        },
        "responseType": "json"
    };

    try {
        const {body} = await got(o);

        //handle bad responses
        if (typeof body.filter !== 'function') throw new Error("Malformed Response");

        let data = body.filter(details => details.id.indexOf("SSF") == -1); //Removing SSF Leagues
        data = data.filter(details => details.realm == "pc"); //Picking pc leagues

        let _leagues = {};

        for (let i in data) {
            const league = data[i];

            const o = {
                leagueName: league.id,
                startAt: league.startAt,
                endAt: league.endAt,
                ladder: league.url,
                DaysLeft: league.endAt ? moment(league.endAt).diff(moment(), "days") : 0
            }

            _leagues[o.leagueName] = o;
        }

        return _leagues;

    } catch (err) {
        Log.Warn(`Failed to request leagues from PoE API => ${err}`);
        await sleep(moment.duration(5, 'seconds'));
        return RequestLeagues(...arguments);
    }
}

function GetItemOverview(League, Name, Class, Corrupted = false, Links = 0, gemLevel = 0) {
    //if(Legacy) Class = 9;

    return new Promise(resolve => {

        if (!checkLeague(League)) return resolve(null); // info not found

        const o = {
            name: Name,
            links: Links,
            itemClass: Class,
            corrupted: Corrupted,
            gemLevel: gemLevel
        };

        Database[League].find(o, (err, result) => {
            if (err) throw err;
            if (result.length == 0) return resolve(null);

            resolve(result[0]);
        })
    });

}

function GetCurrencyValue(League, CurrencyName, fullyResult = false) {
    return new Promise(resolve => {

        if (!checkLeague(League)) return resolve(0); // info not found

        Database[League].find({
            "currencyTypeName": CurrencyName
        }, (err, result) => {
            if (err) throw err;
            if (result.length == 0) return resolve(0);

            result = result[0];

            if (result && result.hasOwnProperty("receive") && result.receive != null) {
                const Value = parseInt(result.receive.value);

                if(!fullyResult) return resolve(Value);
                
                const o = {
                    Value: Value,
                    o: result
                }

                return resolve(o);
            }
            
            resolve(0);
        })
    })
}

async function UpdateLeagueDatabase(League) {
    Log(`Updating ${League} league database..`);

    const startedAt = moment();

    const LeagueDatabaseOverview = await RequestLeagueItemsDB(League);

    if (!LeagueDatabaseOverview) {
        DeleteLeagueDatabase(League);
        return Log.Warn(`There is no data about "${League}" league on poe.ninja, skipping..`)
    }

    const CurrencyOverview = await RequestCurrencyOverview(League);
    await LeagueDatabaseOverview.insert(CurrencyOverview.Overview);
    await LeagueDatabaseOverview.insert(CurrencyOverview.Details);

    Database[League] = LeagueDatabaseOverview;
    SetLeagueUpdateDate(League);

    Log(`Successfully updated ${League} league database in ${moment().diff(startedAt,'seconds')} seconds!`);
}

async function RequestLeagueItemsDB(League) {
    const ListSize = RequestList.length;
    Log.Debug(`Starting ${League} league items requests, found ${ListSize} databases.`);

    let _db = new Datastore();

    for (let i = 0; i < ListSize; i++) {
        const Type = RequestList[i];

        const ItemsOverview = await RequestItemOverview(League, Type);
        if (!ItemsOverview) return null; //return new Promise(resolve => resolve());

        await _db.insert(ItemsOverview);

        //Waiting a bit to avoid to many or to fast requests
        const dur = moment.duration(500, 'milliseconds'); //half a seconds
        await sleep(dur);

    }

    //return new Promise(resolve => resolve(_db))
    return _db;
}

function GetLeagueUpdateDate(League) {
    return UpdateDate[League];
}

function SetLeagueUpdateDate(League) {
    UpdateDate[League] = moment().toISOString(true);
}

function DeleteLeagueDatabase(League) {
    if (Database.hasOwnProperty(League)) delete Database[League];
    if (UpdateDate.hasOwnProperty(League)) delete UpdateDate[League];
}

async function RequestItemOverview(League, Type) {
    Log.Debug(`Requesting ${Type}'s Overview from ${League} league.`);

    const o = {
        "url": "https://poe.ninja/api/data/itemoverview",
        "searchParams": {
            "league": League,
            "type": Type
        },
        "responseType": "json"
    };

    try {
        const {body} = await got(o);

        if (!body) return false;

        return body.lines;
    } catch (err) {
        Log.Warn(`Error on RequestItemOverview(), League: ${League}, Type: ${Type}.`, `=> ${err}`);
        await sleep(moment.duration(5, "seconds"));
        return RequestItemOverview(...arguments);
    }
}

async function RequestCurrencyOverview(League) {
    Log.Debug(`Requesting Currency's Overview from ${League} league.`);

    const o = {
        "url": "https://poe.ninja/api/data/currencyoverview",
        "searchParams": {
            "league": League,
            "type": "Currency"
        },
        "responseType": "json"
    };

    try {
        const {body:data} = await got(o);
        const CurrencyOverview = data.lines;
        const CurrencyDetails = data.currencyDetails;

        const Response = {
            "Overview": CurrencyOverview,
            "Details": CurrencyDetails
        };

        return Response;

    } catch (err) {
        Log.Warn(`Error on RequestCurrencyOverview(), League: ${League}.`, `=> ${err}`);
        await sleep(moment.duration(5, "seconds"));
        return RequestCurrencyOverview(...arguments);
    }
}