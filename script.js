document.getElementById('search-btn').addEventListener('click', () => {
    const cityName = document.getElementById('city-input').value.trim();
    if (cityName !== "") {
        fetchCoordinates(cityName);
    } else {
        alert("Enna da blank-ah iruku, city name types pannu!");
    }
});

async function fetchCoordinates(city) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
    
    try {
        const response = await fetch(geoUrl);
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            alert("Appadi oru city illai pa! Veru edhavathu try pannu.");
            return;
        }

        const { latitude, longitude, name } = data.results[0];
        fetchWeather(latitude, longitude, name);
    } catch (error) {
        console.error("Geocoding Error:", error);
        alert("Network issues da, appram try pannu.");
    }
}

async function fetchWeather(lat, lon, formattedName) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();
        
        document.getElementById('city-name').innerText = formattedName;
        document.getElementById('temperature').innerText = Math.round(data.current.temperature_2m);
        document.getElementById('humidity').innerText = `${data.current.relative_humidity_2m}%`;
        document.getElementById('wind-speed').innerText = `${data.current.wind_speed_10m} km/h`;
        
        const code = data.current.weather_code;
        let status = "Clear Sky ☀️";
        if (code > 0 && code <= 3) status = "Partly Cloudy ⛅";
        else if (code >= 45 && code <= 48) status = "Foggy 🌫️";
        else if (code >= 51 && code <= 67) status = "Drizzle/Rain 🌧️";
        else if (code >= 71 && code <= 77) status = "Snowy ❄️";
        else if (code >= 80 && code <= 99) status = "Thunderstorm ⛈️";
        
        document.getElementById('weather-status').innerText = status;
        document.getElementById('weather-info').style.display = 'block';

    } catch (error) {
        console.error("Weather Data Error:", error);
    }
}