import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../utils/styles";

export default function AppSafeAreaView(props) {
  const { children, edges } = props;
  return (
    <SafeAreaView {...props} style={styles.container} edges={edges}>
      {children}
      <View style={styles.bottomColorProvider} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  bottomColorProvider: {
    backgroundColor: COLORS.white,
    bottom: 0,
    height: "50%",
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: -1,
  },
  container: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
    position: "relative",
  },
});
