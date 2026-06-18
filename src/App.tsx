import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Auth/Login'
import Dashboard from './Dashboard/Dashboard'
import SignUp from './Auth/SignUp'
import ProtectedRoute from './Auth/ProctedRoute/ProtectedRoute'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={
        <ProtectedRoute><Dashboard/></ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
