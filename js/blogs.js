function readData() {
    firebase.database().ref('experience/approved').once('value').then(function (snapshot) {
        document.getElementsByClassName('loading')[0].remove();
        var today = new Date();
        snapshot.forEach(function (year) {
            year.forEach(function (month) {
                month.forEach(function (day) {
                    day.forEach(function (mail) {
                        addDetailsToUI(mail.val().date, mail.val().url);
                    });
                })
            });
        });
    });

}

function addContentIntoUI(date, title, content, imageUrl, imagedescription) {
    var modifiedDate = date.replace(/ /g, "_");
    var modifiedTitle = modifiedDate + title;
    var element = "<article> <div class=\"content\" id=\"" + modifiedTitle + "\"></div><div> <p align=\"justify\">" + content + "</p></div> </article>";
    var storage = firebase.storage();
    storage.refFromURL(referenceUrlExperience + imageUrl).getDownloadURL().then(function (url) {
        var figure = document.createElement("figure");
        var figcaption = document.createElement("figcaption");
        var description = document.createTextNode(imagedescription);
        figcaption.appendChild(description);
        var image = document.createElement("img");
        image.setAttribute("src", url);
        figure.appendChild(image);
        figure.appendChild(figcaption);
        document.getElementById(modifiedTitle).prepend(figure);
    }).catch(function (error) {
    });

    $("#" + modifiedDate).append(element);
}

function addDetailsToUI(date, url) {
    firebase.database().ref("experience/user/" + url).once('value').then(function (snapshot) {
        var modifiedDate = date.replace(/ /g, "_");
        var headingId = modifiedDate + "heading";
        var contentId = modifiedDate + "content";
        var contentIdentifier = "#" + modifiedDate + "content";
        var initial = `<article>
                                <div class=\"panel panel-default\">
                                    <div class=\"heading panel-heading\" data-toggle=\"collapse\" id = ${headingId} href=${contentIdentifier}>
                                        <h2><a> ${snapshot.val().title}</a></h2>
                                            <p class=\"info\">>>>${snapshot.val().author} <i>,</i> ${date}</p>
                                    </div>
                                    <div class=\"content panel-collapse collapse\" id = ${contentId} >
                                        <div id=${modifiedDate}>
                                        </div>
                                    </div>
                                </div>
                     </article>
                  `;
        var element = initial;

        $(".main-content").prepend(element);
        var imageUrl = "#";
        var description = "";
        snapshot.forEach(function (image) {
            if (image.key == "image") {
                description = image.val().description;
                imageUrl = url + "/image/" + image.val().title
            }
        });
        addContentIntoUI(date, snapshot.val().title, snapshot.val().content, imageUrl, description)
    });
}
 