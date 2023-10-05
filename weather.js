$(document).ready(function() {
  
  var myKey = '9272493ac4cba0ac888e369631f62646';
      // Functions for Search History
      function addToSearchHistory(city) {
        var history = JSON.parse(localStorage.getItem('cityHistory')) || [];

        if (history.indexOf(city) === -1) {
            history.push(city);
            localStorage.setItem('cityHistory', JSON.stringify(history));
        }
        displaySearchHistory();
    }

    function displaySearchHistory() {
        var history = JSON.parse(localStorage.getItem('cityHistory')) || [];
        $('.list-group').empty(); 
        history.forEach(function(city) {
            var cityItem = $('<a>').addClass('list-group-item list-group-item-action').text(city);
            $('.list-group').prepend(cityItem);  
        });
    }

    displaySearchHistory();

  $('#search-btn').on('click', function(event) {
      event.preventDefault();
      var userInput = $('#user-input').val().trim();
      if (userInput !== '') {
          getCurrentWeather(userInput);
          forecastFiveDays(userInput);
      }
  });

  function getCurrentWeather(city) {
      var currentWeatherCall = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=' + myKey + '&units=imperial';
      $.ajax({
          url: currentWeatherCall,
          method: 'GET'
      }).then(function(response) {
          if (response && response.name) {
              $('#city-name').text(response.name + " (" + moment().format('MM/DD/YYYY HH:mm:ss') + ")");
              $('#weather-icon').attr('src', 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png');
              $('#temperature').text('Temperature: ' + response.main.temp + '°F');
              $('#humidity').text('Humidity: ' + response.main.humidity + '%');
              $('#wind-speed').text('Wind Speed: ' + response.wind.speed + ' MPH');
          } else {
              console.log('Invalid API response');
          }
      });
  }

  function forecastFiveDays(city) {
      var fiveDayCall = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&APPID=' + myKey + '&units=imperial';
      $.ajax({
          url: fiveDayCall,
          method: 'GET'
      }).then(function(response) {
          if (response && response.list) {
            var listArray = response.list.filter(item => item.dt_txt.includes("12:00:00"));
            
              // removes existing forecast cards before adding new ones
              $('.five-day-card').remove();

              var dispDay = 0;
              listArray.forEach(element => {
                  var currentDate = moment().add(dispDay, 'days').format('MM/DD/YYYY');

                  // Create Bootstrap cards
                  var card = $('<div>').addClass('card five-day-card mx-3').css("width", "12rem");
                  var cardBody = $('<div>').addClass('card-body');
                  var cardTitle = $('<h5>').addClass('card-title').text(currentDate);
                  var weatherIcon = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + element.weather[0].icon + '.png');
                  var temp = $('<p>').addClass('card-text').text('Temperature: ' + element.main.temp + '°F');
                  var humidity = $('<p>').addClass('card-text').text('Humidity: ' + element.main.humidity + '%');
                  var wind = $('<p>').addClass('card-text').text('Windspeed: ' + element.wind.speed + ' MPH');

                  // Append everything together
                  cardBody.append(cardTitle, weatherIcon, temp, humidity, wind);
                  card.append(cardBody);
                  
                  // Append the card to the row for 5-day forecast
                  $('#forecast-row').append(card);

                  dispDay++;
              });
          } else {
              console.log('Invalid API response');
          }
      });
  }
});
