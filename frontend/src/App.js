import { useState, useEffect } from 'react';

// Font Awesome icon imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWheelchair, faClock, faStopwatch, faCalendar, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

const wheelchairIcon = <FontAwesomeIcon icon={faWheelchair} />
const stopwatchIcon = <FontAwesomeIcon icon={faStopwatch} />
const clockIcon = <FontAwesomeIcon icon={faClock} />
const calendarIcon = <FontAwesomeIcon icon={faCalendar} />
const magnifyingGlass = <FontAwesomeIcon icon={faMagnifyingGlass} />
const xMark = <FontAwesomeIcon icon={faXmark} />

function statusToIcon(status) {
  if(status === "On Time"){
    return " ";
  } else if( status==="Delayed" ){
    return clockIcon
  } else if( status==="Scheduled" ){
    return calendarIcon
  } else if( status==="Cancelled"){
    return xMark
  }
}

function getTimeToDepart(arrival, departure) {
  // TODO: Add code to represent arrival time in mintues from now
  // below is only a sketch - there are many more variables involved in estimated departure times
  //   "arrival": {
  //     "expected": null
  // },
  // "departure": {
  //     "aimed": "2023-03-04T15:14:00+13:00",
  //     "expected": null
  // },
  const dateTimeNow = new Date();

  // If scheduled trip only, return aimed time for departure
  if(arrival.expected === null && departure.expected === null){
    const dateTime = new Date(departure.aimed);

    return String(dateTime.getHours()) + ":" + String(dateTime.getMinutes()).padStart(2, '0');
  } else if(arrival.expected === null && departure.expected !== null){
    // If scheduled trip is about to depart
    const dateTime = new Date(departure.expected);
    return String(Math.round((dateTime - dateTimeNow)*0.001/60)) + " mins";
  }

  // If trip is about to reach stop
  if (arrival.expected !== null) {
    const dateTime = new Date(arrival.expected)
    if (dateTimeNow < dateTime) {
      const dateTimeNow = new Date();
      return String(Math.round((dateTime - dateTimeNow) * 0.001 / 60)) + " mins";
    }
  }

  // Else, trip is at stop
  return "Due"
}

function DepartureRow({ singleDeparture }) {


  // Set the accesible icon
  let accesible = "";
  if(singleDeparture.wheelchair) {
    accesible = wheelchairIcon;
  }

  return (
    <tr className={singleDeparture.status === "Cancelled" ? 'cancelled' : ''}>
      <td className='bold'>{ getTimeToDepart(singleDeparture.arrival, singleDeparture.departure) }</td>
      <td> 
        {/* If cancelled, dont color route */}
        <div className='bold service-num' style={singleDeparture.status === "Cancelled" ? { background : "#686868", color : "#444444" } : {background : singleDeparture.backcolor, color : singleDeparture.forecolor}} >{ singleDeparture.serviceID }</div>
      </td>  
      <td> { singleDeparture.direction } </td>
      <td> <span className={singleDeparture.status === "Delayed" ? 'delayed' : ''}>{ statusToIcon(singleDeparture.status) }</span> { accesible }</td>
    </tr>
  );
}

function DepartureTable({ departures }) {
  const rows = [];

  departures.forEach((singleDeparture) => {
    // Ignore first entry as this entry contains stop name and no relevant trip data
    if(!("stopName" in singleDeparture)){
      rows.push(<DepartureRow singleDeparture={singleDeparture} key={singleDeparture.tripID} />);
    }
  })

  return(
    <table className='table'>
      <thead>
        <tr>
          <th>{stopwatchIcon}</th>
          <th>ID</th>
          <th></th>
          <th>Status</th>
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
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='input-group'>
        <input
          type="text"
          value={searchStr}
          onChange={(e) => setSearchStr(e.target.value)}
          placeholder="Enter Stop number"
          className='search-textbox form-control' />
        <span className='input-group-btn'>
          <button className="btn btn-default search-button" type="submit"> {magnifyingGlass} </button>
        </span>
      </div>
    </form>
  );
}


function HeaderDepartureTable(){
  const [departures, setDepartures] = useState([]);
  const [stopNumVal, setStopNum] = useState('5515');
  const [stopNumSent, setStopNumSent] = useState(false);
  // const stopName = "test";
  let stopNumText = stopNumVal;

  // TODO: add error handling and auto refresh every 30s
  useEffect(() => {
    const urlAPI = 'http://localhost:8080/' + stopNumVal; // backend API address
    if (departures.length && !stopNumSent) {

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
  }, [departures, stopNumSent, stopNumVal]);

  return (
    <>
    <div className='header'>
      <div className='container'>
        <br />
        <h1 className='center title'>Metlink Stops</h1>
        <SearchBar onSetStopNum={ setStopNum } onSetStopNumSent={ setStopNumSent } />
        <br />
      </div>
    </div>
    <div className='container'>
      <br />
      <h2>{stopNumText.toUpperCase()} &emsp; {departures.length ? departures[0].stopName : "Fetching stop name"}</h2>
      <DepartureTable departures={departures} />
    </div>
    </>
  );
}

export default function App() {  
  return (
    <HeaderDepartureTable />
  );
}

