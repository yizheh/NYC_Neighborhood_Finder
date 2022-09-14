const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();

async function borough_summary(req, res) {

    const year = req.query.year ? req.query.year : 2020
    const usefor = req.query.usefor
    
    if(usefor === 'graph') {

        connection.query(`
        WITH Borough_Rents AS (
        SELECT NeighborhoodBorough.Borough, AVG(Rent.AvgRent) AS Average_Rent
        FROM NeighborhoodBorough JOIN Rent ON NeighborhoodBorough.Neighborhood = Rent.Neighborhood
        WHERE Rent.Year = ${year}
        GROUP BY NeighborhoodBorough.Borough
        ),
        Borough_Crimes AS (
        SELECT BoroughCrimesAllYears.Borough, BoroughCrimesAllYears.Crime_Count
        FROM BoroughCrimesAllYears
        WHERE BoroughCrimesAllYears.Year = ${year}
        )
        SELECT Borough_Crimes.Borough, Borough_Rents.Average_Rent, Borough_Crimes.Crime_Count
        FROM Borough_Crimes LEFT OUTER JOIN Borough_Rents ON Borough_Crimes.Borough = Borough_Rents.Borough
        ORDER BY Borough_Crimes.Borough;
        `, function (error, results, fields) {
        
            if (error) {
                console.log(error)
                res.json({ error: error })
            }

            else if (results) {
                res.json({ results: results })
            }

        });

    }

    else if (usefor === 'table') {

        connection.query(`
        WITH Borough_Rents AS (
        SELECT NeighborhoodBorough.Borough, AVG(Rent.AvgRent) AS Average_Rent
        FROM NeighborhoodBorough JOIN Rent ON NeighborhoodBorough.Neighborhood = Rent.Neighborhood
        WHERE Rent.Year = ${year}
        GROUP BY NeighborhoodBorough.Borough
        ),
        Borough_Crimes AS (
        SELECT BoroughCrimesAllYears.Borough, BoroughCrimesAllYears.Crime_Count
        FROM BoroughCrimesAllYears
        WHERE BoroughCrimesAllYears.Year = ${year}
        )
        SELECT Borough_Crimes.Borough, CONCAT('$', FORMAT(IFNULL(Borough_Rents.Average_Rent, 0), 2)) AS Average_Rent, FORMAT(Borough_Crimes.Crime_Count, 0) AS Crime_Count
        FROM Borough_Crimes LEFT OUTER JOIN Borough_Rents ON Borough_Crimes.Borough = Borough_Rents.Borough
        ORDER BY Borough_Crimes.Borough;
        `, function (error, results, fields) {
        
            if (error) {
                console.log(error)
                res.json({ error: error })
            }

            else if (results) {
                res.json({ results: results })
            }

        });

    }

}

async function borough_trends(req, res) {

    const borough = req.query.borough ? req.query.borough : 'Bronx'
    
    connection.query(`
    WITH RentBoroughYear AS (
    SELECT NeighborhoodBorough.Borough, Rent.Year, AVG(Rent.AvgRent) AS Average_Rent
    FROM Rent
    JOIN NeighborhoodBorough ON Rent.Neighborhood = NeighborhoodBorough.Neighborhood
    GROUP BY NeighborhoodBorough.Borough, Rent.Year
    )
    SELECT BoroughCrimesAllYears.Year, BoroughCrimesAllYears.Crime_Count, RentBoroughYear.Average_Rent
    FROM BoroughCrimesAllYears LEFT JOIN RentBoroughYear ON BoroughCrimesAllYears.Borough = RentBoroughYear.Borough AND BoroughCrimesAllYears.Year = RentBoroughYear.Year
    WHERE BoroughCrimesAllYears.Borough = '${borough}'
    `, function (error, results, fields) {
    
        if (error) {
            console.log(error)
            res.json({ error: error })
        }

        else if (results) {
            res.json({ results: results })
        }

    });

}

async function rent_filter(req, res) {

    const minrent = req.query.minrent ? req.query.minrent : 0
    const maxrent = req.query.maxrent ? req.query.maxrent : Number.MAX_SAFE_INTEGER

    connection.query(`
    SELECT Rent.Neighborhood, CONCAT('$', FORMAT(AVG(Rent.AvgRent), 2)) AS AverageRent, CONCAT('$', FORMAT(MIN(Rent.MinRent), 2)) AS LowestRent, CONCAT('$', FORMAT(MAX(Rent.MaxRent), 2)) AS HighestRent, CONCAT('$', FORMAT((MAX(Rent.MaxRent) - MIN(Rent.MinRent)), 2)) AS RentRange
    FROM Rent
    WHERE Rent.Year = 2020
    GROUP BY Rent.Neighborhood
    HAVING AVG(Rent.AvgRent) >= ${minrent} AND AVG(Rent.AvgRent) <= ${maxrent}
    `, function (error, results, fields) {
    
        if (error) {
            res.json({ error: error })
        }

        else if (results) {
            res.json({ results: results })
        }

    });

}

async function crime_filter(req, res) {

    const level = req.query.level ? req.query.level : 'Felony'
    const numLevelResults = req.query.numLevelResults ? req.query.numLevelResults : 10
    const gender = req.query.gender ? req.query.gender : 'M'
    const numGenderResults = req.query.numGenderResults ? req.query.numGenderResults : 10
    const agerange = req.query.agerange ? req.query.agerange : '<18'
    const numAgeResults = req.query.numAgeResults ? req.query.numAgeResults : 5
    const ordering = req.query.ordering ? req.query.ordering : 'ASC'

    connection.query(`
    WITH Least_Offenses AS (
    SELECT ZipCodeNeighborhood.Neighborhood, COUNT(*) AS Offense_Count
    FROM ZipCodeNeighborhood JOIN 2020Crimes ON ZipCodeNeighborhood.ZipCode = 2020Crimes.ZipCode
    WHERE 2020Crimes.OffenseLevel = '${level}'
    GROUP BY ZipCodeNeighborhood.Neighborhood
    ORDER BY Offense_Count ${ordering}
    LIMIT ${numLevelResults}
    ),
    Least_Gender_Victimizations AS (
    SELECT ZipCodeNeighborhood.Neighborhood, COUNT(*) AS Gender_Victimizations
    FROM ZipCodeNeighborhood JOIN 2020Crimes ON ZipCodeNeighborhood.ZipCode = 2020Crimes.ZipCode
    WHERE 2020Crimes.VictimGender = '${gender}'
    GROUP BY ZipCodeNeighborhood.Neighborhood
    ORDER BY Gender_Victimizations ${ordering}
    LIMIT ${numGenderResults}
    ),
    Least_Age_Victimizations AS (
    SELECT ZipCodeNeighborhood.Neighborhood, COUNT(*) AS Age_Group_Victimizations
    FROM ZipCodeNeighborhood JOIN 2020Crimes ON ZipCodeNeighborhood.ZipCode = 2020Crimes.ZipCode
    WHERE 2020Crimes.VictimAgeGroup = '${agerange}'
    GROUP BY ZipCodeNeighborhood.Neighborhood
    ORDER BY Age_Group_Victimizations ${ordering}
    LIMIT ${numAgeResults}
    )
    SELECT Least_Offenses.Neighborhood, FORMAT(Least_Offenses.Offense_Count, 0) AS Offense_Count, FORMAT(Least_Gender_Victimizations.Gender_Victimizations, 0) AS Gender_Victimizations, 
    FORMAT(Least_Age_Victimizations.Age_Group_Victimizations, 0) AS Age_Group_Victimizations
    FROM Least_Offenses JOIN Least_Gender_Victimizations ON Least_Offenses.Neighborhood = Least_Gender_Victimizations.Neighborhood
    JOIN Least_Age_Victimizations ON Least_Offenses.Neighborhood = Least_Age_Victimizations.Neighborhood
    `, function (error, results, fields) {
    
        if (error) {
            res.json({ error: error })
        }

        else if (results) {
            res.json({ results: results })
        }

    });

}

async function city_rents(req, res) {
    connection.query(`
    SELECT CONCAT(Year, '-', Month) AS Date, AVG(AvgRent) AVG, AVG(MinRent) MIN, AVG(MaxRent) MAX
    FROM Rent
    GROUP BY Year, Month
    ORDER BY Year, Month
    `, function (error, results, fields) {
    
        if (error) {
            res.json({ error: error })
        }

        else if (results) {
            res.json({ results: results })
        }

    });
}

async function city_crime_level(req, res) {
    connection.query(`
    Select Date, Violation_Num/(Violation_Num+Misdemeanor_Num+Felony_NUM)-0.0001 As Violation_ratio, Misdemeanor_Num/(Violation_Num+Misdemeanor_Num+Felony_NUM)-0.0001 As Misdemeanor_ratio, Felony_Num/(Violation_Num+Misdemeanor_Num+Felony_NUM)-0.0001 As Felony_ratio
From NYC_Crime_Level_Count;
    `, function (error, results, fields) {
    
        if (error) {
            res.json({ error: error })
        }

        else if (results) {
            res.json({ results: results })
        }

    });
}


async function search_neighborhood(req, res) {
    
    const name = req.query.name ? `%${req.query.name}%`: "%"
    connection.query(`
    WITH NB AS (
    SELECT DISTINCT ZCN.Neighborhood, COUNT(ZCN.ZipCode) as NumZipCodes
    FROM ZipCodeNeighborhood as ZCN
    WHERE ZCN.Neighborhood LIKE '${name}'
    GROUP BY ZCN.Neighborhood
    UNION
    SELECT DISTINCT ZCN.Neighborhood, COUNT(ZCN.ZipCode) as NumZipCodes
    FROM ZipCodeNeighborhood as ZCN
    WHERE ZCN.ZipCode like '${name}'
    GROUP BY ZCN.Neighborhood
    UNION
    SELECT DISTINCT ZCN.Neighborhood, COUNT(ZCN.ZipCode) as NumZipCodes
    FROM ZipCodeNeighborhood as ZCN Join NeighborhoodBorough NB on ZCN.Neighborhood = NB.Neighborhood
    WHERE NB.Borough like '${name}'
    GROUP BY ZCN.Neighborhood)
    SELECT NB.Neighborhood, NB.NumZipCodes, GROUP_CONCAT(ZCN.ZipCode ORDER BY ZCN.ZipCode SEPARATOR  ', ') as ZipCodes
    FROM NB JOIN ZipCodeNeighborhood ZCN on NB.Neighborhood = ZCN.Neighborhood
    GROUP BY ZCN.Neighborhood;`, function (error, results, fields) {

        if (error) {
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

async function neighborhood(req, res) {
    const id = req.query.id ? req.query.id : ""
    connection.query(`
    WITH CRIME_STAT 
    (Month, Year, Crime_Count) AS 
        (SELECT C.Month, C.Year, COUNT(C.ZipCode) as Crime_Count
        FROM Crime as C JOIN ( SELECT ZipCode
                               FROM ZipCodeNeighborhood ZCN
                             WHERE ZCN.Neighborhood= '${id}') zip on zip.ZipCode = C.ZipCode
        GROUP BY C.Month,C.Year),
    DS AS(
        SELECT Rent.Neighborhood, Rent.Month, Rent.Year, Rent.AvgRent, Rent.MinRent, Rent.MaxRent, 
        CRIME_STAT.Crime_Count, Concat(CAST(Rent.Year AS CHAR(4)), '-', CAST(Rent.Month AS CHAR(2)),'-', '01') as datestring
        FROM CRIME_STAT JOIN Rent on Rent.Month = CRIME_STAT.Month AND Rent.Year = CRIME_STAT.Year
        WHERE Rent.Neighborhood ='${id}')
    SELECT *,  str_to_date(datestring, '%Y-%m-%d') as date
        FROM DS
        ORDER BY date;`, function (error, results, fields) {

        if (error) {
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

async function neighborhood_rank(req, res) {
    const id = req.query.id ? req.query.id : ""
    connection.query(`
    WITH IDC AS (SELECT ZCN.Neighborhood, TC.OffenseDescription, COUNT(IF (TC.OffenseLevel = 'Felony', 1, NULL)) AS FCOUNT,  COUNT(IF (TC.OffenseLevel = 'Misdemeanor', 1, NULL)) AS MCOUNT, COUNT(*) as TCOUNT
    FROM 2020Crimes TC JOIN ZipCodeNeighborhood ZCN on TC.ZipCode = ZCN.ZipCode
    WHERE ZCN.Neighborhood = '${id}'
    GROUP BY (TC.OffenseDescription)),
    FMOST AS (SELECT Neighborhood, OffenseDescription AS FMOST
    FROM IDC
    WHERE IDC.FCOUNT >= ALL(SELECT FCOUNT FROM IDC)),
        MMOST AS(
    SELECT Neighborhood, OffenseDescription AS MMOST
    FROM IDC
    WHERE IDC.MCOUNT >= ALL(SELECT MCOUNT FROM IDC)),
    NB AS (SELECT *
    From NeighborhoodBorough
    WHERE Neighborhood = '${id}'),
    NBS AS (SELECT NB2.Neighborhood, NB2.Borough
    FROM NeighborhoodBorough NB2, NB
    WHERE NB.Borough = NB2.Borough),
    NBR AS(SELECT R.Neighborhood, AVG(R.AvgRent) as AvgRent
        FROM Rent R
        WHERE Year = 2020
        GROUP BY R.Neighborhood),
    NBSZ AS( SELECT ZCN.ZipCode, NBS.Neighborhood, NBS.Borough
    FROM ZipCodeNeighborhood ZCN JOIN NBS on ZCN.Neighborhood=NBS.Neighborhood),
    Counts AS(
    SELECT NBSZ.Neighborhood, COUNT(TC.CrimeId) AS Total, COUNT(IF (TC.OffenseLevel = 'Felony', 1, NULL)) AS Felonies,
        COUNT(IF (TC.OffenseLevel = 'Misdemeanor', 1, NULL)) as Misdemeanors, NBR.AvgRent, NBSZ.Borough
    FROM 2020Crimes TC JOIN NBSZ ON NBSZ.ZipCode = TC.ZipCode JOIN NBR ON NBSZ.Neighborhood = NBR.Neighborhood
    GROUP BY NBSZ.Neighborhood),
    NBRank as (
    SELECT Counts.Borough, Counts.Neighborhood, RANK() OVER (ORDER BY Counts.Total DESC) AS TRank ,  RANK() OVER (ORDER BY Counts.Felonies DESC) AS FRank , RANK() OVER (ORDER BY Counts.Misdemeanors DESC) AS MRank,  RANK() OVER (ORDER BY Counts.AvgRent DESC) as RentRank
    FROM Counts)
    SELECT *
    FROM NBRank NATURAL JOIN FMOST NATURAL Join MMOST;`, function (error, results, fields) {

        if (error) {
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

async function city_crime_age(req, res) {
    connection.query(`
    With AddTotal AS ( SELECT *, AG1+AG2+AG3+AG4+AG5 As Total
        From NYC_Crime_AgeGroup_Count )
        SELECT Date, AG1/Total- 0.0001 AS AG1_ratio , AG2/Total- 0.0001 AS AG2_ratio, AG3/Total- 0.0001 AS AG3_ratio, AG4/Total- 0.0001 AS AG4_ratio, AG5/Total- 0.0001 AS AG5_ratio
        From AddTotal        
    `, function (error, results, fields) {
    
        if (error) {
            res.json({ error: error })
        }

        else if (results) {
            res.json({ results: results })
        }

    });
}

// async function jersey(req, res) {
//     const colors = ['red', 'blue']
//     const jersey_number = Math.floor(Math.random() * 20) + 1
//     const name = req.query.name ? req.query.name : "player"

//     if (req.params.choice === 'number') {
//         // TODO: TASK 1: inspect for issues and correct 
//         res.json({ message: `Hello, ${name}!`, jersey_number: jersey_number })
//     } else if (req.params.choice === 'color') {
//         var lucky_color_index = Math.floor(Math.random() * 2);
//         // TODO: TASK 2: change this or any variables above to return only 'red' or 'blue' at random (go Quakers!)
//         res.json({ message: `Hello, ${name}!`, jersey_color: colors[lucky_color_index] })
//     } else {
//         // TODO: TASK 3: inspect for issues and correct
//         res.json({ message: `Hello, ${name}, we like your jersey!` })
//     }
// }

// // ********************************************
// //               GENERAL ROUTES
// // ********************************************


// // Route 3 (handler)
// async function all_matches(req, res) {
//     // TODO: TASK 4: implement and test, potentially writing your own (ungraded) tests
//     // We have partially implemented this function for you to 
//     // parse in the league encoding - this is how you would use the ternary operator to set a variable to a default value
//     // we didn't specify this default value for league, and you could change it if you want! 
//     // in reality, league will never be undefined since URLs will need to match matches/:league for the request to be routed here... 
//     const league = req.params.league ? req.params.league : 'D1'
//     const page = req.query.page
//     const pagesize = req.query.pagesize ? req.query.pagesize : 10
//     // use this league encoding in your query to furnish the correct results

//     if (req.query.page && !isNaN(req.query.page)) {
//         // This is the case where page is defined.
//         // The SQL schema has the attribute OverallRating, but modify it to match spec! 
//         // TODO: query and return results here:
    
//         const startindex = (page-1)*pagesize

//         connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
//         FROM Matches 
//         WHERE Division = '${league}'
//         ORDER BY HomeTeam, AwayTeam
//         LIMIT ${startindex},${pagesize}`, function (error, results, fields) {

//             if (error) {
//                 console.log(error)
//                 res.json({ error: error })
//             } else if (results) {
//                 res.json({ results: results })
//             }
//         });

   
//     } else {
//         // we have implemented this for you to see how to return results by querying the database
//         connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
//         FROM Matches 
//         WHERE Division = '${league}'
//         ORDER BY HomeTeam, AwayTeam`, function (error, results, fields) {

//             if (error) {
//                 console.log(error)
//                 res.json({ error: error })
//             } else if (results) {
//                 res.json({ results: results })
//             }
//         });
//     }
// }

// // Route 4 (handler)
// async function all_players(req, res) {
//     // TODO: TASK 5: implement and test, potentially writing your own (ungraded) tests
    
//     const page = req.query.page
//     const pagesize = req.query.pagesize ? req.query.pagesize : 10

//     if (req.query.page && !isNaN(req.query.page)) {

//         const startindex = (page-1)*pagesize

//         connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value  
//             FROM Players 
//             ORDER BY Name
//             LIMIT ${startindex},${pagesize}`, function (error, results, fields) {
    
//                 if (error) {
//                     console.log(error)
//                     res.json({ error: error })
//                 } else if (results) {
//                     res.json({ results: results })
//                 }
//             });
        
//     } else {

//         connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value  
//             FROM Players 
//             ORDER BY Name`, function (error, results, fields) {
    
//                 if (error) {
//                     console.log(error)
//                     res.json({ error: error })
//                 } else if (results) {
//                     res.json({ results: results })
//                 }
//             });

//     }

// }


// // ********************************************
// //             MATCH-SPECIFIC ROUTES
// // ********************************************

// // Route 5 (handler)
// async function match(req, res) {
//     // TODO: TASK 6: implement and test, potentially writing your own (ungraded) tests
    
//     const id = req.query.id

//     if (req.query.id && !isNaN(req.query.id)) {

//         connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals,
//             HalfTimeGoalsH AS HTHomeGoals, HalfTimeGoalsA AS HTAwayGoals, ShotsH AS ShotsHome, ShotsA AS ShotsAway, ShotsOnTargetH AS ShotsOnTargetHome,
//             ShotsOnTargetA AS ShotsOnTargetAway, FoulsH AS FoulsHome, FoulsA AS FoulsAway, CornersH AS CornersHome, CornersA AS CornersAway,
//             YellowCardsH AS YCHome, YellowCardsA AS YCAway, RedCardsH AS RCHome, RedCardsA AS RCAway
//             FROM Matches 
//             WHERE MatchId = ${id}`, function (error, results, fields) {
    
//                 if (error) {
//                     console.log(error)
//                     res.json({ error: error })
//                 } else if (results) {
//                     res.json({ results: results })
//                 }
//             });

//     } else {

//         return res.json({error: "Invalid id"})

//     }

// }

// // ********************************************
// //            PLAYER-SPECIFIC ROUTES
// // ********************************************

// // Route 6 (handler)
// async function player(req, res) {
//     // TODO: TASK 7: implement and test, potentially writing your own (ungraded) tests
    
//     const id = req.query.id

//     if (req.query.id && !isNaN(req.query.id)) {

//         connection.query(`SELECT BestPosition 
//         FROM Players
//         WHERE PlayerId = ${id}`, function (error, results, fields) {

//             if (error) {

//                 console.log(error)
//                 res.json({ error: error })

//             }
                    
//             else {

//                 if (results == '') {

//                     return res.json({results: [] })
    
//                 }

//                 if (results[0]['BestPosition'] === 'GK') {

//                     connection.query(`SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating as Rating, Potential, Club, ClubLogo, Value,
//                     Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height, Weight, BestPosition,
//                     BestOverallRating, ReleaseClause, GKPenalties, GKDiving, GKHandling, GKKicking, GKPositioning, GKReflexes
//                     FROM Players
//                     WHERE PlayerId = ${id}`, function (error, gkresults, fields) {

//                         res.json({results: gkresults})

//                     });

//                 }

//                 else {

//                     connection.query(`SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating as Rating, Potential, Club, ClubLogo, Value,
//                     Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height, Weight, BestPosition, 
//                     BestOverallRating, ReleaseClause, NPassing, NBallControl, NAdjustedAgility, NStamina, NStrength, NPositioning
//                     FROM Players
//                     WHERE PlayerId = ${id}`, function (error, othresults, fields) {

//                         res.json({results: othresults})

//                     });

//                 }
//             }

//         });

//     }

//     else {

//         return res.json({error: "Invalid id"})

//     }

// }

// // ********************************************
// //             SEARCH ROUTES
// // ********************************************

// // Route 7 (handler)
// async function search_matches(req, res) {
//     // TODO: TASK 8: implement and test, potentially writing your own (ungraded) tests
//     // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string

//     const hteam = req.query.Home ? req.query.Home : '%'
//     const ateam = req.query.Away ? req.query.Away : '%'

//     const page = req.query.page
//     const pagesize = req.query.pagesize ? req.query.pagesize : 10

//     if (req.query.page && !isNaN(req.query.page)) {

//         const startindex = (page-1)*pagesize

//         connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals
//         FROM Matches
//         WHERE HomeTeam LIKE '%${hteam}%' AND AwayTeam LIKE '%${ateam}%'
//         ORDER BY HomeTeam, AwayTeam
//         LIMIT ${startindex},${pagesize}`, function (error, results, fields) {
    
//             if (error) {

//                 console.log(error)
//                 res.json({ error: error })

//             } 
                
//             else if (results) {

//                 res.json({ results: results })

//             }
            
//         });
        
//     } 
    
//     else {

//         connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals
//         FROM Matches
//         WHERE HomeTeam LIKE '%${hteam}%' AND AwayTeam LIKE '%${ateam}%'
//         ORDER BY HomeTeam, AwayTeam`, function (error, results, fields) {
    
//             if (error) {

//                 console.log(error)
//                 res.json({ error: error })

//             } 
                
//             else if (results) {

//                 res.json({ results: results })

//             }
            
//         });

//     }

// }

// // Route 8 (handler)
// async function search_players(req, res) {
//     // TODO: TASK 9: implement and test, potentially writing your own (ungraded) tests
//     // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string
    
//     const name = req.query.Name ? req.query.Name : '%'
//     const nation = req.query.Nationality ? req.query.Nationality : '%'
//     const club = req.query.Club ? req.query.Club : '%'
//     const lrating = req.query.RatingLow ? req.query.RatingLow : 0
//     const hrating = req.query.RatingHigh ? req.query.RatingHigh : 100
//     const lpotent = req.query.PotentialLow ? req.query.PotentialLow : 0
//     const hpotent = req.query.PotentialHigh ? req.query.PotentialHigh : 100

//     const page = req.query.page
//     const pagesize = req.query.pagesize ? req.query.pagesize : 10

//     if (req.query.page && !isNaN(req.query.page)) {

//         const startindex = (page-1)*pagesize

//         connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value
//         FROM Players
//         WHERE Name LIKE '%${name}%' AND Nationality LIKE '%${nation}%' AND Club LIKE '%${club}%'
//         AND OverallRating >= ${lrating} AND OverallRating <= ${hrating} 
//         AND Potential >= ${lpotent} AND Potential <= ${hpotent}
//         ORDER BY Name
//         LIMIT ${startindex},${pagesize}`, function (error, results, fields) {
    
//             if (error) {

//                 console.log(error)
//                 res.json({ error: error })

//             } 
                
//             else if (results) {

//                 res.json({ results: results })

//             }
            
//         });
        
//     } 
    
//     else {

//         connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value
//         FROM Players
//         WHERE Name LIKE '%${name}%' AND Nationality LIKE '%${nation}%' AND Club LIKE '%${club}%'
//         AND OverallRating >= ${lrating} AND OverallRating <= ${hrating} 
//         AND Potential >= ${lpotent} AND Potential <= ${hpotent}
//         ORDER BY Name`, function (error, results, fields) {
    
//             if (error) {

//                 console.log(error)
//                 res.json({ error: error })

//             } 
                
//             else if (results) {

//                 res.json({ results: results })

//             }
            
//         });

//     }

// }

module.exports = {
    borough_summary,
    borough_trends,
    rent_filter,
    city_rents,
    city_crime_level,
    city_crime_age,
    crime_filter,
    search_neighborhood,
    neighborhood,
    neighborhood_rank
    // jersey,
    // all_matches,
    // all_players,
    // match,
    // player,
    // search_matches,
    // search_players
}