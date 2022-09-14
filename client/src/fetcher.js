import config from './config.json'

const getBoroughSummary = async (year, usefor) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/borough/summary?year=${year}&usefor=${usefor}`, {
        method: 'GET',
    })
    return res.json()
}

const getCityRents = async (year) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/city/rents`, {
        method: 'GET',
    })
    return res.json()
}

const getCityCrimeLevel = async (year) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/city/crimelevel`, {
        method: 'GET',
    })
    return res.json()
}

const getCityCrimeAge = async (year) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/city/crimeage`, {
        method: 'GET',
    })
    return res.json()
}

const getBoroughTrends = async (borough) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/borough/trends?borough=${borough}`, {
        method: 'GET',
    })
    return res.json()
}

const getFilteredRents = async (minrent, maxrent) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/filter/rents?minrent=${minrent}&maxrent=${maxrent}`, {
        method: 'GET',
    })
    return res.json()
}

const getFilteredCrime = async (level, numLevelResults, gender, numGenderResults, agerange, numAgeResults, ordering) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/filter/crimes?level=${level}&numLevelResults=${numLevelResults}&gender=${gender}&numGenderResults=${numGenderResults}&agerange=${agerange}&numAgeResults=${numAgeResults}&ordering=${ordering}`, {
        method: 'GET',
    })
    return res.json()
}

const getSearchName = async (name) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search?name=${name}`, {
        method: 'GET',
    })
    return res.json()
}

const getNeighborhood = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/neighborhood?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getNeighborhoodRank = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/neighborhood/rank?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

// const getAllMatches = async (page, pagesize, league) => {
//     var res = await fetch(`http://${config.server_host}:${config.server_port}/matches/${league}?page=${page}&pagesize=${pagesize}`, {
//         method: 'GET',
//     })
//     return res.json()
// }

// const getAllPlayers = async (page, pagesize) => {
//     var res = await fetch(`http://${config.server_host}:${config.server_port}/players?page=${page}&pagesize=${pagesize}`, {
//         method: 'GET',
//     })
//     return res.json()
// }

// const getMatch = async (id) => {
//     var res = await fetch(`http://${config.server_host}:${config.server_port}/match?id=${id}`, {
//         method: 'GET',
//     })
//     return res.json()
// }

// const getPlayer = async (id) => {
//     var res = await fetch(`http://${config.server_host}:${config.server_port}/player?id=${id}`, {
//         method: 'GET',
//     })
//     return res.json()
// }

// const getMatchSearch = async (home, away, page, pagesize) => {
//     var res = await fetch(`http://${config.server_host}:${config.server_port}/search/matches?Home=${home}&Away=${away}&page=${page}&pagesize=${pagesize}`, {
//         method: 'GET',
//     })
//     return res.json()
// }

// const getPlayerSearch = async (name, nationality, club, rating_high, rating_low, pot_high, pot_low, page, pagesize) => {
//     var res = await fetch(`http://${config.server_host}:${config.server_port}/search/players?Name=${name}&Nationality=${nationality}&Club=${club}&RatingLow=${rating_low}&RatingHigh=${rating_high}&PotentialHigh=${pot_high}&PotentialLow=${pot_low}&page=${page}&pagesize=${pagesize}`, {
//         method: 'GET',
//     })
//     return res.json()
// }




export {
    getBoroughSummary,
    getBoroughTrends,
    getFilteredRents,
    getCityRents,
    getCityCrimeLevel,
    getCityCrimeAge,
    getFilteredCrime,
    getSearchName,
    getNeighborhood,
    getNeighborhoodRank
    // getAllMatches,
    // getAllPlayers,
    // getMatch,
    // getPlayer,
    // getMatchSearch,
    // getPlayerSearch
}