import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { fetchDataFromApi } from '../utils/api';
import Chart from 'chart.js/auto';
import { color } from 'd3';

function TopGenere() {
  const recentTracks = useSelector((state) => state.Credentials.recentTracks);
  const token = useSelector((state) => state.Credentials.token);
  const [chartData, setChartData] = useState([]);
  const { data, loading } = recentTracks;


  // Prepare chart data
  useEffect(() => {
    const morningTracks = [];
    const afternoonTracks = [];
    const eveningTracks = [];
    const nightTracks = [];
  
    data?.items?.forEach((item) => {
      const track = {
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        ...item,
      };
      const hour = new Date(item.played_at).getHours();
      if (hour >= 5 && hour < 12) {
        morningTracks.push(track);
      } else if (hour >= 12 && hour < 17) {
        afternoonTracks.push(track);
      } else if (hour >= 17 && hour < 22) {
        eveningTracks.push(track);
      } else {
        nightTracks.push(track);
      }
    });
    Promise.all([
      getAudioFeatures(morningTracks, token),
      getAudioFeatures(afternoonTracks, token),
      getAudioFeatures(eveningTracks, token),
      getAudioFeatures(nightTracks, token),
    ]).then((results) => {
      const morningProps = calculateTrackProps(results[0]);
      const afternoonProps = calculateTrackProps(results[1]);
      const eveningProps = calculateTrackProps(results[2]);
      const nightProps = calculateTrackProps(results[3]);
  
      setChartData([
        { label: "Night", ...nightProps },
        { label: "Evening", ...eveningProps },
        { label: "Afternoon", ...afternoonProps },
        { label: "Morning", ...morningProps },
      ]);
    });
  }, [data]);
  
  function getAudioFeatures(tracks, token) {
    const trackIds = tracks.map((track) => track.id).join(",");
    return fetchDataFromApi(`/audio-features?ids=${trackIds}`, token).then(
      (res) => res?.audio_features || []
    );
  }
  
  function calculateTrackProps(audioFeatures) {
    const props = {
      danceability: 0,
      energy: 0,
      liveness: 0,
      speechiness: 0,
      instrumentalness: 0,
    };
    audioFeatures.forEach((x) => {
      props.danceability += x?.danceability || 0;
      props.energy += x?.energy || 0;
      props.liveness += x?.liveness || 0;
      props.speechiness += x?.speechiness || 0;
      props.instrumentalness += x?.instrumentalness || 0;
    });
    const count = audioFeatures.length;
    props.danceability /= count;
    props.energy /= count;
    props.liveness /= count;
    props.speechiness /= count;
    props.instrumentalness /= count;
    return props;
  }
  
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // destroy existing chart
    }
    
    if (chartRef && chartRef.current && chartData.length > 0) {
      const datasets = chartData.map((data, index) => {
        var hex = Math.floor((index / (3)) * (0xDF9F - 0xFDF64) + 0xFDF64).toString(16);
        var red = (parseInt(hex, 16) >> 16) & 0xFF;
        var green = (parseInt(hex, 16) >> 8) & 0xFF;
        var blue = parseInt(hex, 16) & 0xFF;
        return {
          label: data.label,
          data: [
            data.speechiness,
            data.liveness,
            data.instrumentalness,
            data.danceability,
            data.energy,
          ],
          backgroundColor: "rgba(" + red + "," + green + "," + blue + ",0.4)",
          borderColor: `rgba(0, ${index * 30}, 0, 0)`,
          pointBackgroundColor: `rgba(0, ${index * 30}, 0, 1)`,
          pointBorderWidth:1,
          pointRadius:2,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: `rgba(0, ${index * 30}, 0, 1)`,
          borderWidth: 2
        };
      });
      

      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ["speechiness", "liveness","instrumentalness","danceability","energy"],
          datasets: datasets
        },
        options: {
          scales: {
            r: {
              angleLines: {
                display: true,
                color: 'rgba(255, 255, 255, 0.2)',
                lineWidth: 1
              },
              grid:{
                color:"rgba(255,255,255,0.2)"
              },
              ticks: {
                font: {
                  size: 6
                },
                beginAtZero: false,
                min: 0,
                max: 0.5,
                stepSize: 0.2,
                backdropColor: 'rgba(0,0,0,0)',
                color: 'white',
                padding: 10,
                callback: function (value, index, values) {
                  if (value === 0) {
                    return '';
                  }
                  return value.toFixed(1);
                }
              },
              pointLabels: {
                font: {
                  size: 10,
                },
                color: 'white',
                lineHeight: 1.5,
                padding: 10
              }
            },
          }
        }
        
      });

      chartInstanceRef.current.canvas.parentNode.style.width = '400px';
      chartInstanceRef.current.canvas.parentNode.style.height = '400px';

    }
  }, [chartData]);
  
  return (
    <div>
      {!loading && chartData.length > 0 && <canvas  ref={chartRef}></canvas>}
    </div>
  );
}

export default TopGenere;
