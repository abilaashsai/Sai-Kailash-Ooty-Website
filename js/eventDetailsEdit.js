/*  jQuery ready function. Specify a function to execute when the DOM is fully loaded.  */
function readEventData() {
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
    });
};

function updateDetails() {
    var eventAddedId = document.getElementById("eventAdded");
    var userSelection = eventAddedId.options[eventAddedId.selectedIndex].value;

    var userDetailText = document.getElementById("writeup").value;

    if (userSelection == "") {
        alert("Please select the event type");
    } else if (userDetailText == "") {
        alert("Please fill the text");
    } else {
        firebase.database().ref('events/upcoming/' + userSelection).update({
            detail: document.getElementById("writeup").value
        });
        document.getElementById("writeup").value = "";
    }
};

function updateType() {
    var eventAddedId = document.getElementById("eventAdded");
    var userSelection = eventAddedId.options[eventAddedId.selectedIndex].value;

    var eventTypeId = document.getElementById("eventType");
    var userType = eventTypeId.options[eventTypeId.selectedIndex].value;

    if (userSelection == "") {
        alert("Please select the event type");
    }
    else if (userType == "") {
        alert("Please fill the text");
    } else {
        firebase.database().ref('events/upcoming/' + userSelection).update({
            type: userType
        });
        document.getElementById("eventType").value = "";
    }
};

function addDetailsIntoDropDown(year, month, date, message) {
    var eventAdded = document.getElementById("eventAdded");
    var option = document.createElement("option");
    option.value = year + "/" + month + "/" + date;
    option.text = year + "-" + month + "-" + date + " " + message;
    eventAdded.add(option);
};

function uploadImage() {
    var eventAddedId = document.getElementById("eventAdded");
    var userSelection = eventAddedId.options[eventAddedId.selectedIndex].value;

    var userText = document.getElementById("uploadFileName").value;

    if (userText == "") {
        alert("Please name the image file");
    }
    else if (userSelection == "") {
        alert("Please select the event");
    } else {
        var storageRef = firebase.storage().ref('events/upcoming/' + userSelection + "/image/" + userText);
        var $ = jQuery;
        var file = $('#uploadFile').prop('files')[0];

        storageRef.put(file).then(function (snapshot) {
            // console.log('Uploaded a blob or file!');
        });

        firebase.database().ref('events/upcoming/' + userSelection + "/image").child(userText).set({
            date: userSelection
        });

        document.getElementById("uploadFile").value = "";
        document.getElementById("uploadFileName").value = "";
    }
}

