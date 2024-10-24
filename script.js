document.getElementById('getWeather').addEventListener('click', function () {
    const city = document.getElementById('city').value;
    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

async function getWeatherData(city) {
    const apiKey = '4adcec2f9b1cb0993697bd830751f642'; // Replace with your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        displayWeather(weatherData);

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        alert('Error retrieving weather data.');
        console.error(error);
    }
}

function displayWeather(data) {
    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = `
        <h4>Current Weather in ${data.name}</h4>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecastResult');
    forecastContainer.innerHTML = ''; // Clear previous forecasts

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    data.list.forEach((item, index) => {
        if (index % 8 === 0) { // Only take one forecast for each day
            const date = new Date(item.dt * 1000);
            const day = weekdays[date.getDay()];
            const temperature = item.main.temp;
            const description = item.weather[0].description;
            const icon = item.weather[0].icon;
            const windSpeed = item.wind.speed;
            const rainChance = item.pop * 100;
            const visibility = item.visibility / 1000;

            // Determine the forecast item background color based on weather condition
            let forecastClass = 'forecast-default'; // Default background
            const weatherMain = item.weather[0].main;

            if (weatherMain === 'Clear') {
                forecastClass = 'forecast-clear';
            } else if (weatherMain === 'Rain') {
                forecastClass = 'forecast-rain';
            } else if (weatherMain === 'Clouds') {
                forecastClass = 'forecast-clouds';
            } else if (weatherMain === 'Snow') {
                forecastClass = 'forecast-snow';
            }

            const forecastItem = `
                <div class="forecast-item ${forecastClass}">
                    <div class="card">
                        <div class="card-body text-center">
                            <h5>${day}</h5>
                            <p>Temperature: ${temperature} °C</p>
                            <p>Wind Speed: ${windSpeed} m/s</p>
                            <p>Rain Chance: ${rainChance}%</p>
                            <p>Visibility: ${visibility} km</p>
                            <p>${description}</p>
                            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="img-fluid">
                        </div>
                    </div>
                </div>
            `;
            forecastContainer.innerHTML += forecastItem;
        }
    });
}
