import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Feed from './pages/Feed'
import Home from './pages/Home'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import Register from './pages/Register'
import Search from './pages/Search'
import UploadPost from './pages/UploadPost'
import DataFetch from './utils/DataFetch'
import UserProfile from './pages/UserProfile'
import Follow from './components/Post/FollowerLists/Follow'

function App() {

  return (
    <div className=''>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/register' element = {<Register/>} />
          <Route path='/login' element = {<Login/>} />
          <Route path='/user/:userId' element={<UserProfile/>}/>
          <Route path='/myProfile' element={<MyProfile />}/>
          <Route path='/feed' element={<Feed />} />
          <Route path='/uploadPost' element ={<UploadPost/>} />
          <Route path='/test' element= {<DataFetch/>}/>
          <Route path='/search' element={<Search/>}/>
          <Route path='/followlist/:type/:userId' element={<Follow/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
