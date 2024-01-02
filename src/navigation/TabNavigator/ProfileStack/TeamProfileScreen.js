import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import AppContainer from "../../../components/AppContainer";
import AppFlatList from "../../../components/AppFlatList";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import { COLORS, MARGINS } from "../../../utils/styles";
import { AppContext } from "../../../context";
import CareTeamCards from "../../../components/CareTeamCards";
import FakeLogo2 from "../../../../assets/svgs/fakeLogo2.svg";

export default function TeamProfileScreen({ navigation, route }) {
  const { providers, user } = useContext(AppContext);

  const { care_team } = user;

  /**
   * Return Platform Provider/Care Manager card to FlatList.
   * @param {object} item - Provider/Care Manager with demographic info
   */
  const renderTeam = ({ item }) => {

    const { attributes } = item || {};
    /**
     * assigning platform_provider field to attributes
     * allows to select values that are only required
     * for platform providers.
     * */
    if (item.type === "provider") {
      attributes.platform_provider = true;
    }
    /**
     * assigning care_manager field to attributes
     * allows to select values that are only required
     * for care manager.
     * */
    if (item.type === "administrator") {
      attributes.care_manager = true;
    }
    const getProviderSpecialties = () => {
      let specialties =
        attributes?.specialties.join(", ") || "Provider's Profile";
      if (specialties.length > 33) {
        specialties = specialties.substr(0, 33) + "...";
      }
      return specialties;
    };

    const provider_name = () => {
      return attributes?.name || "Platform Provider";
    };
    return (
      <View style={styles.providerCardContainer}>
        <CareTeamCards
          individual
          navigation={navigation}
          name={
            item.type === "provider"
              ? provider_name()
              : attributes?.first_name + " " + attributes?.last_name
          }
          label={
            item.type === "provider"
              ? getProviderSpecialties()
              : attributes?.care_manager_type
          }
          team={attributes}
          icon={<FakeLogo2 height={40} width={40} />}
          avatar={attributes.avatar}
        />
      </View>
    );
  };

  return (
    <AppSafeAreaView edges={["left", "right"]}>
      <AppContainer noPaddingTop noPaddingBottom>
        <AppFlatList
          data={[...care_team, ...providers]}
          renderItem={renderTeam}
          keySignature="provider-profiles"
        />
      </AppContainer>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  cardContainer: {
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: MARGINS.mb3,
  },
  providerCardContainer: {
    marginBottom: MARGINS.mb3,
  },
  cardText: {
    marginLeft: MARGINS.mb2,
  },
});
