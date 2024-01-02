import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { COLORS, MARGINS, STYLEOBJECTS } from "../utils/styles";
import AppText from "./AppText";

export default function AppButton({
  blue,
  lightBlue,
  blueText,
  white,
  big,
  alignSelf,
  small,
  verysmall,
  noBold,
  style,
  onPress,
  title,
  mt3,
  mt4,
  disabled,
  schedule,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.default,
        schedule && styles.schedule,
        blue && styles.blue,
        lightBlue && styles.lightBlue,
        white && styles.white,
        big && styles.big,
        alignSelf && styles.alignSelf,
        small && styles.small,
        verysmall && styles.verysmall,
        pressed && STYLEOBJECTS.pressed,
        disabled && styles.disabled,
        mt3 && styles.mt3,
        mt4 && styles.mt4,
        style && style,
      ]}
      disabled={disabled}
    >
      <AppText
        white={blue && !disabled}
        blue={blueText}
        gray={disabled}
        h3={!small}
        bold={!noBold}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  alignSelf: {
    alignSelf: "center",
  },
  big: {
    width: "100%",
  },
  blue: {
    backgroundColor: COLORS.darkBlue,
  },
  lightBlue: {
    backgroundColor: COLORS.lightBlue
  },
  default: {
    alignItems: "center",
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    marginBottom: MARGINS.mb3,
  },
  disabled: {
    backgroundColor: COLORS.gray,
  },
  mt3: {
    marginTop: MARGINS.mb3,
  },
  mt4: {
    marginTop: MARGINS.mb4,
  },
  schedule: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    padding: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3
  },
  small: {
    width: "50%",
  },
  verysmall: {
    width: "30%",
  },
  white: {
    backgroundColor: COLORS.white,
  },
});
