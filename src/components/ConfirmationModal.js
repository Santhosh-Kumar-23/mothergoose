import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS, MARGINS } from "../utils/styles";
import AppButton from "./AppButton";
import AppText from "./AppText";
import Blue_map from "../../assets/svgs/Blue_map.svg"
export default function ConfirmationModal({
  open,
  setOpen,
  onPress,
  onCancelPress,
  buttonTitle,
  cancelButton,
  cancelButtonTitle,
  body,
  noBody,
  surveyFinish,
  icon,
  header,
}) {
  const handlePress = () => {
    if (typeof onPress === "function") {
      onPress();
    }
    setOpen(!open);
  };

  const handleCancelPress = () => {
    if (typeof onCancelPress === "function") {
      onCancelPress();
    }
    setOpen(!open);
  };

  const renderModal = () => {
    if (!open) {
      return null;
    } else {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.background,
            surveyFinish && styles.noPadding,
          ]}
        >
          <View style={[styles.card, surveyFinish && styles.bottomFixed]}>

            {
              header == "Attention, please!" ?
                <View style={{ alignItems: "center" }}>
                  <Blue_map height={35} width={35} />
                </View>
                : null
            }

            <View style={icon && styles.iconContainer}>
              {icon ? icon : null}
            </View>
            {header ? (
              <AppText mb3 textAlignCenter h3 bold>
                {header}
              </AppText>
            ) : null}
            {
              !noBody ?
                <AppText textAlignCenter mb3 bold>
                  {body}
                </AppText>
                : null
            }

            <AppButton
              onPress={handlePress}
              title={buttonTitle}
              big
              blue
              alignSelf
            />
            {cancelButton ? (
              <AppButton
                big
                blue
                alignSelf
                title={cancelButtonTitle ? cancelButtonTitle : "Cancel"}
                onPress={handleCancelPress}
              />
            ) : null}
          </View>
        </View>
      );
    }
  };

  return renderModal();
}

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    backgroundColor: COLORS.confirmationModalBackground,
    // display: "flex",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  bottomFixed: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    bottom: 0,
    position: "absolute",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingBottom: MARGINS.mb2,
    paddingHorizontal: 30,
    paddingTop: 24,
    width: "100%",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: MARGINS.mb4,
  },
  noPadding: {
    paddingHorizontal: 0,
  },
});
