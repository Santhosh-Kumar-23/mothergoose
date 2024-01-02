import React, { useContext, useState } from "react";
import { StatusBar } from 'react-native'
import { triggerOTP, getUserState } from "../../api";
import AppButton from "../../components/AppButton";
import AppText from "../../components/AppText";
import OnboardingFormTemplate from "../../components/OnboardingFormTemplate";
import Calculate_age from "../../utils/AgeCalc";
import { AppContext } from "../../context";
import { dobMDYRegex } from "../../utils/validations";
import _ from "lodash";
// import analytics from '@react-native-firebase/analytics';

export default function EnterDetailsScreen({ navigation, route }) {
  const { setUser, setError, setUser_State, setRegUser, is_test } = useContext(AppContext);
  const { errorCount } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const [userExit, setUserExit] = useState(false);

  const [errorTitle, setErrorTitle] = useState("We are sorry");

  const [errorSubtitle, setErrorSubtitle] = useState("The name and date of birth combination you entered do not match your information in your providers records.");

  const inputs = [
    {
      label: "First Name",
      placeholderText: "First Name",
      name: "first_name",
      validation: {
        required: { value: true, message: "First Name is required" },
      },
    },
    {
      label: "Last Name",
      placeholderText: "Last Name",
      name: "last_name",
      validation: {
        required: { value: true, message: "Last Name is required" },
      },
    },
    {
      label: "Date of Birth",
      placeholderText: "mm/dd/yyyy",
      name: "dob",
      validation: {
        required: { value: true, message: "Date of birth is required" },
        validate: (value) => dobMDYRegex.test(value),
      },
      type: "date",
    },
  ];

  const errorMessage =
    errorCount < 3
      ? "Please enter the name and date of birth exactly as they appear in your provider’s records."
      : "Please click here for help.";

  const buttonText = userExit ? "Login" : errorCount < 3 ? "Try again" : "Contact Support";

  const errorBody = (
    <>
      <AppText textAlignCenter h4 bold blue mb3>
        {!userExit && errorMessage}
      </AppText>
      <AppButton blue title={buttonText} onPress={() => modalOnPress()} />
    </>
  );



  const modalOnPress = () => {
    setModalVisible(false);

    if (userExit) {
      return navigation.navigate("Log In");
    }
    else if (errorCount < 3) {
      return navigation.navigate("Get Started", { errorCount: errorCount + 1 });
    } else {
      return navigation.navigate("Mother Goose Support");
    }

  };

  const handleSignUp = async ({ first_name, last_name, dob, nycheck }) => {


    // This is to take our mm/dd/yyyy format and make it the yyyy/mm/dd format BE expects
    // TODO: clean this up

    // const Age = Calculate_age(dob);
    // if (Age) {

    //   try {
    //     await analytics().logEvent('UserAge', {
    //       Age: Age.toString()
    //       // UserName: first_name + " " + last_name
    //     })

    //   }
    //   catch (err) {
    //     console.log(err)
    //   }

    //   try {
    //     // to test the age setUserProperties and logEvent
    //     await analytics().setUserProperties({
    //       Prop_Age: Age.toString(),
    //     });
    //   }
    //   catch (err) {
    //     console.log("Age setUserProperties !!!", err)
    //   }
    // }

    const bdayArr = dob.split("/");
    const date_of_birth = `${bdayArr[2]}-${bdayArr[0]}-${bdayArr[1]}`;
    try {

      const res = await triggerOTP(first_name, last_name, date_of_birth);
      if (res.message !== "Code sent") {
        if (res.message == "Welcome back! You are already part of the Mother Goose family. Please login.") {
          setUserExit(true)
          setErrorTitle("Hi " + first_name + ",");
          setErrorSubtitle(res.message)
          setModalVisible(true);
        } else {
          setUserExit(false);
          setErrorTitle("We are sorry");
          setErrorSubtitle("The name and date of birth combination you entered do not match your information in your providers records.");
          setModalVisible(true);
        }

      } else {
        setUser({ first_name, last_name, date_of_birth });

        const Age = Calculate_age(dob);

        // Hidden it to resolve the ad related err in playconsole

        // if (Age && (is_test != true)) {

        //   console.log("analytics update -!-!-! afterReg is_test", is_test)
        //   try {
        //     analytics().setUserProperties({
        //       Age: Age.toString(),
        //     });

        //     analytics().logEvent('UserAge', {
        //       Age: Age.toString(),
        //       UserName: first_name + " " + last_name
        //     })

        //   }
        //   catch (err) {
        //     console.log(err)
        //   }
        // }

        // Get the country / City/ State with name and DOB
        const res_state = await getUserState(first_name, last_name, date_of_birth);
        if (res_state.message == "success") {
          if (res_state.state.id == '37') { // 37 NY user
            setUser_State(res_state.state)
            setRegUser(res_state.user)
          }
        } else {
          setUser_State({})
          setRegUser({})
        }

        navigation.navigate("Verify Code", { isLogin: false });
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  return (
    <>
      <StatusBar hidden={false} />
      <OnboardingFormTemplate
        // getStart
        type="enterDetails"
        inputValues={inputs}
        body={[
          "Welcome! Let's set up your account!",
          "\n",
          "Please enter your name as it appears in your medical records.",
        ]}
        header="Please confirm your identity"
        buttonText="Continue"
        handleInput={(data) => {
          handleSignUp(data);
        }}
        navigation={navigation}
        subLink="We are here"
        subLinkText="Need to update this information?"
        modalVisible={modalVisible}
        modalTitle={errorTitle}
        modalSubtitle={errorSubtitle}
        modalBody={errorBody}
        modalClose={modalOnPress}
      />
    </>

  );
}
