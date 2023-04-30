import { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import * as d3 from "d3";
import { useSelector } from 'react-redux';
import { fetchDataFromApi } from '../utils/api';

function TopArtists() {
  const token = useSelector((state) => state.Credentials.token);
  const recentTracks = useSelector((state) => state.Credentials.recentTracks);
  const [chartData, setChartData] = useState([]);
  const { data, loading } = recentTracks;

  // Prepare chart data
  useEffect(() => {
    const getArtistGenres = async (artistId) => {
      const artistData = await fetchDataFromApi(`/artists/${artistId}`, token);
      return artistData.genres;
    };
  
    const Artists = {};
  
    (async () => {
      for (const item of data?.items || []) {
        for (const artist of item.track.artists) {
          if (!Artists[artist.id]) {
            Artists[artist.id] = {
              name: artist.name,
              id: artist.id,
              genres: await getArtistGenres(artist.id),
              count: 1,
            };
          } else {
            Artists[artist.id].count++;
          }
        }
      }
      setChartData(Object.values(Artists).sort((a, b) => b.count - a.count).slice(0, 18));
    })();
  }, [data, token]);

  // Ref for chart container
  const chartContainer = useRef(null);

  const gener_colors = ["#9fdf9f80","#8ddf8c80","#7cbe7980","#6b9e6780","#5a7d5480","#1fdf6480"];
  const geners = ["filmi", "pop", "hip hop", "jazz", "classical", ""]

  useEffect(() => {
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const width = 350 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
  
    // Define color scale
    const colorScale = d3.scaleOrdinal()
    .domain(geners)
    .range(gener_colors);

    // Define radius scale
    const radius = d3.scaleSqrt().range([8, 35]);
  
    // Define simulation
    const simulation = d3.forceSimulation()
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(-5))
      .force("collision", d3.forceCollide().radius(d => radius(d.count) + 1).strength(1));

      const oldsvg = d3.select(chartContainer.current).select("svg");

    if (!oldsvg.empty()) {
      oldsvg.remove();
    }
  
    const svg = d3.select(chartContainer.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // Set domain for radius scale
    radius.domain([0, d3.max(chartData, d => d.count)]);
  
    // Create bubble nodes
    const nodes = svg.selectAll("circle")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("r", d => radius(d.count * 6))
      .attr("fill", d => colorScale(d.genres[0])); 
  
    // Add text labels to bubbles
    const labels = svg.selectAll("text")
      .data(chartData)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "8px")
      .attr("dy", ".2em")
      .text(d => d.name)
      // .attr("fill","#ffffff85")
      .attr("fill","#000000f")

    // Define tick function
    const ticked = () => {
      nodes
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  
      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    };
  
    // Start simulation
    simulation.nodes(chartData).on("tick", ticked);

  }, [chartData]);
 
  return (
    <div >
      {!loading && chartData.length > 0 && <div className='bubble_chart'>
        <div className='bubble_info'>
          <svg width="100" height="100" >
            <circle cx="50" cy="50" r="50" fill="#9fdf9f80" />
            <text x="50" y="50" textAnchor="middle" fill="white" fontSize="0.5rem">Top Viewed Artist</text>
          </svg>
          <svg width="50" height="50">
            <circle cx="25" cy="25" r="25" fill="#9fdf9f80" />
            <text x="25" y="25" textAnchor="middle" fill="white" fontSize="0.3rem">Lowest Viewed Artist</text>
          </svg>
        </div>
        <div className="bubbles" ref={chartContainer}></div>
        <div className='gener_colors'>
          {geners.map((gener,i)=>{
           return gener != "" ?  <p key={i} style={{backgroundColor:`${gener_colors[i]}`}}>{gener}</p> :  <p>other</p>
          })}
        </div>
        </div>}
    </div>
  );
}

export default TopArtists;