import { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";
import { useSelector } from 'react-redux';

function TimeSpendPerHour() {
  const recentTracks = useSelector((state) => state.Credentials.recentTracks);
  const { data, loading } = recentTracks;
  const [chartData, setChartData] = useState([]);
  
  // Prepare chart data
const dailyHours = {};
useEffect(() => {
  data?.items?.forEach((item) => {
    const playedAt = new Date(item.played_at);
    const playedHour = playedAt.getHours();
    const trackDuration = item.track.duration_ms / 60000; 
    if (playedHour in dailyHours) {
      dailyHours[playedHour] += trackDuration;
    } else {
      dailyHours[playedHour] = trackDuration;
    }
  });
  // Initialize duration to 0 for hours that don't have any duration
  for (let i = 0; i < 24; i++) {
    if (!(i in dailyHours)) {
      dailyHours[i] = 0;
    }
  }
  setChartData(Object.entries(dailyHours).map(([hour, duration]) => ({ hour, duration })));  
}, [data]);

const chartContainer = useRef(null);

useEffect(() => {
  // set the dimensions and margins of the graph
  const margin = {top: 0, right: 0, bottom: 0, left: 0};
  const width = 400 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const oldsvg = d3.select(chartContainer.current)
  .select("svg");

if (!oldsvg.empty()) {
  oldsvg.remove();
}

  // append the svg object to the chart container
  const svg = d3.select(chartContainer.current)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // set the radius of the outer and inner circles
  const outerRadius = Math.min(width, height) / 2 - 10;
  const innerRadius = outerRadius * 0.5;

  // set the color scale for the bars
    const gradient = svg.append("defs")
  .append("linearGradient")
  .attr("id", "gradient")
  .attr("gradientUnits", "userSpaceOnUse")
  .attr("x1", 0).attr("y1", innerRadius)
  .attr("x2", 0).attr("y2", outerRadius);

gradient.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#9fdf9f");
  
  gradient.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#1FDF64");

  // set the x scale for the bars
  const x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0)
    .domain(chartData.map(d => d.hour.toString()));

  // set the y scale for the bars
  const y = d3.scaleRadial()
    .range([innerRadius, outerRadius])
    .domain([0, d3.max(chartData, d => d.duration)]);

  // draw the bars as segments of a circle
  svg.append("g")
    .selectAll("path")
    .data(chartData)
    .enter()
    .append("path")
    .attr("fill", "url(#gradient")
    .attr("stroke", "#9fdf9f")
    .attr("stroke-width",0.6)
    .attr("d", d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(d => y(d.duration))
        .startAngle(d => x(d.hour.toString()))
        .endAngle(d => x(d.hour.toString()) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius)
    );

  // add the hour labels to the chart
  svg.append("g")
    .selectAll("g")
    .data(chartData)
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .attr("transform", d => `rotate(${(x(d.hour.toString()) + x.bandwidth() / 2) * 180 / Math.PI - 90}) translate(${innerRadius - 20},0)`)
    .append("text")
    .text(d => `${d.hour.toString()}:00`)
    .attr("transform", d => (x(d.hour.toString()) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(180) translate(0,5)" : "rotate(180) translate(0,-5)")
    .style("font-size", "12px")
    .style("fill", "#fff")
    .attr("opacity", d => d.duration > 0.1 ? 1 : 0.5);

    svg.append("g")
    .selectAll("g")
    .data(chartData)
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .attr("transform", d => `rotate(${(x(d.hour.toString()) + x.bandwidth() / 2) * 180 / Math.PI - 90}) translate(${innerRadius + 35},0)`)
    .append("text")
    .text(d => `${d.duration.toFixed(2)} mins`)
    .attr("transform", d => (x(d.hour.toString()) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(-180) translate(0,5)" : "rotate(-180) translate(0,-5)")
    .style("font-size", "10px")
    .style("fill", "#fff")
    .attr("opacity", d => d.duration > 0.1 ? 1 : 0.5);
  
}, [chartData]);


  return (
    <div>
      {!loading && chartData.length > 0 && <div ref={chartContainer}></div>}
    </div>
  );
}

export default TimeSpendPerHour;
