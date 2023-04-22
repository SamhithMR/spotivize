import { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import * as d3 from "d3";

function Recent() {

  const beforeTimestampInSeconds = Math.floor((1682121541561 - (24 * 60 * 60 * 1000)) / 1000);
  
  const { data, loading } = useFetch(
  //  `/recommendations?market=IN&limit=10&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical,country&seed_tracks=0c6xIDDpzE81m2q797ordA`
    // `/me`
    `/me/player/recently-played?before=1682035141`
  );

  useEffect(() => {
    console.log(data);
  }, []);

  return (
    <div>
        {!loading && <div> {JSON.stringify(data)} </div>}
    </div>
  )
}

export default Recent;

