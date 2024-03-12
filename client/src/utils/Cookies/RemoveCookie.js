import Cookies from 'js-cookie'

const removeCookies = (cookiesname) => {
    return Cookies.remove(cookiesname)
} 

export default removeCookies