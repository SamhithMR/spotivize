import axios from "axios";

const BASE_URL = "https://api.spotify.com/v1";
const client_id = process.env.REACT_APP_client_id;
const client_secret = process.env.REACT_APP_client_secret;

// request an access token
const authOptions = {
  method: 'POST',
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: 'grant_type=client_credentials'
};

export const fetchDataFromApi = async (url, params) => {
    try {
      const { data: { access_token } } = await axios(authOptions);
      const headers = {
        Authorization: "Bearer " + access_token,
      };
      let data;
      const response = await axios.get(BASE_URL + url, { headers, params });
      data = response.data;
      return data;
    } catch (err) {
      console.log(err);
      return err;
    }
  };
  
