/*  jQuery ready function. Specify a function to execute when the DOM is fully loaded.  */
$(document).ready(
    /* This is the function that will get executed after the DOM is fully loaded */
    function () {
        $("#upcomingDatePicker").datepicker({
            dateFormat: 'mm-dd-yy',
            changeMonth: true,//this option for allowing user to select month
            changeYear: true //this option for allowing user to select from year range
        });
    }
);
function upcomingEventSubmit() {
    var input = document.getElementsByName("upcomingEvent")[0].value;
    var date = document.getElementById("upcomingDatePicker").value;

    var eventTypeId = document.getElementById("eventType");
    var userType = eventTypeId.options[eventTypeId.selectedIndex].value;

    if (userType == "") {
        alert("Please fill the event type");
    } else if (input == "") {
        alert("Please fill the event date");
    } else if (date == "") {
        alert("Please fill the event date");
    } else {
        var eventDate = new Date(date);
        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"][eventDate.getMonth()];
        var storingDate = eventDate.getDate() + ' ' + month + ' ' + eventDate.getFullYear();

        firebase.database().ref('events/upcoming/' + eventDate.getFullYear() + "/" + (eventDate.getMonth() + 1) + "/" + eventDate.getDate()).set({
            message: input,
            date: storingDate,
            detail: "Details will be updated soon. Stay Tuned.",
            type: userType
        });
        readEventData();
    }
}

function announcementSubmit() {
    var title = document.getElementsByName("announcementTitle")[0].value;
    var data = document.getElementById("announcement").value;
    firebase.database().ref('announcement/' + title).set({
        title: title,
        data: data
    });
    readAnnouncementData();
}

function announcementDelete() {
    var title = document.getElementsByName("announcementTitleDelete")[0].value;
    firebase.database().ref('announcement/' + title).remove();
    readAnnouncementData();
}

function eventDelete() {
    var eventDeleteId = document.getElementById("deleteEvent");
    var userSelection = eventDeleteId.options[eventDeleteId.selectedIndex].value;

    firebase.database().ref('events/upcoming/' + userSelection).remove();
    document.getElementById("deleteEvent").value = "";
    readEventData();
}

function readEventData() {

    var select = document.getElementById("deleteEvent");
    // var length = select.options.length;
    // for (i = 0; i < length; i++) {
    //     select.options[i] = null;
    // }
    firebase.database().ref('events/upcoming').once('value').then(function (snapshot) {
        var upcoming = "";
        var past = "";
        var today = new Date();
        snapshot.forEach(function (year) {
            if (year.key >= today.getFullYear()) {
                year.forEach(function (month) {
                    if (month.key >= (today.getMonth() + 1)) {
                        month.forEach(function (day) {
                            addDetailsIntoDropDown(year.key, month.key, day.key, day.val().message);
                            if ((month.key == (today.getMonth() + 1) && day.key >= today.getDate()) || month.key > (today.getMonth() + 1)) {
                                upcoming = upcoming + "<li>" + day.val().message + ' - ' + day.val().date + "</li>";
                            } else {
                                past = "<li>" + day.val().message + ' - ' + day.val().date + "</li>" + past;
                            }
                        })
                    }
                    if (month.key < (today.getMonth() + 1)) {
                        month.forEach(function (day) {
                            addDetailsIntoDropDown(year.key, month.key, day.key, day.val().message);
                            past = "<li>" + day.val().message + ' - ' + day.val().date + "</li>" + past;
                        })
                    }
                });
            }
        });
        document.getElementById("upcomingUpdate").innerHTML = upcoming;
        document.getElementById("pastUpdate").innerHTML = past;
    });
}

function readAnnouncementData() {
    firebase.database().ref('announcement').once('value').then(function (snapshot) {
        var announcement = "";
        snapshot.forEach(function (title) {
            announcement = announcement + "<li>" + title.val().title + " - " + title.val().data + "</li>";
        });
        document.getElementById("announcementData").innerHTML = announcement;

    });
}

function thoughtSubmit() {
    var title = document.getElementsByName("thoughtTitle")[0].value + " - Baba";
    var data = document.getElementById("thought").value;
    firebase.database().ref('thought').set({
        title: title,
        data: data
    });

    readThoughtData();
}

function readThoughtData() {
    firebase.database().ref('thought').once('value').then(function (snapshot) {
        var thought = "<li>" + snapshot.val().title + "</li><li>" + snapshot.val().data + "</li>";
        document.getElementById("thoughtData").innerHTML = thought;
    });
}

function addDetailsIntoDropDown(year, month, date, message) {
    var eventAdded = document.getElementById("deleteEvent");
    var option = document.createElement("option");
    option.value = year + "/" + month + "/" + date;
    option.text = year + "-" + month + "-" + date + " " + message;
    eventAdded.add(option);
}



