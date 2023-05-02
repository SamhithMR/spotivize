import Timespent from '../components/Timespent'
import TimeSpendPerHour from '../components/TimeSpendPerHour'
import TopArtists from '../components/TopArtists';
import TopGenere from '../components/TopGener'
import useFetch from '../hooks/useFetch';
import Card from '../components/Card';
import './home.css'

import React,{ useEffect, useState} from 'react';
import { useDispatch, useSelector} from 'react-redux'
import {getToken, getTrack} from '../store/credentials'
import { Route, Routes, useNavigate } from "react-router-dom"
import { fetchDataFromApi } from '../utils/api';
import axios from 'axios';

import { BiShuffle, BiRepeat, BiSkipNext, BiSkipPrevious, BiVolumeFull } from 'react-icons/bi';
import { BsPlayCircleFill,BsPauseCircleFill } from 'react-icons/bs';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function Home() {

    const dispatch = useDispatch()
    const token = useSelector((state) => state.Credentials.token)
    const recentTracks = useSelector((state) => state.Credentials.recentTracks)
    const seed_Artists = recentTracks?.data?.items?.[0]?.track?.artists?.[0]?.id
    const {data, loading } = useFetch(`/recommendations?limit=15&market=IN&seed_artists=${seed_Artists}`, token)
    const {data: artistsData, loading: artistsLoading } = useFetch(`/artists/${seed_Artists}/related-artists`, token)
    const {data: album, loading: albumLoading } = useFetch(`/browse/new-releases?country=IN&limit=10`, token)
    
    // const {data: current_playing, loading: player_loading } = useFetch(`/me/player`, token)

    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [play, setPlay] = useState(true);
    const [Timage, setTimage] = useState("");
    const [Tname, setTname] = useState("");
    const [Tartists, setTartist] = useState([]);
    const [deviceID, setDeviceId] = useState(``);

    const getCurrentPlaybackState = async () => {
        const response = await fetchDataFromApi("/me/player", token);
        return response;
      };
      
      const updateProgress = async () => {
        const { item, device, is_playing, progress_ms } = await getCurrentPlaybackState();
        setTimage(item?.album?.images?.[0]?.url)
        setDeviceId(device?.id);
        setTname(item?.name)
        setTartist(item?.artists)
        if (is_playing) {
          setProgress(progress_ms);
          setDuration(item?.duration_ms);
          setPlay(true);
        } else {
          setPlay(false);
        }
      };
      
      useEffect(() => {
        setInterval(() => {
          updateProgress();
        }, 1000);
      }, []);

      const PlayerControlls = async (action) => {
        try {
          const headers = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          };
          deviceID && await axios.put(
            `https://api.spotify.com/v1/me/player/${action}?device_id=${deviceID}`,
            {},
            { headers }
          );
        } catch (err) {
          console.log(err);
          return err;
        }
      };
      
      
    const [volume, setVolume] = useState(100);
    const handleVolumeChange = (event) => {
    setVolume(event.target.value);
    setVolumeAPI(event.target.value);
    };
    const setVolumeAPI = async (volume) => {
        await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
            method: 'PUT',
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        };
          


    return(
        <div>
            <div className='components_wrapper'>
                <h1>Your Listening Insights</h1>
                <div className='components'>
                    <div>
                        <TimeSpendPerHour />
                        <h4>Hourly Average Time Spent Listening to Music on Spotify</h4>
                    </div>
                    <div>
                        <Timespent />
                        <h4>Weekly Overview: Time Spent Listening to Music on Spotify</h4>
                    </div>
                    <div>
                        <TopArtists />
                        <h4>Top Artists and Genres by User Listening History</h4>
                    </div>
                    <div>
                        <TopGenere />
                        <h4>Exploring User Audio Preferences throughout the Day with a Radar Chart</h4>
                    </div>
                </div>
            </div>
            {!loading && <div className='recommneded_tracks'>
                <div className="recommendation_heading">
                    <h3>Made for you</h3>
                </div>
                <div className="carosel">
                    {data?.tracks?.map((track, i) => (
                        <Card
                        key={i}
                        name={track?.name}
                        img_url={track?.album?.images?.[0]?.url}
                        artists={track?.artists}
                        />
                    ))}
                </div>

            </div>}
            {!recentTracks.loading && <div className='recommneded_tracks'>
                <div className="recommendation_heading">
                    <h3>Recent played</h3>
                </div>
                <div className="carosel">
                    { recentTracks?.data?.items?.map((x)=> {
                        return <Card name={x?.track?.name} img_url={x.track?.album?.images?.[0]?.url} artists={x?.track?.artists}/>})}
                </div>

            </div>}
            {!artistsLoading && <div className='recommneded_tracks'>
                <div className="recommendation_heading">
                    <h3>Related artists</h3>
                </div>
                <div className="carosel">
                    { artistsData?.artists?.map((x)=> {
                        return <Card name={x?.name} img_url={x?.images?.[0]?.url} artists={[]}/>})}
                </div>

            </div>}
            {!albumLoading && <div className='recommneded_tracks'>
                <div className="recommendation_heading">
                    <h3>New Released</h3>
                </div>
                <div className="carosel">
                    { album?.albums?.items?.map((x)=> {
                        return <Card name={x?.name} img_url={x?.images?.[0]?.url} artists={x?.artists}/>})}
                </div>
            </div>}
            { <div className='Player'>
                <div className="player_info">
                    {Timage !== "" && <div className="Player_img"><LazyLoadImage src={Timage} /></div>}
                    {Tartists !== "" && <div className="player_desc"><h6>{Tname}</h6><p>{(Tartists?.map((x)=>(x.name)))}</p></div>}
                </div>
                <div className="player_contraollers">
                    <div className="player_buttons" ><BiShuffle/><BiSkipPrevious onClick={()=>(PlayerControlls("previous"))}/><div>{play ? <BsPauseCircleFill onClick={()=>(PlayerControlls("pause"))}/> : <BsPlayCircleFill onClick={()=>(PlayerControlls("play"))}/>}</div><BiSkipNext onClick={()=>(PlayerControlls("next"))}/><BiRepeat /></div>
                    <div className="player_progressBar">
                        <div className="progress_time">{(progress / 60000).toFixed(2)}</div>
                        <div className="progress-bar"><div className="progress" style={{ width: `${(progress / duration) * 100}%`}}></div></div>
                        <div className="duration_time">{(duration / 60000).toFixed(2)}</div>
                    </div>
                </div>
                <div className="player_volume">
                    <BiVolumeFull />
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={volume} 
                        onChange={handleVolumeChange} 
                        />
                </div>
            </div>}
        </div>
    )
}
export default Home