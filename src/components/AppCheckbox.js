import React from "react";
import { Controller } from "react-hook-form";
import { COLORS } from "../utils/styles";
import CheckBox from "react-native-check-box";

export default function AppCheckBox(props) {
  const {
    label,
    name,
    defaultValue = false,
    validation,
    control,
    style,
  } = props;

  return (
    <Controller
      control={control}
      name={name}
      rules={
        validation || {
          required: true,
        }
      }
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <CheckBox
          onClick={() => onChange(!value)}
          style={style}
          checkBoxColor={COLORS.darkBlue}
          isChecked={value}
          rightText={label}
          uncheckedCheckBoxColor={COLORS.mediumGray}
        />
      )}
    />
  );
}
