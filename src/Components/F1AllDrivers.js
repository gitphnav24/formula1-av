import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';
import { getFlagCode } from "../helpers";
import Loader from './Loader';
import F1Breadcrumbs from "./F1Breadcrumbs";



const F1AllDrivers = (props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [allDrivers, setAllDrivers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const flags = props.flags;
    const year = props.year;

    const getAllDrivers = async () => {

        const allDriversUrl = `https://ergast.com/api/f1/${year}/driverStandings.json`;

        try {
            const allDriversResponse = await axios.get(allDriversUrl);
            const allDriversData = allDriversResponse.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
            setAllDrivers(allDriversData);
            setIsLoading(false);
        } catch (error) {
            console.log("Something went wrong : ", error);
            navigate("/");
        }
    };

    useEffect(() => {
        setIsLoading(true);
        getAllDrivers();
    }, []);

    if (isLoading) {
        return <Loader />
    };

    const handleClickDetails = (id) => {
        const link = `/driverdetails/${id}`;
        navigate(link);
    };

    const handleClickToTeamsDetails = (teamid) => {
        const link = `/teamdetails/${teamid}`;
        navigate(link);
    };

    const items = [
        { path: "/", name: "F-1 Feeder" },
        { path: "/drivers", name: "Drivers" }
    ];

    const filteredDriverStandings = allDrivers.filter(driver => {
        const fullName = `${driver.Driver.givenName} ${driver.Driver.familyName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return <div className="component-body">
        <div className="header">
            <F1Breadcrumbs items={items} />
            <input
                name="crumbs"
                type="text"
                placeholder="Search by driver name"
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>

        <div className="table-wrapper">
            <h3>Drivers Championship</h3>

            <table className="table">
                <thead>
                    <tr>
                        <th colSpan="4">
                            Drivers Championship Standings - {year}
                        </th>
                    </tr>
                    <tr>
                        <th>Position</th>
                        <th>Driver Name</th>
                        <th>Constructor</th>
                        <th>Annual Points</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDriverStandings.map((driver) => (
                        <tr key={driver.Driver.driverId} >
                            <td >{driver.position}</td>
                            <td className="clickable" onClick={() => handleClickDetails(driver.Driver.driverId)}>
                                <Flag country={getFlagCode(flags, driver.Driver.nationality)} />
                                <span >
                                    {`${driver.Driver.givenName} ${driver.Driver.familyName}`}
                                </span>
                            </td>
                            <td className="clickable" onClick={() => handleClickToTeamsDetails(driver.Constructors[0].constructorId)}>
                                {driver.Constructors[0].name}</td>
                            <td>{driver.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    </div>;
};

export default F1AllDrivers;