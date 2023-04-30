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


function Home() {

    const dispatch = useDispatch()
    const token = useSelector((state) => state.Credentials.token)
    const recentTracks = useSelector((state) => state.Credentials.recentTracks)
    const seed_Artists = recentTracks?.data?.items?.[0]?.track?.artists?.[0]?.id
    const {data, loading } = useFetch(`/recommendations?limit=15&market=IN&seed_artists=${seed_Artists}`, token)
    const {data: artistsData, loading: artistsLoading } = useFetch(`/artists/${seed_Artists}/related-artists`, token)
    const {data: album, loading: albumLoading } = useFetch(`/browse/new-releases?country=IN&limit=10`, token)

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
                        name={track.name}
                        img_url={track?.album?.images?.[0]?.url}
                        artists={track.artists}
                        />
                    ))}
                </div>

            </div>}
            {!recentTracks.loading && <div className='recommneded_tracks'>
                <div className="recommendation_heading">
                    <h3>Recent played</h3>
                </div>
                <div className="carosel">
                    { recentTracks.data?.items.map((x)=> {
                        return <Card name={x.track.name} img_url={x.track?.album?.images?.[0]?.url} artists={x?.track?.artists}/>})}
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
        </div>
    )
}
export default Home