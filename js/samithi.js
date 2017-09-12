function readData() {
    firebase.database().ref(samithivillage).once('value').then(function (snapshot) {
        document.getElementsByClassName('loading')[0].remove();
        snapshot.forEach(function (samithi) {
            var imageArr = [];
            var description = [];
            samithi.forEach(function (content) {
                if (content.key == "image") {
                    content.forEach(function (names) {
                        imageArr.push(samithi.key + "/" + content.key + "/" + names.key);
                        description.push(names.val().description)
                    });
                }
            });
            addDetailsToUI(samithi.val().title, samithi.val().date, samithi.val().detail, imageArr, description);
        });
    });
}
function addDetailsToUI(title, origindate, detail, imageArr, imagedescription) {
    var displayDate = new Date(origindate);
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"][displayDate.getMonth()];
    var date = displayDate.getDate() + ' ' + month + ' ' + displayDate.getFullYear();
    var modifiedTitle = title.replace(/ /g, "_");
    var initial = "<article> <div class=\"heading\"><h2><a>" + title + "</a></h2>  <p class=\"info\">>>>" + date + "</p> </div> <div class=\"content\" id=\"" + modifiedTitle + "\"></div><div> <p align=\"justify\">" + detail + "</p></div> </article>";
    for (var imageCount = 0; imageCount < imageArr.length; imageCount++) {
        var storage = firebase.storage();
        storage.refFromURL(referenceUrlSamithi + imageArr[imageCount]).getDownloadURL().then(function (url) {
            var figure = document.createElement("figure");
            var figcaption = document.createElement("figcaption");
            var description = document.createTextNode(imagedescription[imageCount - 1]);
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