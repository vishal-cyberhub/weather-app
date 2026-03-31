const apiKey = "66c897a5b0d74213a39122442263103";
const locationInput = document.getElementById("locationInput");
const welcomeMsg = document.getElementById("welcomeMsg");
const loader = document.getElementById("loader");
const weatherContent = document.getElementById("weatherContent");

locationInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {
    const location = locationInput.value.trim();

    if (!location) {
        alert("Please enter a location");
        return;
    }


    showState('loading');

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();

        updateUI(data);
        showState('content');

    } catch (error) {
        alert(error.message || "Error fetching data. Please try again.");
        showState('welcome');
        console.log(error);
    }
}

function updateUI(data) {
    const { name, country, localtime } = data.location;
    const { temp_c, condition, feelslike_c, humidity, wind_kph, vis_km } = data.current;

    document.getElementById("city").innerText = `${name}, ${country}`;
    document.getElementById("date").innerText = formatDate(localtime);
    document.getElementById("temperature").innerText = Math.round(temp_c);
    document.getElementById("condition").innerText = condition.text;

    document.getElementById("feelsLike").innerText = `${Math.round(feelslike_c)}°C`;
    document.getElementById("humidity").innerText = `${humidity}%`;
    document.getElementById("windSpeed").innerText = `${wind_kph} km/h`;
    document.getElementById("visibility").innerText = `${vis_km} km`;

    
    updateTheme(condition.code);

    
    lucide.createIcons();
}

function showState(state) {
    welcomeMsg.style.display = (state === 'welcome') ? 'block' : 'none';
    loader.style.display = (state === 'loading') ? 'flex' : 'none';
    weatherContent.style.display = (state === 'content') ? 'block' : 'none';
}

function formatDate(dateStr) {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
}

function updateTheme(conditionCode) {
    const body = document.body;
    body.className = ''; 
    
    if (conditionCode === 1000) {
        body.classList.add('theme-clear');
    } else if ([1003, 1006, 1009].includes(conditionCode)) {
        body.classList.add('theme-cloudy');
    } else if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(conditionCode)) {
        body.classList.add('theme-rainy');
    } else if ([1000].includes(conditionCode)) {
        body.classList.add('theme-sunny');
    } else {
        body.classList.add('theme-default');
    }
}
