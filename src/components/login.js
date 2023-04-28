
function Login(){
    const handleClick = async () => {
        const client_id = "4f183bac2d1844018b2fb19b76e70fed";
        // const client_id = "11b1a38a4b084705ac0b90b36ac1b234"; //fake
        const redirect_uri = "http://localhost:3000/";
        const api_uri = "https://accounts.spotify.com/authorize";
        const scope = [
          "user-read-private",
          "user-read-email",
          "user-modify-playback-state",
          "user-read-playback-state",
          "user-read-currently-playing",
          "user-read-recently-played"
        ];
        window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
          " "
        )}&response_type=token&show_dialog=true`;
      };
return(
    <div>
        <button onClick={handleClick}>login</button>
    </div>
)
}

export default Login