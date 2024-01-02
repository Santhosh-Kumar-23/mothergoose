import React, { useState, useContext } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import OnboardingFormTemplate from "../../components/OnboardingFormTemplate";
import validator from "validator";
import AppText from "../../components/AppText";
import { AppContext } from "../../context";
import { verifyCode, triggerOTP } from "../../api";
import AppSafeAreaView from "../../components/AppSafeAreaView";

export default function VerifyCodeScreen({ navigation, route }) {
  const { user, setUser, setError } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [invalidCode, setInvalidCode] = useState("");
  const [codeResendModal, setCodeResendModal] = useState(false);

  const handleVerifyCode = async (code) => {
    setLoading(true);

    try {
      const res = await verifyCode(code, user);

      setUser(res?.user);
      setLoading(false);
      navigation.navigate("Create Password");
    } catch (error) {
      setLoading(false);
      setInvalidCode("Invalid code");
      console.log({ error });
    }
  };

  const resendOTP = async () => {
    const { first_name, last_name, date_of_birth } = user || {};
    try {
      await triggerOTP(first_name, last_name, date_of_birth);
      setCodeResendModal(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const extraInfo = () => (
    <View style={styles.extraInfoWrapper}>
      <Pressable style={styles.loginLink} onPress={resendOTP}>
        <AppText small gray>
          {" "}
          Didn't receive your code?{" "}
        </AppText>
        <AppText small black underline>
          {" "}
          Resend the code{" "}
        </AppText>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <AppSafeAreaView>
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
          <AppText blue h3 bold textAlignCenter>
            Logging In
          </AppText>
        </View>
      </AppSafeAreaView>
    );
  }

  return (
    <OnboardingFormTemplate
      header="Enter the code you received."
      inputName="code"
      inputValidation={{
        required: { value: true, message: "Please enter a valid code" },
        validate: (val) =>
          (validator.isNumeric(val) && val.length === 6) || "Invalid code.",
      }}
      inputError={invalidCode}
      placeholder="Enter Code"
      keyboardType="numeric"
      extraInfo={extraInfo()}
      navigation={navigation}
      buttonText="Next"
      handleInput={(data) => {
        handleVerifyCode(data);
      }}
      subLink="We are here"
      subLinkText="Need help"
      textAlignCenter
      apiError={invalidCode}
      modalVisible={codeResendModal}
      modalClose={() => setCodeResendModal(false)}
      modalTitle="Code Resent!"
      modalSubtitle=""
    />
  );
}

const styles = StyleSheet.create({
  extraInfoWrapper: {
    alignItems: "center",
    display: "flex",
    marginHorizontal: "20%",
    width: "100%",
  },
  loading: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
