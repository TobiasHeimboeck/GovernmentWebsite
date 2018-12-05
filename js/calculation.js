/**
 * Copyright Notice
 * Created by Tobias Heimböck
 * Last edited 4.12.2018
*/

let content = data.results[0].members; // get all members from the json data

var statistics = [
    {
        "democrats_count": 0,
        "republicans_count": 0,
        "independents_count": 0,
        "democrats_average_votes_with_party": 0,
        "republicans_average_votes_with_party": 0,
        "independents_average_votes_with_party": 0,
        "least_engaged_names": 0,
        "least_engaged_number_missed_votes": 0,
        "least_engaged_percentage_missed_votes": 0,
        "most_engaged_names": 0,
        "most_engaged_number_missed_votes": 0,
        "most_engaged_percentage_missed_votes": 0,
        "least_loyal_names": 0,
        "least_loyal_number_of_votes": 0,
        "least_loyal_percentage_party_votes": 0,
        "most_loyal_names": 0,
        "most_loyal_number_of_votes": 0,
        "most_loyal_percentage_party_votes": 0,
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

    republicanField.innerHTML = statistics[0]["republicans_count"];
    republicanVotedWithPartyField.innerHTML = statistics[0]["republicans_average_votes_with_party"] + "%";

    democrateField.innerHTML = statistics[0]["democrats_count"];
    democrateVotedWithPartyField.innerHTML = statistics[0]["democrats_average_votes_with_party"] + "%";

    independentField.innerHTML = statistics[0]["independents_count"];
    independentVotedWithPartyField.innerHTML = statistics[0]["independents_average_votes_with_party"] + "%";

    /*=================== Senate at a glance ===================*/

    /*=================== Least loyal ===================*/

    var lowestTenPercent = getLowestTenPercentOfVoters();

    for (var i = 0; i < lowestTenPercent.length; i++) {
        var row = document.createElement("tr");
        var senatorName = statistics[0]["least_loyal_names"][i];

        var link = document.createElement("a");
        link.setAttribute("href", lowestTenPercent[i].url);

        var text = document.createTextNode(senatorName);

        link.appendChild(text);

        row.insertCell().appendChild(link);
        row.insertCell().innerHTML = statistics[0]["least_loyal_number_of_votes"][i];
        row.insertCell().innerHTML = statistics[0]["least_loyal_percentage_party_votes"][i] + " %";
        document.getElementById("least").appendChild(row);
    }

    /*=================== Least loyal ===================*/

    /*=================== Most loyal ===================*/

    var highestTenPercent = getHighestTenPercentOfVoters();

    for (var i = 0; i < highestTenPercent.length; i++) {
        var row = document.createElement("tr");
        var senatorName = statistics[0]["most_loyal_names"][i];

        var link = document.createElement("a");
        link.setAttribute("href", highestTenPercent[i].url);

        var text = document.createTextNode(senatorName);

        link.appendChild(text);

        row.insertCell().appendChild(link);
        row.insertCell().innerHTML = statistics[0]["most_loyal_number_of_votes"][i];
        row.insertCell().innerHTML = statistics[0]["most_loyal_percentage_party_votes"][i] + "%";
        document.getElementById("most").appendChild(row);
    }

    /*=================== Most loyal ===================*/
}

function cachePartyMemberCounts() {

    var democrats = getSenatorsWithSameParty("D");
    var republicans = getSenatorsWithSameParty("R");
    var independents = getSenatorsWithSameParty("I");

    statistics[0]["democrats_count"] = getCountOfParty("D");
    statistics[0]["republicans_count"] = getCountOfParty("R");
    statistics[0]["independents_count"] = getCountOfParty("I");
    statistics[0]["democrats_average_votes_with_party"] = getAverageVotes(democrats);
    statistics[0]["republicans_average_votes_with_party"] = getAverageVotes(republicans);
    statistics[0]["independents_average_votes_with_party"] = getAverageVotes(independents);

    statistics[0]["least_loyal_names"] = getFullname(getLowestTenPercentOfVoters());
    statistics[0]["least_loyal_number_of_votes"] = getTotalVotes(getLowestTenPercentOfVoters());
    statistics[0]["least_loyal_percentage_party_votes"] = getPartyPercentage(getLowestTenPercentOfVoters());

    statistics[0]["most_loyal_names"] = getFullname(getHighestTenPercentOfVoters());
    statistics[0]["most_loyal_number_of_votes"] = getTotalVotes(getHighestTenPercentOfVoters());
    statistics[0]["most_loyal_percentage_party_votes"] = getPartyPercentage(getHighestTenPercentOfVoters());
}

function getPartyPercentage(array) {
    var partyArray = [];
    for (i = 0; i < array.length; i++) {
        partyArray.push(array[i].votes_with_party_pct);
    }
    return partyArray;
}

function getFullname(array) {
    var fullName = [];
    for (i = 0; i < array.length; i++) {
        if (array[i].middle_name == null) {
            fullName.push(array[i].first_name + " " + array[i].last_name);
        } else {
            fullName.push(array[i].first_name + " " + array[i].middle_name + " " + array[i].last_name);
        }
    }
    return fullName;
}

function getTotalVotes(array) {
    var totalCountArray = [];
    for (i = 0; i < array.length; i++)
        totalCountArray.push(array[i].total_votes);

    return totalCountArray;
}

function getSenatorsWithSameParty(party) {
    var senatorsWithParty = [];
    for (var i = 0; i < content.length; i++) {
        if (content[i].party === party)
            senatorsWithParty.push(content[i]);
    }
    return senatorsWithParty;
}

function getAverageVotes(party) {
    var sum = 0;

    for (i = 0; i < party.length; i++)
        sum += party[i].votes_with_party_pct;

    return Math.round(sum / party.length * 100) / 100;
}

function getBottomTenPercentOfMissedVotes() {
    var votes = [];
    var bottomTenPercent = [];

    content.sort(function (a, b) {
        return a.missed_votes_pct - b.missed_votes_pct;
    });

    for (i = 0; i < content.length; i++)
        votes.push(content[i]);

    for (i = 0; i < votes.length; i++) {
        if (i < ((votes.length) * 0.1))
            bottomTenPercent.push(votes[i]);
        else if (votes[i] == votes[i - 1])
            bottomTenPercent.push(votes[i]);
    }
    return bottomTenPercent;
}

function getLowestTenPercentOfVoters() {
    var votes = [];
    var lowestTenPercent = [];

    content.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct;
    });

    for (i = 0; i < content.length; i++)
        votes.push(content[i]);

    for (i = 0; i < votes.length; i++) {
        if (i < ((votes.length) * 0.1))
            lowestTenPercent.push(votes[i]);
        else if (votes[i] == votes[i - 1])
            lowestTenPercent.push(votes[i]);
        else
            break;
    }
    return lowestTenPercent;
}

function getHighestTenPercentOfVoters() {
    var votes = [];
    var highestTenPercent = [];

    content.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct;
    });

    for (i = 0; i < content.length; i++) {
        votes.push(content[i]);
    }

    for (i = 0; i < votes.length; i++) {
        if (i < ((votes.length) * 0.1))
            highestTenPercent.push(votes[i]);
        else if (votes[i] == votes[i - 1])
            highestTenPercent.push(votes[i]);
        else
            break;
    }
    return highestTenPercent;
}

function getCountOfParty(party) {
    var partyMembers = [];
    for (var i = 0; i < content.length; i++) {
        if (content[i].party === party)
            partyMembers.push(content[i]);
    }
    return partyMembers.length;
}