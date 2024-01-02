import React from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../../components/AppButton";
import AppLayout from "../../components/AppLayout";
import AppScrollView from "../../components/AppScrollView";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import AppContainer from "../../components/AppContainer";
import AppText from "../../components/AppText";
import AppKeyboardAvoidingView from "../../components/AppKeyboardAvoidingView";
import { COLORS, MARGINS } from "../../utils/styles";
import _ from "lodash";

export default function BetaFeedback({ navigation, route }) {
  return (
    <AppSafeAreaView edges={["left", "right", "bottom"]}>
      <AppKeyboardAvoidingView>
        <AppLayout onboarding>
          <AppScrollView>
            <AppContainer transparent style={styles.containerStyle}>
              <View style={styles.textContainer}>
                <AppText mb3 />
                {[
                  "Your doctor has partnered with Mother Goose Health to better support your journey towards a healthy pregnancy and healthy baby.",
                  "Thank you for letting the Mother Goose Health care team be part of your pregnancy journey.",
                  // "This is an early access version. This means your experience and input will help us build the best service for women like you. This is not the final version and we value your input to make changes and improvements.",
                ].map((text, index) => (
                  <AppText key={index} mb3 h3>
                    {text}
                  </AppText>
                ))}
              </View>

              <AppButton
                title={"Continue"}
                onPress={() => navigation.navigate("Provider Preferences")}
                blue
                style={styles.buttonContainer}
              />
            </AppContainer>
          </AppScrollView>
        </AppLayout>
      </AppKeyboardAvoidingView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    display: "flex",
    paddingTop: MARGINS.mb2,
    justifyContent: "space-between",
  },
  textContainer: {
    marginTop: 50,
  },
  requiredStyle: {
    color: COLORS.errorRed,
  },
  buttonContainer: {
    marginBottom: 100,
  },
});
