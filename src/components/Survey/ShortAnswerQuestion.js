import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppTextInput from "../AppTextInput";
import AppText from "../AppText";
import Dropdown from "../Dropdown";
import { COLORS, MARGINS } from "../../utils/styles";
import _ from "lodash";
import { not_sure } from "../../utils/survey";

/**
 *
 * @param control function from react hook form
 * @param options array of input options (pounds, kilos, etc)
 * @param measure object of selected option
 * @param names optional, array of input names
 * @param reset resets react-hook-from values to empty object
 */
export default function ShortAnswerQuestion({
  control,
  options,
  measure,
  names,
  reset,
  selectOrInput,
  response,
  setResponse,
  questionid
}) {

  // console.log("ShortAnswerQuestion questionid", questionid)
  const [unit, setUnit] = useState(measure);
  const [label, setLabel] = useState(names ? names[0] : "");

  const setMeasurements = (value) => {
    reset();
    setUnit(_.find(options, value));
    if (value.label === not_sure) {
      let data = [...response];
      data.push(value);
      setResponse(data);
    } else {
      setResponse([]);
    }
  };

  const dropDown = !_.isEmpty(options) && options.length > 1;
  const hide_input = unit?.label === not_sure;

  return (
    <View style={[styles.mainContainer, styles.marginBottom]}>
      {!hide_input && (
        <View style={styles.container}>
          <AppTextInput
            style={dropDown ? styles.longInput : styles.fullWidth}
            keyboardType="numeric"
            name={unit.label}
            control={control}
            questionid={questionid}
          />
          {label.label ? (
            <AppText gray style={styles.label}>
              {label.label}
            </AppText>
          ) : null}
        </View>
      )}

      {dropDown && (
        <View style={[styles.dropdown, hide_input && styles.halfWidth]}>
          <Dropdown
            initialChoice={unit}
            label={unit?.label}
            values={options}
            onPress={setMeasurements}
            rounded
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  dropdown: {
    marginBottom: 12,
    width: 110,
  },
  halfWidth: {
    width: "50%",
  },
  label: {
    marginBottom: 12,
    marginLeft: MARGINS.mb2,
  },
  longInput: {
    width: 160,
  },
  mainContainer: {
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-evenly",
    zIndex: 1,
  },
  marginBottom: {
    marginBottom: 72,
  },
  fullWidth: {
    width: "100%",
  },
});
