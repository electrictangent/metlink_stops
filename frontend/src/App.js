import { useState, useEffect } from 'react';

// Font Awesome icon imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWheelchair } from '@fortawesome/free-solid-svg-icons';
const wheelchairIcon = <FontAwesomeIcon icon={faWheelchair} />


function DepartureRow({ singleDeparture }) {
  // TODO: Add code to represent arrival time in mintues from now
  // below is only a sketch - there are many more variables involved in estimated departure times
  // probably is best to seperate into own function
  const dateTime = new Date(singleDeparture.arrival.aimed);
  const dateTimeNow = new Date();
  const minsAway = String(Math.round((dateTime - dateTimeNow)*0.001/60));

  // Set the accesible icon
  let accesible = "";
  if(singleDeparture.wheelchair) {
    accesible = wheelchairIcon;
  }


  return (
    <tr>
      <td>{ singleDeparture.serviceID }</td>
      <td>{ singleDeparture.direction }</td>
      <td>{ minsAway + " mins" }</td>
      <td>{ singleDeparture.status }</td>
      <td>{ accesible }</td>
    </tr>
  );
}

function DepartureTable({ departures }) {
  const rows = [];

  departures.forEach((singleDeparture) => {
    rows.push(<DepartureRow singleDeparture={singleDeparture} key={singleDeparture.tripID} />);
  })

  return(
    <table className='table'>
      <thead>
        <tr>
          <th>Service ID</th>
          <th>Direction</th>
          <th>Arriving in</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

function SearchBar({ onSetStopNum, onSetStopNumSent }) {
  const [searchStr, setSearchStr] = useState('5515');

  function handleSubmit(e) {
    e.preventDefault();
    onSetStopNum(searchStr);
    onSetStopNumSent(true);
    // console.log(stopNum);
  }

//<button className="col-sm-4 btn btn-primary" type="submit" onClick={handleClick}>Search</button>
  return (
    <form onSubmit={handleSubmit}>
      <div className='row'>
        <div className='col-sm-8'>
          <input 
            type="text" 
            value={searchStr}
            onChange={(e) => setSearchStr(e.target.value) }
            placeholder="Enter Stop number" 
            className='form-control' />
        </div>

        <div className='col-sm-4'>
          <input className="btn btn-primary search-button" type="submit" value="Get Stop" />
        </div>
      </div>
    </form>
  );
}


function HeaderDepartureTable(){
  const [departures, setDepartures] = useState([]);
  const [stopNumVal, setStopNum] = useState('5515');
  const [stopNumSent, setStopNumSent] = useState(false);
  const stopName = "test";

  useEffect(() => {
        const urlAPI = 'http://localhost:8080/' + stopNumVal; // backend API address
        if(departures.length && !stopNumSent) {
          
          return;
        }
        const fetchData = async () => {
          try {
            const response = await fetch(urlAPI);
            const json = await response.json();
            setDepartures(json);
            setStopNumSent(false);
            console.log("success");
          } catch (error) {
            console.log("error", error);
          }
        };
    
        fetchData();
    }, [departures, stopNumSent]);

  return (
    <>
    <div>
      <h1>Metlink Stops</h1>
        <SearchBar onSetStopNum={ setStopNum } onSetStopNumSent={ setStopNumSent } />
        <br />
      <h2>Stop {stopNumVal} - {stopName}</h2>
    </div>

    <DepartureTable departures={departures} />
    </>
  );
}

export default function App() {  
  return (
    <HeaderDepartureTable />
  );
}

