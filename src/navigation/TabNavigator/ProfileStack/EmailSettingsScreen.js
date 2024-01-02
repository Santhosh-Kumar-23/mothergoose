import React, { useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppContainer from "../../../components/AppContainer";
import AppText from "../../../components/AppText";
import AppTextInput from "../../../components/AppTextInput";
import AppButton from "../../../components/AppButton";
import ConfirmationModal from "../../../components/ConfirmationModal";

import { useForm } from "react-hook-form";
import { MARGINS, COLORS } from "../../../utils/styles";
import GreenCheck from "../../../../assets/svgs/GreenCheck.svg";
import AppKeyboardAvoidingView from "../../../components/AppKeyboardAvoidingView";
import { AppContext } from "../../../context";
import { updatePatient } from "../../../api";

export default function EmailSettingsScreen({ navigation }) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const { user, setUser } = useContext(AppContext);
  const [openModal, setOpenModal] = useState(false);
  const emailVerified = true;

  const handleEmail = async ({ email }) => {
    await updatePatient(user.id, { email });

    try {
      setOpenModal(true);
      setValue("email", "");
      setUser({ ...user, email });
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <AppSafeAreaView edges={["left", "right"]}>
      <AppContainer>
        <AppKeyboardAvoidingView>
          <View>
            <AppText h3 bold mb3>
              Current Email
            </AppText>
            <View style={styles.currentEmail}>
              <AppText>{user.email}</AppText>
              {emailVerified ? <GreenCheck height={18} width={18} /> : null}
            </View>
            {emailVerified ? (
              <AppText small gray mb3>
                Verified email
              </AppText>
            ) : (
              <AppText small gray mb3>
                Please verify your email
              </AppText>
            )}

            <AppText h3 bold mb3>
              New Email
            </AppText>
            <AppTextInput
              name="email"
              // placeholderText={"New email"}
              label="Email"
              control={control}
              keyboardType="email-address"
              error={errors}
              mb2
            />
            <AppText small gray mb3>
              This will be the email associated with your account
            </AppText>
          </View>
        </AppKeyboardAvoidingView>
        <AppButton
          onPress={handleSubmit(handleEmail)}
          title={"Save changes"}
          disabled={!isValid}
          blue
        />
        <AppButton
          onPress={() => navigation.navigate("Profile")}
          title={"Dismiss"}
          white
        />
      </AppContainer>
      <ConfirmationModal
        open={openModal}
        setOpen={setOpenModal}
        body="Email successfully changed!"
        buttonTitle="OK"
      />
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  currentEmail: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    height: 40,
    justifyContent: "space-between",
    marginBottom: MARGINS.mb2,
    padding: MARGINS.mb2,
  },
});
