import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Keyboard, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
// import Constants from "expo-constants";
import { AppContext } from "../../../context";

export default function SchedulingScreen({ navigation, route }) {
  let { team } = route.params;
  const [windowHeight, setWindowHeight] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);
  const { user, providers } = useContext(AppContext);

  const { first_name, last_name, email, mobile_number, id } = user;

  useEffect(() => {
    setWindowHeight(Dimensions.get("window").height - 150);
    setWindowWidth(Dimensions.get("window").width);

    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // console.log("schedule Iframe url", `${team?.attributes?.acuity_calendar_url}&field:10718516=${id}&firstName=${first_name}&lastName=${last_name}&phone=${mobile_number}&email=${email}`)
  }, []);

  const _keyboardDidShow = (e) => {
    const keyboardHeight = e.endCoordinates.height + 50;
    const winHeight = Dimensions.get("window").height;

    setWindowHeight(winHeight - keyboardHeight);
  };
  const _keyboardDidHide = () =>
    setWindowHeight(Dimensions.get("window").height - 150);

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
    <meta name="description" content="" />
  </head>
  <body style="margin-top: -20px;">
    <iframe src="${team?.attributes?.acuity_calendar_url}&field:10718516=${id}&firstName=${first_name}&lastName=${last_name}&phone=${mobile_number}&email=${email}" title="Schedule Appointment" width="100%" height="800" frameBorder="0"></iframe><script src="https://embed.acuityscheduling.com/js/embed.js" type="text/javascript"></script>
  </body>
  </html>`;

  return <WebView source={{ html }}></WebView>;
}

const styles = StyleSheet.create({});
