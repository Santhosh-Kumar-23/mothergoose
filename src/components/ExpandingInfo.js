import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "./AppText";
import RightArrow from "../../assets/svgs/RightArrow.svg";
import { COLORS, MARGINS } from "../utils/styles";
import _ from "lodash";

export default function ExpandingInfo({
  title,
  content
}) {
  const [open, setOpen] = useState(false);
  const renderContent = (item, index) => {
    if (open) {
      return (
        <Pressable
          key={`${index}-item.title`}
          style={{ margin: 10 }}
        >
          {
            content.length > 0 && content.map((val, key) => {
              return (<View style={{ marginBottom: (content.length - 1 != key) ? 10 : 0, flexDirection: "row", width: "95%" }}>
                <AppText blue>➣ </AppText>
                <AppText h3m blue >{val}</AppText>
              </View>
              )
            })
          }
        </Pressable>
      );
    }
  };

  return (
    <Pressable onPress={() => setOpen(!open)}>
      <View style={{ width: "100%" }}>
        <View style={styles.boxShadow}>
          <View style={[styles.closed, open && styles.open]}>
            <AppText h3m bold>
              {title}
            </AppText>
            <RightArrow style={[styles.icon, open && styles.iconFlipped]} />
          </View>
          <View style={open && styles.openContainer}>
            {renderContent()}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boxShadow: {
    marginVertical: MARGINS.mb2,
    margin: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    borderRadius: 12,
  },
  closed: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    flexDirection: "row",
    height: 48,
    justifyContent: "space-between",
    paddingHorizontal: MARGINS.mb2,
  },

  icon: {
    marginRight: MARGINS.mb2,
    transform: [{ rotate: "90deg" }],
  },
  iconFlipped: {
    transform: [{ rotate: "270deg" }],
  },
  open: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  openContainer: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopColor: COLORS.gray,
    borderTopWidth: 1,
  }
});
