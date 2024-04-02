import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Chat from './pages/Chat'
import Feed from './pages/Feed'
import Home from './pages/Home'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import Register from './pages/Register'
import Search from './pages/Search'
import UploadPost from './pages/UploadPost'
import UserProfile from './pages/UserProfile'
import Follow from './components/Post/FollowerLists/Follow'
import DataFetch from './utils/DataFetch'
import ViewPost from './components/Post/viewPost/viewPost'

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

          <Route path='/chat' element={<Chat/>}/>
          <Route path='/viewpost/:postId/:type' element={<ViewPost />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
