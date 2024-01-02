import React, { useContext, useEffect, useState } from "react";
import OnboardingFormTemplate from "../../components/OnboardingFormTemplate";
import { AppContext } from "../../context";
import AppUpdateCheck from '../../utils/AppUpdateCheck'
// import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, Pressable, StyleSheet, View, StatusBar } from "react-native";

import { Alert, Platform, BackHandler } from 'react-native'
import RNExitApp from 'react-native-exit-app';
// import NetInfo from "@react-native-community/netinfo";
import { useNetInfo } from "@react-native-community/netinfo";

import { CheckbiometricEnabled } from "../../utils/CheckbiometricEnabled";
import { authenticateFingerPrint } from "../../utils/authenticateFingerPrint";
import { useBiometrics } from "../../utils/useBiometrics";
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import { COLORS } from "../../utils/styles";

export default function LoginScreen({ navigation, route }) {
  const netInfo = useNetInfo();
  const { showBioLogin, isInitialized } = useBiometrics();
  // console.log("showBioLogin", showBioLogin)
  // console.log("isInitialized", isInitialized)
  const { getUserCredentials, signInUser } = useContext(AppContext);
  const [apiError, setApiError] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [userInputs, setUserInputs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAvail, setUserAvail] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("We are sorry");

  const [errorSubtitle, setErrorSubtitle] = useState("This account does not exist, please login with a valid user ID and password");
  const set_user_inputs = async () => {

    let user_credentials = await getUserCredentials();
    // let user_credentials  = await Keychain.getGenericPassword();
    await setUserInputs([
      {
        name: "email",
        label: "Email",
        placeholderText: "Please enter your email",
        validation: {
          required: { value: true, message: "Email is required" },
        },
        keyboardType: "email-address",
        value: user_credentials?.email || "",
      },
      {
        name: "password",
        label: "Password",
        placeholderText: "Please enter your password",
        validation: {
          required: { value: true, message: "Password is required" },
        },
        secureTextEntry: true,
        apiError,
        // value: user_credentials?.password || "",
        value: "",
      },
    ]);

    if (user_credentials?.email && user_credentials?.password) {
      setUserAvail(true)
    }
  };


  const handleSubmitLogin = async (data, reset) => {

    await setLoading(true);
    const { email, password } = data;


    try {
      const res = await signInUser(email, password);

      if (res == "success") {
        setLoading(false);
        navigation.navigate("Tab Navigator");
      } else {
        setLoading(false);
        // setApiError("Invalid username or password");
        // setErrorVisible(true);
        setModalVisible(true);
        setErrorSubtitle(res);

      }
    } catch (e) {
      setLoading(false);
      console.log("e", e)
      // setApiError("Invalid username or password");
      // setErrorVisible(true);
      setModalVisible(true);
      setErrorSubtitle("Something went wrong");
    }



    // try {
    //   await signInUser(email, password);
    //   setLoading(false);
    //   navigation.navigate("Tab Navigator");
    // } catch (error) {
    //   setLoading(false);
    //   setApiError("Invalid username or password");
    //   setErrorVisible(true);
    // }
  };

  /** Set login inputs data */

  // const onBioLogin = () => {
  //   CheckbiometricEnabled().then(async res => {
  //     if (res == true) {
  //       // console.log("Flag 1");
  //       let user_credentials = await getUserCredentials();
  //       // if creds available,
  //       if (user_credentials) {
  //         await authenticateFingerPrint()
  //           .then(async (res) => {
  //             // console.log("Flag 2");
  //             // API call here
  //             await handleSubmitLogin(user_credentials)
  //           })
  //           .catch(e => {
  //             // console.log(res, 'in here');
  //             // console.log('authenticateFingerPrint err', e);
  //           });
  //       }
  //     } else {
  //       alert(res);
  //     }
  //   });
  // }



  const handleBioLogin = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();

      const { available, biometryType } = await rnBiometrics.isSensorAvailable();

      if (!available || (Platform.OS === 'ios' && biometryType !== BiometryTypes.FaceID) || (Platform.OS === 'android' && biometryType !== BiometryTypes.Biometrics)) {
        const authType = Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint';
        Alert.alert('Oops!', `${authType} is not available on this device.`);
        return;
      }

      let user_credentials = await getUserCredentials();
      console.log(`User Id is ${user_credentials?.email}`);

      const timestamp = Math.round(new Date().getTime() / 1000).toString();
      const payload = `${user_credentials?.email}__${timestamp}`;
      console.log(`Payload before signature: ${payload}`);

      // Check if keys exist, if not, create them
      const { keysExist } = await rnBiometrics.biometricKeysExist();
      if (!keysExist) {
        await rnBiometrics.createKeys();
      }

      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: `Sign in with ${user_credentials?.email}`,
        payload,
      });

      if (!success) {
        Alert.alert('Oops!', 'Something went wrong during authentication. Please try again.');
        return;
      }

      // Use the signature for further authentication if needed
      // ...

      handleSubmitLogin(user_credentials)
    } catch (error) {
      console.error("BioLogin Error:", error);
      Alert.alert('Error!', 'An error occurred during bio authentication. Please try again.');
    }
  };

  useEffect(() => {
    // onBioLogin()
    set_user_inputs();
    netInfo.isConnected && AppUpdateCheck();
  }, [])


  return (
    <>
      <StatusBar hidden={false} />
      {loading ?
        <View style={styles.loaderDiv}>
          <ActivityIndicator size="large" />
        </View>
        :
        <OnboardingFormTemplate
          header="Welcome Back!"
          type="enterDetails"
          headerBig
          inputValues={userInputs}
          navigation={navigation}
          buttonText="Log In"
          handleInput={async (data, setError, reset) => {
            netInfo.isConnected == true ?
              handleSubmitLogin(data, reset)
              : // netInfo.isConnected == false &&
              Alert.alert(
                "Oops",
                "No Internet connection. Make sure that Wi-Fi or mobile data is turned on, then try again.",
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
          button2Text={userAvail ? "Use Biometric Authentication" : false}
          handle2submit={() => {
            // console.log("bio clicked")
            // Platform.OS == "android" ?
            //   onBioLogin()
            // : 
            handleBioLogin()
          }}

          subLink="Reset it here"
          subLinkText="Forgot your password?"
          subLinkNavigate="Recover Password"
          setErrorVisible={setErrorVisible}

          modalVisible={modalVisible}
          modalTitle={errorTitle}
          modalSubtitle={errorSubtitle}
          // modalBody={errorBody}
          modalClose={() => { setModalVisible(false); }}
        />
      }
    </>

  );
}

const styles = StyleSheet.create({
  loaderDiv: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white
  }
});
