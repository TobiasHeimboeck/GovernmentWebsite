/**
 * Copyright Notice
 * Created by Tobias Heimböck
 * Last edited 3.12.2018
 */

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

function cachePartyMemberCounts() {
    statistics[0]["Number of Democrates"] = getCountOfParty("D");
    statistics[0]["Number of Republicans"] = getCountOfParty("R");
    statistics[0]["Number if Independents"] = getCountOfParty("I");
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