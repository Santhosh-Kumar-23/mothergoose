

import React, { useEffect, useState, useContext } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import AppContainer from '../../../../components/AppContainer';
import AppSafeAreaView from '../../../../components/AppSafeAreaView';
import AppLayout from "../../../../components/AppLayout";
import AppText from '../../../../components/AppText';
import AppButton from '../../../../components/AppButton';
import Breastfeeding from "../../../../../assets/breastfeeding.png";
import Babyheart from "../../../../../assets/babyheart.png";

import AppHeader from '../../../../components/AppHeader';
import { AppActiveOpacity, COLORS } from '../../../../utils/styles';
import { AppContext } from '../../../../context';
import { fetch_insurances, getPumpDetails, sendBFSUserResponse } from '../../../../api';
import SelectDropdown from 'react-native-select-dropdown'
import UpArrow from "../../../../../assets/upArrow.png"
import DownArrow from "../../../../../assets/downArrow.png"
import InfoIcon from "../../../../../assets/info.png"
import AppScrollView from '../../../../components/AppScrollView';


export default function FeedingPlanDashboard({ navigation }) {

    const [preOrdertab, setPreOrdertab] = useState(false)
    const { user } = useContext(AppContext)

    console.log("is_nest_filter_valid", user?.is_nest_filter_valid)

    var info1 = 'Mother Goose is here to support you in whatever decision you make about how to feed your newborn.'
    var info2 = "Are you planning to feed with breastmilk?"
    var info3 = "I would like to learn more"

    var info4 = "Thank you for sharing that with us."
    var info5 = "Click here to view your insurance benefits and order your breast pump and supplies"
    var info6 = "We are here to support you in your breastfeeding journey. Mother Goose has teamed up with Nest Collaborative to offer Certified Lactation Consultants with video visits and education."
    var info7 = "Would you like to meet  with your lactation consultant?"

    // const dataList = [
    //     [1, "Insurance A"],
    //     [2, "Insurance B"],
    //     [3, "Insurance C"],
    //     [4, "Insurance D"]
    // ]
    // const AppSelectDropdown = ({
    //     feild,
    //     defaultButtonText,
    //     dataList,
    //     onSelectItem,
    // }) => {
    //     return (
    //         <SelectDropdown
    //             data={dataList}
    //             // onSelect={(selectedItem, index) => {
    //             //     console.log(selectedItem, index);
    //             // }}
    //             onSelect={(selectedItem, index) => {
    //                 onSelectItem(selectedItem);
    //             }}
    //             defaultButtonText={defaultButtonText}
    //             buttonTextAfterSelection={(selectedItem, index) => {
    //                 return selectedItem[1];
    //             }}
    //             rowTextForSelection={(item, index) => {
    //                 return item[1];
    //             }}
    //             buttonStyle={styles.dropdown2BtnStyle}
    //             buttonTextStyle={styles.dropdown2BtnTxtStyle}
    //             renderDropdownIcon={isOpened => {
    //                 return <Image source={isOpened ? UpArrow : DownArrow} style={{ height: 20, width: 20 }} />
    //             }}
    //             dropdownIconPosition={'right'}
    //             dropdownStyle={styles.dropdown2DropdownStyle}
    //             rowStyle={styles.dropdown2RowStyle}
    //             rowTextStyle={styles.dropdown2RowTxtStyle}
    //         />
    //     )
    // }

    // const onChangeOption = async (selectedItem) => {
    //     console.log("selectedItem", selectedItem)

    // }

    // useEffect(() => {
    //     async function getinsurancesList() {
    //         const insurances = await fetch_insurances(user?.id)
    //     }
    //     getinsurancesList();
    // }, [user])

    const sendCommonResponseInBFS = async (commonData) => {
        await sendBFSUserResponse(user?.id, {
            "user_response": {
                "response_type": commonData,
                "response": true,
                "module_name": "BFS"
            }
        })
    }
    return (
        <AppSafeAreaView >
            <AppHeader
                headerTitle="Feeding Plan"
                onBackPress={() => {
                    if (preOrdertab) {
                        setPreOrdertab(false)
                    } else {
                        navigation.navigate("Home");
                    }
                }}
            />
            <AppLayout onboarding>
                <AppScrollView>
                    <AppContainer transparent >
                        {
                            !preOrdertab ?
                                <View style={styles.Container}>
                                    <Image source={Babyheart} style={{ height: 150, width: 150, resizeMode: "contain" }} />
                                    <AppText h3 mt2 blue bold center>{info1}</AppText>

                                    {/* <View style={{ width: "100%", alignItems: "center" }}>
                                        <TouchableOpacity activeOpacity={0.8}
                                            onPress={() => {
                                                navigation.navigate("LearnMoreScreen")
                                            }}
                                        >
                                            <AppText underline h3 blue mt3>{info3}</AppText>
                                        </TouchableOpacity>
                                    </View> */}

                                    <AppText center h2m blue bold style={{ marginTop: 50 }}>{info2}</AppText>
                                    <View style={styles.BtnsView}>
                                        <AppButton
                                            mt4
                                            onPress={async () => {
                                                await sendBFSUserResponse(user?.id, {
                                                    "user_response": {
                                                        "response_type": "Are you planning to feed with breastmilk?",
                                                        "response": false,
                                                        "module_name": "BFS"
                                                    }
                                                })
                                                await navigation.navigate("EducationMaterial")
                                            }}
                                            title={"No"}
                                            verysmall
                                            blue
                                            alignSelf
                                        />
                                        <AppButton
                                            mt4
                                            onPress={async () => {
                                                await sendBFSUserResponse(user?.id, {
                                                    "user_response": {
                                                        "response_type": "Are you planning to feed with breastmilk?",
                                                        "response": true,
                                                        "module_name": "BFS"
                                                    }
                                                })
                                                setPreOrdertab(true)
                                            }}
                                            title={"Yes"}
                                            verysmall
                                            blue
                                            alignSelf
                                        />
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={AppActiveOpacity}
                                        onPress={async () => {
                                            await sendCommonResponseInBFS(info3)
                                            await navigation.navigate("LearnMoreScreen")
                                        }}
                                        style={{ alignItems: "center", justifyContent: "center", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, backgroundColor: COLORS.darkBlue, marginTop: 30 }}>
                                        <AppText h3 white bold >{info3}</AppText>
                                    </TouchableOpacity>

                                    {/* <AppButton
                                        mt4
                                        onPress={() => { navigation.navigate("LearnMoreScreen") }}
                                        title={info3}
                                        small
                                        blue
                                        alignSelf
                                    /> */}
                                </View> :

                                <View style={styles.Container2}>
                                    <Image source={Babyheart} style={{ height: 150, width: 150, resizeMode: "contain", marginTop: 40 }} />
                                    <AppText center h2m mt2 mb2 blue bold>{info4}</AppText>
                                    {
                                        user?.is_nest_filter_valid ?
                                            <>
                                                <AppText center h3 mt1 mb3 blue semibold >{info6}</AppText>
                                                <AppText center h3 blue semibold>{info7}</AppText>
                                                <View style={{ width: "90%" }}>
                                                    <AppButton
                                                        // onPress={() => navigation.navigate("Scheduling")}
                                                        onPress={() => {
                                                            navigation.navigate("BfsBookingWebView", {
                                                                headerTitle: "Nest Collaborative",
                                                                BackNavScreen: "FeedingPlanDashboard",
                                                            });
                                                        }}
                                                        mt4
                                                        title="Schedule an appointment"
                                                        schedule
                                                    />

                                                </View>
                                                <AppText center h3m gray>You can always come back and do this later from appointment scheduling button</AppText>

                                                {/* <TouchableOpacity
                                                    onPress={() => {
                                                        navigation.navigate("BfsBookingWebView", {
                                                            headerTitle: "Nest Booking",
                                                            BackNavScreen: "FeedingPlanDashboard",
                                                        });
                                                    }}
                                                    activeOpacity={0.8}
                                                    style={{ width: "90%", backgroundColor: COLORS.darkBlue, padding: 15, borderRadius: 10, flexDirection: "row", marginTop: 40 }}>
                                                    <View style={{ width: "100%", paddingHorizontal: 10 }} >
                                                        <Text style={{ color: COLORS.white, fontSize: 15, fontWeight: "600", textAlign: "justify" }}>Schedule appointment</Text>
                                                    </View>
                                                </TouchableOpacity> */}

                                            </>
                                            : null
                                    }

                                    {/* <AppSelectDropdown
                                        onSelectItem={onChangeOption}
                                        feild={"insurance"}
                                        dataList={dataList}
                                        defaultButtonText={dataList?.length ? dataList[0][1] : "Select an Insurance"}
                                    /> */}

                                    <TouchableOpacity
                                        onPress={async () => {
                                            await sendCommonResponseInBFS(info5)
                                            await navigation.navigate("ShopScreen")
                                        }}
                                        activeOpacity={0.8}
                                        style={styles.ShoppBtn}>
                                        <View style={styles.ShopeBtnTxtView} >
                                            <Text style={styles.ShopBtnTxtStyle}>{info5}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {/* <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate("ShopScreen")
                                        }}
                                        activeOpacity={0.8} style={{ paddingHorizontal: 10, paddingVertical: 10, marginHorizontal: 30, marginTop: 20, backgroundColor: COLORS.darkBlue, borderRadius: 10, alignItems: "center", justifyContent: "center", width: "50%" }}>
                                        <AppText center white bold h3>{"Proceed"}</AppText>
                                    </TouchableOpacity> */}
                                </View>
                        }
                    </AppContainer>
                </AppScrollView>
            </AppLayout>
        </AppSafeAreaView>
    )

}

const styles = StyleSheet.create({
    ShoppBtn: { width: "90%", backgroundColor: COLORS.darkBlue, padding: 15, borderRadius: 10, flexDirection: "row", marginTop: 30 },
    ShopeBtnTxtView: { width: "100%", paddingHorizontal: 10 },
    ShopBtnTxtStyle: { color: COLORS.white, fontSize: 15, fontWeight: "600", textAlign: "justify" },
    Container: {
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    Container2: {
        width: "100%",
        // flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    BtnsView: { flexDirection: "row", width: "100%", justifyContent: "space-evenly" },
    dropdown2BtnStyle: {
        width: '85%',
        height: 40,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.mediumBlue,

    },
    dropdown2BtnTxtStyle: {
        textAlign: 'left',
        fontSize: 15
        // fontWeight: 'bold',
    },
    dropdown2DropdownStyle: {
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    dropdown2RowStyle: { height: 39, backgroundColor: COLORS.white, borderBottomColor: '#C5C5C5' },
    dropdown2RowTxtStyle: {
        textAlign: 'left',
        fontSize: 15
        // fontWeight: 'bold',
    },
});