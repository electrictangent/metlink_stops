import React from 'react';


function SearchBar() {

  function handleClick() {
    console.log('hello');
  }

  return (
    <form>
      <input 
      type="text" 
      placeholder="Search..." />

      <button onClick={handleClick}>Search</button>

    </form>
  );
}

function Header({ stop_num, stop_name }) {
  return (
    <div>
    <h1>Metlink Stops</h1>
    <SearchBar />
    <h2>Stop {stop_num} - {stop_name}</h2>
    </div>
  );
}

const EXAMPLE_TABLE = [
  {"service_id": 1, "time_arrival": "timevalue", "time_arrival": "timevalue"},
  {"service_id": 1, "time_arrival": "timevalue", "time_arrival": "timevalue"},
]


export default function App() {

  return (
    <Header stop_name={"Lambton Quay"} stop_num={"5515"}/>
  );
}

