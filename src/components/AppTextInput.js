import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";
import _ from "lodash";
import AppText from "./AppText";
import { COLORS, MARGINS } from "../utils/styles";
import DateMaskedInput from "./DateMaskedInput";

export default function AppTextInput(props) {
  const {
    label,
    placeholderText,
    name,
    style,
    error,
    defaultValue,
    control,
    keyboardType,
    secureTextEntry,
    textContentType,
    currentValue,
    mb1,
    mb2,
    mb3,
    mb4,
    validation,
    errorBottom,
    apiError,
    textArea,
    type,
    questionid,
    editable
  } = props;

  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const PASSWORD_REGEX = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/;

  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const isError =
    (error &&
      Object.getOwnPropertyNames(error) &&
      _.filter(Object.getOwnPropertyNames(error), (errorName) => {
        return errorName === name;
      }).length) ||
    apiError;

  const errorMessage = _.get(props, `error[${name}].message`) || apiError;

  return (
    <View
      style={[
        styles.container,
        mb1 && styles.mb1,
        mb2 && styles.mb2,
        mb3 && styles.mb3,
        mb4 && styles.mb4,
        style,
        errorBottom && styles.errorBottomStyle,
      ]}
    >
      {errorMessage && !isFocused && !isEmpty ? (
        <AppText
          style={[
            errorBottom ? styles.labelBottom : styles.label,
            styles.error,
          ]}
        >
          {errorMessage}
        </AppText>
      ) : null}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue || ""}
        rules={
          validation || {
            required: {
              value: true,
              message: `${label} is required`,
            },
            pattern: {
              value: name === "email" ? EMAIL_REGEX : null,
              message: "Email invalid",
            },
          }
        }
        render={({
          field: { onChange, onBlur, value },
          fieldState: { isDirty },
        }) =>
          type === "date" ? (
            <DateMaskedInput
              editable={editable !== undefined ? editable : true}
              errorMessage={errorMessage}
              isError={isError}
              isFocused={isFocused}
              isDirty={isDirty}
              value={value}
              placeholderText={placeholderText}
              placeholderTextColor={COLORS.gray}
              currentValue={currentValue}
              style={style}
              setIsFocused={setIsFocused}
              setIsEmpty={setIsEmpty}
              onChange={onChange}
            />
          ) : (
            // https://react-hook-form.com/api#Controller
            // { onChange, onBlur, value, name, ref },
            // { invalid, isTouched, isDirty }
            <TextInput
              keyboardType={keyboardType || "default"}
              textContentType={textContentType || "none"}
              placeholder={placeholderText}
              placeholderTextColor={COLORS.gray}
              autoCapitalize="none"
              autoCorrect={false}
              multiline={textArea}
              secureTextEntry={secureTextEntry}
              style={[
                styles.textInput,
                value && styles.hasValue,
                textArea && styles.textArea,
                isFocused && styles.isFocused,
                isError && !isFocused && !isDirty && styles.error,
                errorMessage && !isFocused && styles.error,
                style,
              ]}
              onBlur={() => setIsFocused(false)}
              onFocus={() => {
                setIsFocused(true);
              }}
              onChangeText={(value) => {
                // console.log("value", value, "questionid", questionid)
                // questionid == 41 ? (value.toString()).replace(".", "") : value
                if (value.length) {
                  setIsEmpty(false);
                } else {
                  setIsEmpty(true);
                }
                onChange(questionid == 41 ? (value).replace(".", "") : value);
              }}
              value={currentValue ? currentValue : value}
              error={_.get(props, "error.name")}
              errorText={errorMessage}
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: MARGINS.mb3,
  },
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
  label: {
    marginBottom: MARGINS.mb1,
  },
  labelBottom: {
    marginBottom: MARGINS.mb1,
    marginTop: MARGINS.mb3,
    textAlign: "center",
  },
  mb1: {
    marginBottom: MARGINS.mb1,
  },
  mb2: {
    marginBottom: MARGINS.mb2,
  },
  mb3: {
    marginBottom: MARGINS.mb3,
  },
  mb4: {
    marginBottom: MARGINS.mb4,
  },
  textArea: {
    height: 125,
    paddingVertical: MARGINS.mb4,
  },
  textInput: {
    color: COLORS.black,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    padding: MARGINS.mb2,
  },
});
