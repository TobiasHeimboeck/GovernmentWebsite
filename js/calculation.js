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
storeInTable();

function storeInTable() {
    /*=================== Senate at a glance ===================*/

    var republicanField = document.getElementById("republican-row").getElementsByTagName("td")[1];
    var republicanVotedWithPartyField = document.getElementById("republican-row").getElementsByTagName("td")[2];

    var democrateField = document.getElementById("democrat-row").getElementsByTagName("td")[1];
    var democrateVotedWithPartyField = document.getElementById("democrat-row").getElementsByTagName("td")[2];

    var independentField = document.getElementById("independent-row").getElementsByTagName("td")[1];
    var independentVotedWithPartyField = document.getElementById("independent-row").getElementsByTagName("td")[2];

    republicanField.innerHTML = statistics[0]["Number of Republicans"];
    republicanVotedWithPartyField.innerHTML = statistics[0]["Avarage 'Votes with party' for Republicans"] + "%";

    democrateField.innerHTML = statistics[0]["Number of Democrates"];
    democrateVotedWithPartyField.innerHTML = statistics[0]["Avarage 'Votes with party' for Democrates"] + "%";

    independentField.innerHTML = statistics[0]["Number if Independents"];
    independentVotedWithPartyField.innerHTML = statistics[0]["Avarage 'Votes with party' for Independents"] + "%";

    /*=================== Senate at a glance ===================*/

    /*=================== Least loyal ===================*/

    var lowestTenPercent = getLowestTenPercentOfVoters();

    for (var i = 0; i < lowestTenPercent.length; i++) {
        var row = document.createElement("tr");
        var senatorName = statistics[0]["Least loyal names"][i];

        var link = document.createElement("a");
        link.setAttribute("href", lowestTenPercent[i].url);

        var text = document.createTextNode(senatorName);

        link.appendChild(text);

        row.insertCell().appendChild(link);
        row.insertCell().innerHTML = statistics[0]["Least loyal number of votes"][i];
        row.insertCell().innerHTML = statistics[0]["Least loyal percentage party votes"][i] + " %";
        document.getElementById("least").appendChild(row);
    }

    /*=================== Least loyal ===================*/
}

function cachePartyMemberCounts() {

    console.log(getBottomTenPercentOfMissedVotes());

    var bottomTenPercentOfMissedVotesArray = getBottomTenPercentOfMissedVotes();

    console.log(getFullname(bottomTenPercentOfMissedVotesArray));

    var democrats = getSenatorsWithSameParty("D");
    var republicans = getSenatorsWithSameParty("R");
    var independents = getSenatorsWithSameParty("I");

    statistics[0]["Number of Democrates"] = getCountOfParty("D");
    statistics[0]["Number of Republicans"] = getCountOfParty("R");
    statistics[0]["Number if Independents"] = getCountOfParty("I");
    statistics[0]["Avarage 'Votes with party' for Democrates"] = getAverageVotes(democrats);
    statistics[0]["Avarage 'Votes with party' for Republicans"] = getAverageVotes(republicans);
    statistics[0]["Avarage 'Votes with party' for Independents"] = getAverageVotes(independents);

    statistics[0]["Least loyal names"] = getFullname(getLowestTenPercentOfVoters());
    statistics[0]["Least loyal number of votes"] = getTotalVotes(getLowestTenPercentOfVoters());
    statistics[0]["Least loyal percentage party votes"] = getPartyPercentage(getLowestTenPercentOfVoters());
}

function getPartyPercentage(array) {
    var empty = [];
    for (i = 0; i < array.length; i++) {
        empty.push(array[i].votes_with_party_pct);
    }
    return empty;
}

function getFullname(array) {
    var name = [];
    for (i = 0; i < array.length; i++) {
        if (array[i].middle_name == null) {
            name.push(array[i].first_name + " " + array[i].last_name);
        } else {
            name.push(array[i].first_name + " " + array[i].middle_name + " " + array[i].last_name);
        }
    }
    return name;
}

function getTotalVotes(array) {
    var empty = [];
    for (i = 0; i < array.length; i++)
        empty.push(array[i].total_votes);

    return empty;
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

function getAverageVotes(party) {
    var sum = 0;

    for (i = 0; i < party.length; i++)
        sum += party[i].votes_with_party_pct;

    return Math.round(sum / party.length * 100) / 100;;
}

function getBottomTenPercentOfMissedVotes() {
    var votes = [];
    var lowestTenPercent = [];

    content.sort(function (a, b) {
        return a.missed_votes_pct - b.missed_votes_pct;
    });
    for (i = 0; i < content.length; i++) {
        votes.push(content[i]);
    }

    for (i = 0; i < votes.length; i++) {
        if (i < ((votes.length) * 0.1)) {
            lowestTenPercent.push(votes[i]);
        } else if (votes[i] == votes[i - 1]) {
            lowestTenPercent.push(votes[i]);
        } else {
            break;
        }
    }

    return lowestTenPercent;
}

function getLowestTenPercentOfVoters() {
    var votes = [];
    var lowestTenPercent = [];

    content.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct;
    });

    for (i = 0; i < content.length; i++) {
        votes.push(content[i]);
    }

    for (i = 0; i < votes.length; i++) {

        if (i < ((votes.length) * 0.1)) {
            lowestTenPercent.push(votes[i]);
        } else if (votes[i] == votes[i - 1]) {
            lowestTenPercent.push(votes[i]);
        } else {
            break;
        }

    }
    return lowestTenPercent;
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