import useFetch from './hooks/useFetch'

function App() {

  const {data, loading} = useFetch(`/recommendations?market=IN&limit=10&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical,country&seed_tracks=0c6xIDDpzE81m2q797ordA`)

  return (
    <div className="App">
      {loading && <div>loading...</div>}
      {data ?
      
       <div>{JSON.stringify(data)}</div> 
       
       : <h1>loading</h1>}
    </div>
  );
}

export default App;
