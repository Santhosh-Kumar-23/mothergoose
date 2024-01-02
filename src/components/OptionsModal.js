import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import AppText from "./AppText";
import { COLORS, MARGINS } from "../utils/styles";
// import * as ImagePicker from "expo-image-picker";
import { ImagePicker, launchCamera, launchImageLibrary } from "react-native-image-picker";
import AppSafeAreaView from "./AppSafeAreaView";

export default function OptionsModal({
  open,
  setOpen,
  setSelected,
  title,
  options,
  getPermission,
}) {
  useEffect(() => {
    if (getPermission) {
      async () => {
        const libPermission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
      };
      async () => {
        const camPermission = await ImagePicker.requestCameraPermissionsAsync();
      };
    }
  }, [options]);

  const handlePress = (value) => {
    setSelected(value);
    setOpen(!open);
  };

  const renderModal = () => {
    if (!open) {
      return null;
    } else {
      return (
        <View style={[StyleSheet.absoluteFill, styles.background]}>
          <View style={styles.buttonCard}>
            <View style={styles.buttonContainer}>
              <View style={[styles.card, styles.borderBottom, styles.brTop]}>
                <AppText h3 textAlignCenter style={styles.p2}>
                  {title}
                </AppText>
              </View>
              {options.map((option, i) => {
                const last = i === options.length - 1;
                return (
                  <View
                    key={option}
                    style={[
                      styles.card,
                      styles.borderBottom,
                      last && styles.brBottom,
                    ]}
                  >
                    {/* <Button
                      onPress={() => handlePress(option)}
                      title={option}
                    /> */}
                    <TouchableOpacity onPress={() => handlePress(option)} style={{ alignItems: "center", justifyContent: "center" }}>
                      <AppText h3 InkBlue>{option}</AppText>
                    </TouchableOpacity>
                  </View>
                );
              })}
              <View style={[styles.card, styles.mt3, styles.br12]}>
                {/* <Button onPress={() => setOpen(false)} title="Cancel" /> */}
                <TouchableOpacity onPress={() => setOpen(false)} style={{ alignItems: "center", justifyContent: "center" }}>
                  <AppText h3 InkBlue>Cancel</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    }
  };

  return renderModal();
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "rgba(0, 0, 0, .4)",
    position: "absolute",
  },
  borderBottom: {
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  br12: {
    borderRadius: 12,
  },
  brBottom: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  brTop: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  buttonCard: {
    // borderRadius: 12,
    bottom: 10,
    left: 10,
    margin: MARGINS.mb3,
    position: "absolute",
    // backgroundColor: "rgba(0, 0, 0, .4)",
    right: 10,
    // top: 30,
  },
  buttonContainer: {
    borderRadius: 12,
  },
  card: {
    backgroundColor: COLORS.grayBackground,
    padding: MARGINS.mb2,
  },
  mt3: {
    marginTop: MARGINS.mb3,
  },
  p2: {
    padding: MARGINS.mb2,
  },
});
