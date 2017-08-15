function readSamithiData() {
    firebase.database().ref('samithi/village').once('value').then(function (snapshot) {
        snapshot.forEach(function (village) {
            addDetailsIntoDropDown(village.val().title);
        })
    });
};
function clearAllDetails() {
    document.getElementById("samithiwriteup").value = "";
    document.getElementById('samithiTitle').value = "";
    document.getElementById("samithiDatePicker").value = "";
    document.getElementById("uploadFileName").value = "";
    document.getElementById("imagedescription").value = "";
}

function checkSamithi() {
    var samithiAdded = document.getElementById("samithiAdded");
    var selectedSamithi = samithiAdded.options[samithiAdded.selectedIndex].value;
    if (selectedSamithi === "add_new") {
        document.getElementById('samithiTitle').readOnly = false;
        document.getElementById('samithiNew').style.display = "block"
        clearAllDetails();
    } else {
        document.getElementById('samithiTitle').readOnly = true;
        document.getElementById('samithiNew').style.display = "block";
        firebase.database().ref('samithi/village/' + selectedSamithi).once('value').then(function (snapshot) {
            document.getElementById("samithiTitle").value = snapshot.val().title;
            var dateFormat = moment(snapshot.val().date, "YYYY-MM-DD").format('YYYY-MM-DD');
            document.getElementById("samithiDatePicker").value = dateFormat;
            document.getElementById("samithiwriteup").value = snapshot.val().detail;
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
        })
    }
}
function getSelectedSamithi() {
    var samithiAdded = document.getElementById("samithiAdded");
    return samithiAdded.options[samithiAdded.selectedIndex].value;
}
function updateEdit() {
    var samithiTitle = document.getElementById("samithiTitle").value;
    var samithiDetail = document.getElementById("samithiwriteup").value;
    var date = document.getElementById("samithiDatePicker").value;
    var selectedSamithi = getSelectedSamithi();

    if (selectedSamithi == "") {
        alert("Please select the Samithi");
    } else if (samithiTitle == "") {
        alert("Please fill the Samithi Name");
    } else if (samithiwriteup == "") {
        alert("Please fill the details of Samithi");
    } else if (date == "") {
        alert("Please enter the date");
    } else {
        var eventDate = new Date(date);
        var storingDate = eventDate.getFullYear() + "-" + (eventDate.getMonth() + 1) + "-" + eventDate.getDate();
        if (selectedSamithi === "add_new" || selectedSamithi === "") {
            var modifiedTitle = samithiTitle.toLowerCase();
            firebase.database().ref('samithi/village/' + samithiTitle).set({
                title: samithiTitle,
                detail: samithiDetail,
                date: storingDate
            });
        } else {
            firebase.database().ref('samithi/village/' + getSelectedSamithi()).update({
                title: samithiTitle,
                detail: samithiDetail,
                date: storingDate

            });
        }
        clearAllDetails();
        removeSamithiOptions();
        removeSamithiImages();
        readSamithiData();

    }
};

function addDetailsIntoDropDown(title) {
    var samithiAdded = document.getElementById("samithiAdded");
    var option = document.createElement("option");
    option.value = title.toLowerCase();
    option.text = title;
    samithiAdded.add(option);
}

function uploadImage() {
    var userText = document.getElementById("uploadFileName").value;
    var userDesc = document.getElementById("imagedescription").value;

    if (userText == "") {
        alert("Please name the image file");
    } else if (userDesc == "") {
        alert("Please enter image description");
    }
    else if (getSelectedSamithi() == "") {
        alert("Please select the samithi");
    } else {
        var storageRef = firebase.storage().ref('samithi/village/' + getSelectedSamithi() + "/image/" + userText);
        var $ = jQuery;
        var file = $('#uploadFile').prop('files')[0];

        storageRef.put(file).then(function (snapshot) {
            console.log('Uploaded a blob or file!');
        });

        firebase.database().ref('samithi/village/' + getSelectedSamithi() + "/image").child(userText).set({
            samithi: getSelectedSamithi(),
            description: userDesc
        });

        document.getElementById("uploadFile").value = "";
        document.getElementById("uploadFileName").value = "";
    }
    clearAllDetails();
}

function getSelectedImage() {
    var eventAddedId = document.getElementById("deleteEventImage");
    var userSelection = eventAddedId.options[eventAddedId.selectedIndex].value;
    return userSelection
}

function showImage() {
    var storage = firebase.storage();
    storage.refFromURL(referenceUrlSamithi + getSelectedSamithi() + "/image/" + getSelectedImage()).getDownloadURL().then(function (url) {
        var element = document.createElement("img");
        element.setAttribute("src", url);
        document.getElementById("showImage").appendChild(element);
    });
}

function deleteImage() {
    firebase.storage().refFromURL(referenceUrlSamithi + getSelectedSamithi() + "/image/" + getSelectedImage()).delete().then(function () {
        // File deleted successfully
    }).catch(function (error) {
        // an error occurred!
    });
    firebase.database().ref('samithi/village/' + getSelectedSamithi() + "/image/" + getSelectedImage()).remove();
    clearAllDetails();
}

function removeSamithiOptions() {
    var imageDiv = document.getElementById("samithiAdded");
    while (imageDiv.firstChild) {
        imageDiv.removeChild(imageDiv.firstChild);
    }
    var iterator;
    for (iterator = imageDiv.options.length - 1; iterator >= 2; iterator--) {
        imageDiv.remove(iterator);
    }
}

function removeSamithiImages() {
    var imageDiv = document.getElementById("deleteEventImage");
    while (imageDiv.firstChild) {
        imageDiv.removeChild(imageDiv.firstChild);
    }
    var iterator;
    for (iterator = imageDiv.options.length - 1; iterator >= 1; iterator--) {
        imageDiv.remove(iterator);
    }
}
