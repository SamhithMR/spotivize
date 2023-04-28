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

  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    // Define color scale

    const colorScale = d3.scaleLinear()
    .domain([1, d3.max(chartData, d => d.count)])
     .range([ "#19141432","#1db95482"]);

    // Define radius scale
    const radius = d3.scaleSqrt().range([8, 35]);
  
    // Define simulation
    const simulation = d3.forceSimulation()
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(-5))
      .force("collision", d3.forceCollide().radius(d => radius(d.count) + 1).strength(1));
  
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
      .attr("r", d => radius(d.count * 8))
      .attr("fill", d => colorScale(d.count))
  
    // Add text labels to bubbles
    const labels = svg.selectAll("text")
      .data(chartData)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "8px")
      .attr("dy", ".2em")
      .text(d => d.name);

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
    <div>
      {!loading && chartData.length > 0 && <div ref={chartContainer}></div>}
    </div>
  );
}

export default TopArtists;