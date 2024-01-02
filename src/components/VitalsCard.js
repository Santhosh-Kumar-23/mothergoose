import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS, MARGINS } from "../utils/styles";
import AppText from "./AppText";

export default function VitalsCard({ title, body, icon, navigation, article }) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate(`${title}`, { article })}
    >
      <View style={styles.headerContainer}>
        <AppText>{title}</AppText>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.icon}>{icon}</View>

        <AppText gray mb2>
          {body}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    borderColor: COLORS.gray,
    borderRadius: 12,
    borderWidth: 1,
    // height: 100,
    marginBottom: MARGINS.mb2,
    width: "49%",
  },
  headerContainer: {
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    padding: MARGINS.mb2,
  },
  icon: {
    borderRadius: 200,
    // height: 56,
    // width: 56,
    marginTop: MARGINS.mb2,
    marginBottom: MARGINS.mb2,
    overflow: "hidden",
    // padding: MARGINS.mb2,
    // borderWidth: 1,
  },
});
