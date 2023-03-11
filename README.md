# Metlink Stops

Simple react app that shows stop departures based on stop number/ID

![App Screenshot](preview.png)

Created using `create-react-app`. Data for Metlink stop departures provided by the APIs avaliable at https://opendata.metlink.org.nz/

## Try my app!

An example of this app in action can be found at https://mldemo.electrictangent.com

## Configuration

### Backend config
To use backend server, you'll need to create a JSON config file. An example config file is given below. You must name the file `config.json` and it must be in the same folder as `app.py`.

`./backend/config.json`:

```JSON
{
    "baseURL" : "https://api.opendata.metlink.org.nz/v1/stop-predictions?stop_id=",
    "staticStopInfoURL" : "https://api.opendata.metlink.org.nz/v1/gtfs/routes?stop_id=",
    "apiKey" : "api-key-here"
}

```

To start backend API server, navigate to backend folder and use command `flask run`


### Frontend config
In the `./frontend/` folder, create a `.env` file with the following key:
```
REACT_APP_BACKEND_ADDR=http://backendaddr:port/
```

The address must point to your backend server.


## Credits

Icons provided by Font Awesome. CSS layout created using Bootstrap.