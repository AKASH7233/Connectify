import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Chat from './pages/Chat'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import UserAccount from './pages/UserAccount'
import DataFetch from './utils/DataFetch'
import UpdateProfile from './components/Profile/UpdateProfile'
import MyAccount from './pages/MyAccount'
import UploadPage from './pages/UploadPage'
import SearchPage from './pages/SearchPage'
import FollowPage from './pages/FollowPage'
import VisitedPostPage from './pages/VistiedPost'
import LikedByPage from './pages/LikesPage'
import HiddenPostPage from './pages/HiddenPostPage'
import CommentRepliesPage from './pages/CommentRepliesPage'
import UploadBlinkPage from './pages/UploadBlink'

function App() {

  return (
    <div className=''>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/register' element = {<Register/>} />
          <Route path='/login' element = {<Login/>} />
          <Route path='/user/:userId' element={<UserAccount/>}/>
          <Route path='/myProfile' element={<MyAccount />}/>
          <Route path='/uploadPost' element ={<UploadPage/>} />
          <Route path='/test' element= {<DataFetch/>}/>
          <Route path='/search' element={<SearchPage/>}/>

          <Route path='/editprofile' element={<UpdateProfile/>}/> 

          <Route path='/followlist/:type/:userId' element={<FollowPage/>} />

          <Route path='/chat' element={<Chat/>}/>
          <Route path='/viewpost/:postId/:type' element={<VisitedPostPage />} />
          <Route path='viewreplies/:commentId' element={<CommentRepliesPage/>} />
          <Route path='/likes/:postId' element={<LikedByPage />} />
          <Route path='/hiddenpost' element={<HiddenPostPage />} />
          <Route path='/uploadBlink' element={<UploadBlinkPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
