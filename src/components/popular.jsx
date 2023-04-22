import { useState, useEffect } from 'react';
import useFetch from './hooks/useFetch';
import * as d3 from "d3";

function Popular() {
  const [tracks, setTracks] = useState({name:[],popularity:[]});
  const { data, loading } = useFetch(
    `/recommendations?market=IN&limit=10&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical,country&seed_tracks=0c6xIDDpzE81m2q797ordA`
  );

  useEffect(() => {
    if (data?.tracks?.length) {
      const trackNames = data.tracks.map((track) => track.name);
      const trackpopularity = data.tracks.map((track) => track.popularity);
      setTracks({ name: trackNames, popularity:trackpopularity });
    }
  }, [data]);


  useEffect(() => {
    const svg = d3.select('#chart');
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height')
    ;

    const x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(tracks.name);

    const y = d3.scaleLinear().range([height, 0]).domain([0, 100]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(0,100) rotate(-60)');

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(10))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Popularity');

    g.selectAll('.bar')
      .data(tracks.name)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d))
      .attr('y', (d, i) => y(tracks.popularity[i]))
      .attr('width', x.bandwidth())
      .attr('height', (d, i) => height - y(tracks.popularity[i]));

  }, [tracks]);

  // return (
  //   <div className="App">
  //     {!loading && <div>{JSON.stringify(tracks)}</div>}
  //   </div>
  // );

  return (
    <div className="App">
      {!loading && (
        <svg id="chart" width="560" height="300">
          <g></g>
        </svg>
      )}
    </div>
  );
}

export default Popular;
