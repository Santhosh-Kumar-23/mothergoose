import React from "react";
import { StyleSheet, ScrollView } from "react-native";

export default function AppScrollView(props) {
  const {
    children,
    contentContainerStyle,
    nestedScrollEnabled,
    // keyboardDismissOnScroll
    onRefresh,
    style,
  } = props;
  return (
    <ScrollView
      {...props}
      contentContainerStyle={[
        styles.contentContainerStyle,
        contentContainerStyle,
      ]}
      // in case we decide to implement keyboardDismissal on scroll, leaving commented for reference
      // onScrollBeginDrag={() => keyboardDismissOnScroll && Keyboard.dismiss()}
      // onScrollEndDrag={() => keyboardDismissOnScroll && Keyboard.dismiss()}
      nestedScrollEnabled={nestedScrollEnabled}
      onRefresh={onRefresh}
      keyboardShouldPersistTaps={"handled"}
      style={[styles.scrollview, style]}
      alwaysBounceVertical={false}
    >
      <>{children}</>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
  scrollview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
