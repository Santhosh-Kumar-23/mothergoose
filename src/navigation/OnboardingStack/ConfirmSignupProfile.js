import React from "react";
import OnboardingFormTemplate from "../../components/OnboardingFormTemplate";

export default function ConfirmSignupProfile({ navigation }) {
  return (
    <OnboardingFormTemplate
      body={[
        "Well done! Your account is created!",
        "\n",
        "Now let's set up your profile.",
      ]}
      header="Please confirm your information"
      buttonText="Continue"
      // secondButtonText="Update information with your provider"
      handleInput={() => navigation.navigate("Add Email")}
      // handleSecondInput={() =>
      //   Constants.isDevice
      //     ? Linking.openURL("mailto:support@mothergoosehealth.com")
      //     : console.log("on a device this links to mail")
      // }
      navigation={navigation}
      type="confirmProfile"
      subLink="We are here"
      subLinkText="Need to update this information?"
      // buttonContainerStyle={{ marginTop: "70%" }}
    />
  );
}

// const styles = StyleSheet.create({});
