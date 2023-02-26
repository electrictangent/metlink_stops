#!/usr/bin/env python3
# Backend Flask server that grabs departure data from Metlink Open Data (https://opendata.metlink.org.nz/)
# then parses it into a easier to use format

#   {
#     "service_id": "2",
#     "direction": "Mirarmar - Karori",
#     "arrival": {
#       "aimed": "2023-02-26T14:11:35+13:00",
#       "expected": null
#     },
#     "departure": {
#         "aimed": "2023-02-26T14:10:00+13:00",
#         "expected": null
#     },
#     "status": "ontime",
#     "wheelchair": false,
#     "tripID": "AX__0__853__MNM__8052__1__8052__1_1"
#   },
#   {
#     "service_id": "3",
#     "direction": "Lyall Bay - Wellington Station",
#     "arrival": {
#       "aimed": "2023-02-26T13:53:00+13:00",
#       "expected": "2023-02-26T14:10:20+13:00"
#     },
#     "departure": {
#         "aimed": "2023-02-26T13:53:00+13:00",
#         "expected": "2023-02-26T14:10:20+13:00"
#     },
#     "status": "ontime",
#     "wheelchair": true,
#     "tripID": "27__1__710__TZM__3583__3583_1"
#   }

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


def getStopData(baseURL, stopID, apiKey):
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
        return http_err
    except Exception as err:
        return err


# Grab response from Metlink API then serve
@app.route('/<stopID>')
def main(stopID):
    rawJSONfromMetlink = getStopData(baseURL=configParams["baseURL"], stopID=stopID, apiKey=configParams["apiKey"])
    departures = rawJSONfromMetlink["departures"]
    
    text_response = "{\"list\" : ["
    for i in departures:
        text_response += str(i)
        text_response += ",\n"
    
    text_response += "]}"
    text_response = text_response.replace("'", "\"")

    return Response(text_response, mimetype='application/json')


if __name__ == "__main__":
    #test = getStopData(baseURL=sys.argv[1], stopID=sys.argv[2], apiKey=sys.argv[3])
    #print(test["departures"][0])
    configFile = open(sys.argv[1])
    configParams = json.load(configFile)

    app.run(host=configParams["host"], port=configParams["port"])

