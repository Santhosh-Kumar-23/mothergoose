import React from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";
import AppText from "./AppText";
import Link from "./Link";
import { STYLEOBJECTS } from "../utils/styles";
import { MARGINS, COLORS } from "../utils/styles";
import RightArrow from "../../assets/svgs/RightArrow.svg";
export default function VitalsFeaturedArticle({
  title,
  image,
  subtitle,
  navigation,
  article,
  linkText,
}) {
  return (
    <View style={[STYLEOBJECTS.boxShadow, styles.articleContainer]}>
      <View style={styles.articleBody}>
        <View style={styles.articleTitleContainer}>
          <AppText h2 blue bold style={styles.cardTitleStyle}>
            {title}
          </AppText>
        </View>
        <Image source={image} style={styles.articleImage} />
      </View>
      {/* <Link
        dark
        style={styles.linkContainer}
        numberOfLines={2}
        onPress={() =>
          article
            ? navigation.navigate("Article", article)
            : navigation.navigate("Education")
        }
      >
        {linkText || "See all"}
      </Link> */}

      <Pressable style={styles.PressableContainer}
        onPress={() =>
          article
            ? navigation.navigate("Article", article)
            : navigation.navigate("Education")
        }
      >
        <View style={styles.articletitleView}>
          <AppText h3 capitalize bold blue>{linkText || "See all"}</AppText>
        </View>
        <View style={styles.arrowView}>
          <RightArrow height={12} width={12} style={styles.extraPadding} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  PressableContainer: {
    flexDirection: "row",
    marginBottom: MARGINS.mb1,
    paddingTop: MARGINS.mb3,
    width: "100%",
  },
  articletitleView: {
    width: "90%"
  },
  arrowView: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center"
  },
  extraPadding: {
    padding: MARGINS.mb2,
  },
  articleBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: MARGINS.mb3,
    height: 120,
  },
  articleContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: MARGINS.mb4,
    padding: MARGINS.mb3,
    paddingTop: 0,
  },
  articleTitleContainer: {
    width: "70%",
  },
  linkContainer: {
    width: "75%",
  },
  articleImage: {
    height: "100%",
    width: "30%",
  },
  articleText: {
    width: "60%",
  },
  cardTitleStyle: { marginTop: MARGINS.mb2 },
});
