const fetchWeather = "/weather";

// DOM Elements
const weatherForm = document.querySelector('.weatherForm');
const searchInput = document.querySelector('input');
const widget = document.querySelector('.widget');
const weatherIcon = document.querySelector('.weatherIcon i');
const weatherCondition = document.querySelector('.weatherCondition');
const tempElement = document.querySelector('.temperature span');
const locationElement = document.querySelector('.place');
const dateElement = document.querySelector('.date');

// Month names for date display
const monthNames = ["January", "February", "March", "April", "May", "June", 
                   "July", "August", "September", "October", "November", "December"];

// Weather icon mapping for better visual representation
const weatherIconMap = {
    'clear sky': 'wi-day-sunny',
    'few clouds': 'wi-day-cloudy',
    'scattered clouds': 'wi-cloudy',
    'broken clouds': 'wi-cloudy',
    'overcast clouds': 'wi-cloudy',
    'shower rain': 'wi-showers',
    'rain': 'wi-rain',
    'thunderstorm': 'wi-thunderstorm',
    'snow': 'wi-snow',
    'mist': 'wi-fog',
    'fog': 'wi-fog',
    'haze': 'wi-day-haze',
    'dust': 'wi-dust',
    'sand': 'wi-sandstorm',
    'ash': 'wi-volcano',
    'squall': 'wi-strong-wind',
    'tornado': 'wi-tornado'
};

// Initialize date display
function updateDate() {
    const now = new Date();
    const day = now.getDate();
    const month = monthNames[now.getMonth()].substring(0, 3);
    dateElement.textContent = `${day}, ${month}`;
}

// Show loading state
function showLoading() {
    widget.classList.add('loading');
    locationElement.textContent = "Searching...";
    tempElement.textContent = "--°";
    weatherCondition.textContent = "Loading";
    weatherIcon.className = "wi wi-refresh";
}

// Hide loading state
function hideLoading() {
    widget.classList.remove('loading');
}

// Show error state
function showError(message) {
    hideLoading();
    locationElement.innerHTML = `<span class="error">${message}</span>`;
    tempElement.textContent = "--°";
    weatherCondition.textContent = "Error";
    weatherIcon.className = "wi wi-na";
}

// Get appropriate weather icon
function getWeatherIcon(description) {
    const desc = description.toLowerCase();
    
    // Check for exact matches first
    if (weatherIconMap[desc]) {
        return weatherIconMap[desc];
    }
    
    // Check for partial matches
    if (desc.includes('rain')) return 'wi-rain';
    if (desc.includes('cloud')) return 'wi-cloudy';
    if (desc.includes('sun') || desc.includes('clear')) return 'wi-day-sunny';
    if (desc.includes('storm')) return 'wi-thunderstorm';
    if (desc.includes('snow')) return 'wi-snow';
    if (desc.includes('fog') || desc.includes('mist')) return 'wi-fog';
    if (desc.includes('wind')) return 'wi-strong-wind';
    
    // Default fallback
    return 'wi-day-cloudy';
}

// Convert temperature from Kelvin to Celsius
function kelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

// Format location name
function formatLocation(cityName) {
    return cityName.split(',')[0]; // Take only the city name, remove country code
}

// Handle successful weather data
function displayWeatherData(data) {
    hideLoading();
    
    // Update weather icon
    const iconClass = getWeatherIcon(data.description);
    weatherIcon.className = `wi ${iconClass}`;
    
    // Update location
    locationElement.textContent = formatLocation(data.cityName);
    
    // Update temperature
    const celsius = kelvinToCelsius(data.temperature);
    tempElement.textContent = `${celsius}°`;
    
    // Update weather condition
    weatherCondition.textContent = data.description.charAt(0).toUpperCase() + 
                                  data.description.slice(1);
    
    // Add success animation
    widget.style.transform = 'scale(1.02)';
    setTimeout(() => {
        widget.style.transform = '';
    }, 200);
}

// Handle form submission
weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const location = searchInput.value.trim();
    if (!location) {
        showError('Please enter a city name');
        return;
    }
    
    showLoading();
    
    try {
        const locationApi = `${fetchWeather}?address=${encodeURIComponent(location)}`;
        const response = await fetch(locationApi);
        const data = await response.json();
        
        if (data.error) {
            showError(data.error);
        } else {
            displayWeatherData(data);
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
        showError('Unable to fetch weather data. Please try again.');
    }
});

// Handle input events for better UX
searchInput.addEventListener('input', () => {
    // Clear error state when user starts typing
    if (locationElement.querySelector('.error')) {
        locationElement.textContent = 'Search for a city to get weather';
        weatherCondition.textContent = 'Welcome';
        tempElement.textContent = '--°';
        weatherIcon.className = 'wi wi-day-sunny';
    }
});

// Handle Enter key press
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        weatherForm.dispatchEvent(new Event('submit'));
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    searchInput.focus();
});

// Update date every minute
setInterval(updateDate, 60000);