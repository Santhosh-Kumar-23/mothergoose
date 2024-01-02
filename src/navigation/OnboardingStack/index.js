import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ConfirmSignupProfile from "./ConfirmSignupProfile";
import EditSignupProfile from "./EditSignupProfile";
import EnterDetailsScreen from "./EnterDetailsScreen";
import OnboardingEndScreen from "./OnboardingEndScreen";
import PrivacyPageScreen from "./PrivacyPageScreen";
import ProviderPreferences from "./ProviderPreferences";

// TODO: EVALUATE LOCATION OF SCREENS
// import CreatePasswordScreen from "./CreatePasswordScreen";
// import PregnancyDetails from "./PregnancyDetails";
// import VerifyCodeScreen from "./VerifyCodeScreen";

import SupportFormScreen from "../LoginStack/SupportFormScreen";

export default function OnboardingStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={"Get Started"}
      screenOptions={{
        // headerShown: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Get Started" options={{ headerLeft: null }}>
        {(props) => <EnterDetailsScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Confirm Profile" options={{ headerLeft: null }}>
        {(props) => <ConfirmSignupProfile {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Edit Signup Profile">
        {(props) => <EditSignupProfile {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Provider Preferences">
        {(props) => <ProviderPreferences {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Onboarding Complete">
        {(props) => <OnboardingEndScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Mother Goose Support">
        {(props) => <SupportFormScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Privacy Page">
        {(props) => <PrivacyPageScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
