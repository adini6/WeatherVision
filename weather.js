$(document).ready(function() {
  var myKey = '9272493ac4cba0ac888e369631f62646';

  $('#search-btn').on('click', function() {
    event.preventDefault();
    var userInput = $('#user-input').val().trim();
    if (userInput !== '') {
      getCurrentWeather(userInput);
      forecastFiveDays(userInput);
    }
  });

  function getCurrentWeather(city) {
    var currentWeatherCall =
      'https://api.openweathermap.org/data/2.5/weather?q=' +
      city +
      '&APPID=' +
      myKey;

    $.ajax({
      url: currentWeatherCall,
      method: 'GET'
    }).then(function(response) {
      if (response && response.name) {
        $('#city-name').text(response.name);
        $('#weather-icon').attr(
          'src',
          'http://openweathermap.org/img/w/' +
          response.weather[0].icon +
          '.png'
        );
        $('#temperature').text(
          'Temperature: ' +
          parseInt((response.main.temp - 273.15) * 1.8 + 32) +
          '°F'
        );
        $('#humidity').text('Humidity: ' + response.main.humidity + '%');
        $('#wind-speed').text('Wind Speed: ' + response.wind.speed + ' m/s');
      } else {
        console.log('Invalid API response');
      }
    });
  }

});
