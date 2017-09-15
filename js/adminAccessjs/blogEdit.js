var editor;
function initialize() {
    var container = document.getElementById('writeup');
    editor = new Quill(container, {
        theme: 'snow'
    });

}

function readData() {
    firebase.database().ref(experienceuser).once('value').then(function (snapshot) {
        snapshot.forEach(function (user) {
            if (!user.hasChild("approved")) {
                addDetailsIntoDropDown(user.val().email, user.key)
            }
        });
    })
}

function checkBlog() {
    clearImageField();
    firebase.database().ref(experienceuser + '/' + getUserSelectionKey()).once('value').then(function (snapshot) {
        document.getElementById("maintitle").value = snapshot.val().title;
        document.getElementById("author").value = snapshot.val().author;
        document.getElementById("phone").value = snapshot.val().phone;
        editor.root.innerHTML = snapshot.val().content;
        snapshot.forEach(function (image) {
            if (image.key == "image") {
                image.forEach(function (source) {
                    document.getElementById("imagedescription").value = source.val().description
                    var storage = firebase.storage();
                    storage.refFromURL(referenceUrlExperience + getUserSelectionKey() + "/image/" + source.val().title)
                        .getDownloadURL().then(function (url) {
                        $('#userImage').attr('src', url);
                    });
                })
            }
        });
    })
}

function addDetailsIntoDropDown(email, key) {
    var eventAdded = document.getElementById("blogAdded");
    var option = document.createElement("option");
    option.value = key;
    option.text = email;
    eventAdded.add(option);
}

function getUserSelectionKey() {
    var blogId = document.getElementById("blogAdded");
    var selection = blogId.options[blogId.selectedIndex].value;
    return selection;
}

function getMainTitle() {
    return document.getElementById('maintitle').value;
}

function getAuthorName() {
    return document.getElementById('author').value;
}

function getPhoneNumber() {
    return document.getElementById('phone').value;
}

function approve() {
    var approveBol = false;
    var statusBol = false;
    var eventDate = new Date();
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"][eventDate.getMonth()];
    var storingDate = eventDate.getDate() + ' ' + month + ' ' + eventDate.getFullYear();

    firebase.database().ref(experienceapproved + '/' + eventDate.getFullYear() + "/" +
        (eventDate.getMonth() + 1) + "/" + eventDate.getDate() + "/" + getUserSelectionKey())
        .set({
            url: getUserSelectionKey(),
            date: storingDate
        }).then(function () {
        alert("Successfully updated details");
        approveBol = true;
        reloadIfSuccess()
    })
        .catch(function (error) {
            alert("Something went wrong")
        });

    firebase.database().ref(experienceuser + '/' + getUserSelectionKey()).update({
        title: getMainTitle(),
        author: getAuthorName(),
        phone: getPhoneNumber(),
        content: editor.root.innerHTML,
        approved: {status: "published"}
    }).then(function () {
        alert("Successfully approved");
        statusBol = true;
        reloadIfSuccess()
    })
        .catch(function (error) {
            alert("Something went wrong")
        });

    function reloadIfSuccess() {
        if (approveBol && statusBol) {
            reloadData();
        }
    }
}

function reloadData() {
    var blogDiv = document.getElementById("blogAdded");
    var iterator;
    for (iterator = blogDiv.options.length - 1; iterator >= 1; iterator--) {
        blogDiv.remove(iterator);
    }
    document.getElementById('author').value = "";
    document.getElementById('maintitle').value = "";
    document.getElementById('phone').value = "";
    editor.root.innerHTML = "";
    clearImageField();
    readData();
}
function clearImageField() {
    $('#userImage').attr('src', "#");
}
