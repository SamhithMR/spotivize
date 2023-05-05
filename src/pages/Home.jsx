import React from 'react';
import { useDispatch, useSelector} from 'react-redux'

import Timespent from '../components/Timespent'
import TimeSpendPerHour from '../components/TimeSpendPerHour'
import TopArtists from '../components/TopArtists';
import TopGenere from '../components/TopGener'
import useFetch from '../hooks/useFetch';
import Card from '../components/Card';

import { useNavigate } from 'react-router-dom';
import Player from '../components/player';
import './home.css'

function Home() {
    const token = useSelector((state) => state.Credentials.token)
    const deviceID = useSelector((state) => state.Credentials.deviceID)
    const recentTracks = useSelector((state) => state.Credentials.recentTracks)
    const seed_Artists = recentTracks?.data?.items?.[0]?.track?.artists?.[0]?.id
    const {data, loading } = useFetch(`/recommendations?limit=15&market=IN&seed_artists=${seed_Artists}`, token)
    const {data: artistsData, loading: artistsLoading } = useFetch(`/artists/${seed_Artists}/related-artists`, token)
    const {data: album, loading: albumLoading } = useFetch(`/browse/new-releases?country=IN&limit=10`, token)
   const navigate = useNavigate()
    const playTrack = async (track_id) => {
        const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
            "uris": [`spotify:track:${track_id}`]
            })
        });
        
        if (response.ok) {
            console.log(`Started playing track `);
        } else {
            console.error(`Failed to start playing track : ${response.status} ${response.statusText}`);
        }
        };
    const getDetails = (id, type) =>{
        navigate(`/details/${type}/${id}`)
    }
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
                <div className="carosel" >
                    {data?.tracks?.map((track, i) => (
                        <Card
                        key={i}
                        name={track?.name}
                        img_url={track?.album?.images?.[0]?.url}
                        artists={track?.artists}
                        onclick={playTrack}
                        track_id={track?.id}
                        />
                    ))}
                </div>

            </div>}
            {!recentTracks.loading && <div className='recommneded_tracks'>
                <div className="recommendation_heading">
                    <h3>Recent played</h3>
                </div>
                <div className="carosel">
                    { recentTracks?.data?.items?.map((x,i)=> {
                        return <Card key={i} name={x?.track?.name} img_url={x.track?.album?.images?.[0]?.url} artists={x?.track?.artists} onclick={playTrack} track_id={x?.track?.id}/>})}
                </div>

            </div>}
            {!artistsLoading && <div className='recommneded_tracks'>
                <div className="recommendation_heading">
                    <h3>Related artists</h3>
                </div>
                <div className="carosel">
                    { artistsData?.artists?.map((x,i)=> {
                        return <Card key={i} name={x?.name} img_url={x?.images?.[0]?.url} track_id={x?.id} type={"artists"} onclick={getDetails}/>})}
                </div>

            </div>}
            {!albumLoading && <div className='recommneded_tracks'>
                <div className="recommendation_heading">
                    <h3>New Released</h3>
                </div>
                <div className="carosel">
                    { album?.albums?.items?.map((x,i)=> {
                        return <Card key={i} name={x?.name} img_url={x?.images?.[0]?.url} artists={x?.artists} track_id={x?.id} type={"albums"} onclick={getDetails}/>})}
                </div>
            </div>}
            <Player />
        </div>)
}
export default Home