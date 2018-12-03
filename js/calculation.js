/**
 * Copyright Notice
 * Created by Tobias Heimböck
 * Last edited 3.12.2018
 */

console.log("debug1");

let content = data.results[0].members; // get all members from the json data

var statistics = [
    {
        "Number of Democrates": 0,
        "Number of Republicans": 0,
        "Number if Independents": 0,
        "Avarage 'Votes with party' for Democrates": 0,
        "Avarage 'Votes with party' for Republicans": 0,
        "Avarage 'Votes with party' for Independents": 0,
        "Least engaged names": 0,
        "Least engaged number of missed votes": 0,
        "Least engaged percentage tableLeastEngagedmissed votes": 0,
        "Most engaged names": 0,
        "Most engaged number if missed votes": 0,
        "Most engaged percentage of missed votes": 0,
        "Least loyal names": 0,
        "Least loyal number of votes": 0,
        "Least loyal percentage party votes": 0,
        "Most loyal names": 0,
        "Most loyal number of votes": 0,
        "Most loyal percentage party votes": 0,
    }
];

cachePartyMemberCounts();
storeInTable();

function storeInTable() {
    /*=================== Senate at a glance ===================*/

    // row 1
    var republican_row = document.getElementById("republican-row");
    var republican_td = republican_row.getElementsByTagName("td");

    // row 2
    var democrate_row = document.getElementById("democrat-row");
    var democrate_td = democrate_row.getElementsByTagName("td");

    // row 3
    var independent_row = document.getElementById("independent-row");
    var independent_td = independent_row.getElementsByTagName("td");

    var republicanField = republican_td[1];
    var republicanVotedWithPartyField = republican_td[2];

    var democrateField = democrate_td[1];
    var democrateVotedWithPartyField = democrate_td[2];

    var independentField = independent_td[1];
    var independentVotedWithPartyField = independent_td[2];

    republicanField.innerHTML = statistics[0]["Number of Republicans"];
    republicanVotedWithPartyField.innerHTML = statistics[0]["Avarage 'Votes with party' for Republicans"] + "%";

    democrateField.innerHTML = statistics[0]["Number of Democrates"];
    democrateVotedWithPartyField.innerHTML = statistics[0]["Avarage 'Votes with party' for Democrates"] + "%";

    independentField.innerHTML = statistics[0]["Number if Independents"];
    independentVotedWithPartyField.innerHTML = statistics[0]["Avarage 'Votes with party' for Independents"] + "%";

    /*=================== Senate at a glance ===================*/
}

function cachePartyMemberCounts() {

    var democrats = getSenatorsWithSameParty("D");
    var republicans = getSenatorsWithSameParty("R");
    var independents = getSenatorsWithSameParty("I");

    statistics[0]["Number of Democrates"] = getCountOfParty("D");
    statistics[0]["Number of Republicans"] = getCountOfParty("R");
    statistics[0]["Number if Independents"] = getCountOfParty("I");
    statistics[0]["Avarage 'Votes with party' for Democrates"] = getAverageVotes(democrats);
    statistics[0]["Avarage 'Votes with party' for Republicans"] = getAverageVotes(republicans);
    statistics[0]["Avarage 'Votes with party' for Independents"] = getAverageVotes(independents);
}

function getSenatorsWithSameParty(party) {
    var senatorsWithParty = [];
    for (var i = 0; i < content.length; i++) {
        var senator = content[i];
        if (senator.party === party) {
            senatorsWithParty.push(senator);
        }
    }

    return senatorsWithParty;
}

function getAverageVotes(senatorsParty) {
    var sum = 0;

    for (i = 0; i < senatorsParty.length; i++)
        sum += senatorsParty[i].votes_with_party_pct;

    return Math.round(sum / senatorsParty.length * 100) / 100;;
}

function getCountOfParty(party) {
    var contentToFilter = content;
    var partyMembers = [];

    for (var i = 0; i < contentToFilter.length; i++) {
        var senator = contentToFilter[i];
        if (senator.party === party) {
            partyMembers.push(senator);
        }
    }

    return partyMembers.length;
}