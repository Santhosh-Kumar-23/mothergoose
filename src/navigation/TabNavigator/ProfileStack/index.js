import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "./ProfileScreen";
import TeamProfileScreen from "./TeamProfileScreen";
import ProviderProfileScreen from "./ProvidersProfilesScreen";
import CareProviderScreen from "./CareProviderScreen";
import ProfileSettingsScreen from "./ProfileSettingsScreen";
import EmailSettingsScreen from "./EmailSettingsScreen";
import DeleteAccount from "./DeleteAccount";

import PregnancyDetails from "../../OnboardingStack/PregnancyDetails";
import PrivacyPageScreen from "../../OnboardingStack/PrivacyPageScreen";
import ProviderPreferences from "../../OnboardingStack/ProviderPreferences";

export default function HomeStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={"Profile"}
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Profile"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <ProfileScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Team Profile">
        {(props) => <TeamProfileScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Obstetrical Care Providers">
        {(props) => <ProviderProfileScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Provider Demographics"
        options={{ title: "Obstetrical Care Provider" }}
      >
        {(props) => <CareProviderScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Profile Settings">
        {(props) => <ProfileSettingsScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Privacy Page">
        {(props) => <PrivacyPageScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Email Settings">
        {(props) => <EmailSettingsScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Provider Preferences Settings">
        {(props) => <ProviderPreferences {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Delete Account">
        {(props) => <DeleteAccount {...props} />}
      </Stack.Screen>
      
      <Stack.Screen
        name="Pregnancy Details"
        options={{
          headerTitle: "",
        }}
      >
        {(props) => <PregnancyDetails {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
