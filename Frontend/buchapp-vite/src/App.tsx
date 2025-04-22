import { Routes, Route } from 'react-router'

import Navbar from './components/Navbar'
import './App.css'


function App() {

  return (
    <>
      <Navbar/>
      <div>
    <Routes>        
      <Route path="/"  element={<Stocks/>} />
      <Route path="/favourites"  element={<Favourites />}/>
      <Route path="/cart"  element={<Cart/>}/>
    </Routes>
    </div>

    </>
  )
}

export default App
