console.log('Client side javascript file is loaded!');

const weatherForm = document.getElementsByTagName('form')[0];
const searchInput = weatherForm.getElementsByTagName('input')[0];
const button = weatherForm.getElementsByTagName('button')[0];
const firstP = document.getElementById('first');
const secondP = document.getElementById('second');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    fetch(`http://localhost:8000/weather?address=${searchInput.value}`).then((response) => {
    response.json().then((data) => {
        if(data.err){
            firstP.textContent=data.err.message;
        }else{
            const {place, summary, precipType, temperature, humidity} = data.forecast
            firstP.innerText=place
            secondP.innerText=`${summary}\nExpected: ${precipType}\nTemperature: ${temperature} Celsius\nHumidity: ${humidity}`
        }
    })
})
    
})

