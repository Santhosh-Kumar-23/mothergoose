import React from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { COLORS, MARGINS } from "../../utils/styles";
import AppText from "../AppText";
import ButtonArrow from "../../../assets/svgs/ButtonArrow.svg";

/**
 * @page number: the current page a user is on
 * @percent number: the survey's current percentage completed
 * @navigation function: the navigation function, passed down from the screen
 * @required boolean: whether a question is required or not
 * @nextPage number: some answers allow a user to skip forward in the survey--if a user has given that answer, pass in this prop to route them to the next relevant question
 * @questions array: the array of questions in the survey. Could probably be refactored to simply be the array's length
 */
export default function Footer({
  page,
  percent,
  navigation,
  required,
  nextPage,
  questions,
  goBackCall,
  route,
  showProgressBar,
}) {
  // adds color shift on progress bar
  const getColor = () => {
    if (percent < 30) {
      return styles.red;
    } else if (percent < 40) {
      return styles.purple;
    } else if (percent < 60) {
      return styles.teal;
    } else if (percent < 80) {
      return styles.blue;
    } else if (percent < 90) {
      return styles.yellow;
    } else {
      return styles.green;
    }
  };

  const color = getColor();
  return (
    <View style={styles.container}>
      {/* <Pressable
        onPress={() => {
          if (page > 0) {
            route.params?.goBackCall && route.params?.goBackCall();
            navigation.goBack();
          }
        }}
      >
        <ButtonArrow
          height={32}
          width={40}
          color={page > 0 ? COLORS.darkBlue : COLORS.gray}
        />
      </Pressable> */}

      <View style={styles.progressBarContainer}>
        {showProgressBar && (
          <>
            <AppText blue textAlignCenter mb2>
              {percent}% completed
            </AppText>
            <View style={styles.progressBar}>
              <View style={styles.progressBG} />
              <View
                style={[styles.progress, color, { width: `${percent}%` }]}
              />
            </View>
          </>
        )}
      </View>

      {/* <Pressable
        onPress={() =>
          page < questions.length - 1 && !required
            ? navigation.push("Survey Question", {
              page: nextPage ? nextPage : page + 1,
              goBackCall: goBackCall,
            })
            : null
        }
      >
        <ButtonArrow
          height={32}
          width={40}
          style={styles.rightArrow}
          color={
            page < questions.length - 1 && !required
              ? COLORS.darkBlue
              : COLORS.gray
          }
        />
      </Pressable> */}


    </View>
  );
}

const styles = StyleSheet.create({
  blue: {
    backgroundColor: COLORS.sliderActive,
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 8,
    justifyContent: "space-evenly",
    // left: 20,
    // position: "absolute",
    // right: 20,

  },
  green: {
    backgroundColor: COLORS.green,
  },
  progress: {
    borderRadius: 12,
    bottom: 0,
    height: 8,
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  progressBG: {
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    height: 8,
    position: "relative",
    width: "100%",
  },
  progressBar: {
    marginHorizontal: MARGINS.mb3,
  },
  progressBarContainer: {
    flexDirection: "column",
    flexGrow: 1,
    marginHorizontal: MARGINS.mb3,
  },
  purple: {
    backgroundColor: COLORS.lightPurple,
  },
  red: {
    backgroundColor: COLORS.red,
  },
  rightArrow: {
    transform: [{ rotate: "180deg" }],
  },
  teal: {
    backgroundColor: COLORS.darkTeal,
  },
  yellow: {
    backgroundColor: COLORS.darkYellow,
  },
});
