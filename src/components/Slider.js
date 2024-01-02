import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "./AppText";
import TabHeader from "./TabHeader";
import { MARGINS, COLORS } from "../utils/styles";

export default function Slider({ selected, setSelected, title, disclaimer }) {
  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <AppText gray h3>
          {title}
        </AppText>
        <View style={styles.slider}>
          <TabHeader
            headers={[false, true]}
            selected={selected}
            setSelected={setSelected}
          />
        </View>
      </View>
      <View style={styles.disclaimer}>
        <AppText gray>{disclaimer}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: MARGINS.mb3,
  },
  disclaimer: {
    marginHorizontal: MARGINS.mb2,
  },
  slider: {
    width: "25%",
  },
  sliderContainer: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: MARGINS.mb2,
    padding: MARGINS.mb2,
    paddingHorizontal: MARGINS.mb3,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: "100%",
    elevation: 3
  },
});
