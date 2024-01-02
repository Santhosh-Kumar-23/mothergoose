import React from "react";
import { StyleSheet, Linking, View, Pressable } from "react-native";
import _ from "lodash";
import { COLORS, MARGINS } from "../../../utils/styles" //"../utils/styles";

import AppContainer from "../../../components/AppContainer";
import AppText from "../../../components/AppText";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import ReminderCard from "../../../components/ReminderCard";
import DoctorDetail from "../../../components/DoctorDetail";
import PhysicianDetail from "../../../components/PhysicianDetail";
import AppScrollView from "../../../components/AppScrollView";

export default function AppointmentDetailsScreen({ navigation, route }) {
  const { appointment, provider, physician, date, time } = route.params;

  const _address = provider?.attributes?.full_address || physician?.attributes?.full_address
  const linkToMap = (addr) => {
    return Linking.openURL(`http://maps.google.com/maps?daddr=${addr}`).catch(
      // (err) => console.log("An error occurred", err)
      (err) => setError(err.message)
    );
  };

  return (
    <AppSafeAreaView edges={["left", "right"]}>
      <AppScrollView>
        <AppContainer noPaddingBottom>
          {/* <ReminderCard
            key={appointment.id}
            title={time}
            body={provider?.attributes?.full_address || physician?.attributes?.full_address}
            date={date}
            id={appointment.id}
            appt
            appt_details
            lightBlue
            bigSquare
            noBorder
          /> */}

          <View style={[styles.container, styles.noBorder]}>
            <View style={[styles.colorSquare, styles.lightBlue, styles.bigSquare]}>
              <AppText textAlignCenter semibold>{date}</AppText>
            </View>
            <View style={styles.textContainer}>
              <AppText h3 bold mb1 numberOfLines={1}>
                {time}
              </AppText>
              <View style={styles.textBody}>
                <Pressable
                  onPress={
                    !_.isEmpty(_address) ? () => linkToMap(_address) : null
                  }
                >
                  <AppText gray numberOfLines={1} underline={true}>
                    {_address}
                  </AppText>
                </Pressable>
              </View>
            </View>

          </View>
          {
            provider ?
              <DoctorDetail doctor={provider} appointment={appointment} navigation={navigation} /> :
              physician ?
                <PhysicianDetail doctor={physician} appointment={appointment} /> :
                null
          }

        </AppContainer>
      </AppScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: MARGINS.mb2,
    position: "relative",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  colorSquare: {
    backgroundColor: COLORS.purple,
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
    marginRight: 10,
    width: 40,
  },
  lightBlue: {
    backgroundColor: COLORS.lightBlue,
  },
  bigSquare: {
    height: 60,
    width: 60,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    width: "85%",
  },
  textBody: {
    overflow: "hidden",
  },
});
