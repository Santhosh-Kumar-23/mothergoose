import React from "react";
import { StyleSheet } from "react-native";
import _ from "lodash";
import { COLORS, MARGINS } from "../utils/styles";
import { TextInputMask } from "react-native-masked-text";

/**
 * Return Input Field that resticts user to enter input
 * in a desired pattern.
 * @param {object} props - Props passed to DateMaskedInput
 * @param {object} props.style - Additional style to Input
 * @param {boolean} props.isFocused - Boolean that tells if input is focused
 * @param {function} props.setIsFocused - set focused status
 * @param {string} props.currentValue - Values to set for the input
 * @param {string} props.onChange - Type of input e.g datetime
 * @param {string} props.value - onChange value for the text input
 * @param {string} props.placeholderText - Placeholder text if value not found
 */
export default function DateMaskedInput(props) {
  const {
    placeholderTextColor,
    currentValue,
    errorMessage,
    isError,
    value,
    style,
    isFocused,
    setIsFocused,
    isDirty,
    setIsEmpty,
    onChange,
    placeholderText,
    editable
  } = props;

  return (
    <TextInputMask
      editable={editable !== undefined ? editable : true}
      style={[
        styles.textInput,
        isFocused && styles.isFocused,
        isError && !isFocused && !isDirty && styles.error,
        errorMessage && !isFocused && styles.error,
        style,
      ]}
      type="datetime"
      options={{
        format: "MM/DD/YYYY",
      }}
      onBlur={() => setIsFocused(false)}
      onFocus={() => {
        setIsFocused(true);
      }}
      placeholder={placeholderText}
      placeholderTextColor={placeholderTextColor}
      onChangeText={(value) => {
        if (value.length) {
          setIsEmpty(false);
        } else {
          setIsEmpty(true);
        }
        onChange(value);
      }}
      value={currentValue ? currentValue : value}
    />
  );
}

const styles = StyleSheet.create({
  error: {
    borderColor: COLORS.red,
    color: COLORS.red,
  },
  errorBottomStyle: {
    flexDirection: "column-reverse",
  },
  isFocused: {
    borderColor: COLORS.mediumBlue,
    borderWidth: 2,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    padding: MARGINS.mb2,
    color: COLORS.black
  },
});
