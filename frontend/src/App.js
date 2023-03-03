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

  // background color can be part of API response
  const backgroundColor = "#12043f"
  return (
    <tr className={singleDeparture.status === "Cancelled" ? 'cancelled' : ''}>
      <td className='bold'>{ minsAway + " mins" }</td>
      <td> 
        <div className='bold service-num' style={{ background : backgroundColor}} >{ singleDeparture.serviceID }</div>
      </td>  
      <td> { singleDeparture.direction } </td>
      <td> <span className={singleDeparture.status === "Delayed" ? 'delayed' : ''}>{ statusToIcon(singleDeparture.status) }</span> { accesible }</td>
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
    // console.log(stopNum);
  }

//<button className="col-sm-4 btn btn-primary" type="submit" onClick={handleClick}>Search</button>
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
      <h2>{stopNumVal} &emsp; {stopName}</h2>
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

