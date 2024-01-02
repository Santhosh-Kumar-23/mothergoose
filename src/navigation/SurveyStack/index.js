import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SurveyScreen from "./SurveyScreen";
import SurveyQuestionScreen from "./SurveyQuestionScreen";
import OnboardingEndScreen from "../OnboardingStack/OnboardingEndScreen";
import TabNavigator from "../TabNavigator/HomeStack";
import HomeScreen from "../TabNavigator/HomeStack/HomeScreen"
export default function SurveyStack({ route }) {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={"Survey"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Survey">
        {(props) => <SurveyScreen {...props} route={route} />}
      </Stack.Screen>
      <Stack.Screen name="Survey Question" options={{ headerShown: true, headerLeft: null }}>
        {(props) => <SurveyQuestionScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Onboarding Complete">
        {(props) => <OnboardingEndScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Home"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <HomeScreen {...props} />}
      </Stack.Screen>

    </Stack.Navigator>
  );
}
