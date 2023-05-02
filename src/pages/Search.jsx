import {BiSearchAlt2} from 'react-icons/bi'
import { useDispatch, useSelector} from 'react-redux'
import Card from '../components/Card';
import React,{ useEffect, useState} from 'react';
import useFetch from '../hooks/useFetch';
import './search.css'
function Search() {
        const token = useSelector((state) => state.Credentials.token)
    const recentTracks = useSelector((state) => state.Credentials.recentTracks)
    const seed_Artists = recentTracks?.data?.items?.[0]?.track?.artists?.[0]?.id
    const {data, loading } = useFetch(`/recommendations?limit=15&market=IN&seed_artists=${seed_Artists}`, token)

    return(
        <div className='search'>
            <div className="search_header">
                <div className="search_container">
                    <BiSearchAlt2 className='search'/>
                    <input type="text"  placeholder='what do you want to listen to ?'/>
                </div>
            </div>
            <div className="search_body">
                <div className="carosel">
                {!recentTracks.loading && <div className='recommneded_tracks'>
                <div className="recommendation_heading">
                    <h3>Recent played</h3>
                </div>
                <div className="carosel">
                    { recentTracks?.data?.items?.map((x)=> {
                        return <Card name={x?.track?.name} img_url={x.track?.album?.images?.[0]?.url} artists={x?.track?.artists}/>})}
                </div>

            </div>}
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
            </div>
        </div>
    )
}
export default Search