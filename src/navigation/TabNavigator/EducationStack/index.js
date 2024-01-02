import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ArticleScreen from "./ArticleScreen";
import EducationScreen from "./EducationScreen";
import SearchScreen from "./SearchScreen";

export default function EducationStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={"Education Modules"}
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Education Modules">
        {(props) => <EducationScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Article" options={{ headerShown: true }}>
        {(props) => <ArticleScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Search">
        {(props) => <SearchScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
