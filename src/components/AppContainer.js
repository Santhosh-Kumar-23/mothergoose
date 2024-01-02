import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS, MARGINS } from "../utils/styles";

// this component mostly standardizes styling and adds flexibility

export default function AppContainer(props) {
  const {
    justifyCenter,
    justifyFlexEnd,
    alignFlexStart,
    noAlignCenter,
    noFlex,
    noPaddingHorizontal,
    noPaddingBottom,
    noPaddingTop,
    lessPaddingBottom,
    noTabBar,
    style,
    children,
    morePaddingTop,
    transparent,
    noHVpadding
  } = props;

  return (
    <View
      {...props}
      style={[
        styles.container,
        !noHVpadding && styles.containerPadding,
        justifyCenter && styles.justifyCenter,
        justifyFlexEnd && styles.justifyFlexEnd,
        alignFlexStart && styles.alignFlexStart,
        noAlignCenter && styles.noAlignCenter,
        noPaddingHorizontal && styles.noPaddingHorizontal,
        noPaddingBottom && styles.noPaddingBottom,
        lessPaddingBottom && styles.lessPaddingBottom,
        noPaddingTop && styles.noPaddingTop,
        noTabBar && styles.noTabBar,
        noFlex && styles.noFlex,
        morePaddingTop && styles.morePaddingTop,
        transparent && styles.transparent,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  alignFlexStart: {
    alignItems: "flex-start",
  },
  container: {
    alignSelf: "stretch",
    backgroundColor: COLORS.white,
    flexGrow: 1,
    paddingBottom: 30,
    // paddingHorizontal: MARGINS.mb3,
  },
  containerPadding: {
    paddingHorizontal: MARGINS.mb3,
    paddingTop: 20,
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyFlexEnd: {
    justifyContent: "flex-end",
  },
  lessPaddingBottom: {
    marginBottom: 0,
    paddingBottom: 30,
  },
  morePaddingTop: {
    paddingTop: 30,
  },
  noAlignCenter: {
    alignItems: null,
  },
  noFlex: {
    flex: 0,
    flexGrow: 0,
  },
  noPaddingBottom: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  noPaddingHorizontal: {
    paddingHorizontal: 0,
  },
  noPaddingTop: {
    marginTop: 0,
    paddingTop: 0,
  },
  noTabBar: {
    marginBottom: 0,
    paddingBottom: 30,
  },
  transparent: {
    backgroundColor: COLORS.transparent,
  },
});
