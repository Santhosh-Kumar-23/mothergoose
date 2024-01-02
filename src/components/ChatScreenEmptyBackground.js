import React from "react";
import { StyleSheet, View } from "react-native";
import ChatScreenEmpty from "../../assets/svgs/ChatScreenEmpty.svg";
import { MARGINS } from "../utils/styles";
import AppText from "./AppText";

export default function ChatScreenEmptyBackground({ title }) {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <ChatScreenEmpty />
        <AppText h3 blue semibold textAlignCenter>
          {title || "Start chatting with Mother Goose Staff"}
        </AppText>
        <AppText textAlignCenter>
          Ask anything you want. We are here to support you during this exciting
          journey
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    paddingHorizontal: MARGINS.mb4,
    position: "absolute",
    right: 0,
    top: 100,
  },
  container: {
    height: "100%",
    position: "relative",
  },
});
