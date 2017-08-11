function readData() {

    var upcoming = "";
    var past = "";
    firebase.database().ref('events/upcoming').once('value').then(function (snapshot) {
        var today = new Date();
        var pastData = [];
        snapshot.forEach(function (year) {
            if (year.key >= today.getFullYear()) {
                year.forEach(function (month) {
                    if (month.key >= (today.getMonth() + 1)) {
                        month.forEach(function (day) {
                            var link = day.val().type + ".html";
                            if ((month.key == (today.getMonth() + 1) && day.key >= today.getDate()) || month.key > (today.getMonth() + 1)) {
                                upcoming = upcoming + "<li><b><a href=" + link + "?date=" + day.val().date.replace(/ /g, "_") + ">" + day.val().message + '</a></b> - ' + day.val().date + "</li>";
                            } else {
                                past = "<li><b><a href=" + link + "?date=" + day.val().date.replace(/ /g, "_") + ">" + day.val().message + '</a></b> - ' + day.val().date + "</li>";
                                pastData.push(past);
                            }
                        })
                    }
                    if (month.key < (today.getMonth() + 1)) {
                        month.forEach(function (day) {
                            var link = day.val().type + ".html";
                            past = "<li><b><a href=" + link + "?date=" + day.val().date.replace(/ /g, "_") + ">" + day.val().message + '</a></b> - ' + day.val().date + "</li>";
                            pastData.push(past);
                        })
                    }
                });
            }
        });
        past = "";
        for (var initial = pastData.length - 1; initial >= pastData.length - 5; initial--) {
            past = past + pastData[initial];
        }

        document.getElementById("upcomingData").innerHTML = upcoming;
        document.getElementById("pastData").innerHTML = past;
    });
    firebase.database().ref('announcement').once('value').then(function (snapshot) {
        var announcement = "";
        snapshot.forEach(function (title) {
            document.getElementById("announcementVisibility").style.display = "block"
            announcement = announcement + "<li><b>" + title.val().title + "</b> - " + title.val().data + "</li>";
        });
        document.getElementById("announcementData").innerHTML = announcement;

    });
    firebase.database().ref('thought').once('value').then(function (snapshot) {
        document.getElementById("thoughtTitle").innerHTML = snapshot.val().title;
        document.getElementById("thoughtData").innerHTML = snapshot.val().data;
    });
}
function setFieldsToLoading() {
    document.getElementById("upcomingData").innerHTML = "<li><b>Loading...</b></li>";
    document.getElementById("pastData").innerHTML = "<li><b>Loading...</b></li>";
    document.getElementById("thoughtTitle").innerHTML = "Loading...";
    document.getElementById("announcementData").innerHTML = "<li><b>Loading...</b></li>";
}
 