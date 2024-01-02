import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import AppContainer from "../../../components/AppContainer";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppScrollView from "../../../components/AppScrollView";
import AppText from "../../../components/AppText";
import CareTeamCards from "../../../components/CareTeamCards";
import Link from "../../../components/Link";
import { COLORS, MARGINS } from "../../../utils/styles";
import FakeLogo2 from "../../../../assets/svgs/fakeLogo2.svg";
import _ from "lodash";
import AppButton from "../../../components/AppButton";

export default function ManagerDemographics({ navigation, route }) {

    // let { team } = route.params;

    // let practitioner = team;
    let { practitioner, name, label } = route.params;

    const care_manager = true;

    const display_name = practitioner.first_name
        ? practitioner.first_name + " " + practitioner.last_name
        : practitioner.name;

    useEffect(() => {
        // if (platform_provider)
        //     navigation.setOptions({
        //         title: "Provider Profile",
        //     });
        if (care_manager) {
            navigation.setOptions({
                title: "Care Manager",
            });
        }
    }, []);

    let demographics = [];

    if (care_manager) {
        demographics = [
            {
                label: "Role",
                value: practitioner?.care_manager_type,
                labelProps: {
                    bold: true,
                    black: true,
                },
                noContentStyles: true,
                labelStyles: styles.bioStyles,
                simpleText: true,
            },
        ];
    }

    const renderDemographicRow = (demographic, key) => (
        <View
            key={key}
            style={!demographic.noContentStyles && styles.contentContainer}
        >
            <AppText gray style={demographic.labelStyles} {...demographic.labelProps}>
                {demographic.label}
            </AppText>
            {!_.isEmpty(demographic.value) && (
                <>
                    {demographic.simpleText ? (
                        <AppText>{demographic.value}</AppText>
                    ) : (
                        <Link
                            style={styles.rowContentStyles}
                            ml2
                            numberOfLines={3}
                            {...demographic.valueProps}
                        >
                            {demographic.value}
                        </Link>
                    )}
                </>
            )}
        </View>
    );

    return (
        <AppSafeAreaView edges={["left", "right"]}>
            <AppScrollView>
                <AppContainer noPaddingTop>
                    <CareTeamCards
                        name={display_name || name}
                        label={practitioner.title || practitioner.qualifications}
                        avatar={practitioner.avatar || <FakeLogo2 height={40} width={40} />}
                        icon={practitioner.icon || <FakeLogo2 height={40} width={40} />}
                        noIcon
                        noPress
                        noShadow
                        borderBottom
                    />
                    {demographics.map((demographic, key) => {
                        return renderDemographicRow(demographic, key);
                    })}
                </AppContainer>
            </AppScrollView>
            {care_manager && (
                <AppContainer
                    noPaddingTop
                    noPaddingBottom
                    style={styles.chatContainerStyles}
                >
                    <AppButton
                        onPress={() =>
                            navigation.navigate("Chat", {
                                care_manager_id: practitioner?.id,
                            })
                        }
                        title={"CHAT"}
                        blue
                    />
                </AppContainer>
            )}
        </AppSafeAreaView>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        borderBottomColor: COLORS.gray,
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: MARGINS.mb2,
    },
    rowContentStyles: {
        marginLeft: MARGINS.mb4,
        textAlign: "right",
    },
    bioStyles: {
        paddingVertical: MARGINS.mb2,
    },
    chatContainerStyles: {
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
});
