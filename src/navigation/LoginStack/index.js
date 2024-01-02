import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./LoginScreen";
import RecoverPasswordScreen from "./RecoverPasswordScreen";
import SupportFormScreen from "./SupportFormScreen";
import WelcomeScreen from "./WelcomeScreen";

import CreatePasswordScreen from "../OnboardingStack/CreatePasswordScreen";
import EnterDetailsScreen from "../OnboardingStack/EnterDetailsScreen";
import OnboardingEndScreen from "../OnboardingStack/OnboardingEndScreen";
import PrivacyPageScreen from "../OnboardingStack/PrivacyPageScreen";
import PregnancyDetails from "../OnboardingStack/PregnancyDetails";
import ProviderPreferences from "../OnboardingStack/ProviderPreferences";
import VerifyCodeScreen from "../OnboardingStack/VerifyCodeScreen";
import BetaFeedback from "../OnboardingStack/BetaFeedback";
import TabNavigator from "../TabNavigator";
export default function LoginStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={"Welcome"}
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Welcome"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <WelcomeScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Get Started">
        {(props) => <EnterDetailsScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Create Password">
        {(props) => <CreatePasswordScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Log In">
        {(props) => <LoginScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Recover Password">
        {(props) => <RecoverPasswordScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Verify Code">
        {(props) => <VerifyCodeScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Mother Goose Support">
        {(props) => <SupportFormScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Onboarding Complete">
        {(props) => <OnboardingEndScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Provider Preferences"
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitle: "",
        }}
      >
        {(props) => <ProviderPreferences {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Pregnancy Details"
        options={{
          headerTitle: "",
        }}
      >
        {(props) => <PregnancyDetails {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Privacy Page">
        {(props) => <PrivacyPageScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Beta Feedback"
        options={{
          headerTitle: "",
        }}
      >
        {(props) => <BetaFeedback {...props} />}
      </Stack.Screen>

      <Stack.Screen
                  name="Tab Navigator"
                  options={{headerShown: false, gestureEnabled: false }}
                  screenOptions={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                  }}
                >
                  {(props) => <TabNavigator {...props} />}
                </Stack.Screen>
    </Stack.Navigator>
  );
}
