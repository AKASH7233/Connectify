import Cookies from 'js-cookie'

const getCookies = (cookiesname) => {
    return Cookies.get(`${cookiesname}`)
} 

export default getCookies