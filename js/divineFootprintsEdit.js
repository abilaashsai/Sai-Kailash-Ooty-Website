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
function initializeQuill(){
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
                    paradetail: userDetailText,
                });
            }
        } else {
            firebase.database().ref('article/footprints/paragraph/' + selectedPara).update({
                paradetail: userDetailText,
            });
        }
    }
};

function checkParagraph() {
    editor.root.innerHTML = "";
    var para = document.getElementById("para");
    var selectedPara = para.options[para.selectedIndex].value;
    if (selectedPara === "para" || selectedPara === "") {
        document.getElementById('paratext').style.display = "block"
    } else {
        document.getElementById('paratext').style.display = "none";
        firebase.database().ref('article/footprints/paragraph/' + selectedPara).once('value').then(function (snapshot) {
            editor.root.innerHTML = snapshot.val().paradetail;
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

        storageRef.put(file).then(function (snapshot) {
            // console.log('Uploaded a blob or file!');
        });

        firebase.database().ref('article/footprints/paragraph/' + selectedPara + "/image").child(userText).set({
            description: userDesc
        });

        document.getElementById("uploadFile").value = "";
        document.getElementById("uploadFileName").value = "";
        document.getElementById("imagedescription").value = "";
    }
}