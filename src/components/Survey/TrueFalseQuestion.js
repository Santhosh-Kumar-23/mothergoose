import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { questions } from "../../fakeData/riskSurvey";
import { getNextPage } from "../../utils/helpers";
import { COLORS, MARGINS } from "../../utils/styles";
import AppText from "../AppText";
import { SurveyContext } from "../../context/surveyContext";

/**
 *
 * @param label optional string
 * @param question by default an empty string
 * @param answers array of answer options
 * @param setNextPage function that sets next page
 * @param setResponse function that sets answer
 * @param response user's current answer
 */

export default function TrueFalseQuestion({
  label,
  question,
  answers,
  dependent,
  setNextPage,
  setResponse,
  response,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {label ? (
          <AppText blue mb3 style={styles.mr2}>
            {label}.
          </AppText>
        ) : null}
        <AppText h3m blue mb3>
          {question}
        </AppText>
      </View>
      <View style={styles.buttonContainer}>
        {answers.map((a, i) => {
          const selected = response[0]?.id === a.id;
          return (
            <Pressable
              key={question + i}
              style={[styles.button, selected && styles.selected]}
              onPress={() => setResponse([a])}
            >
              <AppText h3 bold white={selected} textAlignCenter>
                {a.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.darkGray,
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: "45%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  container: {
    marginBottom: 40,
    marginHorizontal: MARGINS.mb3,
  },
  mr2: {
    marginRight: MARGINS.mb2,
    marginTop: 2,
  },
  selected: {
    backgroundColor: COLORS.surveyBlue,
    borderColor: COLORS.surveyBlue,
  },
  textContainer: {
    alignContent: "flex-start",
    flexDirection: "row",
  },
});
