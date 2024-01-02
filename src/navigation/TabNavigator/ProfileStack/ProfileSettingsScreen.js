import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import _ from "lodash";

import AppContainer from "../../../components/AppContainer";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppText from "../../../components/AppText";
import Slider from "../../../components/Slider";
import Link from "../../../components/Link";
import OptionsModal from "../../../components/OptionsModal";
import { MARGINS, COLORS } from "../../../utils/styles";
import RightArrow from "../../../../assets/svgs/RightArrow.svg";
import { AppContext } from "../../../context";
import AppScrollView from "../../../components/AppScrollView";
import { handleSetPushNotifications } from "../../../api";
import { getPrivacyPages } from "../../../utils/helpers";
import VersionCheck from 'react-native-version-check';
import EncryptedStorage from 'react-native-encrypted-storage';
import Session_update from "../../../utils/session_update"
// import Constants from "expo-constants";

export default function ProfileSettings({ navigation }) {

  const currentVersion = VersionCheck.getCurrentVersion();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [apptReminder, setApptReminder] = useState(true);
  const [kickCounterReminder, setKickCounterReminder] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const { user, setLoggedIn, setUser, setError, userAddress, setIs_user } = useContext(AppContext);
  const [privacyPages, setPrivacyPages] = useState([]);

  const { user_app_preference } = user || {};
  const { push_notifications_enabled, daily_kick_counter_reminder_enabled, appointment_reminder_enabled } = user_app_preference?.attributes || {};

  const initialize_privacy_pages = async () => {
    const pages = await getPrivacyPages(false);
    setPrivacyPages(pages);
  };
  /**
   * Set pushNotifications first time page loads
   */
  useEffect(() => {
    if (!_.isEmpty(user_app_preference)) {
      setPushNotifications(push_notifications_enabled);
      appointment_reminder_enabled != null && setApptReminder(appointment_reminder_enabled);
      daily_kick_counter_reminder_enabled != null && setKickCounterReminder(daily_kick_counter_reminder_enabled)
    }
  }, [user_app_preference]);

  useEffect(() => {
    initialize_privacy_pages();
  }, []);

  const handleNotifications = async (option) => {

    try {
      const res = await handleSetPushNotifications(
        user.id,
        option == "push" ? !pushNotifications : pushNotifications,
        option == "appt" ? !apptReminder : apptReminder,
        option == "kick" ? !kickCounterReminder : kickCounterReminder
      );

      /** Keep the user context updated */
      if (!_.isEmpty(user_app_preference)) {
        let userCopy = Object.assign(user, {});

        if (option == "push")
          userCopy.user_app_preference.attributes.push_notifications_enabled = !pushNotifications;
        else if (option == "appt")
          userCopy.user_app_preference.attributes.appointment_reminder_enabled = !apptReminder;
        else if (option == "kick")
          userCopy.user_app_preference.attributes.daily_kick_counter_reminder_enabled = !kickCounterReminder;

        setUser(userCopy);
      }

      if (option == "push")
        setPushNotifications(!pushNotifications);
      else if (option == "appt")
        setApptReminder(!apptReminder);
      else if (option == "kick")
        setKickCounterReminder(!kickCounterReminder);

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <AppSafeAreaView edges={["left", "right"]}>
        <AppScrollView>
          <AppContainer>
            <AppText h2 bold mb3>
              Account settings
            </AppText>
            <View style={[styles.container, styles.boxShadow]}>
              <AppText gray h3 style={styles.extraPadding}>
                Pronoun Preference
              </AppText>
              <Pressable
                style={[styles.extraPadding, styles.row]}
                onPress={() => setOpenModal(true)}
              >
                <AppText style={styles.mh3} numberOfLines={1}>
                  {user.pronouns || "Choose"}
                </AppText>
                <RightArrow
                  height={12}
                  width={12}
                  style={styles.extraPadding}
                />
              </Pressable>
            </View>
            <View style={[styles.container, styles.boxShadow]}>
              <AppText gray h3 style={styles.extraPadding}>
                Provider Preferences
              </AppText>
              <Pressable
                style={[styles.extraPadding, styles.row]}
                onPress={() =>
                  navigation.navigate("Provider Preferences Settings", {
                    settings: true,
                  })
                }
              >
                <AppText style={styles.mh3} numberOfLines={1}>
                  {"Choose"}
                </AppText>
                <RightArrow
                  height={12}
                  width={12}
                  style={styles.extraPadding}
                />
              </Pressable>
            </View>
            <View style={[styles.container, styles.boxShadow, styles.mb4]}>
              <AppText gray h3 style={styles.extraPadding}>
                Email
              </AppText>
              <Pressable
                style={[styles.extraPadding, styles.row]}
                onPress={() => navigation.navigate("Email Settings")}
              >
                <AppText style={styles.mh3}>{user.email}</AppText>
                <RightArrow
                  height={12}
                  width={12}
                  style={styles.extraPadding}
                />
              </Pressable>
            </View>
            <AppText h2 bold mb3>
              Notifications
            </AppText>
            <Slider
              selected={pushNotifications}
              setSelected={() => { handleNotifications("push") }}
              title="Allow push notifications"
              disclaimer="We'll use push notifications to notify you about..."
            />
            <Slider
              selected={apptReminder}
              setSelected={() => { handleNotifications("appt") }}
              title="Appointment Reminders"
              disclaimer="Same day appointment reminders..."
            />
            <Slider
              selected={kickCounterReminder}
              setSelected={() => { handleNotifications("kick") }}
              title="Daily Kick Counter Reminder"
              disclaimer="After 36 weeks we'll remind you daily..."
            />
            <AppText h2 bold mb3>
              Legal Notifications
            </AppText>
            {privacyPages.map((page, index) => {
              if (userAddress && (page.id == "5VIJyL8ntLsbOZ5FKrTv9R" && userAddress.id != "37")) {
                return (
                  <View />
                );
              } else {
                return (
                  <Pressable
                    key={index}
                    style={styles.container}
                    onPress={() =>
                      navigation.navigate("Privacy Page", {
                        page,
                      })
                    }
                  >
                    <AppText>{page.title}</AppText>
                    <RightArrow
                      height={12}
                      width={12}
                      style={styles.extraPadding}
                    />
                  </Pressable>
                );
              }

            })}
            <AppText style={styles.extraPadding}>
              {/* Version {Platform.OS == "android" ? process.env.ANDROID_VERSION + "" : process.env.IOS_VERSION + ""} */}
              Version {currentVersion + ""}
            </AppText>
            <Link
              style={styles.extraPadding}
              onPress={async () => {
                // setLoggedIn(false)
                await setIs_user(true)
                await navigation.navigate("Welcome");
                await EncryptedStorage.getItem("user_id") && Session_update("profile")

              }}
            >
              Sign out
            </Link>
            <Pressable
              style={styles.container}
              onPress={() =>
                navigation.navigate("Delete Account")
              }
            >
              <AppText black>Delete Account</AppText>
              <RightArrow
                height={12}
                width={12}
                style={styles.extraPadding}
              />
            </Pressable>
          </AppContainer>
        </AppScrollView>
      </AppSafeAreaView>
      <OptionsModal
        open={openModal}
        setOpen={setOpenModal}
        setSelected={(pronouns) => setUser({ ...user, pronouns })}
        title="Choose Your Pronouns"
        options={["She/Her", "He/Him", "They/Them", "Rather not say"]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  boxShadow: {
    marginBottom: MARGINS.mb2,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3
  },
  container: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: MARGINS.mb2,
    padding: MARGINS.mb2,
    paddingHorizontal: MARGINS.mb2,
    width: "100%",
  },
  extraPadding: {
    padding: MARGINS.mb2,
  },
  mb4: {
    marginBottom: MARGINS.mb4,
  },
  mh3: {
    marginHorizontal: MARGINS.mb3,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
