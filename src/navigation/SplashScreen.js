import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
// const  MGLogo = require("../../assets/mgAppIcon.png") ;
import MGLogo from "../../assets/svgs/MGLogo.svg";
// import { AppContext } from "../context";

const SplashScreen = ({ navigation, route }) =>{
  const [ready, setReady] = useState(false);

  const loadApp = async () => {
    return setTimeout(() => {
      setReady(true);
    }, 1500);
  };

  useEffect(() => {
    if (ready) {
      navigation.navigate("Login Stack");
    } else {
      loadApp();
    }
  }, [ready]);

  return (
    <View style={styles.container}>
      {/* <Image source={MGLogo} style={{height:700, width:"90%", resizeMode:"contain"}} /> */}
      <MGLogo height={"55"} width={"157"} style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor:"#fff",
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  icon: {
    alignSelf: "center",
  },
});

export default SplashScreen;