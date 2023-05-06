import {BsInstagram, BsGithub, BsTwitter} from 'react-icons/bs'
import './footer.css'
function Footer(){
    return (
        <div className="footer">
            <div className="footer_header">
                <div className="footer_icons">
                    <BsInstagram />
                    <a href="https://github.com/samhithmr" target='_blank'><BsGithub /></a>
                    <BsTwitter />
                </div>
                <div className="fotter_desc">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati esse nemo alias voluptatum magnam sit odio aperiam praesentium quasi optio.
                </div>
            </div>
            <div className="footer_content">
                <ul>
                    <li>Legal</li>
                    <li>Privacy Center</li>
                    <li>Cookies</li>
                    <li>About Ads</li>
                </ul>
            </div>
        </div>
    )
}
export default Footer