import { createSlice } from "@reduxjs/toolkit";

export const Credentials = createSlice({
    name: "Credentials",
    initialState: {
        token: ""
    },
    reducers: {
        getToken: (state, action) => {
            state.token = action.payload;
        }
    },
});

export const { getToken } = Credentials.actions;

export default Credentials.reducer;