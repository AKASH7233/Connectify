import './App.css'

import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import viteLogo from '/vite.svg'

import reactLogo from './assets/react.svg'
import Feed from './pages/Feed'
import Home from './pages/Home'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import Register from './pages/Register'
import Search from './pages/Search'
import UploadPost from './pages/UploadPost'
import DataFetch from './utils/DataFetch'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/register' element = {<Register/>} />
          <Route path='/login' element = {<Login/>} />

          <Route path='/myProfile' element={<MyProfile />}/>
          <Route path='/feed' element={<Feed />} />
          <Route path='/uploadPost' element ={<UploadPost/>} />
          <Route path='/test' element= {<DataFetch/>}/>
          <Route path='/search' element={<Search/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
