let data;

findValidPage();

function findValidPage() {
    switch (location.href.split("/").slice(-1).toString()) {
        case "vue-senate-loyalty.html":
            startFetchingAsync("https://api.propublica.org/congress/v1/113/senate/members.json");
            break;
        case "vue-house-loyalty.html":
            startFetchingAsync("https://api.propublica.org/congress/v1/113/house/members.json");
            break;
    }
}

function startFetchingAsync(url) {
    fetch(url, {
        method: "GET",
        headers: new Headers({
            "X-API-Key": "adZUIoKPgkk0ecKXE0ztm9ErLNJgARlsKHBhTBYa"
        })
    }).then(function (response) {
        return response.json();
    }).then(function (json) {
        data = json;

        console.log(data);

        new Vue({
            el: "#main",
            data: {
                members: data.results[0].members,
                statistics: {},
            },
            created() {

                var democrats = this.getSenatorsWithSameParty("D");
                var republicans = this.getSenatorsWithSameParty("R");
                var independents = this.getSenatorsWithSameParty("I");

                var d_av = this.getAverageVotes(democrats);
                var r_av = this.getAverageVotes(republicans);
                var i_av = this.getAverageVotes(independents);

                var total_average;

                if (independents.length === 0) {
                    total_average = Math.round(((d_av + r_av + i_av) / 2) * 100) / 100 + "%";
                } else {
                    total_average = Math.round(((d_av + r_av + i_av) / 3) * 100) / 100 + "%";
                }

                this.statistics = {
                    democrats_count: democrats.length,
                    republicans_count: republicans.length,
                    independents_count: independents.length,
                    democrats_average_votes_with_party: this.getAverageVotes(democrats),
                    republicans_average_votes_with_party: this.getAverageVotes(republicans),
                    independents_average_votes_with_party: this.getAverageVotes(independents),
                    least_loyal_members: this.getTenPercentOfVoters("lowest"),
                    most_loyal_members: this.getTenPercentOfVoters("highest"),
                    most_loyal_names: this.getFullname(this.getTenPercentOfVoters("highest")),
                    most_loyal_number_of_votes: this.getTotalCountOfVotes(this.getTenPercentOfVoters("highest")),
                    most_loyal_percentage_party_votes: this.getPartyPercentage(this.getTenPercentOfVoters("highest")),
                    least_engaged_names: this.getFullname(this.getTenPercentOfMissedVotes("top")),
                    least_engaged_number_missed_votes: this.getMissedVotes(this.getTenPercentOfMissedVotes("top")),
                    least_engaged_percentage_missed_votes: this.getMissedVotesPercentage(this.getTenPercentOfMissedVotes("top")),
                    most_engaged_names: this.getFullname(this.getTenPercentOfMissedVotes("bottom")),
                    most_engaged_number_missed_votes: this.getMissedVotes(this.getTenPercentOfMissedVotes("bottom")),
                    most_engaged_percentage_missed_votes: this.getMissedVotesPercentage(this.getTenPercentOfMissedVotes("bottom")),
                    total_count: democrats.length + republicans.length + independents.length,
                    total_average_votes_with_party: total_average,

                }
            },
            methods: {
                getAverageVotes(party) {
                    var average = 0;

                    for (i = 0; i < party.length; i++)
                        average += party[i].votes_with_party_pct;

                    if (party.length === 0) {
                        return 0;
                    } else {
                        return Math.round(average / party.length * 100) / 100;
                    }
                },
                getSenatorsWithSameParty(party) {
                    var senatorsWithSameParty = [];
                    for (var i = 0; i < this.members.length; i++) {
                        if (this.members[i].party === party)
                            senatorsWithSameParty.push(this.members[i]);
                    }
                    return senatorsWithSameParty;
                },
                fillTable(tableID, content1, content2, content3, content4) {
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
                },
                getPartyPercentage(array) {
                    var partyArray = [];
                    for (i = 0; i < array.length; i++) {
                        partyArray.push(array[i].votes_with_party_pct);
                    }
                    return partyArray;
                },
                getFullname(array) {
                    var fullName = [];
                    for (i = 0; i < array.length; i++) {
                        if (array[i].middle_name === null) {
                            fullName.push(array[i].first_name + " " + array[i].last_name);
                        } else {
                            fullName.push(array[i].first_name + " " + array[i].middle_name + " " + array[i].last_name);
                        }
                    }
                    return fullName;
                },
                getTotalCountOfVotes(array) {
                    var totalCountArray = [];
                    for (i = 0; i < array.length; i++)
                        totalCountArray.push(array[i].total_votes);

                    return totalCountArray;
                },
                getSenatorsWithSameParty(party) {
                    var senatorsWithSameParty = [];
                    for (var i = 0; i < this.members.length; i++) {
                        if (this.members[i].party === party)
                            senatorsWithSameParty.push(this.members[i]);
                    }
                    return senatorsWithSameParty;
                },
                getAverageVotes(party) {
                    var average = 0;

                    for (i = 0; i < party.length; i++)
                        average += party[i].votes_with_party_pct;

                    if (party.length === 0) {
                        return 0;
                    } else {
                        return Math.round(average / party.length * 100) / 100;
                    }
                },
                getTenPercentOfVoters(type) {
                    var votes = [];
                    var tenPercent = [];

                    switch (type) {
                        case "bottom":
                            this.members.sort(function (a, b) {
                                return a.missed_votes_pct - b.missed_votes_pct;
                            });
                            return this.sortingContent(tenPercent, votes);
                        case "lowest":
                            this.members.sort(function (a, b) {
                                return a.votes_with_party_pct - b.votes_with_party_pct;
                            });
                            return this.sortingContent(tenPercent, votes);
                        case "highest":
                            this.members.sort(function (a, b) {
                                return b.votes_with_party_pct - a.votes_with_party_pct;
                            });
                            return this.sortingContent(tenPercent, votes);
                    }
                },
                getTenPercentOfMissedVotes(type) {
                    var votes = [];
                    var responseArray = [];

                    switch (type) {
                        case "bottom":
                            this.members.sort(function (a, b) {
                                return a.missed_votes_pct - b.missed_votes_pct;
                            });
                            return this.sortingContent(responseArray, votes);

                        case "top":
                            this.members.sort(function (a, b) {
                                return b.missed_votes_pct - a.missed_votes_pct;
                            });
                            return this.sortingContent(responseArray, votes);
                    }
                },
                sortingContent(array, votesArray) {
                    for (var i = 0; i < this.members.length; i++)
                        votesArray.push(this.members[i]);

                    for (var i = 0; i < votesArray.length; i++) {
                        if (i < ((votesArray.length) * 0.1))
                            array.push(votesArray[i]);
                        else if (votesArray[i] === votesArray[i - 1])
                            array.push(votesArray[i]);
                    }
                    return array;
                },
                getMissedVotes(array) {
                    var missedVotesArray = [];
                    for (i = 0; i < array.length; i++)
                        missedVotesArray.push(array[i].missed_votes);
                    return missedVotesArray;
                },
                getMissedVotesPercentage(array) {
                    var missedPercentaceArray = [];
                    for (i = 0; i < array.length; i++)
                        missedPercentaceArray.push(array[i].missed_votes_pct);
                    return missedPercentaceArray;
                },
                getPartyMembersCount(party) {
                    var partyMembers = [];
                    for (var i = 0; i < this.members.length; i++) {
                        if (this.members[i].party === party)
                            partyMembers.push(this.members[i]);
                    }
                    return partyMembers.length;
                }
            }
        });

    }).catch(function (error) {
        console.log(error);
    })
}