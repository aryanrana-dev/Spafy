import './App.css'
import ServicesLayout from './services-page/services-layout'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path='/saloon' element={<ServicesLayout />} />
      </Routes>
    </>
  )
}

export default App
