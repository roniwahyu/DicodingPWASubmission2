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
var LEAGUE_ID = 2021 //Liga Inggris
//endpoint klasemen
var ep_klasemen = `${base_url}competitions/${LEAGUE_ID}/standings?standingType=TOTAL`
//endpoint pertandingan
var ep_tanding = `${base_url}competitions/${LEAGUE_ID}/matches`
var ep_player = `${base_url}competitions/${LEAGUE_ID}/teams`
//endpoint tim
var ep_tim_liga = `${base_url}competitions/${LEAGUE_ID}/teams`
var ep_tim_detail = `${base_url}competitions/${LEAGUE_ID}/teams/`

var datatanding;
var datatim;


var fetchApi = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    });
}
var fetchClimate = url => {
    return fetch(url);
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


var openloader = () => {
    var html = `
    <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle">
          </div>
        </div>
        <div class="circle-clipper right">
            <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-red">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-yellow">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-green">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>`
    document.getElementById("loader").innerHTML = html;
}
var closeloader = () => {
    document.getElementById("loader").innerHTML = '';
}

//dapatkan informasi klasemen
var getklasemen = () => {
    return fetchApi(ep_klasemen).then(status).then(json);
}

var loadklasemen = () => {
    openloader();
    var klasemen = getklasemen()
    klasemen.then(data => {

        var strings = JSON.stringify(data).replace(/http:/g, 'https:');
        // alert(str);
        data = JSON.parse(strings);

        var html = ''
        data.standings.forEach(klasemenx => {
            var inner = ''
            klasemenx.table.forEach(result => {
                inner += `<tr>
            <td>${result.position}</td>
            <td>
              <div class="row" style="margin-bottom:0px;">
                <div class="col s2" style="padding-right:0px;">
                  <img alt="logo ${result.team.name}" class="responsive-img" width="24" height="24" src="${ result.team.crestUrl || 'img/empty_badge.svg'}"> 
                </div>
                <div class="col s10"><a href="#" onClick="timdetail(${result.team.id})">${result.team.name}</a></div>
                </div>
            </td>
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
                <tbody>` + inner + `</tbody>
                </table>
              </div>
          </div>
        </div>
      `
        });
        document.getElementById("titles").innerHTML = 'Klasemen';
        // document.getElementById(".header").innerHTML = 'Klasemen';
        document.getElementById("body-content").innerHTML = html;
        closeloader()
    })
}

//dapatkan informasi pertandingan
var gettanding = () => {
    return fetchApi(ep_tanding).then(status).then(json)
}
var loadtanding = () => {
    openloader()
    var matches = gettanding()
    matches.then(data => {
        matchesData = data;
        // var tanggalmain=data.match;
        var tanggalmain = groupBy(data.matches, 'matchday');

        // var tanggalmain = groupBy(data.matches, 'matchday');

        html = ''
        for (const key in tanggalmain) {
            if (key != 'null') {
                html += `
              <h5>Group stage - ${key} of 6</h5>
              <div class="row">
            `
                tanggalmain[key].forEach(tanding => {
                    html += `
          <div class="col s12 m6 l6">
            <div class="card">
              <div class="card-content card-match row">
              <div class="col s6"><h6>${tanding.stage}</h6></div>
              <div class="col s6 right"><h6>${jadihbt(new Date(tanding.utcDate))}</h6></div>

                <div class="col s4"><a href="#" onClick="getTim(${tanding.homeTeam.id})">${tanding.homeTeam.name}</a></div>
                <div class="col s1 center">${tanding.score.fullTime.homeTeam}</div>
                <div class="col s2 center" style="color:#ff9000"><h5>VS</h5></div>
                <div class="col s1 center">${tanding.score.fullTime.awayTeam}</div>
                <div class="col s4"><a href="#" onClick="timdetail(${tanding.awayTeam.id})">${tanding.awayTeam.name}</a></div>
              </div>
            </div>
          </div>
            `
                });
                html += `
        </div>`
            }

        }
        document.getElementById("titles").innerHTML = 'Pertandingan';
        document.getElementById("body-content").innerHTML = html;
        closeloader()
    })
}

//dapatkan informasi tim
var gettim = () => {
    return fetchApi(ep_tim_liga).then(status).then(json)
}

var loadtim = () => {
    openloader()
    var teams = gettim()

    teams.then(data => {
        var str = JSON.stringify(data).replace(/http:/g, 'https:');
        data = JSON.parse(str);

        datatim = data
        var html = ''
        html += '<div class="row">'
        data.teams.forEach(tim => {
            html += `
              <div class="col s12 m6 l4">
                <div class="card" style="max-height:300px;min-height:200px">
                  <div class="card-image" style="height:100px;max-height:140px;background:center linear-gradient(45deg, rgba(0,128,255, 0.5), rgba(255, 153, 255, 0.5)), url(${tim.crestUrl});content:'';">
                     <div class="center" style="">
                        <img style="padding-top:20px;padding-left:20px; max-width:30%;max-height:30%" class="center-align" src="${tim.crestUrl || 'img/empty_badge.svg'}">
                    </div>
                    <div class="center-align" style="">
                      
                      </div>
                    <a href="#" onClick="timdetail(${tim.id})" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">favorite</i></a>

                  </div>  
                  <div class="card-content">
                    
                  
                    <div class="flow-text center ">${tim.name}</div>
                    <div class="center">${tim.area.name}</div>
                    
                    <div class="center"><a href="${tim.website}" target="_blank">${tim.website}</a></div>
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
//dapatkan informasi tim
var getplayer = () => {
    return fetchApi(ep_tim_liga).then(status).then(json)
}

var loadtim = () => {
    openloader()
    var teams = gettim()

    teams.then(data => {
        var str = JSON.stringify(data).replace(/http:/g, 'https:');
        data = JSON.parse(str);

        datatim = data
        var html = ''
        html += '<div class="row">'
        data.teams.forEach(tim => {
            html += `
              <div class="col s12 m6 l4">
                <div class="card" style="max-height:300px;min-height:200px">
                  <div class="card-image" style="height:100px;max-height:140px;background:center linear-gradient(45deg, rgba(0,128,255, 0.5), rgba(255, 153, 255, 0.5)), url(${tim.crestUrl});content:'';">
                     <div class="center" style="">
                        <img style="padding-top:20px;padding-left:20px; max-width:30%;max-height:30%" class="center-align" src="${tim.crestUrl || 'img/empty_badge.svg'}">
                    </div>
                    <div class="center-align" style="">
                      
                      </div>
                    <a href="#" onClick="timdetail(${tim.id})" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">favorite</i></a>

                  </div>  
                  <div class="card-content">
                    
                  
                    <div class="flow-text center ">${tim.name}</div>
                    <div class="center">${tim.area.name}</div>
                    
                    <div class="center"><a href="${tim.website}" target="_blank">${tim.website}</a></div>
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
var groupkan = function(data, key) {
    return data.reduce(function(i, j) {
        (i[j[key]] = i[j[key]] || []).push(j);
        return i;
    }, {});
};
var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

//konversi menjadi Hari Bulan Tahun
var jadihbt = date => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

function timdetail(id) {
    return new Promise(function(resolve, reject) {
        //Memanggil API team dam memasukkan token API football-data.org
        var request = new Request(base_url + 'teams/' + id, {
            headers: new Headers({
                'X-Auth-Token': API_KEY
            })
        });

        if ("caches" in window) {
            caches.match(request).then(function(response) {
                if (response) {
                    response.json().then(function(data) {
                        // openloader()
                        // Menyusun komponen card artikel secara dinamis
                        var html = `
              <div class="col s12 m6 l3">
                <div class="row">
                <h4 class="light center grey-text text-darken-3"><b>${data.name}</b></h4>
                </div>
              </div>
            `;
                        // Sisipkan komponen card ke dalam elemen dengan id #content
                        document.getElementById("titles").innerHTML = 'Detail Tim' + data.name;
                        document.getElementById("body-content").innerHTML = html;
                        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                        // resolve(data);
                        // closeloader();
                    });
                }
            });
            // }
            openloader()
            fetch(request).then(status).then(json).then(function(data) {
                data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
                // Objek/array JavaScript dari response.json() masuk lewat data.
                // console.log(data);
                // tampilkan data detail team
                var html = `
        <div class="row center">

          <img style="max-width:30%;" alt="${data.name}" src="${data.crestUrl}"> 
          <h4 class="light center grey-text text-darken-3">
          <p>${data.name}</p>
          </h4>
          <p align="center">
            Ground : ${data.venue}
            Club Colors : ${data.clubColors}<br>
            Founded : ${data.founded}<br>
          </p>
          <div class="col m6 s12">
            <div class="card-panel">
              <h5>Competitions</h5>
              
                <ul>`;
                data.activeCompetitions.forEach(function(item) {
                    html += `<li>${item.name}</li>`;
                });

                html += `
                  </ul>
                
              </div>
            </div>
            <div class="col m6 s12">
            <div class="card-panel">
              <h5>Squad</h5>
              
                <ul>`;
                data.squad.forEach(function(item) {
                    html += `<li><a href="#" onClick="playerdetail(${item.id})">${item.name} (${item.position})</a></li>`;
                });
                html += `
                </ul>
              
            </div>
          </div>
        </div>`;
                // masukkan komponen card ke dalam elemen id #body-content
                document.getElementById("body-content").innerHTML = html;
                document.getElementById("titles").innerHTML = 'Detail Tim ' + data.name;

                closeloader();
            });
        };
    })
}

function playerdetail(id) {
    return new Promise(function(resolve, reject) {
        //Memanggil API team dam memasukkan token API football-data.org
        var request = new Request(base_url + 'players/' + id, {
            headers: new Headers({
                'X-Auth-Token': API_KEY
            })
        });

        if ("caches" in window) {
            caches.match(request).then(function(response) {
                if (response) {
                    response.json().then(function(data) {
                        // openloader()
                        // Menyusun komponen card artikel secara dinamis
                        var html = `
              <div class="col s12 m6 l3">
                <div class="row">
                <h4 class="light center grey-text text-darken-3"><b>${data.name}</b></h4>
                </div>
              </div>
            `;
                        // Sisipkan komponen card ke dalam elemen dengan id #content
                        document.getElementById("titles").innerHTML = 'Detail Player' + data.name;
                        document.getElementById("body-content").innerHTML = html;
                        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                        // resolve(data);
                        // closeloader();
                    });
                }
            });
            // }
            openloader()
            fetch(request).then(status).then(json).then(function(data) {
                data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
                // Objek/array JavaScript dari response.json() masuk lewat data.
                // console.log(data);
                // tampilkan data detail team
                var html = `
        <div class="row center">

          <h4 class="light center grey-text text-darken-3">
          <p>${data.name}</p>
          </h4>
          <p align="center">
            Nationality: ${data.nationality}
            Position: ${data.position}<br>
            
          </p>
         
        </div>`;
                // masukkan komponen card ke dalam elemen id #body-content
                document.getElementById("body-content").innerHTML = html;
                document.getElementById("titles").innerHTML = 'Detail PLayer ' + data.name;

                closeloader()
            });
        }
    });
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