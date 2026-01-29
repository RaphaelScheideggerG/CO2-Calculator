import { useState } from 'react'
import DistanceForm from './DistanceForm'
import MainPage from './mainpage'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MainPage />
    </>
  )
}

export default App
