import React from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";

export default function AppKeyboardAvoidingView(props) {
  const { children, style, noFlex } = props;
  return (
    <KeyboardAvoidingView
      {...props}
      behavior="padding"
      style={[styles.default, noFlex && styles.noFlex, style]}
      enabled={Platform.OS == "ios" ? true : false}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  default: {
    alignSelf: "stretch",
    flexGrow: 1,
    justifyContent: "center",
  },
  noFlex: {
    flexGrow: 0,
  },
});
