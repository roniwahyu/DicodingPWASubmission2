var base_url = "https://api.football-data.org/v2/";
//api ku
const API_KEY = 'e3c8239551824307a5069ea4e69f54e2'

/*
    Champions League = 2001

    Liga Jerman = 2002

    Liga Belanda = 2003

    Liga Inggris = 2021

    Liga Spanyol = 2014

    Liga Perancis = 2015
*/
const LEAGUE_ID = 2001 //Liga Inggris
//endpoint klasemen
var ep_klasemen = `${base_url}competitions/${LEAGUE_ID}/standings?standingType=TOTAL`
//endpoint pertandingan
var ep_tanding = `${base_url}competitions/${LEAGUE_ID}/matches`
//endpoint tim
var ep_tim = `${base_url}competitions/${LEAGUE_ID}/teams`

var datatanding;
var datatim;

  
var fetchApi = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    });
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
}

//dapatkan informasi klasemen
var getklasemen = () => {
    return fetchApi(ep_klasemen)
        .then(status)
        .then(json);
}

//dapatkan informasi pertandingan
var gettanding = () => {
    return fetchApi(ep_tanding)
        .then(status)
        .then(json)
}

//dapatkan informasi tim
var gettim = () => {
    return fetchApi(ep_tim)
        .then(status)
        .then(json)
}
var openloader = () => {
    var html = `<div class="preloader-wrapper big active">
      <div class="spinner-layer spinner-blue">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-red">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-yellow">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-green">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>`
    document.getElementById("preloader").innerHTML = html;
}
var closeloader = () => {
    document.getElementById("preloader").innerHTML = '';
}

var loadklasemen = () => {
    openloader();
    var klasemen = getklasemen()
    klasemen.then(data => {

        var str = JSON.stringify(data).replace(/http:/g, 'https:');
        // alert(str);
        data = JSON.parse(str);

        var html = ''
        data.standings.forEach(klasemenx => {
            var detail = ''
            klasemenx.table.forEach(result => {
                detail += `<tr>
            <td>${result.position}</td>
            <td><img class="responsive-img" width="24" height="24" src="${ result.team.crestUrl || 'img/empty_badge.svg'}"> ${result.team.name}</td>
            <td>${result.playedGames}</td>
            <td>${result.won}</td>
            <td>${result.draw}</td>
            <td>${result.lost}</td>
            <td>${result.goalsFor}</td>
            <td>${result.goalsAgainst}</td>
            <td>${result.goalDifference}</td>
            <td>${result.points}</td>
          </tr>`
            })

            html += `
        <div class="col m12 s12 ">
        <div class="card">
        <div class="card-content">
        <h5 class="header">${klasemenx.group}</h5>
        <table class=" striped responsive-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Play</th>
            <th>Win</th>
            <th>Draw</th>
            <th>Lost</th>
            <th>GF</th>
            <th>GA</th>
            <th>Diff</th>
            <th>Point</th>
          </tr>
        </thead>
        <tbody>` + detail + `</tbody>
        </table>
        </div>
        </div>
        </div>
      `
        });
        document.getElementById("titles").innerHTML = 'Klasemen';
        document.getElementById("body-content").innerHTML = html;
        closeloader()
    })
}


var loadtanding = () => {
    openloader()
    var tanding = gettanding()
    tanding.then(data => {
        datatanding = data;
        var matchdays = groupkan(data.tanding, 'matchday');

        html = ''
        for (const key in matchdays) {
            if (key != 'null') {
                html += `
              <h5>Group stage - ${key} of 6</h5>
              <div class="row">`
                matchdays[key].forEach(tandingan => {
                    html += `
                    <div class="col l6 m6  s12">
                      <div class="card">
                        <div class="card-content card-match ">
                        <div style="text-align: center"><h5>${jadihbt(new Date(tandingan.utcDate))}</h5></div>
                          <div class="col s10">${tandingan.homeTeam.name}</div>
                          <div class="col s2">${tandingan.score.fullTime.homeTeam}</div>
                          <div class="col s10">${tandingan.awayTeam.name}</div>
                          <div class="col s2">${tandingan.score.fullTime.awayTeam}</div>
                        </div>
                        <div class=" right-align card-action">
                       
                        </div>
                      </div>
                    </div>`
                });
                html += `</div>`
            }

        }
        document.getElementById("body-content").innerHTML = html;
        document.getElementById("titles").innerHTML = 'Pertandingan';
        closeloader()
    })
}
var loadtim = () => {
    openloader()
    var timx = gettim()

    timx.then(data => {
        var str = JSON.stringify(data).replace(/http:/g, 'https:');
        data = JSON.parse(str);

        datatim = data
        var html = ''
        html += '<div class="row">'
        data.timx.forEach(tim => {
            html += `
              <div class="col s12 m6 l6">
                <div class="card">
                  <div class="card-content">
                    <div class="center"><img width="64" height="64" src="${tim.crestUrl || 'img/empty_badge.svg'}"></div>
                    <div class="flow-text center ">${tim.name}</div>
                    <div class="center">${tim.area.name}</div>
                    <div class="center"><a href="${tim.website}" target="_blank">${tim.website}</a></div>
                  </div>
                  <div class="card-action right-align">
                  </div>
                </div>
              </div>`
        })
        html += "</div>"
        document.getElementById("body-content").innerHTML = html;
        document.getElementById("titles").innerHTML = 'Tim';
        closeloader()
    })
}
//data json di grupkan
var groupkan = function (data, key) {
  return data.reduce(function (i, j) {
    (i[j[key]] = i[j[key]] || []).push(j);
    return i;
  }, {});
};

//konversi menjadi Hari Bulan Tahun
var jadihbt = date => {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

// Blok kode untuk melakukan request data json
function getArticles() {
    if ("caches" in window) {
        caches.match(base_url + "articles").then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    var articlesHTML = "";
                    data.result.forEach(function(article) {
                        articlesHTML += `
            
                  <div class="card">
                    <a href="./article.html?id=${article.id}">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${article.thumbnail}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${article.title}</span>
                      <p>${article.description}</p>
                    </div>
                  </div>
                `;
                    });
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.getElementById("articles").innerHTML = articlesHTML;
                });
            }
        });
    }

    fetch(base_url + "articles")
        .then(status)
        .then(json)
        .then(function(data) {
            // Objek/array JavaScript dari response.json() masuk lewat data.

            // Menyusun komponen card artikel secara dinamis
            var articlesHTML = "";
            data.result.forEach(function(article) {
                articlesHTML += `
              <div class="card">
                <a href="./article.html?id=${article.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${article.thumbnail}" />
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${article.title}</span>
                  <p>${article.description}</p>
                </div>
              </div>
            `;
            });
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("articles").innerHTML = articlesHTML;
        })
        .catch(error);
}

function getArticleById() {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ("caches" in window) {
        caches.match(base_url + "article/" + idParam).then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    var articleHTML = `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.result.cover}" />
              </div>
              <div class="card-content">
                <span class="card-title">${data.result.post_title}</span>
                ${snarkdown(data.result.post_content)}
              </div>
            </div>
          `;
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.getElementById("body-content").innerHTML = articleHTML;
                });
            }
        });
    }

    fetch(base_url + "article/" + idParam)
        .then(status)
        .then(json)
        .then(function(data) {
            // Objek JavaScript dari response.json() masuk lewat variabel data.
            console.log(data);
            // Menyusun komponen card artikel secara dinamis
            var articleHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.result.cover}" />
            </div>
            <div class="card-content">
              <span class="card-title">${data.result.post_title}</span>
              ${snarkdown(data.result.post_content)}
            </div>
          </div>
        `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = articleHTML;
        });
}