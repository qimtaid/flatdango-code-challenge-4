// Your code here

// src/index.js
document.addEventListener('DOMContentLoaded', () => {
  // Fetch the details of the first movie
  fetchMovieDetails(1);
  
  // Fetch the details of all movies
  fetchMoviesList();
});

function fetchMovieDetails(id) {
  fetch(`http://localhost:3000/films/${id}`)
      .then(response => response.json())
      .then(movieData => {
          // Display movie details
          displayMovieDetails(movieData);
      })
      .catch(error => console.error('Error fetching movie details:', error));
}

function fetchMoviesList() {
  fetch('http://localhost:3000/films')
      .then(response => response.json())
      .then(moviesData => {
          // Display movie menu
          displayMovieMenu(moviesData);
      })
      .catch(error => console.error('Error fetching movies list:', error));
}

function displayMovieDetails(movie) {
  const movieDetailsContainer = document.getElementById('movie-details');
  movieDetailsContainer.innerHTML = `
      <div>
          <img src="${movie.poster}" alt="${movie.title}" />
          <h2>${movie.title}</h2>
          <p>Runtime: ${movie.runtime} minutes</p>
          <p>Showtime: ${movie.showtime}</p>
          <p>Tickets Available: ${movie.capacity - movie.tickets_sold}</p>
          <button onclick="buyTicket(${movie.id})">Buy Ticket</button>
          <p>Description: ${movie.description}</p>
      </div>
  `;
}

function displayMovieMenu(movies) {
  const filmsList = document.getElementById('films');
  filmsList.innerHTML = '';
  movies.forEach(movie => {
      const listItem = document.createElement('li');
      listItem.textContent = movie.title;
      listItem.classList.add('film', 'item');
      listItem.addEventListener('click', () => fetchMovieDetails(movie.id));
      filmsList.appendChild(listItem);
  });
}

function buyTicket(movieId) {
  fetch(`http://localhost:3000/films/${movieId}`)
      .then(response => response.json())
      .then(movie => {
          if (movie.tickets_sold < movie.capacity) {
              movie.tickets_sold++;
              displayMovieDetails(movie); // Update displayed ticket count
          } else {
              alert('Sorry, this showing is sold out.');
          }
      })
      .catch(error => console.error('Error buying ticket:', error));
}
