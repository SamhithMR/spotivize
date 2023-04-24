import Timespent from './components/Timespent'
import Login from './components/login'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import {getToken} from './store/credentials'

function App() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.Credentials.token)

  const hash = window.location.hash
  useEffect(()=>{
    dispatch(getToken(hash.substring(1).split("&")[0].split("=")[1]))
  },[hash])

  return (
    <div>
      {/* <Recent /> */}
      {token ? <Timespent /> : <Login />}
    </div>
  )
}

export default App;
