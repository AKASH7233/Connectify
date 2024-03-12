import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Feed from './pages/Feed'
import MyProfile from './pages/MyProfile'
import UploadPost from './pages/UploadPost'
import DataFetch from './utils/DataFetch'
import Search from './pages/Search'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element = {<Register/>} />
          <Route path='/login' element = {<Login/>} />
          <Route path='/' element={<Feed />}/>
          <Route path='/myProfile' element={<MyProfile />}/>
          <Route path='/uploadPost' element ={<UploadPost/>} />
          <Route path='/test' element= {<DataFetch/>}/>
          <Route path='/search' element={<Search/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
