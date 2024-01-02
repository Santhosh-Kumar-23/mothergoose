import React, { useEffect, useContext, useRef, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppState, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeIcon from "../../../assets/svgs/HomeIcon.svg";
import ProfileIcon from "../../../assets/svgs/ProfileIcon.svg";
import LibraryIcon from "../../../assets/svgs/LibraryIcon.svg";
import HeartIcon from "../../../assets/svgs/HeartIcon.svg";
import ChatIcon from "../../../assets/svgs/ChatIcon.svg";

import HomeStack from "./HomeStack";
import EducationStack from "./EducationStack";
import VitalsStack from "./VitalsStack";
import ProfileStack from "./ProfileStack";
import ChatStack from "./ChatStack";
import { AppContext } from "../../context";
import { COLORS } from "../../utils/styles";
import { is_jwt_token_expired } from "../../utils/helpers";
import _ from "lodash";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const iconSize = 30;
const active = COLORS.activeIcon;
const inactive = COLORS.inactiveIcon;

export default function TabNavigator({ navigation, route }) {
  /** Reference app state */
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const insets = useSafeAreaInsets();
  const { loggedIn, userJwtToken, user, getUserCredentials, signInUser, newMsg } = useContext(AppContext);

  useEffect(() => {
    if (!loggedIn) {
      navigation.navigate("Log In");
    }
  }, [loggedIn]);

  /** Refresh user when token expires */
  const getNewAccessToken = async () => {
    let user_credentials = await getUserCredentials();
    /** remove old authorization from axios instance */
    await signInUser(user_credentials?.email, user_credentials?.password);
  };

  /** Check token expiration */
  const checkJWTExpiration = async () => {
    if (is_jwt_token_expired(userJwtToken)) {
      getNewAccessToken();
    }
  };

  /**
   * Check which status is app in. (inactive, background, forground, active)
   */
  useEffect(() => {
    if (!_.isEmpty(user)) {
      const subscription = AppState.addEventListener(
        "change",
        (nextAppState) => {
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
          ) {
            /**
             * Implement method here for when
             * app is on foreground/active.
             */
            checkJWTExpiration();
          }

          appState.current = nextAppState;
          setAppStateVisible(appState.current);
          // console.warn("AppState", appState.current);
        }
      );

      // return () => {
      //   subscription.remove();
      // };
    }
  }, [user]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          if (route.name === "Home") {
            return (
              <HomeIcon height={iconSize} color={focused ? active : inactive} />
            );
          } else if (route.name === "Profile") {
            return (
              <ProfileIcon
                height={iconSize - 2}
                width={iconSize}
                color={focused ? active : inactive}
                style={[
                  styles.profileIcon,
                  styles.inactive,
                  focused && styles.active,
                ]}
              />
            );
          } else if (route.name === "Education") {
            return (
              <LibraryIcon
                height={iconSize}
                color={focused ? active : inactive}
              />
            );
          } else if (route.name === "Vitals") {
            return (
              <HeartIcon
                height={iconSize}
                color={focused ? active : inactive}
              />
            );
          } else if (route.name === "Chat") {
            return (
              <>
                <ChatIcon height={iconSize} color={focused ? active : inactive} />
                {(newMsg) && <View style={{ height: 6, width: 6, borderRadius: 6 / 2, backgroundColor: COLORS.blueLogo, marginBottom: -6 }} />}
              </>

            );
          }
        },
      })}
      tabBarOptions={{
        showLabel: false,
        style: [
          styles.navigator,
          {
            height: insets.bottom > 15 ? 60 + insets.bottom : 80,
            paddingBottom: insets.bottom > 15 ? insets.bottom : 15,
          },
        ],
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ unmountOnBlur: true }} />
      <Tab.Screen name="Education" component={EducationStack} options={{ unmountOnBlur: true }} />
      <Tab.Screen name="Vitals" component={VitalsStack} options={{ unmountOnBlur: true }} />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen name="Profile" component={ProfileStack}
        options={{ unmountOnBlur: true }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  active: {
    borderColor: COLORS.activeIcon,
  },
  inactive: {
    borderColor: COLORS.inactiveIcon,
  },
  navigator: {
    height: 80,
    marginTop: 0,
    paddingBottom: 15,
    paddingTop: 15,
  },
  profileIcon: {
    borderRadius: 15,
    borderWidth: 2,
  },
});
