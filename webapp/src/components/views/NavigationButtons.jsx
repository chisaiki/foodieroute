

import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import "../styles/temp.css"

export default function NavigationButtons(){
  
  return(
      <div id ="nav-bar " className="temp-nav-bar2">
          {/* <SingleButton button={"Home"}></SingleButton> */}
          <SingleButton button="Home"/>
          <SingleButton button="Settings"/>
          
      </div>
  );
}

//function that returns the html code for a button based on the string passed in 
function SingleButton({button}){
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

  const content = nameToData[button] || errorContent;

  return(
      <Link className="nav-button" to={content.link}>
          {content.text}
      </Link>
  );
}

SingleButton.propTypes = {
    button: PropTypes.string.isRequired,
  };