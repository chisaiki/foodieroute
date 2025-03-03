

import { Link } from "react-router-dom";
import "../styles/temp.css"
// import PropTypes from "prop-types"; // Import PropTypes
import {AuthView} from "../../config/auth";

export default function NavigationButtons(){
  
  return(
      <div id ="nav-bar " className="temp-nav-bar2">
          {SingleButton("Home")}
          <div className="flex justify-between items-center gap-8">
            <div><AuthView/></div>
            {SingleButton("Settings")}
          </div>

          {/* <SingleButton button="Home"/> */}
          {/* <SingleButton button="Settings"/> */}
          
      </div>
  );
}

//function that returns the html code for a button based on the string passed in 
function SingleButton(button : string){
  const nameToData = 
  {
      'Home' : {
          text : 'Food Route',
          link : '/'
      },
      'Settings' : { // Settings not made yet
          text : 'Settings',
          link : '/banana'
      },
  };

  const errorContent = {
      text : 'N/A',
      link : '/'
  }
  
  // For group memebers reading this and want to understand the logic
  //https://stackoverflow.com/questions/55377365/what-does-keyof-typeof-mean-in-typescript
  const content = nameToData[button as keyof typeof nameToData] || errorContent;

  return(
      <Link className="nav-button" to={content.link}>
          {content.text}
      </Link>
  );
}



// NOTE: alternative way is to define a prop type, 
// this is the better way to do it but I need to do it the dumb way first

// interface SingleButtonProps {
//     button: string;
//   }

// function SingleButton({ button }: SingleButtonProps) { ...}


// Prop type was needed for JS
// SingleButton.propTypes = {
//     button: PropTypes.string.isRequired,
//   };