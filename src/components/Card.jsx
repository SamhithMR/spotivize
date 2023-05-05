import { LazyLoadImage } from 'react-lazy-load-image-component';
import './Card.css'
import { BsPlayCircleFill } from 'react-icons/bs';

function Card({name, img_url, artists, onclick, track_id, type}){
    return(
        <div className="card" onClick={() => onclick(track_id, type)}>
            <div className='image'><LazyLoadImage src={img_url} /><BsPlayCircleFill className='track_button'  /></div>
            <div className="card_contents">
                <h6>{name}</h6>
                {artists && <div className="card_artists">
                    {artists?.map((artist) =>{return <p>{artist?.name}</p>})}
                </div>}
            </div>
        </div>
    )
}
export default Card