

import React, { useContext } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import AppContainer from '../../../components/AppContainer';
import AppSafeAreaView from '../../../components/AppSafeAreaView';
import AppLayout from "../../../components/AppLayout";
import AppText from '../../../components/AppText';
import { AppContext } from '../../../context';
import Attention from "../../../../assets/Attention.png";
import { bp_cuff_status_API } from '../../../api';
import { COLORS } from '../../../utils/styles';
import AppScrollView from '../../../components/AppScrollView';

export default function DeclineOptionScreen({ navigation }) {

    const { user } = useContext(AppContext)

    let info1 = 'Are you sure? Home blood pressure monitoring is recommended by your doctor and available to you at no cost.'
    let btn1Text = "I have questions about this - please connect me to a nurse"
    let btn2Text = "I declined accidentally, please sign me up!"
    let btn3Text = "I am sure and I know if I change my mind I can reach out to my nurse care manager"

    const onDecline = async () => {
        var data = {
            "user_id": user?.id,
            "pregnancy_id": user?.pregnancy?.id,
            "accept_status": false,
            "delivery_address": ""
        }
        const res = await bp_cuff_status_API(data)
        if (res) {
            await navigation.navigate("Home")
        }
    }

    return (
        <AppSafeAreaView edges={["left", "right"]}>
            <AppLayout onboarding>
                <AppScrollView>
                    <AppContainer transparent justifyCenter>
                        <View style={styles.buttonView}>
                            <Image source={Attention} style={{ height: 150, width: 150, resizeMode: "contain" }} />
                            <AppText center h3 mt3 mb4 blue bold>{info1}</AppText>
                            <TouchableOpacity activeOpacity={0.9} style={styles.BtnStyle}
                                onPress={() => {
                                    navigation.navigate("Chat")
                                }}
                            >
                                <AppText center h3 bold white>{btn1Text}</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.9} style={styles.BtnStyle}
                                onPress={() => {
                                    navigation.goBack();
                                }}>
                                <AppText center h3 bold white>{btn2Text}</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.9} style={styles.BtnStyle}
                                onPress={() => {
                                    onDecline()
                                }}>
                                <AppText center h3 bold white>{btn3Text}</AppText>
                            </TouchableOpacity>
                        </View>
                    </AppContainer>
                </AppScrollView>

            </AppLayout>
        </AppSafeAreaView>
    )

}

const styles = StyleSheet.create({
    buttonView: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    BtnStyle: { backgroundColor: COLORS.darkBlue, borderRadius: 10, padding: 10, marginTop: 20 }
});