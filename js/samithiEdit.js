function readSamithiData() {
    firebase.database().ref('samithi/village').once('value').then(function (snapshot) {
        snapshot.forEach(function (village) {
            addDetailsIntoDropDown(village.val().title);
        })
    });
};

function checkSamithi() {
    var samithiAdded = document.getElementById("samithiAdded");
    var selectedSamithi = samithiAdded.options[samithiAdded.selectedIndex].value;
    if (selectedSamithi === "add_new") {
        document.getElementById('samithiNew').style.display = "block"
    } else {
        document.getElementById('samithiNew').style.display = "none";
        firebase.database().ref('samithi/village/' + selectedSamithi).once('value').then(function (snapshot) {
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
    var selectedSamithi = getSelectedSamithi();

    if (selectedSamithi == "") {
        alert("Please select the Samithi");
    } else if (samithiTitle == "") {
        alert("Please fill the Samithi Name");
    } else if (samithiwriteup == "") {
        alert("Please fill the details of Samithi");
    } else {
        if (selectedSamithi === "add_new" || selectedSamithi === "") {
            var modifiedTitle = samithiTitle.toLowerCase();
            firebase.database().ref('samithi/village/' + modifiedTitle).set({
                title: samithiTitle,
                detail: samithiDetail
            });
            location.reload();
        } else {
            firebase.database().ref('samithi/village/' + modifiedTitle).update({
                title: samithiTitle,
                detail: samithiDetail
            });
            location.reload();
        }
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

    if (userText == "") {
        alert("Please name the image file");
    }
    else if (getSelectedSamithi() == "") {
        alert("Please select the samithi");
    } else {
        var storageRef = firebase.storage().ref('samithi/village/' + getSelectedSamithi() + "/image/" + userText);
        var $ = jQuery;
        var file = $('#uploadFile').prop('files')[0];

        storageRef.put(file).then(function (snapshot) {
            // console.log('Uploaded a blob or file!');
        });

        firebase.database().ref('samithi/village/' + getSelectedSamithi() + "/image").child(userText).set({
            samithi: getSelectedSamithi()
        });

        document.getElementById("uploadFile").value = "";
        document.getElementById("uploadFileName").value = "";
    }
    location.reload();
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
    location.reload();
}