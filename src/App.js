import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import F1AllDrivers from './Components/F1AllDrivers';
import F1AllTeams from './Components/F1AllTeams';
import F1AllRaces from './Components/F1AllRaces';
import F1Menu from './Components/F1Menu';
import F1Welcome from './Components/F1Welcome';
import F1DriverDetails from './Components/F1DriverDetails';
import F1AllTeamsDetails from './Components/F1AllTeamsDetails';
import F1AllRaceDetails from './Components/F1AllRaceDetails';
import axios from "axios";
import "./scss/style.scss";

function App() {

  const [allFlags, setAllFlags] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2013);

  useEffect(() => {
    getAllFlags();
    {localStorage.length==1 ? setSelectedYear(localStorage.year) : setSelectedYear(2013)};
  }, []);

  const getAllFlags = async () => {
    const flagUrl = `https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json`;
    try {
      const allFlagsResponse = await axios.get(flagUrl);
      setAllFlags(allFlagsResponse.data);
    } catch (error) {
      console.log("Axios error");
    };
  };

  const handleChangeYear = (e) => {
    setSelectedYear(e.target.value);
    localStorage.setItem("year", `${e.target.value}`)
  };



  return (
    <div className='appBody'>
      <Router>
        <div>
          <F1Menu/>
        </div>
        <Routes>
          <Route path='/' element={<F1Welcome year={selectedYear} handler={handleChangeYear}/>} />
          <Route path='/drivers' element={<F1AllDrivers year={selectedYear} flags={allFlags} />} />
          <Route path='/driverdetails/:id' element={<F1DriverDetails year={selectedYear} flags={allFlags} />} />
          <Route path='/teams' element={<F1AllTeams year={selectedYear} flags={allFlags} />} />
          <Route path='/teamdetails/:id' element={<F1AllTeamsDetails year={selectedYear} flags={allFlags} />} />
          <Route path='/races' element={<F1AllRaces year={selectedYear} flags={allFlags} />} />
          <Route path='/racedetails/:id' element={<F1AllRaceDetails year={selectedYear} flags={allFlags} />} />
        </Routes>
      </Router>
    </div>
  );





}

export default App;
