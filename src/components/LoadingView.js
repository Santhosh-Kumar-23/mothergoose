import React, { useState } from "react";
import { ActivityIndicator, View, StyleSheet, Text } from "react-native";
import { MARGINS } from "../utils/styles";
import AppText from "./AppText";

export default function LoadingView({
  spinnerSize = "small",
  text,
  spinnerColor = "gray",
}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        style={styles.sipnnerStyle}
        size={spinnerSize}
        color={spinnerColor}
      />
      <AppText bold>{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  sipnnerStyle: {
    marginBottom: MARGINS.mb3,
  },
});
