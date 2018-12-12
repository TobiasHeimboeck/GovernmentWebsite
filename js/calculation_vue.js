let data;

Vue.component("navbar", {
    props: ["active"],
    methods: {
        activePage: function () {

            if (this.active === "home") {
                return "home";
            } else if (this.active === "data") {
                return "data";
            } else if (this.active === "attendance") {
                return "attendance";
            } else if (this.active === "loyalty") {
                return "loyalty";
            }
        }
    },
    template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
                <li class="nav-item" :class="{ selected : activePage() === 'home' }">
                    <a class="nav-link" href="home.html">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item dropdown congress" :class="{ selected : activePage() === 'data' }">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Congress 113
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <a class="dropdown-item" href="senate-data.html">Senate</a>
                        <a class="dropdown-item" href="house-data.html">House</a>
                    </div>
                </li>
                <li class="nav-item dropdown attendance" :class="{ selected : activePage() === 'attendance' }">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Attendance
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <a class="dropdown-item" href="senate-attendance.html">Senate</a>
                        <a class="dropdown-item" href="house-attendance.html">House</a>
                    </div>
                </li>
                <li class="nav-item dropdown loyalty" :class="{ selected : activePage() === 'loyalty' }">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Party Loyalty
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <a class="dropdown-item" href="senate-party-loyalty.html">Senate</a>
                        <a class="dropdown-item" href="house-party-loyalty.html">House</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
    `
});

Vue.component("custom_footer", {
    template: '<footer class="footer"> <p> &copy; 2018 TGIF All Rights Reserved </p> </footer>'
});

var main = new Vue({
    el: "#main",
    data: {
        members: [],
        allMembers: [],
        democrats: [],
        republicans: [],
        independents: [],
        d_average: 0,
        r_average: 0,
        i_average: 0,
        total_average: 0,
        statistics: {},
    },
    created() {
        this.findValidPage();
        this.loader();
    },
    methods: {
        findValidPage() {
            switch (location.href.split("/").slice(-1).toString()) {
                case "senate-party-loyalty.html":
                    this.startFetchingAsync("https://api.propublica.org/congress/v1/113/senate/members.json");
                    break;
                case "senate-attendance.html":
                    this.startFetchingAsync("https://api.propublica.org/congress/v1/113/senate/members.json");
                    break;
                case "house-attendance.html":
                    this.startFetchingAsync("https://api.propublica.org/congress/v1/113/house/members.json");
                    break;
                case "house-party-loyalty.html":
                    this.startFetchingAsync("https://api.propublica.org/congress/v1/113/house/members.json");
                    break;
            }
        },
        startFetchingAsync(url) {
            fetch(url, {
                method: "GET",
                headers: new Headers({
                    "X-API-Key": "adZUIoKPgkk0ecKXE0ztm9ErLNJgARlsKHBhTBYa"
                })
            }).then(function (response) {
                return response.json();
            }).then(function (json) {

                data = json;
                main.members = data.results[0].members;
                main.allMembers = data.results[0].members;

                main.democrats = main.getSenatorsWithSameParty("D");
                main.republicans = main.getSenatorsWithSameParty("R");
                main.independents = main.getSenatorsWithSameParty("I");

                main.d_average = main.getAverageVotes(main.democrats);
                main.r_average = main.getAverageVotes(main.republicans);
                main.i_average = main.getAverageVotes(main.independents);

                if (main.independents.length === 0) {
                    main.total_average = Math.round(((main.d_average + main.r_average + main.i_average) / 2) * 100) / 100 + "%";
                } else {
                    main.total_average = Math.round(((main.d_average + main.r_average + main.i_average) / 3) * 100) / 100 + "%";
                }

                main.statistics = {
                    democrats_count: main.democrats.length,
                    republicans_count: main.republicans.length,
                    independents_count: main.independents.length,
                    democrats_average_votes_with_party: main.getAverageVotes(main.democrats),
                    republicans_average_votes_with_party: main.getAverageVotes(main.republicans),
                    independents_average_votes_with_party: main.getAverageVotes(main.independents),
                    least_loyal_members: main.getTenPercentOfVoters("lowest"),
                    most_loyal_members: main.getTenPercentOfVoters("highest"),
                    least_engaged_members: main.getTenPercentOfMissedVotes("top"),
                    most_engaged_members: main.getTenPercentOfMissedVotes("bottom"),
                    total_count: main.democrats.length + main.republicans.length + main.independents.length,
                    total_average_votes_with_party: main.total_average,

                }

            }).catch(function (error) {
                console.log(error);
            })
        },
        loader() {
            myVar = setTimeout(this.showPage, 500);
        },
        showPage() {
            document.getElementById("loader").style.display = "none";
            document.getElementById("myDiv").style.display = "block";
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
    },
});