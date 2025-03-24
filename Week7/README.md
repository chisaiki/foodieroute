
look at index.js

running the server.js will show the direction and places along the route from origin to destination, which is done all in search_route(). 

The origin and destination are set in the main() function of index.js

Currently, the search query doesn't matter becuase this file uses typesearch that shows every restraunt along the way. 

Jason: The fetchNearbyPlaces() function in index.js is the one that makes the placesAPI call, and so all the information about the places could be extracted from there. 

Anyone is welcome to experiement with reduceCoordinates() and generatePointsAlongLine() which is the function that calculates the midpoints along the route for the API calls. 

This file currently makes Type Search, but if you want to work with textsearch you can replace the fetchNearbyPlaces() function here with the same function written in Week 3 or Week 5. Note that Week 3 text search is not restricted (but a circle), and the Week 5 is restricted but not a cirlce (must be rectangle).


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