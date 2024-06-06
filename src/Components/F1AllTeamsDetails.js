import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import detailslink from '../img/link-white.png';
import Flag from 'react-flagkit';
import { getFlagCode, getCellColorCoded } from "../helpers";
import Loader from "./Loader";
import defaultTeamImage from '../img/team.png';
import F1Breadcrumbs from "./F1Breadcrumbs";
import TDPositionTable from './TDPositionTable';
import '../css/AlexPosition.css'; // Import MY CSS file

const F1AllTeamsDetails = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [teamDetails, setTeamDetails] = useState({});
    const [driverRaces, setDriverRaces] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const flags = props.flags;
    const year = props.year;

    const [teamDrivers, setTeamDrivers] = useState([]);
    const [teamPointsPerRace, setTeamPointsPerRace] = useState({});
    const [driverPoints, setDriverPoints] = useState([]);
    const [driverRacePoints, setDriverRacePoints] = useState({});
    const [driverRacePosition, setDriverRacePosition] = useState({});
    const teamid = params.id;
    const [allRaces, setAllRaces] = useState([]);

    // AV below this UNTIL getTeamDetails
    useEffect(() => {
        // Fetch driver standings for the year 2010
        const fetchDriverStandings = async () => {
            try {
                // console.log("Year is: ", year , "Team ID is: ", teamid)
                // const response = await axios.get('https://ergast.com/api/f1/2010/driverStandings.json');
                const response = await axios.get(`https://ergast.com/api/f1/${year}/driverStandings.json`);
                const standings = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
                // setTeamDrivers(standings.filter((driver) => driver.Constructors[0].constructorId === 'ferrari'));
                // const pID = params.id;       // VEC IMAM teamid
                // console.log("YEAR ID IS:", props.year)
                // console.log("CONSTRUCTOR ID IS:", teamid)
                setTeamDrivers(standings.filter((driver) => driver.Constructors[0].constructorId === teamid));

                const url = `http://ergast.com/api/f1/${props.year}/results/1.json`;
                const allRacesResponse = await axios.get(url);
                const allRacesData = allRacesResponse.data.MRData.RaceTable.Races;
                setAllRaces(allRacesData);

                console.log("allRacesData is: ");
                // const ttd = standings.filter((driver) => driver.Constructors[0].constructorId === teamid);
                // const ttd = response.data.MRData.StandingsTable;
                console.log(allRacesData);
            }
            catch (error) {
                console.error('Error fetching driver standings:', error);
                navigate("/");
            }
        };

        fetchDriverStandings();
    }, []);

    useEffect(() => {
        // Fetch individual driver results and calculate team points per race
        const fetchDriverResults = async () => {
            try {
                const driverResultsPromises = teamDrivers.map(async (driver) => {
                    const response = await axios.get(`https://ergast.com/api/f1/${year}/drivers/${driver.Driver.driverId}/results.json`);
                    const races = response.data.MRData.RaceTable.Races;
                    const driverPoints = races.reduce((totalPoints, race) => totalPoints + parseInt(race.Results[0].points), 0);

                    // Update driverRacePoints here
                    const driverId = driver.Driver.driverId;
                    const driverRacePointsData = races.reduce((pointsByRace, race) => {
                        const raceNumber = race.round;
                        const racePoints = parseInt(race.Results[0].points);
                        return { ...pointsByRace, [raceNumber]: racePoints };
                    }, {});

                    setDriverRacePoints((prevDriverRacePoints) => ({
                        ...prevDriverRacePoints,
                        [driverId]: driverRacePointsData,
                    }));

                    const driverRacePositionData = races.reduce((pointsByRace, race) => {
                        const raceNumber = race.round;
                        const racePosition = parseInt(race.Results[0].position);
                        return { ...pointsByRace, [raceNumber]: racePosition };
                    }, {});

                    setDriverRacePosition((prevDriverRacePosition) => ({
                        ...prevDriverRacePosition,
                        [driverId]: driverRacePositionData,
                    }));

                    return { driverId, points: driverPoints, races };
                });

                const allDriverPoints = await Promise.all(driverResultsPromises);
                // console.log('All driver points:', allDriverPoints);

                // Calculate team points per race
                const pointsPerRace = {};
                allDriverPoints.forEach((driver) => {
                    driver.races.forEach((race) => {
                        const raceNumber = race.round;
                        const racePoints = parseInt(race.Results[0].points);
                        pointsPerRace[raceNumber] = (pointsPerRace[raceNumber] || 0) + racePoints;
                    });
                });

                setTeamPointsPerRace(pointsPerRace);
                // console.log('Team points per race:', pointsPerRace);

                // Process the points as needed
                setDriverPoints(allDriverPoints);
                // console.log('Individual points per race:', allDriverPoints);
            } catch (error) {
                console.error('Error fetching driver results:', error);
                navigate("/");
            }
        };

        if (teamDrivers.length > 0) {
            fetchDriverResults();
        }
    }, [teamDrivers]);

    // Rest of your component logic...
	
    const getTeamDetails = async () => {
        const constructorStandingsUrl = `http://ergast.com/api/f1/${year}/constructors/${params.id}/constructorStandings.json`;
        const resultsUrl = `http://ergast.com/api/f1/${year}/constructors/${params.id}/results.json`;
        try {
            const constructorStandingsResponse = await axios.get(constructorStandingsUrl);
            const resultsResponse = await axios.get(resultsUrl);
            setTeamDetails(constructorStandingsResponse.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0]);
            setDriverRaces(resultsResponse.data.MRData.RaceTable.Races);
            setIsLoading(false);
        } catch (error) {
            console.log("Axios error:", error);
            navigate("/");
        }
    };

    useEffect(() => {
        setIsLoading(true);
        getTeamDetails();
    }, [year]);

    if (isLoading) {
        return <Loader />;
    }

    const getTeamImage = (teamId) => {
        try {
            return require(`../img/${teamId}.png`);
        } catch (error) {
            console.log("Error loading team image:", error);
            return defaultTeamImage;
        }
    };

    const calculateTotalPoints = () => {
        let totalPoints = 0;
        driverRaces.forEach(race => {
            race.Results.forEach(result => {
                totalPoints += parseInt(result.points);
            });
        });
        return totalPoints;
    };

    //deprecated because I built a SUPERIOR ALTERNATIVE!
    const addPoints = (race) => {
        let pointsTest = 0;
        pointsTest = parseInt(race.Results[0].points) + parseInt(race.Results[1].points);
        return pointsTest;
    };

    const driverLastNames = Array.from(new Set(driverRaces.flatMap(race => race.Results.map(result => result.Driver.familyName))));

    const handleClickToRacesDetails = (raceid) => {
        const link = `/racedetails/${raceid}`;
        navigate(link);
    };

    const items = [
        { path: "/", name: "F-1 Feeder" },
        { path: "/teams", name: "Teams" },
        { path: `/teamdetails/${params.id}`, name: `${teamDetails.Constructor.name}` }
    ];

    return (<div className="component-body">
        <div className="header">
            <F1Breadcrumbs items={items} />
        </div>

        <div className="table-flex">
            <div>
                <div className="detailCard sticky-card">
                    <div>
                        <img src={getTeamImage(params.id)} alt="Team Image" style={{ maxWidth: 200 }} />
                        <h3>{teamDetails.Constructor.name} {`\u00A0`}
                            <Flag country={getFlagCode(flags, teamDetails.Constructor.nationality)} />
                        </h3>
                    </div>
                    <table>
                        <tbody>
                            <tr>
                                <td>Country: </td>
                                <td>{teamDetails.Constructor.nationality}</td>
                            </tr>
                            <tr>
                                <td>Position: </td>
                                <td>{teamDetails.position}</td>
                            </tr>
                            <tr>
                                <td>Points: </td>
                                <td>{calculateTotalPoints()}</td>
                            </tr>
                            <tr>
                                <td>History: </td>
                                <td className="external"><a target='_blank' rel='noopener noreferrer' href={teamDetails.Constructor.url}><img src={detailslink} style={{ width: 15, height: 15 }} alt="Details link" /></a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Round</th>
                            <th>Grand Prix</th>
                            {driverLastNames.map((lastName, index) => (
                                <th key={index}>{lastName}</th>
                            ))}
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {driverRaces.map(race => (
                            <tr key={race.round}>
                                <td>{race.round}</td>
                                <td className="clickable" onClick={() => handleClickToRacesDetails(race.round)}>
                                    {race.Circuit.Location.country == "Azerbaijan" ? (<img src={"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/AZ.svg"} className="azer" alt="AZ flag" />) : (<Flag country={getFlagCode(flags, race.Circuit.Location.country)} />)}
                                    <span>{race.Circuit.circuitName}</span>
                                </td>
                                {driverLastNames.map((lastName, index) => {
                                    const driverResult = race.Results.find(result => result.Driver.familyName === lastName && result.Constructor.constructorId === params.id);
                                    return <td style={{ backgroundImage: getCellColorCoded(driverResult?.position) }} key={index}>{driverResult ? driverResult.position : "-"}</td>;
                                })}
                                <td>{addPoints(race)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    );
}; */}

                {/* AV CODE BELOW THIS */}
                {/* <div className="table-wrapper">
                    <h1 style={{ fontSize: '4.2vh' }}>Drivers and Team Points from {teamDetails.Constructor.name} Per Race for season {year}</h1>
                    <TDPointsTable
                        teamDrivers={teamDrivers}
                        driverRacePoints={driverRacePoints}
                        teamPointsPerRace={teamPointsPerRace}
                        allRaces={allRaces}
                        handleClickToRacesDetails={handleClickToRacesDetails}
                        flags={flags}
                    />
                </div> */}
                <div className="table-wrapper">
                    <h1 style={{ fontSize: '4.2vh' }}>Drivers Position and Team Points for {teamDetails.Constructor.name} in each race during {year} season</h1>
                    <TDPositionTable
                        teamDrivers={teamDrivers}
                        driverRacePosition={driverRacePosition}
                        teamPointsPerRace={teamPointsPerRace}
                        allRaces={allRaces}
                        handleClickToRacesDetails={handleClickToRacesDetails}
                        flags={flags}
                    />
                </div>
            </div>
        </div>
    );
};

export default F1AllTeamsDetails;
