import React from "react";
import Modal from "react-native-modal";
import { StyleSheet, View } from "react-native";
import AppText from "./AppText";
import { COLORS, MARGINS } from "../utils/styles";

/**
 *
 * @param title: string: modal title
 * @param subtitle: string: modal subtitle
 * @param body: string: modal body
 * @param isVisible: function: determines whether modal should display
 * @param handleClose: function: determines what should happen when modal is dismissed
 */
export default function AppModal({
  title = "Something went wrong",
  subtitle = "Please try again",
  body = null,
  isVisible,
  handleClose,
}) {
  return (
    <>
      <Modal
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
        isVisible={isVisible}
        swipeDirection="left"
        // onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => handleClose()}
        swipeThreshold={50}
        useNativeDriver={false}
        // propagateSwipe
        // backdropColor={"red"}
        // backgroundOpacity={1}
      >
        <View style={styles.modalContainer}>
          {title ? (
            <AppText h2 textAlignCenter bold blue mb3>
              {title}
            </AppText>
          ) : null}
          {subtitle ? (
            <AppText h3 textAlignCenter bold blue mb3>
              {subtitle}
            </AppText>
          ) : null}
          {body}
          <AppText textAlignCenter>Swipe left to dismiss</AppText>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: MARGINS.mb3,
    zIndex: 1000,
  },
});
