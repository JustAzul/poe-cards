import CurrencyCards from './CurrencyCards';
import Cards from './Cards';

import { GetItemOverview } from './PoeNinjaFetch';

function ChaosToExalted(ExaltedValue, ChaosValue) {
    return parseFloat(ChaosValue / ExaltedValue);
}

function GetMaxBuyoutValue(chaosValue, ChaosProfit, stackSize) {
    const Limit = 20;
    const MaxBuyout = chaosValue + ((ChaosProfit / stackSize) * (Limit / 100));
    return parseInt(MaxBuyout);
}

function GetCurrencyValue(Database, CurrencyName, fullyResult = false) {
    return new Promise(resolve => {

        Database.find({
            "currencyTypeName": CurrencyName
        }, (err, result) => {
            if (err) throw err;
            if (result.length == 0) return resolve(0);

            result = result[0];

            if (result && result.hasOwnProperty("receive") && result.receive != null) {
                const Value = parseInt(result.receive.value);

                if(!fullyResult) return resolve(Value);
                
                const o = {
                    Value,
                    o: result
                }

                return resolve(o);
            }
            
            resolve(0);
        })
    })
}

async function GenerateCardsTableRowJson(Data, LeagueExaltedValue, Details) {

    const CardData = await GetItemOverview(Data, Details.Name, 6);
    if (!CardData) return false;
    const RewardData = await GetItemOverview(Data, Details.Reward, Details.iClass, Details.Corrupted, Details.Links, Details.gemLevel);
    if (!RewardData) return false;

    //Trust System
    if (CardData.count < 10) return false;
    if (RewardData.count < 10) return false;

    const CardExaltedPrice = CardData.hasOwnProperty("exaltedValue") ? CardData.exaltedValue : ChaosToExalted(LeagueExaltedValue, CardData.chaosValue);
    const RewardExaltedValue = RewardData.hasOwnProperty("exaltedValue") ? RewardData.exaltedValue : ChaosToExalted(LeagueExaltedValue, RewardData.chaosValue);

    const ItemSetChaosValue = parseInt(CardData.stackSize * CardData.chaosValue);
    const ItemSetExaltedValue = parseFloat((CardData.exaltedValue ? (CardExaltedPrice * CardData.stackSize) : ChaosToExalted(LeagueExaltedValue, CardData.chaosValue * CardData.stackSize)).toFixed(2));

    const ChaosProfit = parseInt(RewardData.chaosValue - ItemSetChaosValue);
    const ExaltedProfit = RewardExaltedValue - ItemSetExaltedValue;

    let o = CardData;

    o.chaosValue = parseInt(CardData.chaosValue);
    o.exaltedValue = parseFloat(CardExaltedPrice.toFixed(2));
    o.ItemSetChaosValue = ItemSetChaosValue;
    o.ItemSetExaltedValue = parseFloat(ItemSetExaltedValue.toFixed(2));

    o.MaxBuyout = GetMaxBuyoutValue(CardData.chaosValue, ChaosProfit, CardData.stackSize);

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

async function GenerateCurrencyCardsTableRowJson(Data, LeagueExaltedValue, Details) {

    const CardData = await GetItemOverview(Data, Details.Name, 6);
    if (!CardData) return false;

    const RewardDetails = await GetCurrencyValue(Data, Details.Reward, true);
    const RewardBaseChaosValue = RewardDetails.Value;
    if (!RewardBaseChaosValue) return false;

    //Trust System
    if (CardData.count < 10) return false;
    if (RewardDetails.o.receive.count < 10) return false;

    const RewardOrbValue = Details.Reward == "Chaos Orb" ? 1 : RewardBaseChaosValue;
    const RewardChaosValue = RewardOrbValue * Details.Amount;

    const CardExaltedPrice = CardData.hasOwnProperty("exaltedValue") ? CardData.exaltedValue : ChaosToExalted(LeagueExaltedValue, CardData.chaosValue);
    const RewardExaltedValue = ChaosToExalted(LeagueExaltedValue, RewardChaosValue);

    const ItemSetChaosValue = parseInt(CardData.stackSize * CardData.chaosValue);
    const ItemSetExaltedValue = parseFloat((CardData.exaltedValue ? (CardExaltedPrice * CardData.stackSize) : ChaosToExalted(LeagueExaltedValue, CardData.chaosValue * CardData.stackSize)).toFixed(2));

    const ChaosProfit = parseInt(RewardChaosValue - ItemSetChaosValue);
    const ExaltedProfit = (RewardExaltedValue - ItemSetExaltedValue);

    o = CardData;
    o.chaosValue = parseInt(CardData.chaosValue);
    o.exaltedValue = parseFloat(CardExaltedPrice.toFixed(2));
    o.ItemSetChaosValue = ItemSetChaosValue;
    o.ItemSetExaltedValue = parseFloat(ItemSetExaltedValue.toFixed(2));

    o.MaxBuyout = GetMaxBuyoutValue(CardData.chaosValue, ChaosProfit, CardData.stackSize);

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

async function GenerateFlipTableArray(Data, LeagueExaltedValue) {
    let TableArray = [];

    //Cards
    for (let i = 0; i < Cards.length; i++) {
        const Details = Cards[i];
        const o = await GenerateCardsTableRowJson(Data, LeagueExaltedValue, Details);
        if (o) TableArray.push(o);
    }

    //Currency Cards
    for (let i = 0; i < CurrencyCards.length; i++) {
        const Details = CurrencyCards[i];
        const o = await GenerateCurrencyCardsTableRowJson(Data, LeagueExaltedValue, Details);
        if (o) TableArray.push(o);
    }

    //return new Promise(resolve => resolve(TableArray));
    return TableArray;
}

async function GenerateFlipTable(Data, LeagueExaltedValue) {

    let TableArray = await GenerateFlipTableArray(Data, LeagueExaltedValue);
    TableArray = TableArray.sort(function (a, b) {
        const v1 = a.chaosprofit;
        const v2 = b.chaosprofit;
        return v2 - v1;
    });

    return TableArray;
}

module.exports = {
    GenerateFlipTable,
    GetCurrencyValue
}