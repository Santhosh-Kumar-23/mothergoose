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
export default function PhysicianDetail({ doctor, appointment }) {

  var doctor_data = doctor?.attributes || {}

  const { setError } = useContext(AppContext);

  const videoLink = _.get(appointment, "attributes.video_link");



  const linkToVideo = () => {
    return Linking.openURL(videoLink).catch((err) => setError(err.message));
  };

  return (
    <AppContainer>
      <View style={styles.headerContainer}>
        <Image style={styles.image} source={doctor_data?.photo_url || fakeDoctor} />
        <View style={styles.textContainer}>

          <AppText>{doctor_data?.qualifications != "{}" && doctor_data?.qualifications}</AppText>
          <AppText h3 adjustsFontSizeToFit bold>
            {doctor_data?.name}
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
        appointment.type != "visit" &&
        <View>
          <AppText mb3 bold>
            Password is your date of birth: MMDDYYYY
          </AppText>
          {videoLink ? (
            <AppButton onPress={linkToVideo} title={"Join Video"} schedule blue />
          ) : null}
          <AppText>{doctor_data?.description}</AppText>
        </View>
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
    // borderBottomColor: COLORS.gray,
    // borderBottomWidth: 1,
    flexDirection: "row",
    marginBottom: MARGINS.mb3,
    paddingBottom: MARGINS.mb3,
    paddingRight: MARGINS.mb3,
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
