let data; // represents the data from the ajax api

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

scrollFunction();

function scrollFunction() {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}
function topButton() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}