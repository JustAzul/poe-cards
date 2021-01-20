const moment = require("moment");
const numeral = require("numeral");

async function GenerateSplitedValuesTable(ExaltedValue) {
    let TableContent = "";

    for (i = 1; i < 10; i++) {
        const ColumnNumber = i + 1;
        const Split = i / 10;
        const FinalValue = Math.round(ExaltedValue * Split);

        let tr = `<tr>`;
        tr += `<td class="border column100 column${ColumnNumber}" data-column="column${ColumnNumber}">${Split}</td>`;
        tr += `<td class="border column100 column${ColumnNumber}" data-column="column${ColumnNumber}">${FinalValue}</td>`;
        tr += `</tr>`;

        TableContent += tr;
    }

    return TableContent;
}

function GenerateTableRowByJson(o) {

    if (o.ExaltedProfit <= 0) return ``;

    if (o.ChaosProfit <= 0) return ``;

    //const GenerateBadge = n => `<span class="badge badge-info pr-1 ml-1" style="font-size:10px;">${n}</span>`; //${GenerateBadge(o.count)}
    const GenerateButton = (n, b) => ` id="poetrade" data-buyout="${b}" data-name="${n}"`;

    let Row = ``;

    Row += `<tr class="row100">`;
    Row += `<td${GenerateButton(o.name, o.MaxBuyout)} data-toggle="tooltip" data-html="true" title="${o.tooltipHTML}" class="${o.Currency ? `currency ` : ``}column100 column1" data-column="column1"><img style="width:24px; height:24px;" class="mr-2" src="images/InventoryIcon.png">${o.name}</td>`;
    Row += `<td title="${o.name} Stack size" class="column100 column2" data-column="column2">${o.stackSize}</td>`;
    Row += `<td title="${o.name} Chaos Value"${GenerateButton(o.name, o.MaxBuyout)} class="column100 column3" data-column="column3"><img style="width:24px; height:24px;" class="mr-2" src="images/ChaosOrb.png">${numeral(o.chaosValue).format('0,0')}</td>`;
    Row += `<td title="${o.name} Exalted Value"${GenerateButton(o.name, o.MaxBuyout)} class="column100 column4" data-column="column4"><img style="width:24px; height:24px;" class="mr-2" src="images/ExaltedOrb.png">${o.exaltedValue}</td>`;
    Row += `<td title="${o.name} Stacked Chaos Value" class="column100 column5" data-column="column5"><img style="width:24px; height:24px;" class="mr-2" src="images/ChaosOrb.png">${numeral(o.ItemSetChaosValue).format('0,0')}</td>`;
    Row += `<td title="${o.name} Stacked Exalted Value" class="column100 column6" data-column="column6"><img style="width:24px; height:24px;" class="mr-2" src="images/ExaltedOrb.png">${o.ItemSetExaltedValue}</td>`;
    Row += `<td title="${o.RewardData.name} Chaos Value"${!o.Currency ? GenerateButton(o.RewardData.name) : ``}class="column100 column7" data-column="column7"><img class="mr-2" style="width:24px; height:24px;" src="images/ChaosOrb.png" >${numeral(o.RewardData.chaosValue).format('0,0')}</td>`;
    Row += `<td title="${o.RewardData.name} Exalted Value"${!o.Currency ? GenerateButton(o.RewardData.name) : ``}class="column100 column8" data-column="column8"><img style="width:24px; height:24px;" class="mr-2" src="images/ExaltedOrb.png">${o.RewardData.exaltedValue}</td>`;
    Row += `<td title="Profit in Chaos" class="column100 column9" data-column="column9"><img style="width:24px; height:24px;" class="mr-2" src="images/ChaosOrb.png">${numeral(o.ChaosProfit).format('0,0')}</td>`;
    Row += `<td title="Profit in Exalteds" class="column100 column10" data-column="column10"><img style="width:24px; height:24px;" class="mr-2" src="images/ExaltedOrb.png">${o.ExaltedProfit}</td>`;
    Row += `</tr>`;

    return Row;
}

function GenerateLeagueTableRow(LeagueDetails) {
    let EndingDate = LeagueDetails.endAt ? moment(LeagueDetails.endAt).format(`LL`) : `?`;

    let Row = `<tr class="row100">`;
    Row += `<td id="poetrade" data-link="/${LeagueDetails.leagueName}" class="column100 column1" data-column="column1">${LeagueDetails.leagueName}</td>`;
    Row += `<td id="poetrade" data-link="/${LeagueDetails.leagueName}" class="column100 column2" data-column="column2">${EndingDate}</td>`;
    Row += `<td id="poetrade" data-link="/${LeagueDetails.leagueName}" class="column100 column3" data-column="column3">${LeagueDetails.DaysLeft > 0 ? LeagueDetails.DaysLeft + ` days` : `?`}</td>`;
    Row += `<td id="poetrade" data-target="ladder_${LeagueDetails.leagueName}" data-link="${LeagueDetails.ladder}" class="column100 column4" data-column="column4"><a href="${LeagueDetails.ladder}" target="_BLANK">Link</a></td>`;
    Row += `</tr>`;

    return Row;
}

function ChaosToExalted(ExaltedValue, ChaosValue) {
    return parseFloat(ChaosValue / ExaltedValue);
}

function GetMaxBuyoutValue(chaosValue, ChaosProfit, stackSize) {
    const Limit = 20;
    const MaxBuyout = chaosValue + ((ChaosProfit / stackSize) * (Limit / 100));
    return parseInt(MaxBuyout);
}

function removeFromArray(array, value) {
    array.splice(array.indexOf(value), 1);
}

module.exports = {
    ChaosToExalted: ChaosToExalted,
    GetMaxBuyoutValue: GetMaxBuyoutValue,
    removeFromArray: removeFromArray,
    Gen: {
        LeagueTableRow: GenerateLeagueTableRow,
        SplitedValuesTable: GenerateSplitedValuesTable,
        FlipTableRowByJson: GenerateTableRowByJson
    }
}