import React from "react";
import { StyleSheet, View, Pressable, StatusBar, SafeAreaView, Platform, Alert, BackHandler, TouchableOpacity } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from "../../utils/styles";
import MGLogo from "../../../assets/svgs/MGLogo.svg";
import WelcomeGraphic from "../../../assets/svgs/WelcomeGraphic.svg";
import AppButton from "../../components/AppButton";
import AppText from "../../components/AppText";
import AppUpdateCheck from '../../utils/AppUpdateCheck'
import { useNetInfo } from "@react-native-community/netinfo";
import RNExitApp from 'react-native-exit-app';
import { useFocusEffect } from "@react-navigation/native";
export default function WelcomeScreen({ navigation }) {

  const netInfo = useNetInfo();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Confirm Exit!",
          "Are you sure, you want to exit?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { text: "YES", onPress: () => BackHandler.exitApp() }
          ]);

        // Return true to stop default back navigaton
        // Return false to keep default back navigaton
        return true;
      };

      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackPress
        );
      };
    }, []),
  );

  const onNavPress = async (type) => {
    if (netInfo.isConnected == true) {

      // console.log("netInfo.isConnected", netInfo.isConnected)
      const check = await AppUpdateCheck()
      if (type == "start") {
        if (check) {
          navigation.navigate("Get Started", { errorCount: 1 })
        }
      } else {
        if (check) {
          navigation.navigate("Log In")
        }
      }
    } else {

      var err_msg = "No Internet connection. Make sure that Wi-Fi or mobile data is turned on, then try again."
      Alert.alert(
        "Oops",
        err_msg,
        [
          {
            text: "OK",
            onPress: () => {
              Platform.OS == "android" ?
                BackHandler.exitApp() :
                RNExitApp.exitApp()
            },
            style: "cancel"
          }
        ]
      );
    }

  }

  return (

    <LinearGradient
      colors={[COLORS.gradientDark, COLORS.gradientLight]}
      style={styles.container}
    >
      <StatusBar hidden={Platform.OS == "android" ? true : false} />
      <MGLogo height={55} width={157} />
      <WelcomeGraphic style={styles.border} />
      {/* <View style={styles.container}></View> */}
      <View style={styles.buttonContainer}>
        <AppButton
          blue
          onPress={async () => {
            onNavPress("start");

          }}
          title={"Get started"}
        />
        <View
          style={styles.loginText}
        // onPress={async () => {
        //   onNavPress("login");
        // }}
        // onPress={() =>
        //   navigation.navigate("Onboarding Stack", {
        //     screen: "Provider Preferences",
        //   })
        // }
        >
          <AppText white small>
            Already have an account?{" "}
          </AppText>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={async () => {
              onNavPress("login");
            }}
          >
            <AppText white underline small bold style={{ fontSize: 15 }}>
              Log in
            </AppText>
          </TouchableOpacity>

        </View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "stretch",
  },
  container: {
    alignItems: "center",
    alignSelf: "stretch",
    height: "100%",
    justifyContent: "space-around",
    padding: 20,
    width: "100%",
  },
  loginText: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
