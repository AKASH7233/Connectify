import React from 'react'
import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  GabIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
  XIcon,
} from "react-share";



function ShareBtn({title,url}) {
  const isPost = url.includes('user') ? `user's profile` : 'post'
  if(navigator.share){
    navigator.share({
      title : `${title}`,
      url : `${url}`
    }).then(()=>{
      console.log('Thanks for sharing !')
    })
    .catch(console.error)
  }

  return (
    <div className='flex flex-wrap gap-5'>

      <a href={`https://api.whatsapp.com/send?text=Hey%2C%20I%27ve%20found%20an%20amazing%20${isPost}%20on%20Connectify%20!!%0A%0ACheck%20it%20out%3A%20${url}%0A%0A${title}`} target="_blank">
        <WhatsappIcon round={20} size={50}/>
      </a>

      <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank">
        <FacebookIcon round={20} size={50}/>
      </a>

      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank">
        <LinkedinIcon round={20} size={50}/>
      </a>

      <a href={`https://t.me/share/url?url=${url}&text=Hey%2C%20I%27ve%20found%20an%20amazing%20${isPost}%20on%20Connectify%20!!%0A%0ACheck%20it%20out%3A%20${url}%0A%0A${title}`} target="_blank">
        <TelegramIcon round={20} size={50}/>
      </a>

      <a href={`mailto:?subject=Hey%2C%20I%27ve%20found%20an%20amazing%20${isPost}%20on%20Connectify%20!!&body=Hey%2C%20I%27ve%20found%20an%20amazing%20${isPost}%20on%20Connectify%20!!%0A%0ACheck%20it%20out%3A%20${url}%0A%0A${title}`} target="_blank">
        <EmailIcon round={20} size={50}/>
      </a>

      <a href={`https://www.reddit.com/submit?url=${url}&title=Hey%2C%20I%27ve%20found%20an%20amazing%20${isPost}%20on%20Connectify%20!!%20Check%20it%20out%3A%20${url}`} target="_blank">
        <RedditIcon round={20} size={50}/>
      </a>

      <a href={`https://pinterest.com/pin/create/button/?url=${url}&media=${url}&description=Hey%2C%20I%27ve%20found%20an%20amazing%20${isPost}%20on%20Connectify%20!!%0A%0ACheck%20it%20out%3A%20${url}%0A%0A${title}`} target="_blank">
        <PinterestIcon round={20} size={50} />
      </a>

      <a href={`https://www.tumblr.com/widgets/share/tool?canonicalUrl=${url}&title=Hey%2C%20I%27ve%20found%20an%20amazing%20${isPost}%20on%20Connectify%20!!&caption=Hey%2C%20I%27ve%20found%20an%20amazing%20post%20on%20Connectify%20!!%0A%0ACheck%20it%20out%3A%20${url}%0A%0A${title}`} target="_blank">
        <TumblrIcon round={20} size={50} />
      </a>
      
    </div>
  )
}

export default ShareBtn