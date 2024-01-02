import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../utils/styles";
import OnboardingBackgroundImage from "../../assets/svgs/OnboardingBackgroundImage.svg";

export default function Layout(props) {
  const { children, style, onboarding } = props;

  return (
    <View {...props} style={[styles.container, style]}>
      {onboarding ? (
        <OnboardingBackgroundImage style={styles.background} />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    left: 0,
    position: "absolute",
    top: "30%",
    // zIndex: -10,
  },
  container: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: COLORS.WHITE,
    flex: 1,
    // justifyContent: "center",
    position: "relative",
  },
});
