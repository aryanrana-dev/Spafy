import './App.css'
import ServicesLayout from './services-page/services-layout'
import { Routes, Route } from 'react-router-dom'
import Razorpay from './pages/Razorpay'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Razorpay />} />
        <Route path='/saloon' element={<ServicesLayout />} />
      </Routes>
    </>
  )
}

export default App
