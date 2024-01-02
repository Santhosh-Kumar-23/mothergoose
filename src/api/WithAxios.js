import { useEffect } from "react";
import { axiosInstance } from "../utils/axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";

// commented code is in case we decide to implement autologin in the future

export default function WithAxios({ children }) {
  useEffect(() => {
    axiosInstance.interceptors.request.use(
      async (config) => {
        // const authorization = await AsyncStorage.getItem("authorization");
        // if (authorization) {
        //   axiosInstance.defaults.headers.common.authorization = authorization;
        // }
        return config;
      },
      (error) => {
        console.log("err from axios request interceptors:", error);
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      async (response) => {
        const authorization = _.get(response, "headers.authorization");
        if (authorization && _.get(authorization, "length") > 10) {
          // await AsyncStorage.setItem("authorization", authorization);
          axiosInstance.defaults.headers.common.authorization = authorization;
        }
        return response;
      },
      (error) => {
        // https://stackoverflow.com/questions/59484512/logout-if-token-is-expired

        console.log("error in axiosInterceptors", { error });
        return Promise.reject(error);
      }
    );
  }, []);

  return children;
}
