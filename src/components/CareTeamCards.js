import React, { useContext } from "react";
import { Pressable, StyleSheet, Image, View } from "react-native";
import { MARGINS, COLORS } from "../utils/styles";
import AppText from "./AppText";
import RightArrow from "../../assets/svgs/RightArrow.svg";
import { AppContext } from "../context";

// This component isn't fleshed out but will handle the care team profile screens
export default function CareTeamCards({
  name,
  label,
  icon,
  avatar,
  team,
  teamProfile,
  careManagerProfile,
  apptScheduling,
  individual,
  navigation,
  noIcon,
  noPress,
  noShadow,
  borderBottom,
}) {
  const { providers } = useContext(AppContext);

  return (
    <Pressable
      style={[
        styles.cardContainer,
        !noShadow && styles.boxShadow,
        borderBottom && styles.borderBottom,
      ]}
      onPress={() => {
        if (team?.name === "Team Profile") {
          team.providers = providers || {};
        }
        if (noPress) {
          return;
        }
        if (!individual) {
          return careManagerProfile ?
            navigation.navigate("Manager Demographics", {
              practitioner: team,
              name,
              label
            })
            : teamProfile
              ? navigation.navigate("Team Profile", { team })
              : apptScheduling
                ? navigation.navigate("Scheduling", { team })
                : navigation.navigate("Obstetrical Care Providers", { team });
        } else {
          return navigation.navigate("Provider Demographics", {
            practitioner: team,
            name,
            label,
          });
        }
      }}
    >
      {icon ? icon : <Image source={avatar} style={styles.avatar} />}
      <View style={styles.cardText}>
        <AppText gray>{label != "{}" ? label : ""}</AppText>
        <AppText h3 bold>
          {name}
        </AppText>
      </View>
      {!noIcon ? (
        <View style={styles.icon}>
          <RightArrow />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  borderBottom: {
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  boxShadow: {
    marginBottom: MARGINS.mb1,
    padding: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3
  },
  cardContainer: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 24,
  },
  cardText: {
    flex: 1,
    marginLeft: MARGINS.mb2,
  },
  icon: {
    paddingRight: MARGINS.mb3,
  },
});
