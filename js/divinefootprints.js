function readData() {
    firebase.database().ref('article/footprints').once('value').then(function (snapshot) {
        document.getElementsByClassName('loading')[0].remove();
        addTitleAndAuthorToUI(snapshot.val().title, snapshot.val().author)
        snapshot.forEach(function (para) {
            if (para.key == "paragraph") {
                para.forEach(function (line) {
                    var imageArr = [];
                    var description = [];
                    line.forEach(function (image) {
                        if (image.key == "image") {
                            image.forEach(function (names) {
                                imageArr.push(para.key + "/" + line.key + "/" + image.key + "/" + names.key);
                                names.forEach(function (desc) {
                                description.push(names.val().description)
                                })
                            });
                        }
                    });
                    addContentIntoUI(line.key, line.val().paratitle, line.val().paradetail, imageArr, description)
                });
            }
        });
    });
}

function addTitleAndAuthorToUI(title, author) {
    document.getElementById("divineFootprintTitle").innerHTML = title;
    document.getElementById("divineFootprintAuthor").innerHTML = ">>>" + author;
}

function addContentIntoUI(idkey, title, detail, imageArr, imagedescription) {
    var modifiedTitle = idkey;
    console.log(title);
    var initial = "<article> <div class=\"heading\"> <p class=\"info\"><h4><i>" + title + "</i></h4></p> </div> <div class=\"content\" id=\"" + modifiedTitle + "\"></div><div> <p align=\"justify\">" + detail + "</p></div> </article>";
    for (var imageCount = 0; imageCount < imageArr.length; imageCount++) {
        var storage = firebase.storage();
        storage.refFromURL("gs://sai-kailas.appspot.com/article/footprints/" + imageArr[imageCount]).getDownloadURL().then(function (url) {
            var figure = document.createElement("figure");
            var figcaption = document.createElement("figcaption");
            var description = document.createTextNode(imagedescription[imageCount-1]);
            figcaption.appendChild(description);
            var image = document.createElement("img");
            image.setAttribute("src", url);
            figure.appendChild(image);
            figure.appendChild(figcaption);
            document.getElementById(modifiedTitle).prepend(figure);
        }).catch(function (error) {
        });
    }
    var element = initial;
    $(".main-content").append(element);
}