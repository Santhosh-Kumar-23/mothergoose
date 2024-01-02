import React, { useEffect } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import AppText from "../AppText";
import { MARGINS, COLORS } from "../../utils/styles";
import _ from "lodash";
import {
  dont_know,
  none,
  none_of_above,
  not_at_all,
  not_sure,
  not_to_answer,
  other,
  text,
  no,
} from "../../utils/survey";
import AppTextInput from "../AppTextInput";

/**
 *
 * @param answers: array of answers to the question
 * @param dependent: object coontaining the questions that are only accessible to a user if a certain answer is given
 * @param setNextPage: function that sets the next page (if a user's response allows them to skip question)
 * @param response: array, the users survey response
 * @param setResponse function, sets response array
 */
export default function MultipleChoiceQuestion({
  answers,
  dependent,
  setNextPage,
  setResponse,
  response,
  control,
  reset,
  text_answer,
}) {
  /**
   * Remove answer from response state (list of answers selected).
   * @param {*} answer - Answer that is tapped on screen
   */
  const removeSelection = (answer) => {
    const filtered = response.filter((a) => a.id !== answer.id);
    setResponse(filtered);
  };

  /**
   * Add answer selected to response state that also contains other
   * selections (if selected)
   * If patient selects an answer that overrides other answers then
   * only set that answer to response state.
   * @param {object} answer - Answer that is tapped on screen
   */
  const addSelection = (answer) => {
    let res = [];
    const solo_selections = [
      none_of_above,
      not_at_all,
      not_to_answer,
      none,
      not_sure,
      dont_know,
      no,
    ];

    /**
     * In multi_select question, solo_selections are
     * the selection that overrides all other selection
     * that user selected.
     * That means either solo_selection or other selections
     * in a question can be selected.
     *
     * If user selects a solo_selection answer then
     * discard all other answers and if user selects answers
     * other then solo_selections then discard solo_selection
     * answer and select other answers.
     */
    if (!solo_selections.includes(answer.label)) {
      res = [...response];
      solo_selections.forEach((label) => {
        _.remove(res, { label: label });
      });
    }
    res.push(answer);
    setResponse(res);
  };

  return (
    <View style={styles.answerContainer}>
      {answers.map((a) => {
        const isSelected = response.find((r) => r.id === a.id);
        return (
          a.label !== text && (
            <>
              <Pressable
                key={a.id}
                style={[styles.button, isSelected && styles.selected]}
                onPress={() => {
                  isSelected ? removeSelection(a) : addSelection(a);
                }}
              >
                <AppText
                  bold
                  // RFh3m
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
                />
              )}
            </>
          )
        );
      })}
    </View>
  );
}

const TextInput = ({ name, placeholderText, control, reset }) => {
  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return (
    <AppTextInput
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
