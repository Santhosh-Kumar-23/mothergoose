import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../AppText";
import AppTextInput from "../AppTextInput";
import { MARGINS } from "../../utils/styles";

/**
 * @options : array--input values (feet, inches)
 * @control : from react-hook-form
 */

export default function HeightInput({ options, control }) {
  return (
    <View style={[styles.mainContainer, styles.marginBottom]}>
      {options.map((opt) => {
        return (
          <View key={opt.id} style={styles.container}>
            <AppTextInput
              style={styles.input}
              keyboardType="numeric"
              name={opt.label}
              control={control}
            />
            {opt.label ? (
              <AppText gray style={styles.label}>
                {opt.label}
              </AppText>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  input: {
    width: 80,
  },
  label: {
    marginBottom: 12,
    marginLeft: MARGINS.mb2,
  },
  mainContainer: {
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  marginBottom: {
    marginBottom: 72,
  },
});
