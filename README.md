# BiteRoute

### Instructions before launching:

navigate to the webapp folder and create an .env file with variables:

```js
VITE_GOOGLE_MAPS_API_KEY= API-KEY
VITE_FIREBASE_API_KEY= API-KEY
```
the actual API keys were provided in the email we sent you. 


## If launching the first time, install the following beforehand:

  npm install react-router-dom
  npm install firebase
  npm install tailwindcss @tailwindcss/vite
  npm install @react-google-maps/api

## How to launch the web app

  cd webapp
  npm install
  npm run dev


## Once launched, log in:
Sign in with your google account to access the settings, which contains your history and preferences. Otherwise, history is not recorded and preferences are inaccessible.

## Use of Application
The purpose of our application is to search for places along the route. Below describes each feature to help users navigate as needed.

## Features:
-The search box contains five distinct entries: origin as the starting point, destination as the ending point, search for the food of interest, travel for the method of transport, and sort by for selecting what restaurants users wish to view first (e.g. rating prioritizes highly rated food places). Only addresses provided by the Autocomplete are valid. Make sure all fields are filled in order to search.
- The map itself displays the route and the options along the route when search is completed. Each food place is represented by a blue marker. Clicking a place turns the marker red for emphasis, and their info window is revealed.
- The sidebar on the left hand side displays each place along the route. It is ordered using the "sort by" option inside the search box. Upon clicking a place, information such as rating and review count is displayed. Clicking this place again closes its associated info window.
- If signed into Google, you will see your history and any additional preferences. For history, you can select a previous route, and you will be transferred to the main page where your origin, destination, and mode of travel are prefilled. You will still need to press 'Search' for it to go through. The preferences (vegetarian, halal, vegan) are implemented under the hood, so if user enters pizza but specifies vegetarian, this information is internally appended such that only those places that offer the preference are shown to the user.
- Shrinking & Expanding shifts things around according to screen size. When small enough, website enters mobile view. In this state, showing the list closes the search box, but hiding it shows the search box.  In other words, you can toggle between showing the search control and the list of places. 
- Search Distance is currently limited to 15 miles because long distance routes use a lot of API calls. Please try shorter routes first (e.g. Hunter College to Penn Station)