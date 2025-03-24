
look at index.js

running the server.js will show the direction and places along the route from origin to destination, which is done all in search_route(). 

The origin and destination are set in the main() function of index.js

Currently, the search query doesn't matter becuase this file uses typesearch that shows every restraunt along the way. 

Anyone is welcome to experiement with reduceCoordinates() and generatePointsAlongLine() which is the function that calculates the midpoints along the route for the API calls. 

This file currently makes Type Search, but if you want to work with textsearch you can replace the fetchNearbyPlaces() function here with the same function written in Week 3 or Week 5. Note that Week 3 text search is not restricted (but a circle), and the Week 5 is restricted but not a cirlce (must be rectangle).

Jason: The fetchNearbyPlaces() function in index.js is the one that makes the placesAPI call, and so all the information about the places could be extracted from there. 

Chris: If you can add autocomplete, just add another js function and call it before search_route() in main. Make sure to set the output of your function to ORIGIN and DESTINATION.

Syeda: If you wanna try the line of best fit the function to replace is the reduceCoordinates() and generatePointsAlongLine(). These functions take a 2D array of coordinates [[lat, lng], [lat, lng]], and return a 2D array of coordinates so if a line of best fit is found, make sure that the returned value is the appropriate coordinates that was to be extracted from that function. 


# Project Setup Instructions

Before running the project, make sure you have **Node.js** installed. Then, install the necessary dependencies:

### Install dependencies:
```bash
npm install express
npm install dotenv
npm install nodemon
```
make a local .env file and put your own API key

it should look like the .env_sample file

then run:
```bash
nodemon server.js
```
*DO NOT UPLOAD YOUR .env FILE TO GITHUB*

Instead, make a .gitignore file and list your .env file in it (look at my .gitignore for reference)