import { createApi } from "@reduxjs/toolkit/query/react";
import {
  //   getUser,
  getToken,
  //   logOut,
  //   setCredentials,
} from "../features/auth/authSlice";
import axios from "axios";
// import { Mutex } from "async-mutex";

const axiosBaseQuery = async (args, api, extra) => {
  const baseUrl = `http://127.0.0.1:8000/api`;
  const token = getToken(api.getState());
  const defaultHeaders = {
    "Content-Type": "application/json",
  };
  if (token) defaultHeaders["Authorization"] = `Bearer ${token}`;

  try {
    let res;
    let options;
    if (typeof args === "string") {
      options = { url: baseUrl + args };
    } else {
      options = { ...args, url: baseUrl + args.url };
    }

    res = await axios({
      ...options,
      headers: options?.headers
        ? { ...options.headers, ...defaultHeaders }
        : defaultHeaders,
    });
    return {
      data: res.data,
    };
  } catch (axiosErr) {
    console.error(axiosErr.response);
    return {
      error: {
        status: axiosErr?.response?.status,
        data: axiosErr?.response?.data || axiosErr?.message,
      },
    };
  }
};

// const mutex = new Mutex();
const baseQueryReauth = async (args, api, extra) => {
  //   await mutex.waitForUnlock();
  let res = await axiosBaseQuery(args, api, extra);
  //   if (res?.error?.status === 401 && args !== "/refresh") {
  //     if (!mutex.isLocked()) {
  //       const release = await mutex.acquire();
  //       try {
  //         const refRes = await axiosBaseQuery("/refresh", api, extra);
  //         if (refRes.data) {
  //           const username = getUser(api.getState());
  //           api.dispatch(setCredentials({ username, ...refRes.data }));
  //           res = await axiosBaseQuery(args, api, extra);
  //         } else {
  //           api.dispatch(logOut());
  //         }
  //       } finally {
  //         release();
  //       }
  //     } else {
  //       await mutex.waitForUnlock();
  //       res = await axiosBaseQuery(args, api, extra);
  //     }
  //   }

  return res;
};

export const apiSlice = createApi({
  baseQuery: baseQueryReauth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({}),
  keepUnusedDataFor: 0,
});
