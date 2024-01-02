import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { COLORS, MARGINS } from "../utils/styles";

export default function FeaturedArticle({ article }) {
  return (
    <View style={styles.container}>
      <Image source={article.image} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: COLORS.transparent,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderLeftColor: COLORS.gray,
    borderRadius: 15,
    borderRightColor: COLORS.gray,
    borderTopColor: COLORS.transparent,
    borderWidth: 1,
    flexGrow: 1,
    height: 225,
    overflow: "hidden",
    // backgroundColor: COLORS.white,
    // paddingBottom: MARGINS.mb2,
    // marginBottom: 10,
  },
  image: {
    height: "100%",
    width: "100%",
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
  },
  textContainer: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingLeft: MARGINS.mb3,
    paddingTop: MARGINS.mb3,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3
  },
});
