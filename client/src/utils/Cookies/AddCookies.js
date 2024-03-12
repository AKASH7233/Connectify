import Cookies from 'js-cookie'

const setCookies = (cookiesname,value) => {
    return Cookies.set(cookiesname,value,{
        expires:1,
        secure:true
    })
} 

export default setCookies