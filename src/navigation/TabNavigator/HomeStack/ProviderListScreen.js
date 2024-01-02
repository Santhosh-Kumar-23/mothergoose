import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppScrollView from "../../../components/AppScrollView";
import AppContainer from "../../../components/AppContainer";
import AppText from "../../../components/AppText";
import { AppContext } from "../../../context";
import CareTeamCards from "../../../components/CareTeamCards";
import FakeLogo2 from "../../../../assets/svgs/fakeLogo2.svg";
import { MARGINS } from "../../../utils/styles";

export default function ProviderListScreen({ navigation, route }) {

    const { providers } = useContext(AppContext);

    const getProviderSpecialties = (item) => {
        let specialties =
            item?.attributes?.specialties.join(", ") || "Provider's Profile";
        if (specialties.length > 33) {
            specialties = specialties.substr(0, 33) + "...";
        }
        return specialties;
    };

    const provider_name = (item) => {
        return item?.attributes?.name || "Platform Provider";
    };

    return (
        <AppSafeAreaView edges={["left", "right"]}>
            <AppScrollView>
                <AppContainer noPaddingTop>
                    <AppText bold h2 center blue mt3>We are happy to help!</AppText>
                    <AppText bold h3 center blue mt4 mb3>Please select a member of your obstetrical care team</AppText>
                    {
                        providers?.map((item) => {
                            return (
                                <View style={styles.providerCardContainer}>
                                    <CareTeamCards
                                        navigation={navigation}
                                        name={
                                            item?.type === "provider"
                                                ? provider_name(item)
                                                : item?.attributes?.first_name + " " + item?.attributes?.last_name
                                        }
                                        label={
                                            item?.type === "provider"
                                                ? getProviderSpecialties(item)
                                                : null//item?.attributes?.care_manager_type
                                        }
                                        team={item}
                                        icon={<FakeLogo2 height={40} width={40} />}
                                        apptScheduling={true}
                                        avatar={item?.attributes.avatar}
                                    />
                                </View>
                            )
                        })
                    }
                </AppContainer>
            </AppScrollView>
        </AppSafeAreaView>
    );
}

const styles = StyleSheet.create({
    providerCardContainer: {
        marginBottom: MARGINS.mb3,
    },
});
