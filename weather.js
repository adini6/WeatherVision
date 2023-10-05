$(document).ready(function() {
  var myKey = '9272493ac4cba0ac888e369631f62646';

  $('#search-btn').on('click', function(event) {
    event.preventDefault();
    var userInput = $('#user-input').val().trim();
    if (userInput !== '') {
      getCurrentWeather(userInput);
      forecastFiveDays(userInput);
    }
  });

  function getCurrentWeather(city) {
    var currentWeatherCall = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=' + myKey;
    $.ajax({
      url: currentWeatherCall,
      method: 'GET'
    }).then(function(response) {
      if (response && response.name) {
        $('#city-name').text(response.name);
        $('#weather-icon').attr('src', 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png');
        $('#temperature').text('Temperature: ' + parseInt((response.main.temp - 273.15) * 1.8 + 32) + '°F');
        $('#humidity').text('Humidity: ' + response.main.humidity + '%');
        $('#wind-speed').text('Wind Speed: ' + response.wind.speed + ' m/s');
      } else {
        console.log('Invalid API response');
      }
    });
  }
  function forecastFiveDays(city) {
    var fiveDayCall = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&APPID=' + myKey;
    $.ajax({
        url: fiveDayCall,
        method: 'GET'
    }).then(function(response) {
        if (response && response.list) {
            var listArray = response.list;

            // Clear any existing forecast cards before adding new ones
            $('.five-day-card').remove();

            var dispDay = 1;
            listArray.forEach(element => {
                var yearDateTime = element.dt_txt;
                var currentTime = moment(yearDateTime).format('HH:mm:ss');

                if (currentTime === '15:00:00' && dispDay <= 5) { // Ensure only 5 days are processed
                    var currentDate = moment(yearDateTime).format('MM/DD/YYYY');

                    // Create Bootstrap card dynamically
                    var card = $('<div>').addClass('card five-day-card mx-3').css("width", "12rem");
                    var cardBody = $('<div>').addClass('card-body');
                    var cardTitle = $('<h5>').addClass('card-title').text(currentDate);
                    var weatherIcon = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + element.weather[0].icon + '.png');
                    var temp = $('<p>').addClass('card-text').text('Temperature: ' + parseInt((element.main.temp - 273.15) * 1.8 + 32) + '°F');
                    var humidity = $('<p>').addClass('card-text').text('Humidity: ' + element.main.humidity + '%');

                    // Append everything together
                    cardBody.append(cardTitle, weatherIcon, temp, humidity);
                    card.append(cardBody);
                    
                    // Append the card to the row for 5-day forecast
                    $('.row').append(card);

                    dispDay++;
                }
            });
        } else {
            console.log('Invalid API response');
        }
    });
}
});
