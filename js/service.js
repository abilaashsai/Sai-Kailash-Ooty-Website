function readData() {
    firebase.database().ref('events/upcoming').once('value').then(function (snapshot) {
        document.getElementsByClassName('loading')[0].remove();
        var today = new Date();
        snapshot.forEach(function (year) {
            if (year.key >= today.getFullYear()) {
                year.forEach(function (month) {
                    month.forEach(function (day) {
                        if (day.val().type == "service") {
                            var imageArr = [];
                            day.forEach(function (image) {
                                if (image.key == "date" || image.key == "message" || image.key == "type" || image.key == "detail") {
                                } else {
                                    image.forEach(function (names) {
                                        imageArr.push(year.key + "/" + month.key + "/" + day.key + "/image/" + names.key)
                                    });
                                }
                            });
                            addDetailsToUI(day.val().date, day.val().message, day.val().detail, imageArr);
                        }
                    })
                });
            }
        });
    });
}

function addDetailsToUI(date, message, detail, imageArr) {
    var modifiedDate = date.replace(/ /g, "_");
    var initial = "<article> <div class=\"heading\"> <h2><a>" + message + "</a></h2> <p class=\"info\">>>>" + date + "</p> </div> <div class=\"content\" id=\"" + modifiedDate + "\"> <p>" + detail + "</p>";
    var image = "";

    for (var imageCount = 0; imageCount < imageArr.length; imageCount++) {
        var storage = firebase.storage();
        storage.refFromURL("gs://sai-kailas.appspot.com/events/upcoming/" + imageArr[imageCount]).getDownloadURL().then(function (url) {
            var element = document.createElement("img");
            element.setAttribute("src", url);
            document.getElementById(modifiedDate).appendChild(element);
        }).catch(function (error) {
        });
    }
    var final = "</div> </article>";
    var element = initial + image + final;
    $(".main-content").prepend(element);
}
 