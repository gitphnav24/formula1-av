import { getAllYears } from "../helpers";

const F1Welcome = (props) => {

    const years = getAllYears();

    return <div className="component-body welcome">
        <h1>Welcome : F1 FEEDER</h1>

{/* 
        <p>The <span>"Drivers"</span> button displays the races each driver participated in and the number of races they drove. By clicking on a driver's name, you can access more detailed information about their biography. Similarly, clicking on a specific race provides additional insights and details.</p>
        <p>The <span>"Teams"</span> button showcases constructor championships and offers detailed information about racing teams.</p>
        <p>The <span>"Races"</span>" button presents the race calendar for the selected year, including details about each round, Grand Prix, circuit, date, and the winner of each race.</p> */}


        <div className="buttons">
            {/* <h2>Select The Year:</h2> */}
            <select size="1" defaultValue={props.year} onChange={props.handler}>
                {years.map(year => (
                    <option key={year}
                        value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>


        <div className="buttons">
            {/* <h2>Clear Local Storage:</h2> */}
            <input type="button" value="Clear Local Storage" onClick={() => localStorage.clear()} />;
        </div>
{/* 
        <img src={require(`../img/welcome.png`)} alt="F1Feeder" /> */}

        {/* <img src={require(`../img/monaco1933.jpg`)} alt="Background" /> */}

    </div>

}

export default F1Welcome;


