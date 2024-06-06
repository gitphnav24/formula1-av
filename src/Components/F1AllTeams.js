import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';
import { getFlagCode } from "../helpers";
import detailslink from '../img/link-icon.png';
import Loader from "./Loader";
import F1Breadcrumbs from "./F1Breadcrumbs";


const F1AllTeams = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [allTeams, setAllTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const flags = props.flags;
    const year = props.year;

    const getAllTeams = async () => {
        try {
            const allTeamsResponse = await axios.get(`https://ergast.com/api/f1/${year}/constructorStandings.json`);
            const allTeamsData = allTeamsResponse.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
            setAllTeams(allTeamsData);
            setIsLoading(false);
        } catch (error) {
            console.log("Something went wrong:", error);
            navigate("/");
        }
    };

    useEffect(() => {
        setIsLoading(true);
        getAllTeams();
    }, [year]);

    if (isLoading) {
        return <Loader />;
    };

    const handleClickDetails = (id) => {
        const teamlink = `/teamdetails/${id}`;
        navigate(teamlink);
    };

    const filteredTeams = allTeams.filter(team => {
        const teamName = team.Constructor.name.toLowerCase();
        return teamName.includes(searchTerm.toLowerCase());
    });

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const items = [
        { path: "/", name: "F-1 Feeder" },
        { path: "/teams", name: "Teams" }
    ];

    return (<div className="component-body">
        <div className="header">
            <F1Breadcrumbs items={items} />
            <input
                type="text"
                placeholder="Search by team name"
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>

        <div className="table-wrapper">
            <h3>Constructors Championship</h3>

            <table className="table">
                <thead>
                    <tr>
                        <th colSpan="4">Constructors Championship Standings - {year}</th>
                    </tr>
                    <tr>
                        <th>Position</th>
                        <th>Constructor Name</th>
                        <th>Details</th>
                        <th>Annual Points</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTeams.map((constructor) => (
                        <tr key={constructor.Constructor.constructorId}>
                            <td>{constructor.position}</td>
                            <td className="clickable"  onClick={() => handleClickDetails(constructor.Constructor.constructorId)}>
                                <Flag country={getFlagCode(flags, constructor.Constructor.nationality)} />
                                {constructor.Constructor.name}
                            </td>
                            <td className="clickable" >
                                <a target='_blank' rel='noopener noreferrer' href={constructor.Constructor.url}>
                                    Details
                                    <img src={detailslink} style={{ width: 15, height: 15, paddingLeft: 10 }} />
                                </a>
                            </td>
                            <td>{constructor.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
};

export default F1AllTeams;