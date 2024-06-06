import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';
import { getFlagCode } from "../helpers";
import Loader from "./Loader";
import F1Breadcrumbs from "./F1Breadcrumbs";



const F1AllRaces = (props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [allRaces, setAllRaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const flags = props.flags;
    const year = props.year;

    const getAllRaces = async () => {
        try {
            const url = `https://ergast.com/api/f1/${props.year}/results/1.json`;
            const allRacesResponse = await axios.get(url);
            const allRacesData = allRacesResponse.data.MRData.RaceTable.Races;
            setAllRaces(allRacesData);
            setIsLoading(false);
        } catch (error) {
            console.log("Something went wrong : ", error);
            navigate("/");
        }
    };

    const handleClickDetails = (id) => {
        const link = `/racedetails/${id}`;
        navigate(link);
    };

    const handleClickToDriverDetails = (driverid) => {
        const link = `/driverdetails/${driverid}`;
        navigate(link);
    };

    useEffect(() => {
        setIsLoading(true);
        getAllRaces();
    }, [year]);

    if (isLoading) {
        return <Loader />;
    };

    const filteredResults = allRaces.filter(race => {
        const grandPrix = race.raceName.toLowerCase();
        const circuitName = race.Circuit.circuitName.toLowerCase();
        return grandPrix.includes(searchTerm.toLowerCase()) || circuitName.includes(searchTerm.toLowerCase());
    });

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const items = [
        { path: "/", name: "F-1 Feeder" },
        { path: "/races", name: "Races" }
    ];

    return <div className="component-body">
        <div className="header">
            <F1Breadcrumbs items={items} />
            <input
                type="text"
                placeholder="Search by Grand Prix or Circuit"
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>

        <div className="table-wrapper">

            <h3>Race Calendar - {year}</h3>


            <table className="table">
                <thead>
                    <tr>
                        <th>Round</th>
                        <th>Grand Prix</th>
                        <th>Circuit Name</th>
                        <th>Date</th>
                        <th>Winner</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredResults.map((race) => (
                        <tr key={race.Circuit.circuitId}>
                            <td>{race.round}</td>
                            <td className="clickable" onClick={() => handleClickDetails(race.round)}>
                                {race.Circuit.Location.country == "Azerbaijan" ? (<img src={"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/AZ.svg"} className="azer" alt="AZ flag" />) : (<Flag country={getFlagCode(flags, race.Circuit.Location.country)} />)}
                                <span >
                                    {race.raceName}
                                </span>
                            </td>
                            <td>{race.Circuit.circuitName}</td>
                            <td>{race.date}</td>
                            <td className="clickable" onClick={() => handleClickToDriverDetails(race.Results[0].Driver.driverId)}>
                                <Flag country={getFlagCode(flags, race.Results[0].Driver.nationality)} />
                                {race.Results[0].Driver.familyName}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>;

    </div>;
};

export default F1AllRaces;