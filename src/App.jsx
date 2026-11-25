import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 style={{ textAlign: 'center', fontSize: '50px' }}>Welcome To My Application</h1>

        <div className="flex justify-center">
    <button className="bg-blue-500 text-white px-5 py-2 rounded-md m-1 cursor-pointer">
        Submit
    </button>
</div>
    </>
  )
}

export default App
