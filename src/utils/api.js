import axios from "axios";

const BASE_URL = "https://api.spotify.com/v1";
const SPOTIFY_TOKEN = process.env.REACT_APP_SPOTIFY_API;

const headers = {
    Authorization: "Bearer " + SPOTIFY_TOKEN,
};

export const fetchDataFromApi = async (url, params) => {
    try {
        const { data } = await axios.get(BASE_URL + url, {
            headers,
            params,
        });
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
};
