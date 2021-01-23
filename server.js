const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const app = express();
const next = require("next");

const Server = http.createServer(app);
const IO = SocketIO(Server);

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const {duration} = require("moment");
const {watch} = require('graceful-fs');
const {readJSON, Log} = require('azul-tools');

const DB = require("./server/components/database.js");
const helper = require("./server/components/helper.js");

const ServerPort = process.env.PORT || 80;

let TableData = {};
let LeaguesData = {};

let Cards = require("./server/data/Cards.json");
let CurrencyCards = require("./server/data/CurrencyCards.json");

// *Auto reloading Cards.json if needed.
watch("./server/data/Cards.json", async eventType => {
    if (eventType != 'change') return;
    const newFileData = await readJSON("./server/data/Cards.json");
    if (Object.entries(newFileData).length === 0) return;
    Cards = newFileData;
});

// *Auto reloading CurrencyCards.json if needed.
watch("./server/data/CurrencyCards.json", async eventType => {
    if (eventType != 'change') return;
    const newFileData = await readJSON("./server/data/CurrencyCards.json");
    if (Object.entries(newFileData).length === 0) return;
    CurrencyCards = newFileData;
});

async function GenerateFlipTable(League, LeagueExaltedValue) {
    Log.Debug(`Generating ${League} league Table..`);

    let TableArray = await GenerateFlipTableArray(League, LeagueExaltedValue);
    TableArray = await TableArray.sort(function (a, b) {
        const v1 = a.chaosprofit;
        const v2 = b.chaosprofit;
        return v2 - v1;
    });

    return TableArray;
}

async function GenerateFlipTableArray(League, LeagueExaltedValue) {
    let TableArray = [];

    //Cards
    for (let i = 0; i < Cards.length; i++) {
        const Details = Cards[i];
        const o = await GenerateCardsTableRowJson(League, LeagueExaltedValue, Details);
        if (o) TableArray.push(o);
    }

    //Currency Cards
    for (let i = 0; i < CurrencyCards.length; i++) {
        const Details = CurrencyCards[i];
        const o = await GenerateCurrencyCardsTableRowJson(League, LeagueExaltedValue, Details);
        if (o) TableArray.push(o);
    }

    //return new Promise(resolve => resolve(TableArray));
    return TableArray;
}

async function GenerateCurrencyCardsTableRowJson(League, LeagueExaltedValue, Details) {

    const CardData = await DB.GetItemOverview(League, Details.Name, 6);
    if (!CardData) return false;

    const RewardDetails = await DB.GetCurrencyValue(League, Details.Reward, true);
    const RewardBaseChaosValue = RewardDetails.Value;
    if (!RewardBaseChaosValue) return false;

    //Trust System
    if (CardData.count < 10) return false;
    if (RewardDetails.o.receive.count < 10) return false;

    const RewardOrbValue = Details.Reward == "Chaos Orb" ? 1 : RewardBaseChaosValue;
    const RewardChaosValue = RewardOrbValue * Details.Amount;

    const CardExaltedPrice = CardData.hasOwnProperty("exaltedValue") ? CardData.exaltedValue : helper.ChaosToExalted(LeagueExaltedValue, CardData.chaosValue);
    const RewardExaltedValue = helper.ChaosToExalted(LeagueExaltedValue, RewardChaosValue);

    const ItemSetChaosValue = parseInt(CardData.stackSize * CardData.chaosValue);
    const ItemSetExaltedValue = parseFloat((CardData.exaltedValue ? (CardExaltedPrice * CardData.stackSize) : helper.ChaosToExalted(LeagueExaltedValue, CardData.chaosValue * CardData.stackSize)).toFixed(2));

    const ChaosProfit = parseInt(RewardChaosValue - ItemSetChaosValue);
    const ExaltedProfit = (RewardExaltedValue - ItemSetExaltedValue);

    o = CardData;
    o.chaosValue = parseInt(CardData.chaosValue);
    o.exaltedValue = parseFloat(CardExaltedPrice.toFixed(2));
    o.ItemSetChaosValue = ItemSetChaosValue;
    o.ItemSetExaltedValue = parseFloat(ItemSetExaltedValue.toFixed(2));

    o.MaxBuyout = helper.GetMaxBuyoutValue(CardData.chaosValue, ChaosProfit, CardData.stackSize);

    o.RewardData = {};
    o.RewardData.chaosValue = parseInt(RewardChaosValue);
    o.RewardData.exaltedValue = parseFloat(RewardExaltedValue.toFixed(2));

    o.ChaosProfit = ChaosProfit;
    o.ExaltedProfit = parseFloat(ExaltedProfit.toFixed(2));

    o.Currency = true;

    const DisplayReward = Details.Amount > 1 ? `${Details.Amount}x ${Details.Reward}` : Details.Reward;
    const CardDetails = {
        artFilename: CardData.artFilename,
        CardName: CardData.name,
        CardStack: CardData.stackSize,
        RewardName: DisplayReward,
        rewardClass: "00",
        isCorrupted: false,
        Flavour: CardData.flavourText
    }

    const _o = {
        Card: {
            name: Details.Name,
            stack: CardData.stackSize,
            chaosprice: o.chaosValue,
            exaltedprice: o.exaltedValue,
            Details: CardDetails
        },
        Reward: {
            name: DisplayReward,
            chaosprice: o.RewardData.chaosValue,
            exaltedprice: o.RewardData.exaltedValue
        },
        setchaosprice: o.ItemSetChaosValue,
        setexprice: o.ItemSetExaltedValue,
        chaosprofit: o.ChaosProfit,
        exprofit: o.ExaltedProfit,
        isCurrency: true
    };

    return _o.chaosprofit > 0 ? _o : false;

}

async function GenerateCardsTableRowJson(League, LeagueExaltedValue, Details) {

    const CardData = await DB.GetItemOverview(League, Details.Name, 6);
    if (!CardData) return false;
    const RewardData = await DB.GetItemOverview(League, Details.Reward, Details.iClass, Details.Corrupted, Details.Links, Details.gemLevel);
    if (!RewardData) return false;

    //Trust System
    if (CardData.count < 10) return false;
    if (RewardData.count < 10) return false;

    const CardExaltedPrice = CardData.hasOwnProperty("exaltedValue") ? CardData.exaltedValue : helper.ChaosToExalted(LeagueExaltedValue, CardData.chaosValue);
    const RewardExaltedValue = RewardData.hasOwnProperty("exaltedValue") ? RewardData.exaltedValue : helper.ChaosToExalted(LeagueExaltedValue, RewardData.chaosValue);

    const ItemSetChaosValue = parseInt(CardData.stackSize * CardData.chaosValue);
    const ItemSetExaltedValue = parseFloat((CardData.exaltedValue ? (CardExaltedPrice * CardData.stackSize) : helper.ChaosToExalted(LeagueExaltedValue, CardData.chaosValue * CardData.stackSize)).toFixed(2));

    const ChaosProfit = parseInt(RewardData.chaosValue - ItemSetChaosValue);
    const ExaltedProfit = RewardExaltedValue - ItemSetExaltedValue;

    let o = CardData;

    o.chaosValue = parseInt(CardData.chaosValue);
    o.exaltedValue = parseFloat(CardExaltedPrice.toFixed(2));
    o.ItemSetChaosValue = ItemSetChaosValue;
    o.ItemSetExaltedValue = parseFloat(ItemSetExaltedValue.toFixed(2));

    o.MaxBuyout = helper.GetMaxBuyoutValue(CardData.chaosValue, ChaosProfit, CardData.stackSize);

    o.RewardData = RewardData || {};
    o.RewardData.chaosValue = parseInt(o.RewardData.chaosValue || 0);
    o.RewardData.exaltedValue = parseFloat(RewardExaltedValue.toFixed(2));

    o.ChaosProfit = ChaosProfit;
    o.ExaltedProfit = parseFloat(ExaltedProfit.toFixed(2));

    const DisplayReward = RewardData.itemClass == 4 ? `Level ${RewardData.gemLevel} ${RewardData.name}` : RewardData.name;

    const CardDetails = {
        artFilename: CardData.artFilename,
        CardName: CardData.name,
        CardStack: CardData.stackSize,
        RewardName: DisplayReward,
        rewardClass: RewardData.itemClass,
        isCorrupted: RewardData.corrupted,
        Flavour: CardData.flavourText
    }

    const _o = {
        Card: {
            name: CardData.name,
            stack: CardData.stackSize,
            chaosprice: o.chaosValue,
            exaltedprice: o.exaltedValue,
            Details: CardDetails
        },
        Reward: {
            name: DisplayReward,
            chaosprice: o.RewardData.chaosValue,
            exaltedprice: o.RewardData.exaltedValue
        },
        setchaosprice: o.ItemSetChaosValue,
        setexprice: o.ItemSetExaltedValue,
        chaosprofit: o.ChaosProfit,
        exprofit: o.ExaltedProfit,
        isCurrency: false
    };

    return _o.chaosprofit > 0 ? _o : false;

}

async function SendSocketData(League, sock = IO) {
    if (!TableData.hasOwnProperty(League)) {
        
        const result = {
            "success": false,
            "details": {}
        };

        const args = ["LeagueDetails", League, result];

        sock.emit(...args);
        return;
    }    

    const Exalt = await DB.GetCurrencyValue(League, "Exalted Orb");
    const Mirror = await DB.GetCurrencyValue(League, "Mirror of Kalandra");

    const result = {
        "success": true,
        "details": {
            "ExaltValue": Exalt,
            "DivineValue": await DB.GetCurrencyValue(League, "Divine Orb"),
            "AnullValue": await DB.GetCurrencyValue(League, "Orb of Annulment"),
            "MirrorValue": Mirror,
            "XMirrorValue": Math.round(Mirror / Exalt),
            "LastUpdated": await DB.GetLeagueUpdateDate(League),
            //"Onlines": 0,
            "Table": TableData[League]
        }
    };

    const args = ["LeagueDetails", League, result];
    sock.emit(...args);
}

async function Update() {
    const Leagues = await DB.RequestLeagues();

    LeaguesData = Leagues;    

    for (let leagueName in Leagues) {

        //if(leagueName === "Hardcore") continue;
        await DB.UpdateLeagueDatabase(leagueName);

        const Exalt = await DB.GetCurrencyValue(leagueName, "Exalted Orb");

        TableData[leagueName] = await GenerateFlipTable(leagueName, Exalt);
        
        Log.Debug(`Sending latest ${leagueName} League data to currently open pages..`);
        SendSocketData(leagueName);
    }

}

process.nextTick(async () => {
    const UpdateInterval = duration(5, "minutes");
    
    //await Promise.all([Update(), nextApp.prepare()]);
    await nextApp.prepare();
    Update();
    
    if (!dev) {
        setInterval(() => Update(), UpdateInterval);
        Log.Debug(`Timer Started!`);
    }
    
    app.get("*", nextHandler);
    Server.listen(ServerPort, () => Log(`Listening on ${ServerPort}`));

});

IO.on("connection", Socket => {
    
    Log(`[${Socket['id']}] New Connection!`);

    const HandleListData = () => Socket.emit("LeagueListData", LeaguesData);    
    const HandleLeagueDetails = league => SendSocketData(league, Socket);

    Socket.on("getLeagueList", HandleListData);
    Socket.on("getLeagueDetails", HandleLeagueDetails);

    Socket.once('disconnect', () => {
        Log(`[${Socket['id']}] Disconnected`);
        Socket.off("getLeagueList", HandleListData);
        Socket.off("getLeagueDetails", HandleLeagueDetails);
    });

});