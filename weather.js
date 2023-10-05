$(document).ready(function() {
  var myKey = '9272493ac4cba0ac888e369631f62646';

  $('#search-btn').on('click', function() {
    var userInput = $('#user-input').val().trim();
    if (userInput !== '') {
      getCurrentWeather(userInput);
      forecastFiveDays(userInput);
    }
  });

});