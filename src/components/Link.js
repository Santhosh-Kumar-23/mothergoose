import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { COLORS, LINEHEIGHT, MARGINS, SIZES } from "../utils/styles";
import AppText from "./AppText";

export default function Link({
  children,
  onPress,
  style,
  dark,
  negMB3,
  h3,
  ml2,
  mb2,
  mt2,
  small,
  alignSelfCenter,
  bold,
  adjustsFontSizeToFit,
  numberOfLines,
}) {
  return (
    <Pressable
      style={[
        ml2 && styles.ml2,
        alignSelfCenter && styles.alignSelfCenter,
        negMB3 && styles.negMB3,
      ]}
      onPress={onPress}
    >
      <AppText
        style={[
          styles.default,
          dark && styles.dark,
          mb2 && styles.mb2,
          mt2 && styles.mt2,
          style && style,
        ]}
        adjustsFontSizeToFit={adjustsFontSizeToFit}
        numberOfLines={numberOfLines || 1}
        h3={h3}
        small={small}
        bold={bold}
      >
        {children}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  alignSelfCenter: {
    alignSelf: "center",
  },
  dark: {
    color: COLORS.darkBlue,
  },
  default: {
    color: COLORS.mediumBlue,
  },
  mb2: {
    marginBottom: MARGINS.mb2,
  },
  ml2: {
    marginLeft: MARGINS.mb2,
  },
  mt2: {
    marginTop: MARGINS.mb2,
  },
  negMB3: {
    marginBottom: -3,
  },
});
