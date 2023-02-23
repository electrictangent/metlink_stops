#!/usr/bin/env python3
# Simple JSON API backend to practise React
import sys
from flask import Flask
from flask import Response
import pandas as ps
  
app = Flask(__name__)

# Grab response from file then serve

@app.route('/5515')
def stop1():
    json_response = open('5515_json_response.json', 'r')
    json_response = json_response.read()
    return Response(json_response, mimetype='application/json')

@app.route('/5516')
def stop2():
    json_response = open('5516_json_response.json', 'r')
    json_response = json_response.read()
    return Response(json_response, mimetype="application/json")

if __name__ == "__main__":
    app.run(host=sys.argv[1], port=sys.argv[2])

