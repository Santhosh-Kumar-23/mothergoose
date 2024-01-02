import React, { useEffect } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { questions } from "../../fakeData/riskSurvey";
import { getNextPage } from "../../utils/helpers";
import { COLORS, MARGINS } from "../../utils/styles";
import AppText from "../AppText";
import _ from "lodash";
import { other, text } from "../../utils/survey";
import AppTextInput from "../AppTextInput";

/**
 *
 * @param answers array of answer options to the question
 * @param dependent array of dependent questions
 * @param setNextPage function that sets the next page if a relevant answer is selected
 * @param setResponse function that sets answer array when an answer is selected
 * @param response array of the user's answer
 */
export default function SingleAnswerQuestion({
  answers,
  dependent,
  setNextPage,
  setResponse,
  response,
  control,
  reset,
  text_answer,
}) {
  return (
    <View style={styles.answerContainer}>
      {answers.map((a) => {
        const isSelected = response[0]?.id === a.id;
        return (
          a.label !== text && (
            <>
              <Pressable
                key={a.id}
                style={[styles.button, isSelected && styles.selected]}
                onPress={() => {
                  setResponse([a]);
                }}
              >
                <AppText
                  bold
                  // RFh3
                  gray={!isSelected}
                  white={isSelected}
                  style={styles.card}
                >
                  {a.label}
                </AppText>
              </Pressable>
              {!_.isEmpty(text_answer) && isSelected && a.label === other && (
                <TextInput
                  name={text_answer?.label}
                  placeholderText={text_answer?.label}
                  control={control}
                  reset={reset}
                  text_answer={text_answer}
                  response={response}
                />
              )}
            </>
          )
        );
      })}
    </View>
  );
}

const TextInput = ({
  name,
  placeholderText,
  control,
  reset,
  text_answer,
  response,
}) => {
  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return (
    <AppTextInput
      // currentValue={answer?.label || ""}
      name={name}
      placeholderText={placeholderText}
      control={control}
      style={styles.otherTextField}
    />
  );
};

const styles = StyleSheet.create({
  answerContainer: {
    flexDirection: "column",
    marginBottom: MARGINS.mb4,
    marginHorizontal: MARGINS.mb3,
  },
  button: {
    borderColor: COLORS.darkGray,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    marginBottom: MARGINS.mb3,
    minHeight: 40,
    paddingLeft: MARGINS.mb2,
  },
  card: {
    margin: MARGINS.mb2,
  },
  selected: {
    backgroundColor: COLORS.surveyBlue,
    borderColor: COLORS.surveyBlue,
  },
  otherTextField: {
    marginBottom: MARGINS.mb3,
    marginHorizontal: MARGINS.mb1,
  },
});
