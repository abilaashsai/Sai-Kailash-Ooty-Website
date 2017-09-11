var editor;
function readData() {
    firebase.database().ref('article/footprints').once('value').then(function (snapshot) {
            document.getElementById("writeuptitle").value = snapshot.val().title;
            document.getElementById("writeupauthor").value = snapshot.val().author;
            snapshot.forEach(function (para) {
                if (para.key == "paragraph") {
                    para.forEach(function (line) {
                        addDetailsIntoDropDown(line.key)
                    });
                }
            });
        }
    );
}
function initializeQuill() {
    var container = document.getElementById('parawriteup');
    editor = new Quill(container, {
        theme: 'snow'
    });
}

function updateEdit() {
    var userDetailTitle = document.getElementById("writeuptitle").value;
    var userDetailAuthor = document.getElementById("writeupauthor").value;
    var userDetailText = editor.root.innerHTML;
    var para = document.getElementById("para");
    var selectedPara = para.options[para.selectedIndex].value;

    if (userDetailTitle == "") {
        alert("Please fill the title");
    } else if (userDetailAuthor == "") {
        alert("Please fill the author");
    } else if (userDetailText == "") {
        alert("Please fill the details of paragraph");
    } else {
        if (selectedPara === "para" || selectedPara === "") {
            var userParaNumber = document.getElementById("paranumber").value;
            if (userParaNumber == "") {
                alert("Please enter paragraph number");
            } else {
                firebase.database().ref('article/footprints/paragraph/' + userParaNumber).set({
                    paradetail: userDetailText
                }).then(function () {
                    alert("details updated successfully");
                    clearAllDetails();
                    readData();
                }).catch(function (error) {
                    // an error occurred!
                    alert("some error has been occurred");
                });
            }
        } else {
            firebase.database().ref('article/footprints/paragraph/' + selectedPara).update({
                paradetail: userDetailText
            }).then(function () {
                alert("details updated successfully");
                clearAllDetails();
                readData();
            }).catch(function (error) {
                // an error occurred!
                alert("some error has been occurred");
            });
        }
    }
};

function getSelectedPara() {
    var para = document.getElementById("para");
    var selectedPara = para.options[para.selectedIndex].value;
    return selectedPara
}

function getSelectedImage() {
    var eventAddedId = document.getElementById("deleteEventImage");
    var userSelection = eventAddedId.options[eventAddedId.selectedIndex].value;
    return userSelection
}

function checkParagraph() {
    clearAllFieldsExceptPara();

    var para = document.getElementById("para");
    var selectedPara = para.options[para.selectedIndex].value;
    if (selectedPara === "para" || selectedPara === "") {
        document.getElementById('paratext').style.display = "block"
    } else {
        document.getElementById('paratext').style.display = "none";
        firebase.database().ref('article/footprints/paragraph/' + selectedPara).once('value').then(function (snapshot) {
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

function addDetailsIntoDropDown(number) {
    var paraDropDown = document.getElementById("para");
    var option = document.createElement("option");
    option.value = number;
    option.text = number;
    paraDropDown.add(option);
}

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
        var storageRef = firebase.storage().ref('article/footprints/paragraph/' + selectedPara + "/image/" + userText);
        var $ = jQuery;
        var file = $('#uploadFile').prop('files')[0];

        storageRef.put(file).then(function () {
            alert("image uploaded successfully");
            clearAllDetails();
            readData();
        }).catch(function (error) {
            // an error occurred!
            alert("some error has been occurred");
        });

        firebase.database().ref('article/footprints/paragraph/' + selectedPara + "/image").child(userText).set({
            description: userDesc
        }).then(function () {
            alert("image uploaded successfully");
            clearAllDetails();
            readData();
        }).catch(function (error) {
            // an error occurred!
            alert("some error has been occurred");
        });

        document.getElementById("uploadFile").value = "";
        document.getElementById("uploadFileName").value = "";
        document.getElementById("imagedescription").value = "";
    }
}

function removeOptions(selectbox) {
    var iterator;
    for (iterator = selectbox.options.length - 1; iterator >= 2; iterator--) {
        selectbox.remove(iterator);
    }
}

function showImage() {
    var storage = firebase.storage();
    storage.refFromURL(referenceUrlFootprints + 'paragraph/' + getSelectedPara() + "/image/" + getSelectedImage()).getDownloadURL().then(function (url) {
        var element = document.createElement("img");
        element.setAttribute("src", url);
        document.getElementById("showImage").appendChild(element);
    });
}

function deleteImage() {
    firebase.storage().refFromURL(referenceUrlFootprints + 'paragraph/' + getSelectedPara() + "/image/" + getSelectedImage()).delete().then(function () {
        // File deleted successfully
    }).then(function () {
        alert("image deleted successfull");
    }).catch(function (error) {
        // an error occurred!
    });
    firebase.database().ref('article/footprints/paragraph/' + getSelectedPara() + "/image/" + getSelectedImage()).remove().then(function () {
        alert("image reference deleted successfull");
        clearAllDetails();
        readData();
    });
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

function clearAllFieldsExceptPara() {
    removeEventImagesListAndImage();
    document.getElementById("uploadFileName").value = "";
    document.getElementById("imagedescription").value = "";
    editor.root.innerHTML = "";
    document.getElementById('paratext').style.display = "none";
    removeOptions(document.getElementById("deleteEventImage"));
}

function clearAllDetails() {
    removeEventImagesListAndImage();
    document.getElementById("uploadFileName").value = "";
    document.getElementById("imagedescription").value = "";
    document.getElementById("para").value = "";
    editor.root.innerHTML = "";
    document.getElementById('paratext').style.display = "none";
    removeOptions(document.getElementById("deleteEventImage"));
}

