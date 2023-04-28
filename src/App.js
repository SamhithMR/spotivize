import Timespent from './components/Timespent'
import TimeSpendPerHour from './components/TimeSpendPerHour'
import TopArtists from './components/TopArtists';
import Login from './components/login'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import {getToken, getTrack} from './store/credentials'
import { fetchDataFromApi } from './utils/api';
import TopGenere from './components/TopGener';
import './App.css'

function App() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.Credentials.token)

  const hash = window.location.hash

  useEffect(()=>{
    const token_value = hash.substring(1).split("&")[0].split("=")[1];
    dispatch(getToken(token_value))
    const today = new Date();
    const lastWeekTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 0, 0, 0).getTime();
    fetchDataFromApi(`/me/player/recently-played?after=${lastWeekTimestamp}&limit=50`,token_value)
    .then((res)=>{
      dispatch(getTrack({data:res,loading:false}))
    })
    .catch((err)=>{
      console.log("from app.js" + err);
    })
  },[hash])

  return (
    <div className='app'>
      {/* <Recent /> */}
      {token ? <div className='components'> 
       <TopGenere/>
      <TimeSpendPerHour />
       <TopArtists />
      <Timespent />
       </div> : <Login />}
    </div>
  )
}

export default App;
