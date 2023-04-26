import { createSlice } from "@reduxjs/toolkit";

export const Credentials = createSlice({
    name: "Credentials",
    initialState: {
        token: "",
        recentTracks:{data:{},loading:true}
    },
    reducers: {
        getToken: (state, action) => {
            state.token = action.payload;
        },
        getTrack: (state, action)=>{
            state.recentTracks = action.payload
        }
    },
});

export const { getToken, getTrack } = Credentials.actions;

export default Credentials.reducer;