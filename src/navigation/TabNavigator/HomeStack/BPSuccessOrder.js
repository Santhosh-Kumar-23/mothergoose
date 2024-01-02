

import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import AppContainer from '../../../components/AppContainer';
import AppSafeAreaView from '../../../components/AppSafeAreaView';
import AppLayout from "../../../components/AppLayout";
import AppText from '../../../components/AppText';
import AppButton from '../../../components/AppButton';
import Success from "../../../../assets/Success.png";

export default function BPSuccessOrder({ navigation }) {
    const info1 = 'Thank you, Your brand new device should be arriving in 5 - 7 days!'
    return (
        <AppSafeAreaView edges={["left", "right"]}>
            <AppLayout onboarding>
                <AppContainer transparent justifyCenter>
                    <View style={styles.buttonView}>
                        <Image source={Success} style={{ height: 150, width: 150, resizeMode: "contain" }} />
                        <AppText center h3 mt4 blue bold>{info1}</AppText>
                        <AppButton
                            mt4
                            onPress={() => { navigation.navigate("Home") }}
                            title={"Okay"}
                            small
                            blue
                            alignSelf
                        />
                    </View>
                </AppContainer>
            </AppLayout>
        </AppSafeAreaView>
    )
}

const styles = StyleSheet.create({
    buttonView: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    }
});