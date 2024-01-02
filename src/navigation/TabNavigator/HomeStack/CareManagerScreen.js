import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import AppContainer from "../../../components/AppContainer";
import AppFlatList from "../../../components/AppFlatList";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import { COLORS, MARGINS } from "../../../utils/styles";
import { AppContext } from "../../../context";
import CareTeamCards from "../../../components/CareTeamCards";
import FakeLogo2 from "../../../../assets/svgs/fakeLogo2.svg";
import AppText from "../../../components/AppText";

export default function CareManagerScreen({ navigation }) {
    const { providers, user } = useContext(AppContext);

    const { care_team } = user;

    /**
     * Return Platform Provider/Care Manager card to FlatList.
     * @param {object} item - Provider/Care Manager with demographic info
     */
    const renderTeam = ({ item }) => {
        const { attributes } = item || {};
        if (attributes.care_manager_type == "Obstetrical Registered Nurse" || attributes.care_manager_type == "Social Worker")
            return (
                <View style={styles.providerCardContainer}>
                    <CareTeamCards
                        // individual
                        navigation={navigation}
                        name={attributes?.first_name + " " + attributes?.last_name}
                        label={attributes?.care_manager_type}
                        team={attributes}
                        careManagerProfile={true}
                        icon={<FakeLogo2 height={40} width={40} />}
                        avatar={<FakeLogo2 height={40} width={40} />}
                    />
                </View>
            );
    };

    return (
        <AppSafeAreaView edges={["left", "right"]}>
            <AppContainer noPaddingTop noPaddingBottom>
                {
                    care_team.length > 0 ?
                        <AppText h3 bold mt3>
                            Who do you want to chat with?
                        </AppText> :
                        <AppText h3 bold mt3>
                            Currently, No Care manager is available!
                        </AppText>
                }
                <AppFlatList
                    data={care_team}
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
