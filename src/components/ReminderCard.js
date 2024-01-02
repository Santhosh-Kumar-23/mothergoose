import React, { useContext } from "react";
import { StyleSheet, Text, View, Image, Pressable, Linking } from "react-native";
import { COLORS, MARGINS } from "../utils/styles";
import AppSwipeable from "./AppSwipeable";
import AppText from "./AppText";
import fakeDoctor from "../../assets/fakeDoctor.png";
import gmap from "../../assets/gmap.png";
import noteReminder from '../../assets/noteReminder.png'
import RightArrow from "../../assets/svgs/RightArrow.svg";
import Dailyremindericon from "../../assets/Dailyremindericon.png";
import { AppContext } from "../context";
// import * as Linking from "expo-linking";
import _ from "lodash";

// import Icon from 'react-native-vector-icons/AntDesign';
// Icon.loadFont().then();

/**
 * @param title: string: card's title
 * @param id: int: reminder id--not sure if needed
 * @param body: string: body/address link for appointments
 * @param appt: bool: determines whether or not reminder is for an appointment
 * @param date: str: Month abbreviation/Day format
 * @param purple: bool: determines whether square should be purple
 * @param gray: bool: determines whether square should be gray
 * @param hasImage: bool: determines whether card has an image on the right side
 * @param lightBlue: bool: determines whether square should be light blue
 * @param bigSquare: bool: determines whether square should be big (60x60 vs 40x40)
 * @param noBorder: bool: determines whether card should have a border
 * @param boxShadow: bool: determines whether card should have box shadow
 * @param morePadding: bool: determines whether card should have extra padding
 * @param photoUrl: str: the url for the photo if hasImage
 * @param pv12: bool: adds vertical padding of 12
 * @param article: bool: determines whether card is for an article in education modules
 */
export default function ReminderCard({
  title,
  id,
  body,
  appt,
  date,
  purple,
  gray,
  hasImage,
  lightBlue,
  bigSquare,
  noBorder,
  boxShadow,
  morePadding,
  photoUrl,
  pv12,
  article,
  doc_data,
  canceledAppt,
  cancelLink,
  upcomingProviderAppt,
  navigation
}) {

  const { setError } = useContext(AppContext);
  const linkToMap = (addr) => {
    return Linking.openURL(`http://maps.google.com/maps?daddr=${addr}`).catch(
      // (err) => console.log("An error occurred", err)
      (err) => setError(err.message)
    );
  };

  return (
    <View >
      <View style={boxShadow ? styles.boxShadow : null}>
        <AppSwipeable>
          <View
            style={[
              styles.container,
              noBorder && styles.noBorder,
              morePadding && styles.morePadding,
              pv12 && styles.pv12,
              canceledAppt && styles.canceledApptBG
              // boxShadow && styles.boxShadow,
            ]}
          >
            {
              pv12 ?
                <View
                // style={{ marginRight: 10, marginLeft: -5 }}
                >
                  {/* <Image
                    source={Dailyremindericon}
                    style={{
                      height: 46, width: 46, resizeMode: "contain"
                    }}
                  /> */}
                  {/* <Dailyremindericon width={15} height={15} /> */}

                </View>
                :
                <View
                  style={[
                    styles.colorSquare,
                    purple && styles.purple,
                    lightBlue && styles.lightBlue,
                    gray && styles.gray,
                    bigSquare && styles.bigSquare,

                  ]}
                >
                  <AppText lineThrough={canceledAppt} textAlignCenter semibold>
                    {appt ? date : null}
                  </AppText>
                </View>
            }

            <View style={bigSquare ? styles.textContainer : null}>
              <AppText lineThrough={canceledAppt} h3 bold mb1={body} numberOfLines={1} gray={canceledAppt}>
                {title}
              </AppText>

              {appt ?
                <>
                  {(appt && hasImage) ? (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        width={24}
                        height={24}
                        source={photoUrl || fakeDoctor}
                        style={styles.appt_avatar}
                      />
                      <AppText numberOfLines={1} ml2 bold gray>{doc_data?.name}</AppText>
                    </View>

                  ) : null}
                </>
                : body && (
                  <View style={styles.textBody}>
                    <Pressable
                      onPress={
                        appt && !_.isEmpty(body) ? () => linkToMap(body) : null
                      }
                    >
                      <AppText gray numberOfLines={1} underline={appt}>
                        {body}
                      </AppText>
                    </Pressable>
                  </View>
                )

              }

              {upcomingProviderAppt ?
                <Pressable
                  onPress={() => {
                    if (cancelLink) {
                      console.log("cancelLink", cancelLink)
                      navigation.navigate("ReScheduling", {
                        cancel_reschedule_link: cancelLink
                      })
                    }
                  }}
                >
                  <View style={[{ backgroundColor: COLORS.shockingPink, paddingVertical: 3, borderRadius: 5, alignItems: "center", justifyContent: "center", marginTop: 5, width: "50%" }, styles.CRapptboxShadow]}>
                    <Text style={{ fontSize: 10, color: COLORS.black }}>Cancel / re-schedule</Text>
                  </View>
                </Pressable>

                : null}

            </View>


            {(!appt && hasImage) ? (
              <Image
                width={24}
                height={24}
                source={photoUrl || fakeDoctor}
                style={styles.avatar}
              />
            ) : null}

            {(appt && body) ? ( // show map for appointment
              <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
                <Pressable
                  onPress={
                    appt && !_.isEmpty(body) ? () => linkToMap(body) : null
                  }
                >
                  <Image
                    source={gmap}
                    style={styles.appt_location}
                  />
                </Pressable>
              </View>
            ) : null}

            {article ? (
              <View style={styles.iconContainer}>
                <RightArrow width={15} height={15} />
              </View>
            ) : null}



          </View>
        </AppSwipeable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: 24,
    position: "absolute",
    right: MARGINS.mb3,
    top: MARGINS.mb3,
    width: 24,
  },
  appt_location: {
    // backgroundColor: "red",
    height: 40,
    // position: "absolute",
    // right: MARGINS.mb3,
    // top: MARGINS.mb2,
    // left: MARGINS.mb2,
    // bottom: 5,
    width: 40,
  },
  appt_avatar: {
    height: 24,
    width: 24,
  },
  bigSquare: {
    height: 60,
    width: 60,
  },
  boxShadow: {
    marginBottom: MARGINS.mb3,
    // padding: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    borderRadius: 10

  },
  CRapptboxShadow: {
    top: MARGINS.mb1,
    // padding: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    // borderRadius: 10

  },
  colorSquare: {
    backgroundColor: COLORS.purple,
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
    marginRight: 10,
    width: 40,
  },
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
  canceledApptBG: {
    backgroundColor: COLORS.lightGray2,
  },
  gray: {
    backgroundColor: COLORS.gray,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: MARGINS.mb2,
  },
  lightBlue: {
    backgroundColor: COLORS.lightBlue,
  },
  morePadding: {
    paddingVertical: MARGINS.mb3,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  purple: {
    backgroundColor: COLORS.purple,
  },
  pv12: {
    paddingVertical: 12,
  },
  textBody: {
    overflow: "hidden",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    width: "85%",
  },
});
