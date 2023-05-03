import { fetchDataFromApi } from '../utils/api';
import axios from 'axios';
import React,{ useEffect, useState} from 'react';
import { useDispatch, useSelector} from 'react-redux'
import { BiShuffle, BiRepeat, BiSkipNext, BiSkipPrevious, BiVolumeFull } from 'react-icons/bi';
import { BsPlayCircleFill,BsPauseCircleFill } from 'react-icons/bs';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getdeviceID } from '../store/credentials';
import useFetch from '../hooks/useFetch';
import "../pages/home.css"

function Player(){
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [play, setPlay] = useState(true);
    const [Timage, setTimage] = useState("");
    const [Tname, setTname] = useState("");
    const [Tartists, setTartist] = useState([]);
    const [deviceID, setDeviceId] = useState(``);

    
    const dispatch = useDispatch()
    const token = useSelector((state) => state.Credentials.token)
    const recentTracks = useSelector((state) => state.Credentials.recentTracks)
    const seed_Artists = recentTracks?.data?.items?.[0]?.track?.artists?.[0]?.id

    const getCurrentPlaybackState = async () => {
        const response = await fetchDataFromApi("/me/player", token);
        return response;
      };
      
      const updateProgress = async () => {
        const { item, device, is_playing, progress_ms } = await getCurrentPlaybackState();
        dispatch(getdeviceID(device?.id))
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
        }, 100000);
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

export default Player