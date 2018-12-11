let data;

findValidPage();

function findValidPage() {
    switch (location.href.split("/").slice(-1).toString()) {
        case "senate-party-loyalty.html":
            startFetchingAsync("https://api.propublica.org/congress/v1/113/senate/members.json");
            break;
        case "senate-attendance.html":
            startFetchingAsync("https://api.propublica.org/congress/v1/113/senate/members.json");
            break;
        case "house-attendance.html":
            startFetchingAsync("https://api.propublica.org/congress/v1/113/house/members.json");
            break;
        case "house-party-loyalty.html":
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

        new Vue({
            el: "#main",
            data: {
                members: data.results[0].members,
                statistics: {},
            },
            created() {

                this.loader();

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
                    least_engaged_members: this.getTenPercentOfMissedVotes("top"),
                    most_engaged_members: this.getTenPercentOfMissedVotes("bottom"),
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
                loader() {
                    myVar = setTimeout(this.showPage, 500);
                },
                showPage() {
                    document.getElementById("loader").style.display = "none";
                    document.getElementById("myDiv").style.display = "block";
                }
            }
        });

    }).catch(function (error) {
        console.log(error);
    })
}