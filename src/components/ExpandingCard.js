import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "./AppText";
import RightArrow from "../../assets/svgs/RightArrow.svg";
import { COLORS, MARGINS } from "../utils/styles";
import _ from "lodash";
import Link from "./Link";

export default function ExpandingCard({
  title,
  content,
  pregnancy,
  insurance,
  editPage,
  navigation,
  children,
}) {
  const [open, setOpen] = useState(false);
  const renderContent = () => {
    if (open) {
      if (children) {
        return children;
      }
      if (pregnancy) {
        const {
          firstPregnancy,
          dueDate,
          numberOfBabies,
          pregnancyMethod,
          height,
          prePregnancyWeight,
          gestational_age,
        } = content;

        const getDate = (date) => {
          const year = date.getYear() + 1900;
          const month = date.getMonth() + 1;
          const day = date.getDate();

          return day + "/" + month + "/" + year;
        };

        return (
          <>
            <View style={styles.detail}>
              <AppText gray>First pregnancy? </AppText>
              {_.isBoolean(firstPregnancy) && (
                <AppText bold gray>
                  {firstPregnancy ? "Yes" : "No"}
                </AppText>
              )}
            </View>
            <View style={styles.detail}>
              <AppText gray>Height </AppText>
              {!_.isEmpty(height) && (
                <AppText bold gray>
                  {height}
                </AppText>
              )}
            </View>
            <View style={styles.detail}>
              <AppText gray>Pre-pregnancy weight </AppText>
              {!_.isEmpty(prePregnancyWeight) && (
                <AppText bold gray>
                  {prePregnancyWeight}
                </AppText>
              )}
            </View>
            <View style={styles.detail}>
              <AppText gray>Due date </AppText>
              {!_.isEmpty(dueDate) && (
                <AppText bold gray>
                  {dueDate}
                </AppText>
              )}
            </View>
            <View style={styles.detail}>
              <AppText gray>I'm pregnant with </AppText>
              {numberOfBabies && numberOfBabies >= 1 && (
                <AppText bold gray>
                  {numberOfBabies === 1
                    ? `${numberOfBabies} baby`
                    : `${numberOfBabies} babies`}
                </AppText>
              )}
            </View>
            <View style={styles.detail}>
              <AppText gray>Pregnancy method? </AppText>
              {!_.isEmpty(pregnancyMethod) && (
                <AppText bold gray>
                  {pregnancyMethod}
                </AppText>
              )}
            </View>

            <View style={styles.detail}>
              <AppText gray>Gestational Age </AppText>
              {!_.isEmpty(gestational_age) && (
                <AppText bold gray>
                  {gestational_age}
                </AppText>
              )}
            </View>
            <View style={[styles.detail, styles.editContainer]}>
              {editPage && (
                <Link
                  onPress={() =>
                    navigation.navigate(editPage, { settings: true })
                  }
                >
                  Edit
                </Link>
              )}
            </View>
          </>
        );
      } else if (insurance) {
        const { insurance_name, member_id, group_id } = content || {};
        return (
          <>
            <View style={styles.detail}>
              <View style={{ width: "50%" }}>
                <AppText gray>Insurance company </AppText>
              </View>
              <View style={{ width: "50%", alignItems: "flex-end" }}>
                <AppText bold gray>
                  {insurance_name}
                </AppText>
              </View>
            </View>
            <View style={styles.detail}>
              <AppText gray>Member ID </AppText>
              <AppText bold gray>
                {member_id}
              </AppText>
            </View>
            <View style={styles.detail}>
              <AppText gray>Group ID </AppText>
              <AppText bold gray>
                {group_id}
              </AppText>
            </View>
          </>
        );
      }
    }
  };

  return (
    <Pressable onPress={() => setOpen(!open)}>

      <View>
        <View style={styles.boxShadow}>
          <View style={[styles.closed, open && styles.open]}>
            <AppText h3 bold>
              {title}
            </AppText>
            <RightArrow style={[styles.icon, open && styles.iconFlipped]} />
          </View>
          <View style={open && styles.openContainer}>{renderContent()}</View>
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
  detail: {
    // alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: MARGINS.mb3,
    paddingVertical: MARGINS.mb2,
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
  },
  editContainer: {
    justifyContent: "flex-end",
    marginTop: MARGINS.mb2,
    marginBottom: MARGINS.mb1,
  },
});
