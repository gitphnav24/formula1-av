import Flag from 'react-flagkit';
import { getFlagCode, getCellColorCoded } from "../helpers";

const TDPointsTable = ({ teamDrivers, driverRacePoints, teamPointsPerRace, allRaces, handleClickToRacesDetails, flags }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Round</th>
                    <th>Grand Prix</th>
                    {teamDrivers.map((driver) => (
                        <th key={driver.Driver.driverId}>{driver.Driver.familyName}</th>
                    ))}
                    <th>Team Points</th>
                </tr>
            </thead>
            <tbody>
                {allRaces.map((race) => (
                    <tr key={race.round}>
                        <td>{race.round}.</td>
                        <td onClick={() => handleClickToRacesDetails(race.round)}>
                            {race.Circuit.Location.country === 'Azerbaijan' ? (
                                <img src="https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/AZ.svg" alt="AZ flag" />
                            ) : (
                                <Flag country={getFlagCode(flags, race.Circuit.Location.country)} />
                            )}
                            <span>{race.Circuit.circuitName}</span>
                        </td>
                        {teamDrivers.map((driver) => (
                            <td key={driver.Driver.driverId}>
                                {driverRacePoints[driver.Driver.driverId] &&
                                    driverRacePoints[driver.Driver.driverId][race.round] ? (
                                    driverRacePoints[driver.Driver.driverId][race.round]
                                ) : (
                                    0
                                )}
                            </td>
                        ))}
                        <td>{teamPointsPerRace[race.round] || 0}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TDPointsTable;