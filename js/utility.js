function populateTabs() {
    document.getElementById("tabNavigation").innerHTML = `
    <nav>
    <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="spiritual.html">Spiritual Wing</a></li>
        <li><a href="service.html">Service Wing</a></li>
        <li><a href="education.html">Educational Wing</a></li>
        <li><a href="other.html">Other</a></li>
        <li><a href="divinefootprints.html">Divine Footprints</a></li>
        <li><a href="blogs.html">Blogs</a></li>
        <li><a href="location.html">Location</a></li>

    </ul>
</nav>
    `
}

function populateCopyright() {
    document.getElementById("copyright").innerHTML = `<p> Copyright © 2017 - saikailasooty.org</p>`
}

function populateFooter() {
    document.getElementById("pageFooter").innerHTML = `
    <div class="row">
            <section class="col-1-3">
                <div class="heading">About us</div>
                <div class="content">
                    The picturesque hill-station in the Nilgiris District of Tamil Nadu is the latest entrant in the
                    list of Abodes of Kaliyuga Avatar Bhagawan Sri Sathya Sai Baba. The Prashanthi report is found <a
                        href="http://www.theprasanthireporter.org/2012/05/sai-kailash-divine-abode-in-ooty-dedicated-to-bhagawan/">here</a>.
                </div>
            </section>
            <section class="col-1-3">
                <div class="heading"></div>
                <div class="content">
                </div>
            </section>
            <section class="col-1-3">
                <div class="heading">FOLLOW US ON</div>
                <td><a href="https://itunes.apple.com/in/app/sai-kailas-ooty/id1252407949?mt=8"><img
                        src="images/ios.png"/></a></td>
                <td><a href="https://play.google.com/store/apps/details?id=com.saikailas.ooty.organization&hl=en"><img
                        src="images/android.png"/></a></td>
            </section>
        </div>
    `
}

