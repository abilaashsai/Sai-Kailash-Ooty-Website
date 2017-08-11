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

function getSelectedEvent() {
    var eventAddedId = document.getElementById("eventAdded");
    var userSelection = eventAddedId.options[eventAddedId.selectedIndex].value;
    return userSelection;
}
function getSelectedImage() {
    var eventAddedId = document.getElementById("deleteEventImage");
    var userSelection = eventAddedId.options[eventAddedId.selectedIndex].value;
    return userSelection
}

function updateDetails() {
    var userDetailText = document.getElementById("writeup").value;

    if (getSelectedEvent() == "") {
        alert("Please select the event type");
    } else if (userDetailText == "") {
        alert("Please fill the text");
    } else {
        firebase.database().ref('events/upcoming/' + getSelectedEvent()).update({
            detail: document.getElementById("writeup").value
        });
        document.getElementById("writeup").value = "";
    }
};

function updateType() {
    var eventTypeId = document.getElementById("eventType");
    var userType = eventTypeId.options[eventTypeId.selectedIndex].value;

    if (getSelectedEvent() == "") {
        alert("Please select the event type");
    }
    else if (userType == "") {
        alert("Please fill the text");
    } else {
        firebase.database().ref('events/upcoming/' + getSelectedEvent()).update({
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

function checkInformation() {

    removeOptions(document.getElementById("deleteEventImage"));
    if (getSelectedEvent() === "") {
        document.getElementById("eventType").value = "";
        document.getElementById("writeup").value = "";
        document.getElementById("uploadFileName").value = "";
    } else {
        firebase.database().ref('events/upcoming/' + getSelectedEvent()).once('value').then(function (snapshot) {
            document.getElementById("eventType").value = snapshot.val().type;
            document.getElementById("writeup").value = snapshot.val().detail;
            snapshot.forEach(function (image) {
                if (image.key == "image") {
                    image.forEach(function (imageName) {
                            var imageTitle = document.getElementById("deleteEventImage");
                            var option = document.createElement("option");
                            option.value = imageName.key;
                            option.text = imageName.key;
                            imageTitle.add(option);
                        }
                    )
                }
            });
        });
    }
}

function uploadImage() {
    var userText = document.getElementById("uploadFileName").value;

    if (userText == "") {
        alert("Please name the image file");
    }
    else if (getSelectedEvent() == "") {
        alert("Please select the event");
    } else {
        var storageRef = firebase.storage().ref('events/upcoming/' + getSelectedEvent() + "/image/" + userText);
        var $ = jQuery;
        var file = $('#uploadFile').prop('files')[0];

        storageRef.put(file).then(function (snapshot) {
            // console.log('Uploaded a blob or file!');
        });

        firebase.database().ref('events/upcoming/' + getSelectedEvent() + "/image").child(userText).set({
            date: getSelectedEvent()
        });

        document.getElementById("uploadFile").value = "";
        document.getElementById("uploadFileName").value = "";
    }
}

function showImage() {
    var storage = firebase.storage();
    storage.refFromURL(referenceUrl + getSelectedEvent() + "/image/" + getSelectedImage()).getDownloadURL().then(function (url) {
        var element = document.createElement("img");
        element.setAttribute("src", url);
        document.getElementById("showImage").appendChild(element);
    });
}

function deleteImage() {
    firebase.storage().refFromURL(referenceUrl + getSelectedEvent() + "/image/" + getSelectedImage()).delete().then(function () {
        // File deleted successfully
    }).catch(function (error) {
        // an error occurred!
    });
    firebase.database().ref('events/upcoming/' + getSelectedEvent() + "/image/" + getSelectedImage()).remove();
}

function removeOptions(selectbox) {
    var imageDiv = document.getElementById("showImage");
    while (imageDiv.firstChild) {
        imageDiv.removeChild(imageDiv.firstChild);
    }
    var iterator;
    for (iterator = selectbox.options.length - 1; iterator >= 1; iterator--) {
        selectbox.remove(iterator);
    }
}

