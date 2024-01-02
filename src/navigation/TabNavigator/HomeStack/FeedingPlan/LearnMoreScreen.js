import React from 'react'
import { Image } from 'react-native'
import AppContainer from '../../../../components/AppContainer';
import AppSafeAreaView from '../../../../components/AppSafeAreaView';
import AppLayout from "../../../../components/AppLayout";
import AppText from '../../../../components/AppText';
import AppButton from '../../../../components/AppButton';
import Babyheart from "../../../../../assets/babyheart.png";
import AppHeader from '../../../../components/AppHeader';

export default function LearnMoreScreen({ navigation }) {
    const info1 = 'Thank you for sharing  that with us.\nYour care manager is happy to chat and answer any questions.'
    return (
        <AppSafeAreaView>
            <AppHeader
                headerTitle="Learn More"
                onBackPress={() => {
                    navigation.goBack();
                }}
            />
            <AppLayout onboarding>
                <AppLayout onboarding>
                    <AppContainer transparent style={{ alignItems: "center", justifyContent: "center" }}>
                        <Image source={Babyheart} style={{ height: 150, width: 150, resizeMode: "contain", marginTop: 40 }} />
                        <AppText center h2m mt2 blue bold>{info1}</AppText>
                        <AppButton
                            mt4
                            onPress={() => { navigation.navigate("Chat") }}
                            title={"Chat"}
                            small
                            blue
                            alignSelf
                        />
                    </AppContainer>
                </AppLayout>
            </AppLayout>
        </AppSafeAreaView>
    )
}
