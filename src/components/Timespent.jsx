import { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import * as d3 from "d3";
import { useSelector } from 'react-redux';

function Timespent() {
 const recentTracks = useSelector((state) => state.Credentials.recentTracks);
  const [chartData, setChartData] = useState([]);

  const { data, loading } = recentTracks;

  // Prepare chart data
  useEffect(() => {
    const weekMap = {};
    data?.items?.forEach((item) => {
      const duration = Math.round(item?.track.duration_ms / 1000 / 60);
      const week = new Date(item.played_at).toLocaleDateString(undefined, { weekday: 'short' });

      if (weekMap[week]) {
        weekMap[week] += duration;
      } else {
        weekMap[week] = duration;
      }
    });
    setChartData(Object.entries(weekMap).map(([week, duration]) => ({ week, duration })).reverse());
  }, [data]);

  // Ref for chart container
  const chartContainer = useRef(null);

  // D3.js code to create bar chart
useEffect(() => {

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 400 - margin.left - margin.right;
  const height = 250 - margin.top - margin.bottom;

  const oldsvg = d3.select(chartContainer.current)
  .select("svg");

  if (!oldsvg.empty()) {
    oldsvg.remove();
  }

  const svg = d3.select(chartContainer.current)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define gradient
  const gradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "0%")
    .attr("y2", "0%");
    gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "lightgreen");
    gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "darkgreen");

  const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1)

  const y = d3.scaleLinear()
    .range([height, 0]);

  x.domain(chartData.map(d => d.week));
  y.domain([0, d3.max(chartData, d => d.duration)]);

  // Add bars
  svg.selectAll(".bar")
    .data(chartData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.week))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.duration))
    .attr("height", d => height - y(d.duration))
    .attr("fill", "url(#gradient)");

  // Add value labels
  svg.selectAll(".text")
    .data(chartData)
    .enter().append("text")
    .attr("class", "text")
    .attr("x", d => x(d.week) + x.bandwidth() / 2)
    .attr("y", d => y(d.duration) - 5)
    .attr("text-anchor", "middle")
    .text(d => `${d.duration} min`)
    .style("fill", "#fff")
    
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

    svg.selectAll("text")
   .style("fill", "white");


  // Remove y-axis
  svg.select(".domain").remove();
  svg.selectAll(".tick line").remove();

}, [chartData]);


  return (
    <div >
      {!loading && chartData.length > 0 && <div ref={chartContainer}></div>}
    </div>
  );
}

export default Timespent;