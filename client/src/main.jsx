import './index.css'

import {CookiesProvider} from 'react-cookie'
import ReactDOM from 'react-dom/client'
import { ToastBar,Toaster } from 'react-hot-toast'
import{Provider} from 'react-redux'

import App from './App.jsx'
import { store } from './redux/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store = {store}>
    <CookiesProvider>
   <Toaster>
  {(t) => (
    <ToastBar
      toast={t}
      style={{
        ...t.style,
        animation: t.visible ? 'custom-enter 1s ease' : 'custom-exit 1s ease',
      }}
    />
  )}
</Toaster>
<Toaster
  toastOptions={{
    className: '',
    style: {
      border: '1px solid #713200',
      padding: '16px',
      color: '#713200',
    },
  }}
  />
    <App />
  </CookiesProvider>,
  </Provider>
)
