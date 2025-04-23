import { Routes, Route } from 'react-router'

import Navbar from './components/Navbar'

import './App.css'
import Home from './pages/Home'
import Friends from './pages/Friends'
import Books from './pages/Books'
import Footer from './components/Footer'
import Login from './pages/Login'

function App() {

  return (
    <>
      <Login/>

      {/* <Navbar/>
        <Routes>        
          <Route path="/"  element={<Home/>} />
          <Route path="/freunde"  element={<Friends />}/>
          <Route path="/buecher"  element={<Books/>}/>
        </Routes>
      <Footer/> */}
    </>
  )
}

export default App
