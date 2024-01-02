import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS, MARGINS, STYLEOBJECTS } from "../utils/styles";
import AppText from "./AppText";

export default function VitalsHeader({ left, center, right, label }) {
  return (
    <View style={[styles.headerContainer, STYLEOBJECTS.boxShadow]}>
      <View style={styles.borderBottom}>
        <AppText semibold textAlignCenter>
          {label}
        </AppText>
      </View>
      <View style={styles.body}>
        <View style={styles.segment}>
          <AppText h2 textAlignCenter mb2>
            {left.value || "--"}
          </AppText>
          <AppText gray textAlignCenter>
            {left.label}
          </AppText>
        </View>
        <View style={[styles.segment, styles.center]}>
          <AppText h2 textAlignCenter mb2>
            {center.value || "--"}
          </AppText>
          <AppText gray textAlignCenter>
            {center.label}
          </AppText>
        </View>
        <View style={styles.segment}>
          <AppText h2 textAlignCenter mb2>
            {right.value || "--"}
          </AppText>
          <AppText gray textAlignCenter>
            {right.label}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: MARGINS.mb3,
    paddingVertical: MARGINS.mb1,
  },
  borderBottom: {
    borderBottomWidth: 1,
    alignItems: "center", justifyContent: "center",
    borderColor: COLORS.gray,
    paddingHorizontal: MARGINS.mb3,
    paddingVertical: MARGINS.mb2,
  },
  center: {
    borderColor: COLORS.gray,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: MARGINS.mb3,
  },
  segment: {
    width: "33%",
  },
});
