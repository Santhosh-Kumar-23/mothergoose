import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS, MARGINS } from "../utils/styles";
import AppText from "./AppText";

export default function TabHeader({ headers, selected, setSelected }) {
  const renderTab = (header, selected, setSelected) => {
    const isSelected = selected === header;
    return (
      <Pressable
        style={[
          styles.tabHeaderContainer,
          isSelected && styles.tabContainerSelected,
        ]}
        onPress={() => setSelected(header)}
        key={header}
      >
        <AppText style={styles.tabTitle} semibold={isSelected} h3>
          {header}
        </AppText>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, selected === true ? styles.active : styles.deactive]}>
      {headers.map((header) => renderTab(header, selected, setSelected))}
    </View>
  );
}

const styles = StyleSheet.create({
  active: {
    backgroundColor: COLORS.sliderActive,
  },
  deactive: {
    backgroundColor: COLORS.sliderDeactive,
  },
  container: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    marginBottom: MARGINS.mb1,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3
  },
  tabContainerSelected: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.tabSelectedBorder,
    borderWidth: 1,
  },
  tabHeaderContainer: {
    alignSelf: "center",
    backgroundColor: COLORS.transparent,
    borderRadius: 15,
    flex: 1,
    height: 30,
    justifyContent: "center",
  },
  tabTitle: {
    alignSelf: "center",
    backgroundColor: COLORS.transparent,
  },
});
