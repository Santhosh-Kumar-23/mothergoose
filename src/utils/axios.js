// import React, { useContext } from "react";
import axios from "axios";
import { Platform } from 'react-native'
// import Constants from "expo-constants";
import * as Sentry from "@sentry/react-native";

import DeviceInfo from 'react-native-device-info';

let systemVersion = DeviceInfo.getSystemVersion();
// console.log("systemVersion", systemVersion);


// console.log("API_URL --> ", process.env.API_URL)
// console.log("global.auth -->", global.auth)

// import { AppContext } from "../context";
// const { userJwtToken } = useContext(AppContext);

var header_data = global.auth != null ?
  {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Authorization": global.auth
  } :
  {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

export const axiosInstance = axios.create({
  baseURL: "https://stg.mothergoosehealth.com", //process.env.API_URL,
  headers: header_data
});

/**
 * Incerceptor to catch exceptions on try catch
 * blocks and log errors on Sentry.
 */

const axios_interceptors = () => {
  // axiosInstance.interceptors.response.use(
  //   async (response) => response,
  //   (error) => {
  //     // console.log("Sentry error", error)
  //     Sentry.captureException(error);
  //     throw error;
  //   }
  // );
}

if (Platform.OS == "android") {
  if (systemVersion > 8) {
    axios_interceptors();
  }
} else {
  axios_interceptors();
}



const SD_Date = {
  baseURL: `https://desk-api-${process.env.SENDBIRD_APP_ID_STAGING}.sendbird.com/v3`,
  headers: {
    "Content-Type": "application/json; charset=utf8",
    SENDBIRDDESKAPITOKEN: process.env.SENDBIRD_DESK_KEY_STAGING,
  }
}

export const sendbirdDeskInstance = axios.create(SD_Date);
