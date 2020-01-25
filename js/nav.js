document.addEventListener("DOMContentLoaded", function() {
    // Activate sidebar nav
    var elems = document.querySelectorAll(".sidenav");
    var slider = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(slider)
    M.Sidenav.init(elems);
    // var instance = M.Carousel.getInstance(elem);

    var sidenavs = document.querySelectorAll('.sidenav')
    for (var i = 0; i < sidenavs.length; i++) {
        M.Sidenav.init(sidenavs[i]);
    }
    var dropdowns = document.querySelectorAll('.dropdown-trigger')
    for (var i = 0; i < dropdowns.length; i++) {
        M.Dropdown.init(dropdowns[i]);
    }
    var collapsibles = document.querySelectorAll('.collapsible')
    for (var i = 0; i < collapsibles.length; i++) {
        M.Collapsible.init(collapsibles[i]);
    }
    var featureDiscoveries = document.querySelectorAll('.tap-target')
    for (var i = 0; i < featureDiscoveries.length; i++) {
        M.FeatureDiscovery.init(featureDiscoveries[i]);
    }
    var materialboxes = document.querySelectorAll('.materialboxed')
    for (var i = 0; i < materialboxes.length; i++) {
        M.Materialbox.init(materialboxes[i]);
    }
    var modals = document.querySelectorAll('.modal')
    for (var i = 0; i < modals.length; i++) {
        M.Modal.init(modals[i]);
    }
    var parallax = document.querySelectorAll('.parallax')
    for (var i = 0; i < parallax.length; i++) {
        M.Parallax.init(parallax[i]);
    }
    var scrollspies = document.querySelectorAll('.scrollspy')
    for (var i = 0; i < scrollspies.length; i++) {
        M.ScrollSpy.init(scrollspies[i]);
    }
    var tabs = document.querySelectorAll('.tabs')
    for (var i = 0; i < tabs.length; i++) {
        M.Tabs.init(tabs[i]);
    }
    var tooltips = document.querySelectorAll('.tooltipped')
    for (var i = 0; i < tooltips.length; i++) {
        M.Tooltip.init(tooltips[i]);
    }
    
    loadNav();

    function loadNav() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status != 200) return;

                // Muat daftar tautan menu
                document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
                    elm.innerHTML = xhttp.responseText;
                });

                // Daftarkan event listener untuk setiap tautan menu
                document
                    .querySelectorAll(".sidenav a, .topnav a")
                    .forEach(function(elm) {
                        elm.addEventListener("click", function(event) {
                            // Tutup sidenav
                            var sidenav = document.querySelector(".sidenav");
                            M.Sidenav.getInstance(sidenav).close();

                            // Muat konten halaman yang dipanggil
                            page = event.target.getAttribute("href").substr(1);
                            loadPage(page);
                        });
                    });
            }
        };
        xhttp.open("GET", "nav.html", true);
        xhttp.send();
    }

    // Load page content
    var page = window.location.hash.substr(1);
    if (page == "") page = "home";
    loadPage(page);

    function loadPage(page) {
        if (page == 'home') loadklasemen()
        if (page == 'tanding') loadtanding()
        if (page == 'team') loadtim()
        if (page == 'klasemen') loadklasemen()
        if (page == 'player') loadplayer()
        // if(page == 'matches') loadklasemen()
        // if(page == 'premier') premierleague()

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                var content = document.querySelector("#body-content");
                if (this.status == 200) {
                    content.innerHTML = xhttp.responseText;
                } else if (this.status == 404) {
                    content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
                } else {
                    content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
                }
            }
        };
        xhttp.open("GET", "pages/" + page + ".html", true);
        xhttp.send();
    }
    function loadtemplate(template) {
       
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                var content = document.querySelector(el);
                if (this.status == 200) {
                    content.innerHTML = xhttp.responseText;
                } else if (this.status == 404) {
                    content.innerHTML = "<p>Component tidak ditemukan.</p>";
                } else {
                    content.innerHTML = "<p>Ups.. Component tidak dapat diakses.</p>";
                }
            }
        };
        xhttp.open("GET", "templates/" + template + ".html", true);
        xhttp.send();
    }
});