var editor;
var maintitleFilled = false;
var authorFilled = false;
var detail = false;
var userUID;
var emailID;
var imageUpload = true;

var firebaseDataSetSucceed = false;
var firebaseImageSetSucceed = false;
var firebaseStorageSetSucceed = false;

function initialize() {
    var container = document.getElementById('writeup');
    editor = new Quill(container, {
        theme: 'snow'
    });
    document.getElementById('newBlogButton').click();
}

function setEmail(email) {
    emailID = email;
}

function setUserID(userid) {
    userUID = userid;
}

function enableSubmitButton() {
    var maintitleId = document.getElementById('maintitle');
    var authorId = document.getElementById('author');

    maintitleId.oninput =
        function () {
            if ($(this).val().length > 0) {
                maintitleFilled = true;
                checkSubmitEnable();
            } else {
                maintitleFilled = false;
                checkSubmitEnable();
            }
        };
    maintitleId.onpropertychange = maintitleId.oninput;

    authorId.oninput = function () {
        if ($(this).val().length > 0) {
            authorFilled = true;
            checkSubmitEnable();
        } else {
            authorFilled = false;
            checkSubmitEnable();
        }
    };
    authorId.onpropertychange = maintitleId.oninput;

    editor.on('text-change', function () {
        detail = editor.getText().trim().length > 0;
        checkSubmitEnable();
    });

    $('#uploadFile').change(function () {
        var fileName = $(this).val();
        var imageDetails = document.getElementById("imageDetails");
        if (fileName.length > 0) {
            var file = $('#uploadFile').prop('files')[0];
            if (file.size / 1024 / 1024 > 4) {
                alert("File too big");
                return;
            }
            var imageNameWarning = document.getElementById("imageNameWarning");
            var uploadFileName = document.getElementById("uploadFileName");
            imageDetails.style.display = 'inline';
            imageNameWarning.style.display = 'inline';
            imageUpload = false;

            var reader = new FileReader();
            reader.onload = function (e) {
                $('#userImage').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
            checkSubmitEnable();

            uploadFileName.oninput = function () {
                if ($(this).val().length > 0) {
                    imageUpload = true;
                    imageNameWarning.style.display = 'none';
                    checkSubmitEnable();
                } else {
                    imageUpload = false;
                    imageNameWarning.style.display = 'inline';
                    checkSubmitEnable();
                }
            };
            uploadFileName.onpropertychange = uploadFileName.oninput;

        } else {
            imageDetails.style.display = 'none';
            imageUpload = true;
            checkSubmitEnable();
        }

    });
}

function checkSubmitEnable() {
    if (maintitleFilled && authorFilled && detail && imageUpload) {
        $('.button').prop("disabled", false);
    } else {
        $('.button').prop("disabled", true);
    }
}

function submit() {
    function showFailureNotice() {
        var failureNotice = document.getElementById("failureNotice");
        failureNotice.style.display = 'inline';
    }

    var maintitleValue = document.getElementById('maintitle').value;
    var authorValue = document.getElementById('author').value;
    var phoneValue = document.getElementById('phone').value;
    var detail = editor.root.innerHTML;
    var imageDetails = document.getElementById("imageDetails");

    firebase.database().ref(experienceuser).child(userUID).set({
        title: maintitleValue,
        author: authorValue,
        phone: phoneValue,
        content: detail,
        email: emailID
    }).then(function () {
        firebaseDataSetSucceed = true;
        checkSucceed();
    })
        .catch(function (error) {
            showFailureNotice()
        });

    if (imageDetails.style.display != "none") {
        var uploadFileName = document.getElementById("uploadFileName").value;
        var imagedescription = document.getElementById("imagedescription").value;
        firebase.database().ref(experienceuser + '/' + userUID + "/image/" + uploadFileName).update({
            title: uploadFileName,
            description: imagedescription
        }).then(function () {
            firebaseImageSetSucceed = true;
            checkSucceed();
        })
            .catch(function (error) {
                showFailureNotice();
            });

        var storageRef = firebase.storage().ref(experienceuser + '/' + userUID + "/image/" + uploadFileName);
        var $ = jQuery;
        var file = $('#uploadFile').prop('files')[0];

        storageRef.put(file).then(function (snapshot) {
            // console.log('Uploaded a blob or file!');
        }).then(function () {
            firebaseStorageSetSucceed = true;
            checkSucceed();
        })
            .catch(function (error) {
                showFailureNotice();
            });

    }
}

function checkSucceed() {
    if (firebaseStorageSetSucceed && firebaseImageSetSucceed && firebaseDataSetSucceed) {
        document.getElementById('reviewButton').click();
        clearAllFields();
        console.log("success")
    }
}

function readReview() {
    var loadingReviewElement = document.getElementsByClassName('loadingReview')[0];
    var mainContentReviewElement = document.getElementsByClassName('main-content-review')[0];
    loadingReviewElement.style.display = 'inline';
    firebase.database().ref(experienceuser + '/' + userUID).once('value').then(function (snapshot) {
        while (mainContentReviewElement.hasChildNodes()) {
            mainContentReviewElement.removeChild(mainContentReviewElement.lastChild);
        }
        loadingReviewElement.style.display = 'none';
        if (!snapshot.hasChild("approved") ||
            (snapshot.hasChild("approved") && snapshot.val().approved.status != "published")) {
            addDetailsToUI(".main-content-review", snapshot.val().title)
        }
    })
}

function readPublished() {
    var loadingReviewElement = document.getElementsByClassName('loadingPublished')[0];
    var mainContentPublishedElement = document.getElementsByClassName('main-content-published')[0];
    loadingReviewElement.style.display = 'inline';
    firebase.database().ref(experienceuser + '/' + userUID).once('value').then(function (snapshot) {
        while (mainContentPublishedElement.hasChildNodes()) {
            mainContentPublishedElement.removeChild(mainContentPublishedElement.lastChild);
        }
        loadingReviewElement.style.display = 'none';
        if (snapshot.hasChild("approved") && snapshot.val().approved.status === "published") {
            addDetailsToUI(".main-content-published", snapshot.val().title)
        }
    })
}

function openTab(evt, tabName) {
    if (tabName === 'Review') {
        readReview()
    }
    if (tabName === 'Published') {
        readPublished()
    }
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function addDetailsToUI(id, title) {
    var initial = "<article> <div class=\"heading\"> <h2><a>" + title + "</a></h2>";
    var final = "</div> </article>";
    var element = initial + final;
    $(id).prepend(element);
}

function clearAllFields() {
    document.getElementById("maintitle").value = "";
    document.getElementById("author").value = "";
    document.getElementById("phone").value = "";
    editor.root.innerHTML = "";
    document.getElementById("uploadFile").value = "";
    document.getElementById("imagedescription").value = "";
    document.getElementById("uploadFileName").value = "";
    imageDetails.style.display = 'none';
}
