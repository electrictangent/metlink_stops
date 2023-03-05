import { useState, useEffect, useRef } from "react";

// Font Awesome icon imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWheelchair,
  faClock,
  faStopwatch,
  faCalendar,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const wheelchairIcon = <FontAwesomeIcon icon={faWheelchair} />;
const stopwatchIcon = <FontAwesomeIcon icon={faStopwatch} />;
const clockIcon = <FontAwesomeIcon icon={faClock} />;
const calendarIcon = <FontAwesomeIcon icon={faCalendar} />;
const magnifyingGlass = <FontAwesomeIcon icon={faMagnifyingGlass} size="2x" />;
const xMark = <FontAwesomeIcon icon={faXmark} />;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function statusToIcon(status) {
  if (status === "On Time") {
    return " ";
  } else if (status === "Delayed") {
    return clockIcon;
  } else if (status === "Scheduled") {
    return calendarIcon;
  } else if (status === "Cancelled") {
    return xMark;
  }
}

function getTimeToDepart(arrival, departure) {
  const dateTimeNow = new Date();

  // If scheduled trip only, return aimed time for departure
  if (arrival.expected === null && departure.expected === null) {
    const dateTime = new Date(departure.aimed);

    return (
      String(dateTime.getHours()) +
      ":" +
      String(dateTime.getMinutes()).padStart(2, "0")
    );
  } else if (arrival.expected === null && departure.expected !== null) {
    // If scheduled trip is about to depart
    const dateTime = new Date(departure.expected);
    return (
      String(Math.round(((dateTime - dateTimeNow) * 0.001) / 60)) + " mins"
    );
  }

  // If trip is about to reach stop
  if (arrival.expected !== null) {
    const dateTime = new Date(arrival.expected);
    if (dateTimeNow < dateTime) {
      const dateTimeNow = new Date();
      const duemins = Math.round(((dateTime - dateTimeNow) * 0.001) / 60);
      if (duemins > 0) {
        return String(duemins) + " mins";
      } else {
        return "Delayed";
      }
    }
  }

  // Else, trip is at stop
  return "Due";
}

function LoadingSpinner() {
  return <span>Loading you stewpid</span>;
}

function DepartureRow({ singleDeparture }) {
  // Set the accesible icon
  let accesible = "";
  if (singleDeparture.wheelchair) {
    accesible = wheelchairIcon;
  }

  return (
    <tr className={singleDeparture.status === "Cancelled" ? "cancelled" : ""}>
      <td className="bold">
        {getTimeToDepart(singleDeparture.arrival, singleDeparture.departure)}
      </td>
      <td>
        {/* If cancelled, dont color route */}
        <div
          className="bold service-num"
          style={
            singleDeparture.status === "Cancelled"
              ? { background: "#686868", color: "#444444" }
              : {
                  background: singleDeparture.backcolor,
                  color: singleDeparture.forecolor,
                }
          }
        >
          {singleDeparture.serviceID}
        </div>
      </td>
      <td> {singleDeparture.direction} </td>
      <td>
        {" "}
        <span className="icons">
          <span
            className={singleDeparture.status === "Delayed" ? "delayed" : ""}
          >
            {statusToIcon(singleDeparture.status)}
          </span>
          {accesible}
        </span>{" "}
      </td>
    </tr>
  );
}

function DepartureTable({ departures }) {
  const rows = [];
  let i = 0;

  // Error handling
  // User opened web app for first time or nothing in search bar
  if (!departures.length) {
    return <h2>Enter a stop number in the searchbar.</h2>;
    // No data received
  } else if (departures[0] === "loading") {
    return <h2><LoadingSpinner /></h2>;
  } else if ("httpError" in departures[0]) {
    // API returns an error (e.g. stop id not found)
    return <h2>Stop not found or API down.</h2>;
  } else {
    departures.forEach((singleDeparture) => {
      // Ignore first entry as this entry contains stop name and no relevant trip data
      if (!("stopName" in singleDeparture)) {
        rows.push(
          <DepartureRow
            singleDeparture={singleDeparture}
            key={"ind" + String(i) + "_" + singleDeparture.tripID} // Sometimes the API will give duplicate tripIDs, the incrementor ensures all keys are unique.
          />
        );
        i += 1;
      }
    });

    return (
      <table className="table">
        <thead>
          <tr>
            <th>{stopwatchIcon}</th>
            <th>ID</th>
            <th></th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

function SearchBar({ onSetStopNum, onSetStopNumSent, searchStr, setSearchStr }) {

  function handleSubmit(e) {
    e.preventDefault();
    onSetStopNum(searchStr);
    onSetStopNumSent(true);
  }

  return (
    <div className="header">
      <div className="container">
        <br />
        <h1 className="center title">Metlink Stops</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={searchStr}
              onChange={(e) => setSearchStr(e.target.value)}
              placeholder="Enter Stop number"
              className="search-textbox form-control"
            />
            <span className="input-group-btn">
              <button className="btn btn-default search-button" type="submit">
                {" "}
                {magnifyingGlass}{" "}
              </button>
            </span>
          </div>
        </form>
        <br />
      </div>
    </div>
  );
}

function StopTitle({ stopNum, depName }) {
  return (
    <h2>
      {stopNum.toUpperCase()} &emsp; {depName}
    </h2>
  );
}

export default function App() {
  const [departures, setDepartures] = useState([]);
  const [stopNumVal, setStopNum] = useState("");
  const [stopNumSent, setStopNumSent] = useState(false);
  const [searchStr, setSearchStr] = useState("");

  // TODO: add error handling and auto refresh every 30s
  useEffect(() => {
    const urlAPI = "http://localhost:8080/" + stopNumVal; // backend API address

    const fetchData = async () => {
      // If we have already fetched the data and no request for a new data fetch sent
      if (!stopNumSent) {
        return;
      }
      if (searchStr === ""){
        setStopNumSent(false);

        return setDepartures([]);
        
      }
      try {
        setDepartures(["loading"]);
        setStopNumSent(false);
        const response = await fetch(urlAPI);
        const json = await response.json();
        setDepartures(json);

        console.log("success");
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [departures, stopNumSent, stopNumVal]);

  // Tell fetchData to fetch data every 30s
  useInterval(() => {
    setStopNumSent(true);
  }, 30000);

  return (
    <>
      <SearchBar onSetStopNum={setStopNum} onSetStopNumSent={setStopNumSent} searchStr={searchStr} setSearchStr={setSearchStr} />

      <div className="container">
        <br />
        {departures.length ? <StopTitle stopNum={stopNumVal} depName={departures[0].stopName} /> : stopNumSent ? <LoadingSpinner /> : ""}
        <DepartureTable departures={departures} />
      </div>
    </>
  );
}
