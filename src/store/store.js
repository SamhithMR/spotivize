import { configureStore } from "@reduxjs/toolkit";

import Credentials from "./credentials";

export const store = configureStore({
    reducer: {
        Credentials: Credentials,
    },
});