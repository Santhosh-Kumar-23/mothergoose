import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { COLORS, MARGINS } from "../../utils/styles";
import AppText from "../AppText";
import { AppContext } from "../../context";
import { formatGestionalAgeToWeeksDays } from "../../utils/pregnancy";

export default function ProgressBar({ condensed }) {
  const { user } = useContext(AppContext);
  const { gestational_age } = user?.pregnancy?.attributes || {};

  // condensed prop is to let us use this on PregnancyProgress screen and also on the home screen
  const progressDetails = () => {
    const gestationalAgeTextProps = condensed
      ? {
        h3: true,
        style: styles.blue,
      }
      : {
        h1: true,
        mb3: true,
        textAlignCenter: true,
      };
    return (
      <View style={[condensed && styles.textContainer]}>
        <AppText bold {...gestationalAgeTextProps}>
          {formatGestionalAgeToWeeksDays(gestational_age)}
        </AppText>
      </View>
    );
  };

  const trimesters = ["1st trimester", "2nd trimester", "3rd trimester"];

  const getProgressBarWidth = () => {
    // if (gestational_age > 90 && gestational_age <= 180) return "68%";
    // else if (gestational_age > 180) return "100%";
    // else return "35%";

    var totalgestational_Value = 280;
    if (gestational_age > totalgestational_Value) return "100%";
    else {
      var percent = ((100 * gestational_age) / totalgestational_Value).toFixed() + "%"
      return percent;
    }

  };

  return (
    <>
      {progressDetails()}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBackground, condensed && styles.mb3]}>
          <View style={[styles.progress, { width: getProgressBarWidth() }]} />
        </View>
        {!condensed ? (
          <View style={styles.trimesterContainer}>
            {trimesters.map((trimester, i) => (
              <View
                key={i}
                style={[styles.trimester, i === 2 && styles.lastTrimester]}
              >
                <AppText textAlignCenter gray>
                  {trimester}
                </AppText>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  blue: {
    color: COLORS.mediumBlue,
  },
  lastTrimester: {
    borderRightColor: COLORS.gray,
    // borderStyle: "dashed",
  },
  mb3: {
    marginBottom: MARGINS.mb3,
  },
  progress: {
    backgroundColor: COLORS.shockingPink,
    borderRadius: 25,
    height: MARGINS.mb2,
    zIndex: 1,
  },
  progressBackground: {
    backgroundColor: COLORS.lightShockingPink,
    borderRadius: 25,
    height: MARGINS.mb2,
    position: "relative",
    width: "100%",
    zIndex: -1,
  },
  progressContainer: {
    paddingHorizontal: MARGINS.mb2,
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: MARGINS.mb2,
  },
  trimester: {
    // borderColor: "transparent",
    borderLeftColor: COLORS.gray,
    borderRightColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderWidth: 1,
    paddingBottom: MARGINS.mb1,
    paddingTop: MARGINS.mb3,
    width: "33.3%",
    // borderStyle: "dashed",
  },
  trimesterContainer: {
    flexDirection: "row",
    width: "100%",
  },
});
