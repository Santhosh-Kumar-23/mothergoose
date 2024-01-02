import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import AppContainer from "../../components/AppContainer";
import AppKeyboardAvoidingView from "../../components/AppKeyboardAvoidingView";
import AppLayout from "../../components/AppLayout";
import AppTextInput from "../../components/AppTextInput";
import { useForm } from "react-hook-form";
import AppText from "../../components/AppText";
import { MARGINS } from "../../utils/styles";
import AppButton from "../../components/AppButton";
import AppScrollView from "../../components/AppScrollView";
import { AppContext } from "../../context";
import { submitMGSupportForm } from "../../api";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function SupportFormScreen({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const { setError } = useContext(AppContext);

  const [openModal, setOpenModal] = useState();

  const inputs = [
    {
      label: "First Name",
      placeholderText: "First Name",
      name: "first_name",
      control,
      error: errors,
    },
    {
      label: "Last Name",
      placeholderText: "Last Name",
      name: "last_name",
      control,
      error: errors,
    },
    {
      label: "Email",
      placeholderText: "Email",
      name: "email",
      control,
      error: errors,
      keyboardType: "email-address",
    },
    {
      label: "Date of Birth",
      placeholderText: "mm/dd/yyyy",
      name: "date_of_birth",
      control,
      error: errors,
    },
    {
      label: "Issue",
      placeholderText: "Please describe the issue you're facing",
      name: "issue",
      control,
      error: errors,
      textArea: true,
    },
  ];

  const submitForm = async (data) => {
    try {
      await submitMGSupportForm(data);
      setOpenModal(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleModalClick = () => {
    setOpenModal(false);
    navigation.goBack();
  };

  return (
    <AppSafeAreaView edges={["left", "right", "bottom"]}>
      <AppKeyboardAvoidingView>
        <AppLayout onboarding>
          <AppScrollView>
            <AppContainer noPaddingTop transparent>
              <View style={styles.inputContainer}>
                <AppText textAlignCenter h3 semibold blue>
                  How can we help?
                </AppText>
                {inputs.map((input, i) => {
                  const {
                    label,
                    placeholderText,
                    name,
                    control,
                    error,
                    keyboardType,
                    textArea,
                  } = input;
                  return (
                    <View key={i + label}>
                      <AppText gray small mb2>
                        {label}
                      </AppText>
                      <AppTextInput
                        label={label}
                        placeholderText={placeholderText}
                        textArea={textArea}
                        name={name}
                        control={control}
                        error={error}
                        keyboardType={keyboardType}
                      />
                    </View>
                  );
                })}
                <AppButton
                  blue={isValid}
                  onPress={handleSubmit(submitForm)}
                  title="Submit"
                  disabled={!isValid}
                  grey={!isValid}
                />
              </View>
            </AppContainer>
          </AppScrollView>
        </AppLayout>
      </AppKeyboardAvoidingView>
      <ConfirmationModal
        open={openModal}
        setOpen={handleModalClick}
        body="Form submitted to Mother Goose Help Desk. Will reach you shortly!"
        buttonTitle="OK"
      />
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingVertical: MARGINS.mb4,
  },
});
