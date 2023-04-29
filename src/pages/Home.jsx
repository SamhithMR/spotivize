import Timespent from '../components/Timespent'
import TimeSpendPerHour from '../components/TimeSpendPerHour'
import TopArtists from '../components/TopArtists';
import Login from '../components/login'
import TopGenere from '../components/TopGener'
import './home.css'


function Home() {
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
        </div>
    )
}
export default Home