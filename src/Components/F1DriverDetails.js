import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import detailslink from '../img/link-white.png';
import Flag from 'react-flagkit';
import { getFlagCode, getCellColorCoded } from "../helpers";
import defaultDriverImage from '../img/avatar.png';
import F1Breadcrumbs from "./F1Breadcrumbs";


const F1DriverDetails = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [driverDetails, setDriverDetails] = useState({});
    const [driverRaces, setDriverRaces] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const flags = props.flags;
    const year = props.year;


    const getDriverDetails = async () => {
        const driverStandingsUrl = `https://ergast.com/api/f1/${year}/drivers/${params.id}/driverStandings.json`;
        const resultsUrl = `https://ergast.com/api/f1/${year}/drivers/${params.id}/results.json`;
        try {
            const driverStandingsResponse = await axios.get(driverStandingsUrl);
            const resultsResponse = await axios.get(resultsUrl);
            const driverStandingsData = driverStandingsResponse.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
            const resoultsData = resultsResponse.data.MRData.RaceTable.Races;
            setDriverDetails(driverStandingsData);
            setDriverRaces(resoultsData);
            setIsLoading(false);
        } catch (error) {
            console.log("Axios error", error);
            navigate("/");
        };
    };

    useEffect(() => {
        setIsLoading(true);
        getDriverDetails();
    }, [year]);

    if (isLoading) {
        return <Loader />;
    };

    const getDriverImage = (driverId) => {
        try {
            return require(`../img/${driverId}.jpg`);
        } catch (error) {
            console.log("Error loading driver image:", error);
            return defaultDriverImage;
        }
    };

    const handleClickToRacesDetails = (raceid) => {
        const link = `/racedetails/${raceid}`;
        navigate(link);
    };

    const handleClickToTeamsDetails = (teamid) => {
        const link = `/teamdetails/${teamid}`;
        navigate(link);
    };

    const items = [
        { path: "/", name: "F-1 Feeder" },
        { path: "/drivers", name: "Drivers" },
        { path: `/driverdetails/${params.id}`, name: `${driverDetails.Driver.givenName} ${driverDetails.Driver.familyName}` }
    ];

    return <div className="component-body">
        <div className="header">
            <F1Breadcrumbs items={items} />
        </div>

        <div className="table-flex">
            <div>
                <div className="detailCard sticky-card">

                    <div>
                        <table>
                            <tbody>
                                <tr >
                                    <td rowSpan="2" style={{ marginBottom: 'auto' }}>
                                        <img src={getDriverImage(params.id)} alt="Driver Image" className="driverImg" />
                                    </td>
                                    <td style={{ verticalAlign: 'middle' }}>
                                        <p><Flag country={getFlagCode(flags, driverDetails.Driver.nationality)} /> </p>
                                        <h3>{driverDetails.Driver.givenName}</h3>
                                        <h3>{driverDetails.Driver.familyName}</h3>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>

                    <table>
                        <tbody>
                            <tr>
                                <td>Country: </td>
                                <td>{driverDetails.Driver.nationality}</td>
                            </tr>
                            <tr>
                                <td>Team: </td>
                                <td>{driverDetails.Constructors[0].name}</td>
                            </tr>
                            <tr>
                                <td>Birth: </td>
                                <td>{driverDetails.Driver.dateOfBirth}</td>
                            </tr>
                            <tr>
                                <td>Biography: </td>
                                <td className="external"><a target='_blank' rel='noopener noreferrer' href={driverDetails.Driver.url}><img src={detailslink} style={{ width: 15, height: 15 }} /></a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th colSpan="5">Formula 1 {year} Results</th>
                        </tr>
                        <tr>
                            <th>Round</th>
                            <th>Grand Prix</th>
                            <th>Team</th>
                            <th>Grid</th>
                            <th>Race</th>
                        </tr>
                    </thead>
                    <tbody>
                        {driverRaces.map((race) => (
                            <tr key={race.raceName}>
                                <td>{race.round}</td>
                                <td className="clickable" onClick={() => handleClickToRacesDetails(race.round)}>
                                    {race.Circuit.Location.country == "Azerbaijan" ? (<img src={"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/AZ.svg"} alt="AZ flag" />) : (<Flag country={getFlagCode(flags, race.Circuit.Location.country)} />)} {race.raceName}
                                </td>
                                <td className="clickable2" onClick={() => handleClickToTeamsDetails(race.Results[0].Constructor.constructorId)}>
                                    {race.Results[0].Constructor.name}
                                </td>
                                <td>{race.Results[0].grid}</td>

                                <td style={{ backgroundImage: getCellColorCoded(race.Results[0].position) }}>{race.Results[0].position}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>;
};

export default F1DriverDetails;