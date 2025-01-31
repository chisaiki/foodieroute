import { useRouteError } from "react-router-dom";
import { useState, ReactNode } from 'react'
// import "./styles/tailwindStyle.css"



export default function Bananas() {
  const error: unknown = useRouteError();
  console.error(error);

  
  // After every time this state changes, the page will re-render
  const [count, setBanana] = useState<number>(3);

  function addBanana(): void {
    setBanana(count + 1);
  }

  function removeBanana(): void {
    setBanana((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
  }


  // How to render lists or mutliple things! (from js to ts)
  // let tmp = [];
  // for (var i = 0; i < count; i++) {
  //   tmp.push(i);
  // }
  // // 'i' is not used but we use a map function to create each banana
  // var bananasDynanamic = tmp.map(function (i) {
  //   return (
  //     <img src="https://i.imgur.com/Mudezu4.png" alt="banana" className="banana"></img>
  //   );
  // });

  const bananasDynanamic: ReactNode = Array.from({ length: count }, (_, i) => (
    <img
      key={i}
      src='https://i.imgur.com/Mudezu4.png'
      alt='banana'
      className='banana'
      height='100px'
      width='200px'
    />
  ));


  return (
    <div  id="banana-page" >
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <button  onClick={addBanana}> Add Banana</button>
      <button  onClick={removeBanana}> Remove Banana</button>
      </div>
      <div>{bananasDynanamic}</div>
      {/* <img src="https://i.imgur.com/Mudezu4.png" alt="banana" className="banana"></img>
      <img src="https://i.imgur.com/Mudezu4.png" alt="banana" className="banana"></img>
      <img src="https://i.imgur.com/Mudezu4.png" alt="banana" className="banana"></img> */}
      


    </div>
    
  );
}