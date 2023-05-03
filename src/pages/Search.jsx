import {BiSearchAlt2} from 'react-icons/bi'
import { useDispatch, useSelector} from 'react-redux'
import Card from '../components/Card';
import React,{ useEffect, useState} from 'react';
import useFetch from '../hooks/useFetch';
import './search.css'
import './home.css'
import Player from '../components/player';

function Search() {
    const token = useSelector((state) => state.Credentials.token)
    const recentTracks = useSelector((state) => state.Credentials.recentTracks)
    const deviceID = useSelector((state) => state.Credentials.deviceID)
    const seed_Artists = recentTracks?.data?.items?.[0]?.track?.artists?.[0]?.id
    const {data, loading } = useFetch(`/recommendations?limit=15&market=IN&seed_artists=${seed_Artists}`, token)
    const [query, setQuery] = useState("")
    const {data:searchResult, loading:searchLoading } = useFetch(`/search?q=${query}&type=track`, token)
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
        };

    return(
        <div className='search'>
            <div className="search_header">
                <div className="search_container">
                    <BiSearchAlt2 className='search'/>
                    <input type="text"  placeholder='what do you want to listen to ?' onChange={(e)=>{setQuery(e.target.value)}}/>
                </div>
            </div>
            <div className="search_body">
                {!searchLoading && query && <div className='recommneded_tracks'>
                    <div className="recommendation_heading">
                        <h3>search Results for {query} </h3>
                    </div>
                    <div className="carosel">
                        {searchResult?.tracks?.items?.map((item, i) => (
                            <Card
                            key={i}
                            name={item?.name}
                            img_url={item?.album?.images?.[0]?.url}
                            artists={item?.artists}
                            onclick={playTrack} track_id={item?.id}
                            />
                        ))}
                    </div>
                </div>}
                {!recentTracks.loading && <div className='recommneded_tracks'>
                <div className="recommendation_heading">
                    <h3>Recent played</h3>
                </div>
                <div className="carosel">
                    { recentTracks?.data?.items?.map((x, i)=> {
                        return <Card
                         name={x?.track?.name} 
                         key={i} 
                         img_url={x.track?.album?.images?.[0]?.url} 
                         artists={x?.track?.artists}
                         onclick={playTrack} track_id={x?.track?.id}
                         />})}
                </div>

                </div>}
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
                        onclick={playTrack} track_id={track?.id}
                        />
                    ))}
                </div>
                </div>}
            </div>
            <Player />
        </div>
    )
}
export default Search