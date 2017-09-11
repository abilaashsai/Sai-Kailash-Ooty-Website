function initFirebase() {
    var config = {
        apiKey: "AIzaSyD1GcbzoM-Na-W6fK9N4fvwRms6P3TNCIo",
        authDomain: "sai-kailas.firebaseapp.com",
        databaseURL: "https://sai-kailas.firebaseio.com",
        projectId: "sai-kailas",
        storageBucket: "sai-kailas.appspot.com",
        messagingSenderId: "193674830725"
    };
    firebase.initializeApp(config);
}
var referenceUrl = "gs://sai-kailas.appspot.com/events/upcoming/";
var referenceUrlSamithi = "gs://sai-kailas.appspot.com/samithi/village/";
var referenceUrlFootprints = "gs://sai-kailas.appspot.com/article/footprints/";
