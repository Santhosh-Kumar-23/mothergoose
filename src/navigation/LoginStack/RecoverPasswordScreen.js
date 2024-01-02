import React, { useState } from "react";
import OnboardingFormTemplate from "../../components/OnboardingFormTemplate";
import validator from "validator";
import { handleResetPassword } from "../../api";

const RecoverPasswordScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handlePasswordReset = async ({ email }, setError) => {
    try {
      const res = await handleResetPassword(email);

      // This won't work until BE PR is merged but should work once that happens
      setModalVisible(true);
      setModalMessage(
        `An email with instructions to reset your password has been sent to ${email}`
      );
    } catch (error) {
      setError("email", {
        type: "manual",
        message: error.response?.data?.errors?.email,
      });
    }
  };

  return (
    <OnboardingFormTemplate
      header="Please enter your email"
      inputName="email"
      inputValidation={{
        required: { value: true, message: "Please enter your email address" },
        validate: (val) => validator.isEmail(val) || "Invalid email",
      }}
      placeholder="email@example.com"
      subLink="We are here"
      subLinkText="Need help?"
      textAlignCenter
      buttonText="Reset Password"
      handleInput={(data, setError) => {
        handlePasswordReset(data, setError);
      }}
      navigation={navigation}
      modalVisible={modalVisible}
      modalTitle="Password Reset"
      modalSubtitle={modalMessage}
      modalClose={() => {
        navigation.navigate("Log In");
      }}
    />
  );
};

export default RecoverPasswordScreen;
