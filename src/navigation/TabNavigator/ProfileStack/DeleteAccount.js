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
import { updatePatient, deleteAccount } from "../../../api";

export default function DeleteAccount({ navigation }) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const { user, setUser } = useContext(AppContext);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const emailVerified = true;


  const confirmDelete = async () => {
    const res = await deleteAccount(user.id, user.email)
    if (res.message == "request successfully updated!") {

      setOpenSuccessModal(true);
    }
  }

  return (
    <AppSafeAreaView edges={["left", "right"]}>
      <AppContainer>
        <AppKeyboardAvoidingView>
          <View>

            <AppText mt3 h3 gray textAlignCenter>
              {"Our care management team is here for you every step of the way. We work directly with your obstetrical care provider to help you achieve the best possible pregnancy outcome."}
            </AppText>
            <AppText bold h3 gray textAlignCenter>
              {"Deleting your Mother Goose Health account is permanent and cannot be reversed. "}
            </AppText>
            <AppText h3 gray textAlignCenter>
              {"This process can take up to 5 days during this time a Mother Goose team member will reach out to confirm the account deletion."}
            </AppText>

            <AppText mt3 h2m black bold textAlignCenter>
              {"Are you sure you want to delete your account?"}
            </AppText>
          </View>
        </AppKeyboardAvoidingView>
        <AppButton
          onPress={handleSubmit(confirmDelete)}
          title={"Yes, Delete Account"}
          blue
        />
        <AppButton
          onPress={() => navigation.navigate("Home")}
          title={"No, Cancel Account Deletion"}
          white
        />
      </AppContainer>
      <ConfirmationModal
        open={openSuccessModal}
        setOpen={setOpenSuccessModal}
        body="Request successfully updated!"
        buttonTitle="OK"
        onPress={() => navigation.navigate("Welcome")}
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
