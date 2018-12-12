Vue.component('clicker', {
    data: function () {
        return {
            count: 0
        }
    },
    template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
});

Vue.component("navbar", {
    template:
        '<nav class="navbar navbar-expand-lg navbar-light bg-light">' +
        '<div class="collapse navbar-collapse" id="navbarNavDropdown">' +
        '<ul class="navbar-nav">' +
        '<li class="nav-item active">' +
        '<a class="nav-link" href="home.html">Home <span class="sr-only">(current)</span></a>' +
        '</li>' +
        '<li id="selected" class="nav-item dropdown">' +
        '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"' +
        'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        'Congress 113' +
        '</a>' +
        '<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">' +
        '<a class="dropdown-item" href="senate-data.html">Senate</a>' +
        '<a class="dropdown-item" href="house-data.html">House</a>' +
        '</div>' +
        '</li>' +
        '<li class="nav-item dropdown">' +
        '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"' +
        'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        'Attendance' +
        '</a>' +
        '<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">' +
        '<a class="dropdown-item" href="senate-attendance.html">Senate</a>' +
        '<a class="dropdown-item" href="house-attendance.html">House</a>' +
        '</div>' +
        '</li>' +
        '<li class="nav-item dropdown">' +
        '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"' +
        'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        'Party Loyalty' +
        '</a>' +
        '<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">' +
        '<a class="dropdown-item" href="senate-party-loyalty.html">Senate</a>' +
        '<a class="dropdown-item" href="house-party-loyalty.html">House</a>' +
        '</div>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '</nav>'
});

Vue.component("custom_footer", {
    template: '<footer class="footer"> <p> &copy; 2018 TGIF All Rights Reserved </p> </footer>'
});

var main = new Vue({
    el: "#main"
});