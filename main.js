//2개 이상의 api endpoint를 호출
//검색이 가능
//pagination
//반응형
//현재 날씨
//검색 도시가 나오도록 하기

//let date = new Date(1714338000*1000)
//     console.log('date', date)
//     let year = date.getFullYear()
//     console.log('Year', year)
//     let month = '0' + (date.getMonth()+1)
//     console.log('month', month)
//     let day = date.getDate();
//     console.log('day', day)
//     let Hours = date.getHours()
//     console.log('Hours', Hours)
//     let Minute = date.getMinutes()
//     console.log('Minute', Minute)
//     let Seconds = date.getSeconds()
//     console.log('Seconds', Seconds)

let API_KEY = `8313a050c8c3787e9647feedd0df4b95`
let url = ''
let data = ''
let weatherList = []
let dateList = []
//forecast page
let pageNum = 1;

const errorMethod = (error) => {
    let errorHTML = 
    `<div class="search_box">
        <button class="burger"><i class="fa-solid fa-bars"></i></button>
        <input type="text" class="search_city" placeholder="search city">
        <button class="find_city" onclick="find_city()">find</button>
    </div>
    <div class="alert alert-primary" role="alert">
        ${error}
    </div>`

    document.querySelector('.current_weather').innerHTML = errorHTML
    document.querySelector('.pagination').innerHTML = ''
}

//클릭 시 forecast page 바꿈
const page = (page) => {
    pageNum = page
    NoRepeat()
}

//pagination
const paginationMethod = () => {
    let paginationHTML = ''
    paginationHTML += 
    `<li class="page-item" onclick="page(${pageNum - 1})" ${pageNum == 1 ? 'style="display:none"' : ''}>
        <a class="page-link" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
        </a>
    </li>`
    for(let i = 1; i <= 3; i++){
        paginationHTML += `<li class="page-item ${pageNum === i ? 'active' : ''}" onclick="page(${i})"><a class="page-link">${i}</a></li>`
    }
    paginationHTML += 
    `<li class="page-item" onclick="page(${pageNum + 1})" ${pageNum == 3 ? 'style="display:none"' : ''}>
        <a class="page-link" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
        </a>
    </li>`
    document.querySelector('.pagination').innerHTML = paginationHTML
}

//도시 검색
const find_city = () => {
    let city = document.querySelector('.search_city').value
    url = new URL(`httP://api.openweathermap.org/data/2.5/forecast?lang=kr&q=${city}&appid=${API_KEY}&units=metric`)
    NoRepeat()
}


//화면에 출력
const render = () => {
    //현재 날씨 정보
    let current_renderHTML = 
    `<div class="search_box">
        <button class="burger"><i class="fa-solid fa-bars"></i></button>
        <input type="text" class="search_city" placeholder="search city">
        <button class="find_city" onclick="find_city()">find</button>
    </div>
    <div class="city_name" style="color:white; font-weight:700;">${data.city.name}</div>
    <div class="current_temp">
    <div class="current_icon">☀️</div>
    ${weatherList[0].main.temp.toFixed(1)}°
    </div>
    <div class="min_max">
        <div class="min">최저기온 ${weatherList[0].main.temp_min.toFixed(1)}°</div>
        <div class="max">최고기온 ${weatherList[0].main.temp_max.toFixed(1)}°</div>
    </div>
    <div class="rest">
        <div class="current_feels_like">체감 ${weatherList[0].main.feels_like.toFixed(1)}°</div>
        <div class="current_humidity">습도 ${weatherList[0].main.humidity}%</div>
        <div class="wind_deg">${weatherList[0].wind.deg < 90 ?
            '북풍' : weatherList[0].wind.deg < 180 ?
            '동풍' : weatherList[0].wind.deg < 270 ?
            '남풍' : '서풍'
        } ${weatherList[0].wind.speed}m/s</div>
        </div>
    </div>
    `
    document.querySelector('.current_weather').innerHTML = current_renderHTML
    
    //예보 날시
    let forecast_renderHTML = ''
    forecast_renderHTML += 
    `<div class="forecast_inventory">
        <div>시간</div>
        <div>날씨</div>
        <div>기온</div>
        <div>체감</div>
        <div>습도</div>
    </div>`

    let Today = dateList[0].getDate()
    // console.log('date', dateList)
    // console.log('dateDay', dateList[0].getDate())
    let number = pageNum == 1 ? 1 : pageNum == 2 ? 3 : 5
    for(let i = 0; i < weatherList.length; i++){
        if(Today + number >= dateList[i].getDate() && Today + number - 2 < dateList[i].getDate())
        {
            forecast_renderHTML += 
            `<div class="forecast_list">
                <div class="time">
                ${("0" + dateList[i].getHours()).substr(-2)}${("0" + dateList[i].getHours()) < 12 ? 'AM' : 'PM'}
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherList[i].weather[0].icon}.png">
                </div>
                <div class="temp">${weatherList[i].main.temp.toFixed(1)}°</div>
                <div class="feels_like">${weatherList[i].main.feels_like.toFixed(1)}°</div>
                <div class="humidity">${weatherList[i].main.humidity}%</div>
            </div>`
        }
    }

    document.querySelector('.forecast').innerHTML = forecast_renderHTML
}

//중복 되는 함수
const NoRepeat = async () => {
    try{
        let response = await fetch(url)
        console.log('response', response)
        data = await response.json()
        console.log('data', data)
        if(data.cod === '200'){
            weatherList = data.list
            dateList = weatherList.map((x) => new Date(x.dt * 1000))
            console.log('weatherList', weatherList)
            render();
            paginationMethod()
        }
        else{
            throw new Error(data.message)
        }
    }catch(error){
        errorMethod(error.message)
    }
    
}


//첫 시작은 내 위치 나오게 하기
const myLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            // 위치 정보에서 위도와 경도 가져오기
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
    
            url = new URL(`httP://api.openweathermap.org/data/2.5/forecast?lang=kr&lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
            NoRepeat()
        });
    }
}

myLocation();