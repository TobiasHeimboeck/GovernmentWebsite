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

/**
 * this function sotores all data in the table
 */
function storeInTable() {
    /*=================== Senate at a glance ===================*/

    var republicanField = document.getElementById("republican-row").getElementsByTagName("td")[1];
    var republicanVotedWithPartyField = document.getElementById("republican-row").getElementsByTagName("td")[2];

    var democrateField = document.getElementById("democrat-row").getElementsByTagName("td")[1];
    var democrateVotedWithPartyField = document.getElementById("democrat-row").getElementsByTagName("td")[2];

    var independentField = document.getElementById("independent-row").getElementsByTagName("td")[1];
    var independentVotedWithPartyField = document.getElementById("independent-row").getElementsByTagName("td")[2];

    var totalField = document.getElementById("total-row").getElementsByTagName("td")[1];
    var totalVotedWithPartyField = document.getElementById("total-row").getElementsByTagName("td")[2];

    republicanField.innerHTML = statistics[0]["republicans_count"];
    republicanVotedWithPartyField.innerHTML = statistics[0]["republicans_average_votes_with_party"] + "%";

    democrateField.innerHTML = statistics[0]["democrats_count"];
    democrateVotedWithPartyField.innerHTML = statistics[0]["democrats_average_votes_with_party"] + "%";

    independentField.innerHTML = statistics[0]["independents_count"];
    independentVotedWithPartyField.innerHTML = statistics[0]["independents_average_votes_with_party"] + "%";

    totalField.innerHTML = content.length;

    if (statistics[0]["independents_count"] === 0)
        totalVotedWithPartyField.innerHTML = Math.round(((statistics[0]["democrats_average_votes_with_party"] + statistics[0]["republicans_average_votes_with_party"] + statistics[0]["independents_average_votes_with_party"]) / 2) * 100) / 100 + "%";
    else
        totalVotedWithPartyField.innerHTML = Math.round(((statistics[0]["democrats_average_votes_with_party"] + statistics[0]["republicans_average_votes_with_party"] + statistics[0]["independents_average_votes_with_party"]) / 3) * 100) / 100 + "%";

    /*=================== Senate at a glance ===================*/

    /*=================== Least loyal ===================*/

    fillTable("least", getTenPercentOfVoters("lowest"), "least_loyal_names", "least_loyal_number_of_votes", "least_loyal_percentage_party_votes");

    /*=================== Least loyal ===================*/

    /*=================== Most loyal ===================*/

    fillTable("most", getTenPercentOfVoters("highest"), "most_loyal_names", "most_loyal_number_of_votes", "most_loyal_percentage_party_votes");

    /*=================== Most loyal ===================*/

    /*=================== Senate at glance ===================*/

    fillTable("least-engaged", getTenPercentOfMissedVotes("top"), "least_engaged_names", "least_engaged_number_missed_votes", "least_engaged_percentage_missed_votes");

    fillTable("most-engaged", getTenPercentOfMissedVotes("bottom"), "most_engaged_names", "most_engaged_number_missed_votes", "most_engaged_percentage_missed_votes");

    /*=================== Senate at glance ===================*/
}

function fillTable(tableID, content1, content2, content3, content4) {
    if (document.getElementById(tableID) !== null) {
        var table = document.getElementById(tableID);
        var tableContent = content1;

        for (var i = 0; i < tableContent.length; i++) {
            var row = document.createElement("tr");
            var senatorName = statistics[0][content2][i];

            var link = document.createElement("a");
            link.setAttribute("href", tableContent[i].url);

            var text = document.createTextNode(senatorName);
            link.appendChild(text);

            row.insertCell().appendChild(link);
            row.insertCell().innerHTML = statistics[0][content3][i];
            row.insertCell().innerHTML = statistics[0][content4][i];

            table.appendChild(row);
        }
    }
}

function cachePartyMemberCounts() {

    var democrats = getSenatorsWithSameParty("D");
    var republicans = getSenatorsWithSameParty("R");
    var independents = getSenatorsWithSameParty("I");

    statistics[0]["democrats_count"] = getPartyMembersCount("D");
    statistics[0]["republicans_count"] = getPartyMembersCount("R");
    statistics[0]["independents_count"] = getPartyMembersCount("I");
    statistics[0]["democrats_average_votes_with_party"] = getAverageVotes(democrats);
    statistics[0]["republicans_average_votes_with_party"] = getAverageVotes(republicans);
    statistics[0]["independents_average_votes_with_party"] = getAverageVotes(independents);

    statistics[0]["least_loyal_names"] = getFullname(getTenPercentOfVoters("lowest"));
    statistics[0]["least_loyal_number_of_votes"] = getTotalCountOfVotes(getTenPercentOfVoters("lowest"));
    statistics[0]["least_loyal_percentage_party_votes"] = getPartyPercentage(getTenPercentOfVoters("lowest"));

    statistics[0]["most_loyal_names"] = getFullname(getTenPercentOfVoters("highest"));
    statistics[0]["most_loyal_number_of_votes"] = getTotalCountOfVotes(getTenPercentOfVoters("highest"));
    statistics[0]["most_loyal_percentage_party_votes"] = getPartyPercentage(getTenPercentOfVoters("highest"));

    statistics[0]["least_engaged_names"] = getFullname(getTenPercentOfMissedVotes("top"));
    statistics[0]["least_engaged_number_missed_votes"] = getMissedVotes(getTenPercentOfMissedVotes("top"));
    statistics[0]["least_engaged_percentage_missed_votes"] = getMissedVotesPercentage(getTenPercentOfMissedVotes("top"));

    statistics[0]["most_engaged_names"] = getFullname(getTenPercentOfMissedVotes("bottom"));
    statistics[0]["most_engaged_number_missed_votes"] = getMissedVotes(getTenPercentOfMissedVotes("bottom"));
    statistics[0]["most_engaged_percentage_missed_votes"] = getMissedVotesPercentage(getTenPercentOfMissedVotes("bottom"));
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
        if (array[i].middle_name === null) {
            fullName.push(array[i].first_name + " " + array[i].last_name);
        } else {
            fullName.push(array[i].first_name + " " + array[i].middle_name + " " + array[i].last_name);
        }
    }
    return fullName;
}

function getTotalCountOfVotes(array) {
    var totalCountArray = [];
    for (i = 0; i < array.length; i++)
        totalCountArray.push(array[i].total_votes);

    return totalCountArray;
}

function getSenatorsWithSameParty(party) {
    var senatorsWithSameParty = [];
    for (var i = 0; i < content.length; i++) {
        if (content[i].party === party)
            senatorsWithSameParty.push(content[i]);
    }
    return senatorsWithSameParty;
}

function getAverageVotes(party) {
    var average = 0;

    for (i = 0; i < party.length; i++)
        average += party[i].votes_with_party_pct;

    if (party.length === 0) {
        return 0;
    } else {
        return Math.round(average / party.length * 100) / 100;
    }
}

/*=========================================================*/

function getTenPercentOfVoters(type) {
    var votes = [];
    var tenPercent = [];

    switch (type) {
        case "bottom":
            content.sort(function (a, b) {
                return a.missed_votes_pct - b.missed_votes_pct;
            });
            return sortingContent(tenPercent, votes);
        case "lowest":
            content.sort(function (a, b) {
                return a.votes_with_party_pct - b.votes_with_party_pct;
            });
            return sortingContent(tenPercent, votes);
        case "highest":
            content.sort(function (a, b) {
                return b.votes_with_party_pct - a.votes_with_party_pct;
            });
            return sortingContent(tenPercent, votes);
    }
}

function getTenPercentOfMissedVotes(type) {
    var votes = [];
    var responseArray = [];

    switch (type) {
        case "bottom":
            content.sort(function (a, b) {
                return a.missed_votes_pct - b.missed_votes_pct;
            });
            return sortingContent(responseArray, votes);

        case "top":
            content.sort(function (a, b) {
                return b.missed_votes_pct - a.missed_votes_pct;
            });
            return sortingContent(responseArray, votes);
    }
}

function sortingContent(array, votesArray) {
    for (var i = 0; i < content.length; i++)
        votesArray.push(content[i]);

    for (var i = 0; i < votesArray.length; i++) {
        if (i < ((votesArray.length) * 0.1))
            array.push(votesArray[i]);
        else if (votesArray[i] === votesArray[i - 1])
            array.push(votesArray[i]);
    }
    return array;
}

function getMissedVotes(array) {
    var missedVotesArray = [];
    for (i = 0; i < array.length; i++)
        missedVotesArray.push(array[i].missed_votes);
    return missedVotesArray;
}

function getMissedVotesPercentage(array) {
    var missedPercentaceArray = [];
    for (i = 0; i < array.length; i++)
        missedPercentaceArray.push(array[i].missed_votes_pct);
    return missedPercentaceArray;
}

function getPartyMembersCount(party) {
    var partyMembers = [];
    for (var i = 0; i < content.length; i++) {
        if (content[i].party === party)
            partyMembers.push(content[i]);
    }
    return partyMembers.length;
}