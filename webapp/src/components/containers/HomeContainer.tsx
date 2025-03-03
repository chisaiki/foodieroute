import HomeView from "../views/HomeView";
import { useEffect, useState } from "react";
//import { useDispatch, useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { fetchEmployees } from "../../store/employeesSlice";
// import { fetchTasks } from "../../store/tasksSlice";

function HomeContainer() {
    // Firebase has redux-firestore <<<<< we should be using that

    // const dispatch = useDispatch();

    // const [isLoaded, setIsLoaded] = useState(false);

    // useEffect(() => {
    //   // Back end call goes here
    //     //dispatch(fetchTasks()); // This is needed for Kyle's Table

    //     // My lazy way of making sure new info is not missed without doing a 
    //     // real frontend data update function.
    //     if (!isLoaded){
    //       setTimeout(1000); // reloads info after 1 sec
    //       setIsLoaded(true)
    //     }


    //   }, [dispatch, isLoaded]);
          {/* <HomeView dispatch={dispatch} /> */}
    return (
      <HomeView/>
    );

}

export default HomeContainer;

