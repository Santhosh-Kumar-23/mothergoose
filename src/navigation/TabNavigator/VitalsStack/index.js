import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import BloodPressureScreen from "./BloodPressureScreen";
import ContractionCounterScreen from "./ContractionCounterScreen";
import KickCounterScreen from "./KickCounterScreen";
import WeightScreen from "./WeightScreen";
import VitalsScreen from "./VitalsScreen";
import ArticleScreen from "../EducationStack/ArticleScreen";
import CustomWebview from '../HomeStack/CustomWebview';

export default function VitalsStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={"My Vitals"}
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="My Vitals"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <VitalsScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Blood Pressure"
        options={{
          headerTitle: "My Blood Pressure",
        }}
      >
        {(props) => <BloodPressureScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Kick Counter">
        {(props) => <KickCounterScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Contraction Counter">
        {(props) => <ContractionCounterScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Weight"
        options={{
          headerTitle: "My Weight",
        }}
      >
        {(props) => <WeightScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Article" options={{ headerShown: true }}>
        {(props) => <ArticleScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="CustomWebview" options={{ headerShown: false }}>
        {(props) => <CustomWebview {...props} />}
      </Stack.Screen>

    </Stack.Navigator>
  );
}
