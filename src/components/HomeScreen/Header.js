import React, { useContext } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import AppText from "../AppText";
import fakeAvatar from "../../../assets/fakeAvatar.png";
import { COLORS, MARGINS } from "../../utils/styles";
import { AppContext } from "../../context";
import { getTimeOfDay } from "../../utils/helpers";

export default function Header() {
  const { user } = useContext(AppContext);

  return (
    <View style={styles.container}>
      <AppText h3 mb1>
        Good {getTimeOfDay()}
      </AppText>
      <View style={styles.userContainer}>
        <AppText h1 bold mb2>
          {user.first_name}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginTop: MARGINS.mb4,
  },
  image: {
    height: 40,
    width: 40,
  },
  userContainer: {
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: -20,
    paddingBottom: MARGINS.mb2,
    paddingHorizontal: 20,
  },
});
