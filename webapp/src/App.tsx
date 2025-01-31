import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


// @ts-expect-error // temp solution, WILL REPLACE NEXT!! 
import { db } from './config/firebase.js';
import { getDocs, collection, QuerySnapshot, DocumentData } from 'firebase/firestore';


function App() {
  const [count, setCount] = useState<number>(0)

  const [imageUrl, setImageUrl] = useState<string>("")

  const imageCollectionRef = collection(db, "test");

  useEffect(() => {
    const getImageUrl = async () => {
      // READ the data from DB
      // Set the imageurl
      try {
        const data:QuerySnapshot<DocumentData> = await getDocs(imageCollectionRef);
        if (data.docs.length > 0) {
          const firstImageUrl = data.docs[0].data().url; // Assuming `url` field exists
          setImageUrl(firstImageUrl);
        }
      } catch (err){
        console.error(err)
      }
    };
    getImageUrl();
  }, [])



  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        {imageUrl && <img src={imageUrl} 
          alt="Fetched from Firebase"
          // display ='block'
          // sizes="10vw"
          style={{
            display: 'block',
            maxWidth: '230px',
            maxHeight: '400px',
            width: 'auto',
            height: 'auto'
          }}
          />}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>xwx
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
