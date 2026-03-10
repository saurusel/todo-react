import { createSlice } from "@reduxjs/toolkit";
import { getCookie } from "../shared/lib/cookies";
import {
    ACCESS_TOKEN_COOKIE,
    ACCESS_TOKEN_VALUE,
} from "../shared/constants/auth";

const initialState = {
    isAuth: getCookie(ACCESS_TOKEN_COOKIE) === ACCESS_TOKEN_VALUE,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(state) {
            state.isAuth = true;
        },
        logout(state) {
            state.isAuth = false;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
