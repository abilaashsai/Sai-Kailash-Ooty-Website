var editor;
function initialize() {
    var container = document.getElementById('writeup');
    editor = new Quill(container, {
        theme: 'snow'
    });

}

function getQuestion() {
    return document.getElementById('writeuptitle').value;
}

function submit() {

    var submitDate = new Date();
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"][submitDate.getMonth()];
    var storingDate = submitDate.getDate() + ' ' + month + ' ' + submitDate.getFullYear();

    firebase.database().ref(question)
        .push().set({
        question: getQuestion(),
        answer: editor.root.innerHTML,
        date: storingDate
    }).then(function () {
        alert("Successfully updated details");
        clearData();
    })
        .catch(function (error) {
            alert("Something went wrong")
        });
}

function clearData() {
    document.getElementById('writeuptitle').value = "";
    editor.root.innerHTML = "";
}