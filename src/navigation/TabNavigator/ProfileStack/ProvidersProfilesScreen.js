import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import AppFlatList from "../../../components/AppFlatList";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import CareTeamCards from "../../../components/CareTeamCards";
import { MARGINS } from "../../../utils/styles";
import { AppContext } from "../../../context";
import _ from "lodash";
import FakeLogo2 from "../../../../assets/svgs/fakeLogo2.svg";

export default function ProviderProfileScreen({ navigation, route }) {
  const { team } = route.params;
  const { user } = useContext(AppContext);
  let { physicians } = user;

  const renderTeamMember = ({ item }) => {
    const { attributes } = item || {};
    return (
      <View style={styles.cardContainer}>
        <CareTeamCards
          individual
          navigation={navigation}
          name={
            _.isEmpty(attributes?.name) ||
            attributes?.name.match(/^ *$/) !== null
              ? "Obstetrical Care Provider"
              : attributes?.name
          }
          label={"Physician Profile"}
          team={attributes || item}
          icon={<FakeLogo2 height={40} width={40} />}
          avatar={item.avatar}
        />
      </View>
    );
  };
  return (
    <AppSafeAreaView edges={["left", "right"]}>
      <AppFlatList
        data={physicians}
        renderItem={renderTeamMember}
        keySignature="provider-profiles"
      />
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: MARGINS.mb3,
    marginHorizontal: MARGINS.mb3,
  },
});
