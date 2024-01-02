

import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import AppContainer from '../../../components/AppContainer';
import AppSafeAreaView from '../../../components/AppSafeAreaView';
import AppScrollView from '../../../components/AppScrollView';
import AppLayout from "../../../components/AppLayout";
import AppText from '../../../components/AppText';
import { AppContext } from '../../../context';
import AppButton from '../../../components/AppButton';
import { bp_cuff_status_API } from '../../../api';
import Check from "../../../../assets/svgs/Check.svg";
import LinkIcon from "../../../../assets/svgs/LinkIcon.svg";
import Uncheck from "../../../../assets/svgs/Uncheck.svg"
import { MARGINS } from '../../../utils/styles';

export default function AgreeBPcuff({ navigation }) {
    const { user } = useContext(AppContext)
    const [isAgree, setIsAgree] = useState(false)

    // var info1 = '"Blood pressure abnormalities are the most common reason for problems in pregnancy. \nIncreasing the frequency of checking your blood pressure can detect these problems early. \nSo, Mother Goose and your obstetrician have teamed up to provide you a free blood pressure cuff"'
    // var info2 = "Here's how it works\n➢ there is no set up required except to put in the batteries\n➢ we will send you reminders to check your blood pressure twice weekly\n➢ your care manager is always available to answer questions\n➢ your obstetrician will automatically receive all measurements which will also appear on your mobile app"
    // var info2_arr = ["Here's how it works", "There is no set up required except to put in the batteries", "We will send you reminders to check your blood pressure twice weekly", "Your care manager is always available to answer questions", "Your obstetrician will automatically receive all measurements which will also appear on your mobile app"]
    // var info3 = "Please click here to acknowledge the terms and receive your blood pressure cuff."
    // var info4 = "Blood Pressure Cuff User Manual for you"

    let titiledata = "Personalized Blood Pressure Program\nStart Here"

    let riskTitle = "Risk"
    let riskBody = "Abnormal blood pressure is a very common sign of problems in pregnancy."

    let PreventionTitle = "Prevention"
    let PreventionBody = "Increasing how often your blood pressure is checked can help detect and solve problems early."

    let ProgramTitle = "Program"
    let ProgramBody = "Mother Goose and your obstetrical provider have team up to provide a mobile blood pressure cuff at no cost to you."

    let guideTitle = "How it Works"

    let guideBody = [
        "The cuff is ready to use out of the box, just add batteries (included)",
        "Follow the instructions to take your first blood pressure measurement ",
        "We will automatically receive measurements after every use",
        "The cuff works like a cell phone, using its own signal to share results with your care team",
        "Mother Goose will send you reminders to check your blood pressure twice a week",
        "Your Mother Goose care manager is always available to answer questions",
        "You can find your blood pressure history in your Mother Goose mobile app"
    ]

    let alertTxt = "Your provider will receive an alert and contact you if there are any abnormalities"

    let consentTitle = "Consent"
    let consentBody = "Please click here to acknowledge the terms for this preventative program and we will send you your blood pressure cuff."


    const onAgree = async () => {
        // Api Call
        await navigation.navigate("AddressEnterScreen")
    }

    return (
        <AppSafeAreaView edges={["left", "right"]}>
            <AppLayout onboarding>
                <AppScrollView >
                    <AppContainer transparent>
                        <AppText h3 mt2 blue bold>{titiledata}</AppText>

                        <AppText h3 mt3 blue bold>{riskTitle}</AppText>
                        <AppText h3m blue >{riskBody}</AppText>

                        <AppText h3 mt2 blue bold>{PreventionTitle}</AppText>
                        <AppText h3m blue >{PreventionBody}</AppText>

                        <AppText h3 mt2 blue bold>{ProgramTitle}</AppText>
                        <AppText h3m blue >{ProgramBody}</AppText>

                        <View />
                        <AppText h3 mt3 blue bold>{guideTitle}</AppText>
                        {
                            guideBody.map((val, key) => {
                                return (
                                    <View style={{ flexDirection: "row", marginTop: 5, paddingRight: 10 }}>
                                        <AppText h3m blue >➢ </AppText>
                                        <AppText h3m blue>{val}</AppText>
                                    </View>
                                )
                            })
                        }

                        <AppText h3 mt3 blue bold>{alertTxt}</AppText>

                        {/* BP cuff user manual pdf link */}
                        {/* <AppText h3 blue mt3>{info4} <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("CustomWebview", {
                                    WebURL: process.env.BPcuff_user_manual_link,
                                    headerTitle: "BP Cuff user manual",
                                    BackNavScreen: "AgreeBPcuff"
                                })
                            }}
                        >
                            <LinkIcon height={18} width={18} />
                        </TouchableOpacity>
                        </AppText> */}

                        <AppText h3 mt3 blue bold>{consentTitle}</AppText>
                        <View style={{ flexDirection: "row", marginTop: MARGINS.mb2, paddingRight: 20 }}>
                            <TouchableOpacity style={{ marginTop: 4 }} onPress={() => {
                                setIsAgree(!isAgree)
                            }}>
                                {
                                    isAgree ?
                                        <Check height={21} width={21} />
                                        :
                                        <Uncheck height={21} width={21} />
                                }
                            </TouchableOpacity>
                            <AppText ml2 h3m blue>{consentBody} <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("CustomWebview", {
                                        WebURL: process.env.BP_terms_link,
                                        headerTitle: "BP Cuff Terms",
                                        BackNavScreen: "AgreeBPcuff"
                                    })
                                }}
                            >
                                <LinkIcon height={18} width={18} style={{ top: 3 }} />
                            </TouchableOpacity>
                            </AppText>
                        </View>
                    </AppContainer>
                </AppScrollView>
                <View style={styles.buttonView}>
                    <AppButton
                        onPress={() => { onAgree() }}
                        title={"I Agree"}
                        blue
                        small
                        alignSelf
                        style={{ right: 10 }}
                        disabled={!isAgree}
                    />
                    <AppButton
                        onPress={() => {
                            // onDecline() 
                            navigation.navigate("DeclineOptionScreen")
                        }}
                        title={"Decline"}
                        small
                        white
                        alignSelf
                        style={{ left: 10, backgroundColor: "#dbdbdb" }}
                    />
                </View>
            </AppLayout>
        </AppSafeAreaView>
    )

}


const styles = StyleSheet.create({
    buttonView: {
        width: "80%",
        justifyContent: "space-between",
        flexDirection: "row",

    }
});