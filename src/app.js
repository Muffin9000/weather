const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode.js')

const app = express();
const PORT = 8000;
const pubDir = path.join(__dirname, '../public');
const viewDir = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

app.use(express.static(pubDir))
app.set('view engine', 'hbs');
app.set('views', viewDir);
hbs.registerPartials(partialsPath);


app.get('', (req,res) => {
    res.render('index', {title: 'Weather', name: 'Kostjan', age: '30'})
});
app.get('/about', (req,res) => {
    res.render('about',{title: 'About'})
});


app.get('/weather', (req, res) => {
    const addressQuery = req.query.address;

    if(!req.query.address || req.query.address.length == 0){
        return res.send({
            err: {message: 'Address has to be provided in search'}
        })
    }else{
        geocode.geocode(addressQuery, (err, {place, coordinates} = {}) => {
            if(err){
                return res.send({err: {message: err}});
            }
            geocode.forecast(coordinates,'ru', (err2, forecast_data) => {
                if(err2){
                    return res.send({err: {message: err2}});
                }
                const {timezone, currently} = forecast_data
                const {summary, precipType, temperature, humidity} = currently
                return res.send({forecast: {place,summary,precipType,temperature,humidity}});
            })
        })
    }
})

app.get('/help', (req,res) => {
    res.render('help',{title: 'Help'})
});

app.get('*', (req, res) => {
    res.render('404')
});

app.listen(PORT, () => {
    console.info(`Server is runnig at port ${PORT}`)
});