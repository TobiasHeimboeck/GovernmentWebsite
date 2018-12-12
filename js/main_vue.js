let data; // represents the data from the ajax api

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
        checkBoxes: [],
        checkboxDemocrat: null,
        checkboxRepublican: null,
        checkboxIndependent: null,
    },
    created() {
        this.findValidPage();
        this.loader();
        this.generateStatesList();
    },
    methods: {
        findValidPage() {
            switch (location.href.split("/").slice(-1).toString()) {
                case "senate-data.html":
                    this.startFetchingAsync("https://api.propublica.org/congress/v1/113/senate/members.json");
                    break;
                case "house-data.html":
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
                main.loadCheckboxes()
            }).catch(function (error) {
                console.log(error);
            })
        },
        loadCheckboxes() {
            this.checkboxDemocrat = this.$refs.democrat_check;
            this.checkboxRepublican = this.$refs.republican_check;
            this.checkboxIndependent = this.$refs.independent_check;
        },
        filterSenators() {

            var senatorsArray = [];

            for (var i = 0; i < this.allMembers.length; i++) {

                if (document.getElementById("state-filter").value === this.allMembers[i].state || document.getElementById("state-filter").value === "all") {

                    if (document.getElementById("democrat_check").checked && this.allMembers[i].party === "D") {
                        senatorsArray.push(this.allMembers[i]);
                    } else if (document.getElementById("republican_check").checked && this.allMembers[i].party === "R") {
                        senatorsArray.push(this.allMembers[i]);
                    } else if (document.getElementById("independent_check").checked && this.allMembers[i].party === "I") {
                        senatorsArray.push(this.allMembers[i]);
                    }
                }
            }

            this.members = senatorsArray;

        },
        generateStatesList() {
            var statesArray = [];

            for (var i = 0; i < this.allMembers.length; i++)
                statesArray.push(this.allMembers[i].state);

            this.states = statesArray.filter((v, i, a) => a.indexOf(v) === i).sort();

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