function readData() {
    firebase.database().ref('events/upcoming').once('value').then(function (snapshot) {
        document.getElementsByClassName('loading')[0].remove();
        var today = new Date();
        snapshot.forEach(function (year) {
            if (year.key >= today.getFullYear()) {
                year.forEach(function (month) {
                    month.forEach(function (day) {
                        if (day.val().type == "spiritual") {
                            addDetailsToUI(day.val().date, day.val().message);
                            day.forEach(function (para) {
                                if (para.key == "paragraph") {
                                    para.forEach(function (line) {
                                        var imageArr = [];
                                        var description = [];
                                        line.forEach(function (image) {
                                            if (image.key == "image") {
                                                image.forEach(function (names) {
                                                    imageArr.push(year.key + "/" + month.key + "/" + day.key + "/" + para.key + "/" + line.key + "/" + image.key + "/" + names.key);
                                                    names.forEach(function (desc) {
                                                        description.push(names.val().description)
                                                    })
                                                });
                                            }
                                        });
                                        addContentIntoUI(day.val().date, line.key, line.val().paradetail, imageArr, description)
                                    });
                                }
                            });
                        }
                    })
                });
            }
        });
        function scrollToSpecificLocation() {
            var url_string = window.location.href;
            var url = new URL(url_string);
            var scrollId = "#" + url.searchParams.get("date");
            if (url.searchParams.get("date") != null) {
                $(document).ready(function () {
                    $('html, body').animate({
                        scrollTop: $(scrollId).offset().top
                    }, 'slow');
                });
            }
        }

        scrollToSpecificLocation();
    });

}

function addContentIntoUI(date, idkey, detail, imageArr, imagedescription) {
    var modifiedDate = date.replace(/ /g, "_");
    var modifiedTitle = idkey;
    var initial = "<article> <div class=\"content\" id=\"" + modifiedTitle + "\"></div><div> <p align=\"justify\">" + detail + "</p></div> </article>";
    for (var imageCount = 0; imageCount < imageArr.length; imageCount++) {
        var storage = firebase.storage();
        storage.refFromURL(referenceUrl + imageArr[imageCount]).getDownloadURL().then(function (url) {
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
    $("#" + modifiedDate).append(element);
}

function addDetailsToUI(date, message) {
    var modifiedDate = date.replace(/ /g, "_");
    var initial = "<article> <div class=\"heading\"> <h2><a>" + message + "</a></h2> <p class=\"info\">>>>" + date + "</p> </div> <div class=\"content\"> <div id=\"" + modifiedDate + "\"></div></div>";
    var final = "</div> </article>";
    var element = initial + final;
    $(".main-content").prepend(element);
}
 