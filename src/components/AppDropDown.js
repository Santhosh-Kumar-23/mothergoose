import React from "react";
import { Controller } from "react-hook-form";
import DropDown from "../components/Dropdown";

// this component offers a controlled dropdown for the onboarding flow

export default function AppDropDown(props) {
  const {
    name,
    defaultValue,
    validation,
    control,
    selections,
    // isMonths,
    ...rest
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
        <DropDown
          initialChoice={value}
          label={value}
          values={selections}
          onPress={(selVal) => onChange(selVal)}
          {...rest}
        />
      )}
    />
  );
}

// const styles = StyleSheet.create({});
