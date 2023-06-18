"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");


//get actors
// TMD_BASE_URL / movie/{movieid} / credits?api-key=xxx & language=en-US
//https://api.themoviedb.org/3/ movie/436270 /credits?api_key=542003918769df50083a13c415bbc602&language=en-US

// TMD_BASE_URL /person/1083010 / similar?api-key=xxx & language=en-US
//https://api.themoviedb.org/3/now-playing?api_key=542003918769df50083a13c415bbc602&language=en-US&page=1



//enterance screen
const enterancePage = () => {
  document.getElementById("my-audio").play();
  const enterBtn = document.getElementById('enter-btn')
  enterBtn.addEventListener('click', () => {
    autorun();
    //getting the footer and navbar when clicked
    document.getElementById('footer').style.display = 'block'
    navEl.style.position = "relative"
  })
}


// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};
//console.log(atob("NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="))
//console.log(btoa("542003918769df50083a13c415bbc602"))

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const staffRes = await fetchStaff(movie.id);
  const relatedFilms = await fetchRelatedFilms(movie.id);
  const movieTrailers = await fetchTrailers(movie.id)
  renderMovie(movieRes, staffRes, relatedFilms, movieTrailers);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  
  return res.json();
};

// this function to fetch genres and show them in the navbar 
const fetchGenres = async () => {
  const url = constructUrl(`genre/movie/list`);
  const res = await fetch(url);
  const genresJson = await res.json();
  console.log(genresJson.genres)
  genresJson.genres.forEach((genre)=>{
    const genreEl = document.createElement('li')
    genreEl.innerHTML = `<a id='genrebtn' href='#'>${genre.name}</a>`
    document.getElementById('dropgeneres').appendChild(genreEl)
    genreEl.addEventListener("click", () => {
      
      fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${atob(
        "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
      )}&with_genres=${genre.id}`)
      
      .then(resp => resp.json())
      .then(data => renderMovies(data.results))
    })
  
  })
  
};
fetchGenres();


//this function provides actors and director information from API
const fetchStaff = async (id) => {
  const url = constructUrl(`movie/${id}/credits`);
  const res = await fetch(url);
  //console.log(res.json())
  return res.json();
};

//this function provides to get similar films from API
const fetchRelatedFilms = async (id) => {
  const url = constructUrl(`movie/${id}/similar`);
  const res = await fetch(url);
  //console.log(res.json())
  return res.json();
};

const fetchTrailers = async(id) => {
  const url = constructUrl(`movie/${id}/videos`);
  const res = await fetch(url);
 // console(res.json());
  return res.json();
};


//this is for fetching the movie credit for single actor page
const fetchActorsMovie = async (id) => {
  const url = constructUrl(`person/${id}/movie_credits`);
  const res = await fetch(url);
  // console.log(res.json());
  return res.json();

};


// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};




// You'll need to play with this function in order to add features and enhance the style.
//provides to show all now playing movies in the home page
const renderMovies = (movies) => {
  CONTAINER.innerHTML = '';

  movies.forEach((movie) => {
    const movieDiv = createMovieCard(movie);
    CONTAINER.appendChild(movieDiv);
  });
};

const createMovieCard = (movie) => {
  const movieDiv = document.createElement("div");
  movieDiv.className = "col-sm-3 d-flex align-items-stretch";
  movieDiv.innerHTML = `
    <div class="card movies-card">
      <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster">
      <h3>${movie.title}</h3>
      <div class="rating">
        <span class="material-icons">Rating: ${movie.vote_average}</span>
      </div>
      <button class="btn btn-primary" id="homepage-more-detail-btn">More Details</button>
    </div>
  `;

  const btnPrimary = movieDiv.querySelector(".btn-primary");
  const rating = movieDiv.querySelector(".rating");

  btnPrimary.style.visibility = "hidden";
  rating.style.visibility = "hidden";

  const showButtonAndRating = () => {
    btnPrimary.style.visibility = "visible";
    rating.style.visibility = "visible";
  };

  const hideButtonAndRating = () => {
    btnPrimary.style.visibility = "hidden";
    rating.style.visibility = "hidden";
  };

  const showMovieDetails = () => {
    movieDetails(movie);
  };

  movieDiv.addEventListener("mouseover", showButtonAndRating);
  movieDiv.addEventListener("mouseout", hideButtonAndRating);
  btnPrimary.addEventListener("click", showMovieDetails);
  movieDiv.addEventListener("click", showMovieDetails);

  return movieDiv;
};




// You'll need to play with this function in order to add features and enhance the style.
//provides to show single movie page with movie details
const renderMovie = (movie, staffs, relatedFilms, trailers) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
        </div>

        <div class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p id= "movie-genres">Genres: </p>
          <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
          <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
          <h3>Overview:</h3>
          <p id="movie-overview">${movie.overview}</p>
          <p id="movie-director"> </p>
          <p id="movie-vote-average">Rating: ${movie.vote_average}</p>
          <p id="movie-vote-count">Vote count: ${movie.vote_count}</p>
          <p id="movie-language">Language: ${movie.original_language.toUpperCase()}</p>
        </div>
    
        <div>
          <h3>Production Companies:</h3>
          <div id= "production-companies" class= "row"></div>
        </div>

        </div >
          <h3>Actors:</h3>
          <div id="actors" class="row" ></div>
        </div>

        </div >
          <h3>Trailer:</h3>
          <div id="trailer" ></div>
        </div>

        <div >
          <h3>Similar Films:</h3>
          <div id="similarFilms" class="row"></div>
        </div>

    </div>`;

  renderActors(staffs);
  renderSimilarFilms(relatedFilms, movieDetails);
  findDirector(staffs.crew);
  findGenres(movie.genres);
  renderProductionCompanies(movie.production_companies);
  renderTrailer(trailers);
};

//this function provides to get main 5 actor informations about each film
const renderActors = (staffs) => {
  const actorList = document.querySelector("#actors");
  staffs.cast.slice(0, 5).map((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.className = "col";
    const actorCard = document.createElement("div");
    actorCard.className = "card";

    actorCard.innerHTML = `
    <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name} poster" height="200">
    <div class = "card-body">
          <p class = "card-text" id="single-movie-text">${actor.name}</p>
        </div>`;
    actorCard.addEventListener("click", () => {
      const fetchPerson = async (personId) => {
        const url = constructUrl(`person/${personId}`);
        const res = await fetch(url);
        const actorJson = await res.json();
        const actorsMovie = await fetchActorsMovie(personId);

        displaySingleActorPage(actor, actorJson, actorsMovie);
      };

      fetchPerson(actor.id);
    });

    actorDiv.appendChild(actorCard);
    actorList.appendChild(actorDiv);
  });
};



//this function provides to get 5 related films about the chosen film
const renderSimilarFilms = (similarFilms, movieDetails) => {
  const relatedFilmsList = document.querySelector("#similarFilms");
  similarFilms.results.slice(0, 5).map((film) => {
    const filmDiv = document.createElement("div");
    filmDiv.className = "col";
    const similarFilmCard = document.createElement("div");
    similarFilmCard.className = "card";
    
    similarFilmCard.innerHTML = `
        <img src="${BACKDROP_BASE_URL + film.poster_path}" alt="${film.title} poster" height="200">
        <div class = "card-body">
          <p class = "card-text" id="single-movie-text" >${film.original_title}</p>
        </div>`;
    ///actorDiv.addEventListener("click", () => {displaySingleActorPage();});
    filmDiv.appendChild(similarFilmCard);
    relatedFilmsList.appendChild(filmDiv);
    filmDiv.addEventListener('click', () => {
      movieDetails(film)})
  });
};

const findDirector = (staffs) => {
  staffs.map((staff) => {
    if (staff.job === "Director") {
      const directorInfo = document.getElementById("movie-director");
      directorInfo.innerText = `Director : ${staff.name}`;
    }
  });
};

const findGenres = (genres) => {
  genres.map((genre) => {
    const movieGenreInfo = document.getElementById("movie-genres");
    movieGenreInfo.append(` ${genre.name}, `);
  });
};

const renderProductionCompanies = (companies) => {
  companies.map((company) => {
    const companyInfo = document.getElementById("production-companies");

    const companyDiv = document.createElement("div");
    companyDiv.className = "col";
    const companyCard = document.createElement("div");
    companyCard.className = "card";

    companyCard.innerHTML = `
    <img src="${BACKDROP_BASE_URL + company.logo_path}" alt="${
      company.name
    } poster" width="100" height = "100%">
    <div class = "card-body">
          <p class = "card-text" id="single-movie-text">${company.name}</p>
        </div>`;

    companyDiv.appendChild(companyCard);
    companyInfo.appendChild(companyDiv);
  });
};

const renderTrailer = (trailers) => {
  const trailerKey = trailers.results[0].key;
  const trailerDiv = document.getElementById("trailer");
  const trailerArea = document.createElement('div');
  trailerArea.className = "trailer";
  trailerArea.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailerKey}" allowfullscreen ></iframe>`;
  trailerDiv.appendChild(trailerArea);
};


//this function provides to get movies of chosen actor
const renderActorsMovie = (actorsMovie) => {
  const actorsMovieList = document.querySelector("#actorsMovie");
  actorsMovie.cast.map((film) => {
    const filmDiv = document.createElement("div");
    filmDiv.className = "col";
    const actorsMovieCard = document.createElement("div");
    actorsMovieCard.className = "card";

    actorsMovieCard.innerHTML = `
        <img src="${BACKDROP_BASE_URL + film.poster_path}" alt="${film.title} poster" height="200" id="single-movie-text">
        <div class = "card-body">
          <p class = "card-text" id="single-movie-text">${film.original_title}</p>
        </div>`;
    ///actorDiv.addEventListener("click", () => {displaySingleActorPage();});
    filmDiv.appendChild(actorsMovieCard);
    actorsMovieList.appendChild(filmDiv);
    filmDiv.addEventListener('click', () => {
      movieDetails(film);
    });
  });
};


//this function provides to get the information about the chosen actor
const displaySingleActorPage = (actor, actorJson, actorsMovie) => {
  CONTAINER.innerHTML = `
      <div class="row">
        <div class="col-md-4 left-text">
               
          <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name} poster" height="200" id="actor-image">
          <p id="actor-birthday"><b>Birthday:</b> ${actorJson.birthday ? actorJson.birthday : "no info"}</p>
          <p id="actor-place-of-birth"><b>Place of Birth:</b> ${actorJson.place_of_birth ? actorJson.place_of_birth : "no info"}</p>
          <p id="actor-deathday"><b>Date of Death:</b> ${actorJson.deathday ? actorJson.deathday : "alive"}</p>
          <p><strong><bdi>Gender</bdi></strong><br> ${actorJson.gender == 2 ? "Male" : "Female"}</p>
          <p id="actor-known-for"><b>Known for:</b> ${actorJson.known_for_department ? actorJson.known_for_department : "no info"}</p>
          <p id="actor-popularity"><b>Popularity:</b> ${actorJson.popularity ? actorJson.popularity : "no info"}</p>
 
        </div>

        <div class="col-md-8 biography-container">

          <h2 id="actor-name">${actorJson.name}</h2>
             
          <h3>Biography:</h3>
          <p class="left-text" id="actor-biography">${actorJson.biography ? actorJson.biography : "no info"}</p>
          <div id="actorsMovie" class="row"></div>

        </div>
      </div>`;
  renderActorsMovie(actorsMovie);

};



const navEl = document.createElement("nav");
navEl.innerHTML = `<div class="navbar">
<i class='bx bx-menu'></i>

<div class="logo"><img src="./images/logo.png" alt="logo" id="logo"/></div>
<div class="nav-links">
  <div class="sidebar-logo">
    <span class="logo-name">CodingLab</span>
    <i class='bx bx-x' ></i>
  </div>
  <ul class="links">
    <li>
      <a href="#" id='genres'>GENRES</a>
      <i class='bx bxs-chevron-down htmlcss-arrow arrow  '></i>
      <ul class="htmlCss-sub-menu sub-menu" id='dropgeneres'>
        
      </ul>
    </li>
    <li>
      <a href="#">FILTER</a>
      <i class='bx bxs-chevron-down js-arrow arrow '></i>
      <ul class="js-sub-menu sub-menu">
        <li><a href="#">Most Popular</a></li>
        <li><a href="#">New</a></li>
        <li><a href="#">Good rated</a></li>
        <li><a href="#">Example</a></li>
      </ul>
    </li>
    <li><a href="#" id ="all-actors">ACTORS</a></li>
    <li><a href="#">ABOUT US</a></li>
  </ul>
</div>
<div class="search-box">
  <i class='bx bx-search'></i>
  <div class="input-box">
    <input type="text" placeholder="Search...">
  </div>
</div>
</div>`;



document.querySelector("body").prepend(navEl);
// search-box open close js code
let navbar = document.querySelector(".navbar");
let searchBox = document.querySelector(".search-box .bx-search");

searchBox.addEventListener("click", () => {
  navbar.classList.toggle("showInput");
  if (navbar.classList.contains("showInput")) {
    searchBox.classList.replace("bx-search", "bx-x");
  } else {
    searchBox.classList.replace("bx-x", "bx-search");
  }
});

// sidebar open close js code
let navLinks = document.querySelector(".nav-links");
let menuOpenBtn = document.querySelector(".navbar .bx-menu");
let menuCloseBtn = document.querySelector(".nav-links .bx-x");
menuOpenBtn.onclick = function () {
  navLinks.style.left = "0";
};
menuCloseBtn.onclick = function () {
  navLinks.style.left = "-100%";
};

//  sidebar submenu open close js code
let htmlcssArrow = document.querySelector(".htmlcss-arrow");
htmlcssArrow.onclick = function () {
  navLinks.classList.toggle("show1");
};

let jsArrow = document.querySelector(".js-arrow");
jsArrow.onclick = function () {
  navLinks.classList.toggle("show3");
 };
 
 // home button functionality
 const logoBtn = document.getElementById('logo')
logoBtn.addEventListener('click', (e) => {
  autorun()
  e.preventDefault()
})


//create all actors page when clicked the actor button in the navbar
const allActorsBtn = document.getElementById("all-actors")
allActorsBtn.addEventListener('click', () => {
  CONTAINER.innerHTML = `<div class="row" id="all-actors-page"></div>`
  allActors();
})

const allActors = async () => {
  const allActorsPage = document.getElementById('all-actors-page')
  const allMovies = await fetchMovies();
  allMovies.results.map(async (singleMovie) => {
    const allStaffs = await fetchStaff(singleMovie.id);
    const mainActor = allStaffs.cast[0]
    //mainActor provides first actor of each movie
    const actorDiv = document.createElement("div");
    actorDiv.className = "col";
    const actorCard = document.createElement("div");
    actorCard.className = "card";

    actorCard.innerHTML = `
    <img src="${BACKDROP_BASE_URL + mainActor.profile_path}" alt="${mainActor.name} poster" height="200">
    <div class = "card-body">
          <p class = "card-text" id="single-movie-text">${mainActor.name}</p>
        </div>`;

    actorDiv.appendChild(actorCard);
    allActorsPage.appendChild(actorDiv);

    //added eventListener like the actors on the single movie page
    actorCard.addEventListener("click", () => {
      const fetchPerson = async (personId) => {
        const url = constructUrl(`person/${personId}`);
        const res = await fetch(url);
        const actorJson = await res.json();
        displaySingleActorPage(mainActor, actorJson);
      };
      fetchPerson(mainActor.id);
    });

  })
};



 document.addEventListener("DOMContentLoaded", enterancePage);