import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { CommonActions } from "@react-navigation/native";

import ChatScreen from "./ChatScreen";
import ChatLobbyScreen from "./ChatLobbyScreen";

export default function ChatStack({ route, navigation }) {
  const Stack = createStackNavigator();
  const { care_manager_id } = route.params || {};

  useEffect(() => {
    return () => {
      /**
       * care_manager_id param is used to start chat directly with
       * a care manager. It is added to route.params when patient
       * is requests a chat directly from the care_manager demographics
       * screen.
       *
       * On chat stack unmount, set care_manager_id to undefined.
       * Setting care_manager_id to undefined removes
       * it from the Chat route.params, allowing Chat Stack to
       * work with a default behavior.
       */
      navigation.dispatch(
        CommonActions.setParams({ care_manager_id: undefined })
      );
    };
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={"Chat Lobby"}
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Chat Lobby"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <ChatLobbyScreen {...props} route={route} />}
      </Stack.Screen>
      <Stack.Screen name="Chat">
        {(props) => <ChatScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
