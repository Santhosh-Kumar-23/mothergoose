import React, { useContext } from "react";
import { View } from "react-native";

import AppText from "../../components/AppText";
import OnboardingFormTemplate from "../../components/OnboardingFormTemplate";
import { AppContext } from "../../context";

import SignUpComplete from "../../../assets/svgs/SignUpComplete.svg";

export default function OnboardingEndScreen({ navigation, route }) {
  const { user, setLoggedIn } = useContext(AppContext);

  const onSubmit = async () => {
    setLoggedIn(true);
    navigation.navigate("Tab Navigator");
  };

  return (
    <OnboardingFormTemplate
      body={completeImage()}
      header=""
      buttonText="Let's Go!"
      handleInput={onSubmit}
      navigation={navigation}
      subLink=""
      subLinkText=""
      subLinkNavigate=""
      type="null"
      endScreen
      hideSubLink
    />
  );
}

const completeImage = () => (
  <View style={{ width: "100%", marginTop: "20%" }}>
    <SignUpComplete width={"100%"} />
    <AppText bold h2 blue textAlignCenter>
      Congrats!
    </AppText>
    <AppText bold h2 blue textAlignCenter>
      You are now a member of Mother Goose Health! We're so excited you have
      allowed us to be part of your pregnancy journey
    </AppText>
  </View>
);
