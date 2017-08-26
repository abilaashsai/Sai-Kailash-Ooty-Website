var editor;
var maintitleFilled = false;
var authorFilled = false;
var detail = false;
var userUID;

function initialize() {
    var container = document.getElementById('writeup');
    editor = new Quill(container, {
        theme: 'snow'
    });

}

function setEmail(email) {
    userUID = email;
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
}

function checkSubmitEnable() {
    if (maintitleFilled && authorFilled && detail) {
        $('.button').prop("disabled", false);
    } else {
        $('.button').prop("disabled", true);
    }

}

function submit() {

    var maintitleValue = document.getElementById('maintitle').value;
    var authorValue = document.getElementById('author').value;
    var phoneValue = document.getElementById('phone').value;
    var detail = editor.root.innerHTML;

    firebase.database().ref("experience/user").child(userUID).set({
        title: maintitleValue,
        author: authorValue,
        phone: phoneValue,
        content: detail
    });
}