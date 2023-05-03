import { createSlice } from "@reduxjs/toolkit";

export const Credentials = createSlice({
    name: "Credentials",
    initialState: {
        token: "",
        recentTracks:{data:{},loading:true},
        deviceID:""
    },
    reducers: {
        getToken: (state, action) => {
            state.token = action.payload;
        },
        getTrack: (state, action)=>{
            state.recentTracks = action.payload
        },
        getdeviceID: (state, action)=>{
            state.deviceID = action.payload
        }
    },
});

export const { getToken, getTrack, getdeviceID} = Credentials.actions;

export default Credentials.reducer;