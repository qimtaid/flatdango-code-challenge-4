// src/index.js
document.addEventListener('DOMContentLoaded', () => {
    fetchMovieDetails(1);
    fetchMoviesList();
  });
  
  function fetchMovieDetails(id) {
    fetch(`http://localhost:3000/films/${id}`)
        .then(response => response.json())
        .then(movieData => {
            displayMovieDetails(movieData);
        })
        .catch(error => console.error('Error fetching movie details:', error));
  }
  
  function fetchMoviesList() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(moviesData => {
            displayMovieMenu(moviesData);
        })
        .catch(error => console.error('Error fetching movies list:', error));
  }
  
  function displayMovieDetails(movie) {
    const movieDetailsContainer = document.getElementById('movie-details');
    const ticketsAvailable = movie.capacity - movie.tickets_sold;
    const buyButton = ticketsAvailable > 0 ? '<button onclick="buyTicket(' + movie.id + ')">Buy Ticket</button>' : '<button disabled>Sold Out</button>';
  
    movieDetailsContainer.innerHTML = `
        <div>
            <img src="${movie.poster}" alt="${movie.title}" />
            <h2>${movie.title}</h2>
            <p>Runtime: ${movie.runtime} minutes</p>
            <p>Showtime: ${movie.showtime}</p>
            <p>Tickets Available: ${ticketsAvailable}</p>
            ${buyButton}
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
                updateTicketsSold(movie);
            } else {
                alert('Sorry, this showing is sold out.');
            }
        })
        .catch(error => console.error('Error buying ticket:', error));
  }
  
  function updateTicketsSold(movie) {
    fetch(`http://localhost:3000/films/${movie.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tickets_sold: movie.tickets_sold
      })
    })
    .then(response => response.json())
    .then(updatedMovie => {
      displayMovieDetails(updatedMovie);
    })
    .catch(error => console.error('Error updating tickets sold:', error));
  }
  