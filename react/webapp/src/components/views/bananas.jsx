import { useRouteError } from "react-router-dom";
import { useState } from "react";
import "../styles/tailwindStyle.css"

export default function Bananas() {
  const error = useRouteError();
  console.error(error);

  
  // After every time this state changes, the page will re-render
  const [count, setBanana] = useState(3)

  function addBanana(){
    setBanana(count + 1)
  }

  function removeBanana(){
    setBanana(count -1)
  }

  // How to render lists or mutliple things!
  // var tmp = [];
  // for (var i = 0; i < count; i++) {
  //   tmp.push(i);
  // }

  // // 'i' is not used but we use a map function to create each banana
  // var bananasDynanamic = tmp.map(function (i) {
  //   return (
  //     <img src="https://i.imgur.com/Mudezu4.png" alt="banana" className="banana"></img>
  //   );
  // });

  const bananasDynanamic = Array.from({ length: count }, (_, i) => (
    <img
      key={i}
      src="https://i.imgur.com/Mudezu4.png"
      alt="banana"
      className="banana"
      height='100px'
      width='200px'
    />
  ));

  return (
    <div  id="banana-page" className="center-banana" >
      <div id="IUseThisToCenterEverything">
        <div className="flex flex-row flex-wrap justify-center gap-4 w-full max-w-[1000px] " >{bananasDynanamic}</div>
        {/* <img src="https://i.imgur.com/Mudezu4.png" alt="banana" className="banana"></img>
        <img src="https://i.imgur.com/Mudezu4.png" alt="banana" className="banana"></img>
        <img src="https://i.imgur.com/Mudezu4.png" alt="banana" className="banana"></img> */}
        
        <div className="flex flex-row gap-8 justify-center">
          <button  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
           onClick={addBanana}> Add Banana</button>
          <button  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          onClick={removeBanana}> Remove Banana</button>
        </div>

      </div>


    </div>
    
  );
}