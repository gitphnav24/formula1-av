import Flag from 'react-flagkit';
import { getFlagCode, getCellColorCoded } from "../helpers";

const TDPositionTable = ({ teamDrivers, driverRacePosition, teamPointsPerRace, allRaces, handleClickToRacesDetails, flags }) => {
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
                <span>{race.raceName}</span>
              </td>
              {teamDrivers.map((driver) => {
							   
															
										
													
																					 
                const position = driverRacePosition[driver.Driver.driverId]?.[race.round] || 0;
                const positionClass =
                  position === 0
                    ? 'position-0'
                    : position > 10
                    ? 'position-greater-than-10'
                    : `position-${position}`;
  
                return (
                  <td
                    key={driver.Driver.driverId}
                    style={{
                      backgroundColor: position === 0 ? 'turquoise' : position > 10 ? 'teal' : '',
                    }}
                    className={`position-box ${positionClass}`}
                  >
                    {position}
																										
																							
										
                  </td>
                );
              })}
              <td>{teamPointsPerRace[race.round] || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  export default TDPositionTable;