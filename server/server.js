const express = require('express');
const mysql = require('mysql');


const routes = require('./routes')
const config = require('./config.json')
const cors = require('cors');


const app = express();
app.use(cors({
    origin: '*'
}));

app.get('/borough/summary', routes.borough_summary)

app.get('/borough/trends', routes.borough_trends)

app.get('/filter/rents', routes.rent_filter)

app.get('/filter/crimes', routes.crime_filter)

app.get('/search', routes.search_neighborhood)

app.get('/neighborhood', routes.neighborhood)

app.get('/neighborhood/rank', routes.neighborhood_rank)

app.get('/city/rents', routes.city_rents)

app.get('/city/crimelevel', routes.city_crime_level)

app.get('/city/crimeage', routes.city_crime_age)


// // Route 4 - register as GET 
// app.get('/players', routes.all_players)

// // Route 7 - register as GET 
// app.get('/search/matches', routes.search_matches)

// // Route 8 - register as GET 
// app.get('/search/players', routes.search_players)





app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;