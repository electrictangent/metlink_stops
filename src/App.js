import React from 'react';

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
      <td>{ singleDeparture.service_id }</td>
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

function SearchBar() {

  function handleClick() {
    console.log('hello');
  }

  return (
    <form>
      <div className='row'>
        <div className='col-sm-8'>
          <input 
            type="text" 
            placeholder="Search..." 
            className='form-control'
          />
        </div>

          <button className="col-sm-4 btn btn-primary" type="submit" onClick={handleClick}>Search</button>
      </div>
    </form>
  );
}

function Header({ stopNum, stopName }) {
  return (
    <div>
      <h1>Metlink Stops</h1>
      <SearchBar />
      <br />
      <h2>Stop {stopNum} - {stopName}</h2>
    </div>
  );
}

const EXAMPLE_TABLE = [
  {
    "service_id": "2",
    "direction": "Mirarmar - Karori",
    "arrival": {
      "aimed": "2023-02-26T14:11:35+13:00",
      "expected": null
    },
    "departure": {
        "aimed": "2023-02-26T14:10:00+13:00",
        "expected": null
    },
    "status": "ontime",
    "wheelchair": false,
    "tripID": "AX__0__853__MNM__8052__1__8052__1_1"
  },
  {
    "service_id": "3",
    "direction": "Lyall Bay - Wellington Station",
    "arrival": {
      "aimed": "2023-02-26T13:53:00+13:00",
      "expected": "2023-02-26T14:10:20+13:00"
    },
    "departure": {
        "aimed": "2023-02-26T13:53:00+13:00",
        "expected": "2023-02-26T14:10:20+13:00"
    },
    "status": "ontime",
    "wheelchair": true,
    "tripID": "27__1__710__TZM__3583__3583_1"
  }
]


export default function App() {

  return (
    <>
    <Header stopName={"Lambton Quay"} stopNum={"5515"}/>
    <DepartureTable departures={EXAMPLE_TABLE} />
    </>

  );
}

