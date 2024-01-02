import React, { useContext } from "react";
import { StyleSheet, Image, Text, View, Linking } from "react-native";
import AppText from "./AppText";
import fakeDoctor from "../../assets/fakeDoctor.png";
import fakeDoctor2 from "../../assets/fakeDoctor2.png";
import AppContainer from "./AppContainer";
import { COLORS, MARGINS } from "../utils/styles";
import moment from "moment";
import _ from "lodash";
import AppButton from "./AppButton";
// import * as Linking from "expo-linking";
import { AppContext } from "../context";

/** @param doctor: obj: a user's appointment provider */
// This component displays detailed information on a provider
export default function DoctorDetail({ navigation, doctor, appointment }) {
  let {
    photo_url,
    description,
    specialty,
    email,
    name = "Your Doctor",
    phone_number,
    date_of_birth,
  } = doctor?.attributes || {};

  const { setError } = useContext(AppContext);

  const videoLink = _.get(appointment, "attributes.video_link");
  const cancel_reschedule_link = (appointment.upcoming == true && appointment?.attributes?.canceled != true) ? _.get(appointment, "attributes.cancel_reschedule_link") : null;
  const cancelledAppt = appointment?.attributes?.canceled

  const linkToVideo = () => {
    return Linking.openURL(videoLink).catch((err) => setError(err.message));
  };

  return (
    <AppContainer>
      <View style={styles.headerContainer}>
        <Image style={styles.image} source={photo_url || fakeDoctor} />
        <View style={styles.textContainer}>
          <AppText>{specialty}</AppText>
          <AppText h3 adjustsFontSizeToFit bold>
            {name}
          </AppText>
        </View>
      </View>
      {/* Leaving this commented in case client decides there should be links to this info here */}
      {/* <View style={styles.detailContainer}>
        <AppText small gray>
          {phone_number}
        </AppText>
        <AppText small gray>
          {email}
        </AppText>
      </View> */}

      {
        cancelledAppt != true ?
          (
            <View>
              <AppText mb3 bold>
                Password is your date of birth: MMDDYYYY
              </AppText>
              {videoLink ? (
                <AppButton onPress={linkToVideo} title={"Join Video"} schedule blue />
              ) : null}
              <AppText>{description}</AppText>
            </View>
          )
          : null
      }

      {
        cancel_reschedule_link ? (
          <View style={styles.header3Container}>
            <AppButton lightBlue onPress={() => {
              navigation.navigate("ReScheduling", {
                cancel_reschedule_link
              })
            }} title={"Cancel / Reschedule Appointment"} />
          </View>
        ) : null
      }
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  // detailContainer: {
  //   borderBottomColor: COLORS.gray,
  //   borderBottomWidth: 1,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginBottom: MARGINS.mb3,
  //   paddingBottom: MARGINS.mb3,
  // },
  headerContainer: {
    alignItems: "center",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    flexDirection: "row",
    marginBottom: MARGINS.mb3,
    paddingBottom: MARGINS.mb3,
    paddingRight: MARGINS.mb3,
  },
  header2Container: {
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    // marginBottom: MARGINS.mb3,
    // paddingBottom: MARGINS.mb3,
  },
  header3Container: {
    borderTopColor: COLORS.gray,
    borderTopWidth: 1,
    paddingTop: MARGINS.mb3,
    // marginTop: MARGINS.mb3,
  },
  image: {
    borderRadius: 20,
    height: 40,
    marginRight: MARGINS.mb2,
    width: 40,
  },
  textContainer: {
    marginHorizontal: MARGINS.mb2,
    paddingRight: MARGINS.mb3,
  },
});
