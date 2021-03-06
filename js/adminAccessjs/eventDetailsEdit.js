/*  jQuery ready function. Specify a function to execute when the DOM is fully loaded.  */
var editor;
function readEventData() {
    firebase.database().ref(eventsupcoming).once('value').then(function (snapshot) {
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

function initializeQuill() {
    var container = document.getElementById('parawriteup');
    editor = new Quill(container, {
        theme: 'snow'
    });
}

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
        firebase.database().ref(eventsupcoming + '/' + getSelectedEvent()).update({
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
        firebase.database().ref(eventsupcoming + '/' + getSelectedEvent()).update({
            type: userType
        }).then(function () {
            alert("type updated");
            document.getElementById("eventType").value = "";
            clearAllFields();
        });
    }
};

function addDetailsIntoDropDown(year, month, date, message) {
    var eventAdded = document.getElementById("eventAdded");
    var option = document.createElement("option");
    option.value = year + "/" + month + "/" + date;
    option.text = year + "-" + month + "-" + date + " " + message;
    eventAdded.add(option);
};
function addParaDetailsIntoDropDown(number) {
    var paraDropDown = document.getElementById("para");
    var option = document.createElement("option");
    option.value = number;
    option.text = number;
    paraDropDown.add(option);
}
function checkInformation() {
    clearAllFieldsExceptEvent();

    if (getSelectedEvent() === "") {
        document.getElementById("eventType").value = "";
    } else {
        firebase.database().ref(eventsupcoming + '/' + getSelectedEvent()).once('value').then(function (snapshot) {
            document.getElementById("eventType").value = snapshot.val().type;
            snapshot.forEach(function (para) {
                if (para.key == "paragraph") {
                    para.forEach(function (line) {
                        addParaDetailsIntoDropDown(line.key)
                    });
                }
            });
        });
    }
}

function checkParagraph() {
    removeEventImagesListAndImage();
    editor.root.innerHTML = "";
    var para = document.getElementById("para");
    var selectedPara = para.options[para.selectedIndex].value;
    if (selectedPara === "para" || selectedPara === "") {
        document.getElementById('paratext').style.display = "block"
    } else {
        document.getElementById('paratext').style.display = "none";
        firebase.database().ref('events/upcoming/' + getSelectedEvent() + '/paragraph/' + selectedPara).once('value').then(function (snapshot) {
            editor.root.innerHTML = snapshot.val().paradetail;
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

function updateEdit() {
    var selectedEvent = getSelectedEvent();
    var userDetailText = editor.root.innerHTML;
    var para = document.getElementById("para");
    var selectedPara = para.options[para.selectedIndex].value;

    if (selectedEvent == "") {
        alert("Please select the event");
    } else if (userDetailText == "") {
        alert("Please fill the details of paragraph");
    } else {
        if (selectedPara === "para" || selectedPara === "") {
            var userParaNumber = document.getElementById("paranumber").value;
            if (userParaNumber == "") {
                alert("Please enter paragraph number");
            } else {
                firebase.database().ref(eventsupcoming + '/' + getSelectedEvent() + '/paragraph/' + userParaNumber).set({
                    paradetail: userDetailText
                }).then(function () {
                    alert("details updated");
                });
            }
        } else {
            firebase.database().ref(eventsupcoming + '/' + getSelectedEvent() + '/paragraph/' + selectedPara).update({
                paradetail: userDetailText
            }).then(function () {
                alert("details");
            });
        }
    }
    clearAllFields();
};

function uploadImage() {
    var para = document.getElementById("para");
    var selectedPara = para.options[para.selectedIndex].value;

    var userText = document.getElementById("uploadFileName").value;
    var userDesc = document.getElementById("imagedescription").value;

    if (userText == "") {
        alert("Please name the image file");
    } else if (userDesc == "") {
        alert("Please name the description");
    }
    else if (selectedPara == "" || selectedPara == "para") {
        alert("Please select the paragraph");
    } else {
        var storageRef = firebase.storage().ref(eventsupcoming + '/' + getSelectedEvent() + '/paragraph/' + selectedPara + "/image/" + userText);
        var $ = jQuery;
        var file = $('#uploadFile').prop('files')[0];

        storageRef.put(file).then(function (snapshot) {
            alert("image uploaded successfully");
            // console.log('Uploaded a blob or file!');
        });

        firebase.database().ref(eventsupcoming + '/' + getSelectedEvent() + '/paragraph/' + selectedPara + "/image").child(userText).set({
            description: userDesc
        }).then(function () {
            alert("image description set successfull");
        });

        document.getElementById("uploadFile").value = "";
        document.getElementById("uploadFileName").value = "";
        document.getElementById("imagedescription").value = "";
    }
    clearAllFields();
}

function clearAllFields() {
    document.getElementById("eventType").value = "";
    document.getElementById("paranumber").value = "";
    document.getElementById("uploadFileName").value = "";
    document.getElementById("imagedescription").value = "";
    editor.root.innerHTML = "";
    document.getElementById('paratext').style.display = "none";
    removeOptions(document.getElementById("para"));
    document.getElementById("para").value = "";
}

function removeOptions(selectbox) {
    var iterator;
    for (iterator = selectbox.options.length - 1; iterator >= 2; iterator--) {
        selectbox.remove(iterator);
    }
}

function getSelectedPara() {
    var para = document.getElementById("para").value;
    return para;
}

function showImage() {
    var storage = firebase.storage();
    storage.refFromURL(referenceUrl + getSelectedEvent() + '/paragraph/' + getSelectedPara() + "/image/" + getSelectedImage()).getDownloadURL().then(function (url) {
        var element = document.createElement("img");
        element.setAttribute("src", url);
        document.getElementById("showImage").appendChild(element);
    });
}

function deleteImage() {
    firebase.storage().refFromURL(referenceUrl + getSelectedEvent() + '/paragraph/' + getSelectedPara() + "/image/" + getSelectedImage()).delete().then(function () {
        // File deleted successfully
    }).then(function () {
        alert("image deleted successfull");
    }).catch(function (error) {
        // an error occurred!
    });
    firebase.database().ref(referenceUrl + getSelectedEvent() + '/paragraph/' + getSelectedPara() + "/image/" + getSelectedImage()).remove().then(function () {
        alert("image reference deleted successfull");
    });
    clearAllDetails();
}

function removeEventImagesListAndImage() {
    var imageDiv = document.getElementById("deleteEventImage");
    var iterator;
    for (iterator = imageDiv.options.length - 1; iterator >= 1; iterator--) {
        imageDiv.remove(iterator);
    }
    var imageDisp = document.getElementById("showImage")
    while (imageDisp.hasChildNodes()) {
        imageDisp.removeChild(imageDisp.lastChild);
    }
}

function clearAllFieldsExceptEvent() {
    removeEventImagesListAndImage();
    document.getElementById("paranumber").value = "";
    document.getElementById("uploadFileName").value = "";
    document.getElementById("imagedescription").value = "";
    editor.root.innerHTML = "";
    document.getElementById('paratext').style.display = "none";
    removeOptions(document.getElementById("para"));
    removeOptions(document.getElementById("deleteEventImage"));
    document.getElementById("para").value = "";
}

