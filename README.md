# Metlink Stops

Simple react app that shows stop departures based on stop number/ID

![App Screenshot](preview.png)

Created using `create-react-app`. Data for Metlink stop departures provided by the APIs avaliable at https://opendata.metlink.org.nz/

## Try my app!

An example of this app in action can be found at https://get a link.

## Installation

### Backend config
To use backend server, you'll need to create a JSON config file. An example config file is given below.

`./backend/config.json`:

```JSON
{
    "baseURL" : "https://api.opendata.metlink.org.nz/v1/stop-predictions?stop_id=",
    "staticStopInfoURL" : "https://api.opendata.metlink.org.nz/v1/gtfs/routes?stop_id=",
    "apiKey" : "api-key-here",
    "host": "localhost",
    "port": 8080
}

```

To start backend API server, use command `./api-server.py /path/to/config`.


### Frontend config
In the `./frontend/` folder, create a `.env` file with the following key:
```
REACT_APP_BACKEND_ADDR=http://backendaddr:port/
```


## Credits

Icons provided by Font Awesome. CSS layout created using Bootstrap.