import useFetch from "../hooks/useFetch"
import { useDispatch, useSelector} from 'react-redux'
import { useParams } from "react-router-dom"
import Player from '../components/player'
import Footer from '../components/footer'
import './Details.css'

function Details() {
    const token = useSelector((state) => state.Credentials.token)
    const recentTracks = useSelector((state) => state.Credentials.recentTracks)
    const deviceID = useSelector((state) => state.Credentials.deviceID)
    const {id, type} = useParams()
    const {data, loading} = useFetch(`/${type}/${id}?market=IN`, token)
    const {data:tracks, loading:tracksLoading} = useFetch(`/artists/${id}/top-tracks?market=IN`, token)


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
        <div className="details">
            <div className="details_header">
                <div className="details_header_wrapper">
                    <div className="details_header_image">
                        <img src={data?.images?.[0]?.url} alt="" srcset="" />
                    </div>
                    <div className="details_header_content">
                        <h5>{type}</h5>
                        <h1>{data?.name}</h1>
                        {type == 'albums' && <p className="artists">{data?.artists?.map((x)=>(x.name))}</p>}
                        {type === "artists" && (<p className="artists">{data?.genres?.map((x, i) => (<span key={i}>{x}{i < data.genres.length - 1 && ", "} </span>))}</p>)}
                        {type == "artists" && <p className="followers">followers: <span>{data?.followers?.total}</span></p>}
                    </div>
                </div>
            </div>
            <div className="details_body">
                <div className="mask"></div>
                {type == 'artists' && !tracksLoading  && <div className="artists_tracks">
                    <div className="tracks_heading">
                        <p>tracks</p>
                        <p>album</p>
                        <p>duration</p>
                    </div>
                    <div className="tracks">
                        {tracks?.tracks?.map((track, i)=>{
                            return <div className="track" key={i} onClick={()=>(playTrack(track?.id))}> 
                            <p><img src={track?.album?.images?.[0]?.url} alt="" />{track?.name}</p>
                            <p>{track?.album?.name}</p>
                            <p>{Math.round(track?.duration_ms / 60000 * 100) / 100}</p>
                            </div>
                        })}
                    </div>
                    </div>}
                {type == 'albums' && !loading  && <div className="artists_tracks">
                    <div className="tracks_heading">
                        <p>tracks</p>
                        <p>artists</p>
                        <p>duration</p>
                    </div>
                    <div className="tracks">
                        {data?.tracks?.items?.map((track, i)=>{
                            return <div className="track" key={i} onClick={()=>(playTrack(track?.id))}> 
                            <p><img src={track?.images?.[0]?.url} alt="" />{track?.name}</p>
                            <p>{track?.artists?.map((x, i) => (<span key={i}>{x.name}{i < track.artists.length - 1 && ", "} </span>))}</p>
                            <p>{Math.round(track?.duration_ms / 60000 * 100) / 100}</p>
                            </div>
                        })}
                    </div>
                    </div>}
            </div>
            <Footer />
            <Player className="play"/>
        </div>
    )
}
export default Details