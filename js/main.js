/**
 * Copyright Notice
 * Created by Tobias Heimböck
 * Last edited 4.12.2018
*/

let content = data.results[0].members; // get all members from the json data

var democrateButton = document.getElementById("democrate-check");
var republicanButton = document.getElementById("republican-check");
var independentButton = document.getElementById("independent-check");

var dropdown = document.getElementById("state-filter");

/**
 * function to check if the middlename is null and build the fullname
 * @param {*} firstName 
 * @param {*} middleName 
 * @param {*} lastName 
 */
function checkName(firstName, middleName, lastName) {
    var fullName;

    if (middleName === null) {
        fullName = firstName + " " + lastName;
    } else {
        fullName = firstName + " " + middleName + " " + lastName;
    }

    return fullName;
}

/**
 * function to append a new row to the table
 * @param {*} fullName 
 * @param {*} party 
 * @param {*} state 
 * @param {*} senority 
 * @param {*} percentage 
 * @param {*} url 
 */
function addTableRow(fullName, party, state, senority, percentage, url) {
    var table = document.getElementById("table");
    var row = table.insertRow(0);

    var fullNameField = row.insertCell(0);
    var partyField = row.insertCell(1);
    var stateField = row.insertCell(2);
    var senorityField = row.insertCell(3);
    var percentageField = row.insertCell(4);

    var link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("class", "link");

    if (party === "R") {
        row.setAttribute("id", "republican");
    } else if (party === "D") {
        row.setAttribute("id", "democrate");
    } else if (party === "I") {
        row.setAttribute("id", "independent");
    }

    var linkText = document.createTextNode(fullName);
    link.appendChild(linkText);
    fullNameField.appendChild(link);

    partyField.innerHTML = party;
    stateField.innerHTML = state;
    senorityField.innerHTML = senority;
    percentageField.innerHTML = percentage;

}

/**
 * function to delete all table rows
 */
function clearTable() {
    var table = document.getElementById("table");
    var rows = table.getElementsByTagName("tr");
    var rowCount = rows.length;

    for (var i = 0; i < rowCount; i++) {
        table.deleteRow(rows[i]);
    }
}

/*======================= button click events =======================*/
var text = document.createTextNode("(Please select a checkbox!)"); // text node to inform player that all buttons are unchecked
var headline = document.getElementById("headline"); // div container to append the text node

// dropdown menu for the state filter
dropdown.addEventListener("change", function () {
    loadTable();
});

// democrate check box
democrateButton.addEventListener("change", function () {
    loadTable();
    if (areAllUnchecked()) {
        headline.appendChild(text);
    } else {
        headline.removeChild(text);
    }
});

// republican check box
republicanButton.addEventListener("change", function () {
    loadTable();
    if (areAllUnchecked()) {
        headline.appendChild(text);
    } else {
        headline.removeChild(text);
    }
});

// independent check box
independentButton.addEventListener("change", function () {
    loadTable();
    if (areAllUnchecked()) {
        headline.appendChild(text);
    } else {
        headline.removeChild(text);
    }
});
/*======================= button click events =======================*/

// check the buttons automatically 
// when the user enters the page
checkButtons();

/**
 * function to load the table and fill it
 */
function loadTable() {
    var filteredContent = filterParty();

    clearTable();

    for (var i = 0; i < filteredContent.length; i++) {
        addTableRow(
            checkName(filteredContent[i].first_name, filteredContent[i].middle_name, filteredContent[i].last_name), filteredContent[i].party,
            filteredContent[i].state, filteredContent[i].seniority, filteredContent[i].votes_with_party_pct + "%", filteredContent[i].url
        );
    }
}

/**
 * function to handle the filtering 
 */
function filterParty() {
    var contentToFilter = content;
    var responseArray = [];

    for (var i = 0; i < contentToFilter.length; i++) {
        var senator = contentToFilter[i];

        if (dropdown.value === senator.state || dropdown.value === "all") {

            if (democrateButton.checked && senator.party === "D") {
                responseArray.push(senator);
            }

            if (republicanButton.checked && senator.party === "R") {
                responseArray.push(senator);
            }

            if (independentButton.checked && senator.party === "I") {
                responseArray.push(senator);
            }

        }
    }
    return responseArray;
}

/**
 * function to check if all party-filter buttons are unchecked
 */
function areAllUnchecked() {
    return !democrateButton.checked && !republicanButton.checked && !independentButton.checked;
}

/**
 * enable all buttons and load the table
 */
function checkButtons() {
    democrateButton.checked = true;
    republicanButton.checked = true;
    independentButton.checked = true;
    loadTable();
}

/**
 * function to get all states from
 * the senators and put them in a array
 */
function cacheStates() {
    var states = [];

    for (var i = 0; i < content.length; i++) {
        if (!contains(content[i].state, states)) {
            states.push(content[i].state);
        }
    }
    return states;
}

appendStatesInDropdown();

/**
 * function to append the states in a dropdown menu
 */
function appendStatesInDropdown() {
    var states = cacheStates();

    for (var i = 0; i < states.length; i++) {
        var option = document.createElement("option");
        var displayName = document.createTextNode(states[i]);
        option.appendChild(displayName);
        dropdown.appendChild(option);
    }
}

window.onscroll = function () {
    scrollFunction();
};

document.getElementById("myBtn").addEventListener("click", function () {
    moveToTop();
});

/**
 * function to add / remove to back to top button
 */
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// function to move to site to top if the back to top button was clicked
function moveToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

/**
 * function to check if there 
 * are dublicated states in the array
 * @param {*} value 
 * @param {*} array 
 */
function contains(value, array) {
    return array.indexOf(value) > -1;
}