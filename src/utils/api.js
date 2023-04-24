import axios from "axios";
const BASE_URL = "https://api.spotify.com/v1";

export const fetchDataFromApi = async (url, token) => {
    try {
      const headers = {
        Authorization: "Bearer " + token,
        "Content-Type" : "application/json"
      };
      const {data} = await axios.get(BASE_URL + url, { 
        headers
     });
      return data;
    } catch (err) {
      console.log(err);
      return err;
    }
  };