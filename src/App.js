import React from 'react';


function DepartureRow({ singleDeparture }) {
  return (
    <tr>
      <td>{ singleDeparture.service_id }</td>
      <td>{ singleDeparture.depart_time }</td>
    </tr>
  );
}

function DepartureTable({ departures }) {
return(
  
)
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
    "stop_id": "5515",
    "service_id": "14",
    "direction": "outbound",
    "operator": "NBM",
    "origin": {
        "stop_id": "7224",
        "name": "Kilbirnie-B"
    },
    "destination": {
        "stop_id": "4136",
        "name": "Wilton"
    },
    "delay": "PT4M26S",
    "vehicle_id": "5750",
    "name": "MannersSt at Cuba-A",
    "arrival": {
        "aimed": "2023-02-22T19:49:00+13:00",
        "expected": "2023-02-22T19:53:26+13:00"
    },
    "departure": {
        "aimed": "2023-02-22T19:49:00+13:00",
        "expected": "2023-02-22T19:55:01+13:00"
    },
    "status": "delayed",
    "monitored": true,
    "wheelchair_accessible": true,
    "trip_id": "14__0__183__NBM__17__5__17__5_1"
  },
  {
    "stop_id": "5515",
    "service_id": "2",
    "direction": "outbound",
    "operator": "NBM",
    "origin": {
        "stop_id": "7042",
        "name": "SeatounPk-HectorSt"
    },
    "destination": {
        "stop_id": "5332",
        "name": "Karori"
    },
    "delay": "-PT8S",
    "vehicle_id": "5739",
    "name": "MannersSt at Cuba-A",
    "arrival": {
        "aimed": "2023-02-22T19:56:00+13:00",
        "expected": "2023-02-22T19:55:52+13:00"
    },
    "departure": {
        "aimed": "2023-02-22T19:56:00+13:00",
        "expected": "2023-02-22T19:55:52+13:00"
    },
    "status": "ontime",
    "monitored": true,
    "wheelchair_accessible": true,
    "trip_id": "2__0__323__NBM__86__1__86__1_1"
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

