

import Home from './pages/Home'
import Explore from './pages/Explore'
import Details from './pages/Details'
import Search from './pages/Search'

import './App.css'

import { fetchDataFromApi } from './utils/api';
import Login from './components/login'

import React,{ useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux'
import {getToken, getTrack} from './store/credentials'
import { Route, Routes, useNavigate } from "react-router-dom"


// icons
import { HiOutlineHome } from 'react-icons/hi';
import { FiSearch } from 'react-icons/fi';
import { BsSpotify } from 'react-icons/bs';
import { SlPlaylist } from 'react-icons/sl';

function App() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector((state) => state.Credentials.token)

  const hash = window.location.hash;
  // const hash = `access_token=BQAfgL3CBBQ5lMVxnoCaT-bV1DU5zkU_L5h33DWumpp-YFxbs1bY2sO9oQ0_Hqq_NcsOWxlxEusZCgZDU-fik1cfVngKJi_9zOfVs0BASqcLwoQMpWxbSaExcHM1jpD3uXufoYoVUgMIT_vwQ3cqP2PVSMRBaIcKBL8oib3FGx6cEMla2910EUFsPxUI0K6lkMHqu5Q1t5xTkNESkT0f2YVsyjTvQg&token_type=Bearer&expires_in=3600`;
  // const hash = `access_token=BQCUIVfzjVj2fPUU3kqGBUhRP0PaE5ZBy-U_e1bMrxLKbUADwB3NGrNYf8EMDwZEfOiUlN6850sstY8Qa0kbw4WgTS7IbfzOy1vRD21EypTDCE2ZCo02O8f3LPWj1VhdTBkqR17KqbNisMT-qeH-a6zGqSkyj2OiGgzzFKLRc7ECrfWf6fKMPUYTKm4cCngnPSGCRlKYEGqjiDLvXXTM-F7Rft1-6A&token_type=Bearer&expires_in=3600`;
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
  },[])

  return (
  <>
    {token ? <div className='app'>
      <div className='left'>
        <div className='left_top'>
          <BsSpotify style={{color:"#1FDF64"}}  onClick={()=>(navigate(`/`))}/>
        </div>
        <div className='left_middel'>
          <HiOutlineHome onClick={()=>(navigate(`/`))}/>
          <FiSearch  onClick={()=>(navigate(`/search`))}/>
          <SlPlaylist  onClick={()=>(navigate(`/explore/:id`))}/>
        </div>
      </div>
      <div className='right'>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/explore/:id" element={<Explore />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/details/:id" element={<Details />}></Route>
        </Routes>
      </div>
    </div> : <Login/>}
  </>
  )
}

export default App;
