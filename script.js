//Getting DOM data
let locationTrue = document.querySelector("#location-true");
let locatonFalse = document.querySelector("#location-false");
let tempValue = document.querySelector(".temp")
let discription = document.querySelector(".discription")
let timezone = document.querySelector(".timezone")
let realTemp = document.querySelector(".real-temp")
let uvindex = document.querySelector(".uvindex")
let windSpeed = document.querySelector(".wind-speed")
let humidity = document.querySelector(".humidity")

//-----------------------------------------------------------------

// App Data
const weather = {};

// Check if user's browser supports Geolocation
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    locationTrue.style.display = "none";
    locatonFalse.style.display = "block";
    alert("Browser dosen't support Geolocation")
}

// Get user position
function setPosition(position) {
    let lon = position.coords.longitude;
    let lat = position.coords.latitude;

    getWeather(lon, lat);
    getlocation(lon, lat);

    locationTrue.style.display = "block";
    locatonFalse.style.display = "none";
}

// Show error if there is an ISSUE with Geolocation
function showError(error) {
    locationTrue.style.display = "none";
    locatonFalse.style.display = "block";
}

// Get weather data from API
function getWeather(lon, lat) {
    const proxy = "https://cors-anywhere.herokuapp.com/"
    const api = `${proxy}https://api.darksky.net/forecast/71450cdfab9c01340b59eac9a642afb5/${lat},${lon}?units=ca`
    console.log(api)

    fetch(api)
        .then(response => {
            return response.json()
        })
        .then(data => {
            const dataGrap = data.currently
            console.log(data)

            weather.temperture = Math.floor(dataGrap.temperature)+"°"
            weather.realfeel = Math.round(dataGrap.apparentTemperature)
            weather.uv = uvIndexTOWord(dataGrap.uvIndex);
            weather.summary = dataGrap.summary;
            weather.hum = dataGrap.humidity * 100 + "%";
            weather.wind = Math.floor(dataGrap.windSpeed) + " km/h";
            weather.icon = dataGrap.icon;

            
            setIcons(document.querySelector("#icon1"), weather.icon);
        })


};


// Get exact user location from API
function getlocation(lon, lat) {
    const api = `https://eu1.locationiq.com/v1/reverse.php?key=89f8c869ce6281&lat=${lat}&lon=${lon}&format=json`

    fetch(api)
        .then(response => {
            return response.json()
        })
        .then(data => {

            const dataGrap = data.address;
            console.log(dataGrap)
            weather.location = dataGrap.city + ", " + dataGrap.state

            console.log(weather)

            setDOM();
        })
}

//uv index discription
function uvIndexTOWord(uv) {


    if (uv <= 2.9) {
        uv = "Low"
        return uv
    } else if (uv <= 5.9) {
        uv = "Moderate"
        return uv
    } else if (uv <= 7.9) {
        uv = "High"
        return uv
    } else if (uv <= 10.9) {
        uv = "Very high"
        return uv
    } else {
        uv = "Extreme"
        return uv
    }

}


// Adding Weather Animated Icons 
function setIcons(iconID, icon) {
    const skycons = new Skycons({
        color: "white"
    }, {
        "resizeClear": true
    });
    currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    console.log(currentIcon)
    return skycons.set(iconID, Skycons[currentIcon]);

};


// Applying data to DOM
function setDOM() {
    tempValue.textContent = weather.temperture;
    discription.textContent = weather.summary;
    timezone.textContent = weather.location;
    realTemp.textContent = weather.realfeel;
    uvindex.textContent = weather.uv;
    windSpeed.textContent = weather.wind;
    humidity.textContent = weather.hum;
}