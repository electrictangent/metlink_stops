#!/usr/bin/env python3
# Backend Flask server that grabs departure data from Metlink Open Data (https://opendata.metlink.org.nz/)
# then parses it into a easier to use format

import sys

# Flask imports
from flask import Flask
from flask import Response
from flask_cors import CORS

# JSON API calling imports
import requests
import json
from requests.exceptions import HTTPError


# Flask setup
app = Flask(__name__)
CORS(app)


def fetchAPIdata(baseURL, stopID, apiKey):
    url = baseURL + str(stopID)
    print(url)
    headers = {
        'Accept': 'application/json',
        'x-api-key': str(apiKey)
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except HTTPError as http_err:
        return http_err.response.status_code
    except Exception as err:
        return err


def parseArrivalAndDepartureTimes(dictObject):
    text = '{'
    for key in dictObject:
        if type(dictObject[key]) == str:
            text += ' "{}" : '.format(key) + '"{}" ,'.format(dictObject[key])
        else:
            text += ' "{}" : '.format(key) + 'null ,'
    
    text = text[:-1] + '}'
    return text

def parseDirectionText(routeName, direction, routeList):
    # text = origin["name"] + " - " + destination["name"]
    # text = text.replace("\'", "")
    # text = text.replace("\"", "")

    for route in routeList:
        if route["route_short_name"] == routeName:
            if direction == "inbound":
                return route["route_long_name"]
            else:
                return route["route_desc"]

    return "sad"

def parseStatus(rawStatus):
    if rawStatus == None:
        return "Scheduled"
    elif rawStatus == "ontime":
        return "On Time"
    else:
        return rawStatus.capitalize()



# Grab response from Metlink API then serve
@app.route('/<stopID>')
def main(stopID):
    # Fetching departure predictions
    rawJSONfromMetlink = fetchAPIdata(baseURL=configParams["baseURL"], stopID=stopID, apiKey=configParams["apiKey"])
    # If metlink server does not recognize stop number or is down
    if type(rawJSONfromMetlink) != int:
        departuresList = rawJSONfromMetlink["departures"]
    else:
        return Response('[{"httpError": ' + str(rawJSONfromMetlink) + '}]', mimetype='application/json')

    # Fetching route info for stop
    rawJSONforRoutes = fetchAPIdata(baseURL=configParams["staticStopInfoURL"], stopID=stopID, apiKey=configParams["apiKey"])
    # If metlink server does not recognize stop number or is down
    if type(rawJSONforRoutes) != int:
        routeList = rawJSONforRoutes
    else:
        routeList = None




    text_response = '[\n'
    # Add stop name as first list entry
    text_response += '\t{"stopName": "' + departuresList[0]["name"] + '"},' 
    for singleTrip in departuresList:
        singleTripText = '\t{\n'
        # Add keys and values
        singleTripText += '\t\t"serviceID" : "' + singleTrip["service_id"] + '",\n'

        # singleTripText += '\t\t"direction" : "' + parseDirectionText(singleTrip["service_id"], singleTrip["direction"], routeList) + '",\n'
        singleTripText += '\t\t"direction" : "' + singleTrip["destination"]["name"] + '",\n'
        singleTripText += '\t\t"arrival" : ' + parseArrivalAndDepartureTimes(singleTrip["arrival"]) + ',\n'
        singleTripText += '\t\t"departure" : ' + parseArrivalAndDepartureTimes(singleTrip["departure"])  + ',\n'
        singleTripText += '\t\t"status" : "' + parseStatus(singleTrip["status"]) + '",\n'
        singleTripText += '\t\t"wheelchair" : ' + str(singleTrip["wheelchair_accessible"]).lower() + ',\n'
        singleTripText += '\t\t"tripID" : "' + str(singleTrip["trip_id"]) + '"\n'
        
        # Last item in array does not need a trailing comma for correct JSON
        if singleTrip == departuresList[-1]:
            singleTripText += '\t}\n'
        else:
            singleTripText += '\t},\n'

        # Add to response
        text_response += singleTripText
    

    # Finish text_response and make string JSON compliant
    text_response += "\n]"    
    return Response(text_response, mimetype='application/json')


if __name__ == "__main__":
    #test = fetchAPIdata(baseURL=sys.argv[1], stopID=sys.argv[2], apiKey=sys.argv[3])
    #print(test["departures"][0])
    configFile = open(sys.argv[1])
    configParams = json.load(configFile)

    app.run(host=configParams["host"], port=configParams["port"])

