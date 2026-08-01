import './App.css'
import ServicesLayout from './services-page/services-layout'
import SalonLogin from './login/salonLogin'
import { Routes, Route } from 'react-router-dom'
import CheckoutLayout from './checkout/checout-layout'
import DashboardLayout from './dashboard/dashboard-layout'
import RegisterSalon from './registration/register-salon'

function App() {

  return (
    <>
      <Routes>
        <Route path='/salon/login' element={<SalonLogin />} />
        <Route path='/salon/checkout' element={<CheckoutLayout />} />
        <Route path='/salon/dashboard' element={<DashboardLayout />} />
        <Route path='/salon/register' element={<RegisterSalon />} />
        <Route path='/salon/:name' element={<ServicesLayout />} />
      </Routes>
    </>
  )
}

export default App
