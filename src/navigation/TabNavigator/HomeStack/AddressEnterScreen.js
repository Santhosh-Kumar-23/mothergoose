

import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, TouchableOpacity, View, TextInput, Keyboard, ActivityIndicator } from 'react-native'
import AppContainer from '../../../components/AppContainer';
import AppSafeAreaView from '../../../components/AppSafeAreaView';
import AppScrollView from '../../../components/AppScrollView';
import AppLayout from "../../../components/AppLayout";
import AppText from '../../../components/AppText';
import { AppContext } from '../../../context';
import AppButton from '../../../components/AppButton';
import { bp_cuff_status_API, usps_address_check_API, get_userEDWAddress, getUserState } from '../../../api';
import { COLORS, MARGINS } from '../../../utils/styles';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import ConfirmationModal from '../../../components/ConfirmationModal';

// const axios = require('axios').default;

// const xmlbuilder2 = require('xmlbuilder2')

export default function AddressEnterScreen({ navigation }) {
    const { user } = useContext(AppContext)
    const [Loader, setLoader] = useState(true)
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [defaultAddress, setDefaultAddress] = useState("");
    const [Address1, setAddress1] = useState("");
    const [Address2, setAddress2] = useState("");
    const [AddressCity, setAddressCity] = useState("");
    const [AddressState, setAddressState] = useState("");
    const [AddressZip, setAddressZip] = useState("");
    const [AddressErr, setAddressErr] = useState("");
    const [openAddFeild, setOpenAddFeild] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [modalBody, setModalBody] = useState("false");
    const [modalBtn1, setModalBtn1] = useState("ok");
    const [modalBtn2, setModalBtn2] = useState("cancel");
    const [newSugAdd, setnewSugAdd] = useState("");

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const getEDWAddress = async () => {

        /**
         * Get the EDW address for populate to input placeholder
         */
        var recc_address = await getUserState(user?.first_name, user?.last_name, user?.date_of_birth);
        setAddress1(recc_address?.bp_cuff_address?.address_one)
        setAddressCity(recc_address?.bp_cuff_address?.city)
        setAddressState(recc_address?.bp_cuff_address?.state)
        setAddressZip(recc_address?.bp_cuff_address?.zip)

        /**
         * Get the USPS reconsiled address. If it is, directly allow the user to save it for cuff delivery address 
         */
        var res = await get_userEDWAddress(user.id);
        setDefaultAddress(res?.user_address)
        if (res?.user_address == "") {
            setOpenAddFeild(true)
        }
    }

    const onPositiveClick = async () => {
        if (newSugAdd != "") {
            var data = {
                "user_id": user?.id,
                "pregnancy_id": user?.pregnancy?.id,
                "accept_status": true,
                "delivery_address": newSugAdd
            }

            const res = await bp_cuff_status_API(data)
            if (res) {
                navigation.navigate("BPSuccessOrder")
                // navigation.navigate("Home")
            }
        } else {
            setOpenModal(false)
        }

    }

    const onCancelClick = () => {
        setOpenModal(false)
    }


    const onSaveSameAddres = async () => {
        var data = {
            "user_id": user?.id,
            "pregnancy_id": user?.pregnancy?.id,
            "accept_status": true,
            "delivery_address": defaultAddress
        }

        const res = await bp_cuff_status_API(data)
        if (res) {
            navigation.navigate("BPSuccessOrder")
            // navigation.navigate("Home")
        }
    }

    function removeCommaStart(inputString) {
        if (typeof inputString === 'string' && inputString.startsWith(',')) {
            return inputString.substring(1);
        }
        return inputString;
    }

    const checkWithUSPS = async () => {

        var data = {
            "address1": Address1,
            "address2": Address2,
            "city": AddressCity,
            "state": AddressState,
            "zip_code": AddressZip,
        }

        const res = await usps_address_check_API(data)
        if (res.error != "") {
            setModalBtn1("Close & edit again") // ok btn
            setModalBtn2("") // cancel btn
            setnewSugAdd("")
            setModalBody(res.error)
            setOpenModal(true)
        } else {

            let sug_addr = `${(res.suggested_address?.address1 ? "\n" : "") + res.suggested_address?.address1} ${(res.suggested_address?.address2 ? "\n" : "") + res.suggested_address?.address2} ${"\n" + res.suggested_address?.city + ", " + res.suggested_address?.state + ", " + res.suggested_address?.zip}`
            setModalBtn1("Confirm & close") // ok btn
            setModalBtn2("Edit again") // cancel btn
            setnewSugAdd(res.suggested_address)
            // setModalBody("Your suggested delivery address is " + removeCommaStart(res.suggested_address))
            setModalBody("Your suggested delivery address is " + sug_addr)
            setOpenModal(true)
        }

    }

    useEffect(() => {
        getEDWAddress()
        setTimeout(() => {
            setLoader(false)
        }, 1000)
    }, [])

    if (Loader) {
        return (
            <AppSafeAreaView edges={["left", "right"]}>
                <AppLayout onboarding>
                    <View style={[styles.alignJustifyCenter, { height: "100%", width: "100%" }]}>
                        <ActivityIndicator size="large" />
                    </View>
                </AppLayout>
            </AppSafeAreaView>
        )
    }

    return (
        <AppSafeAreaView edges={["left", "right"]}>
            <AppLayout onboarding>
                <AppScrollView >
                    <AppContainer transparent>
                        <AppText bold h2m mt3 blue >Please confirm the correct delivery address.</AppText>

                        {
                            openAddFeild == false ?
                                <>
                                    <View style={[styles.boxShadow, { width: "100%", padding: 20, backgroundColor: COLORS.white, borderRadius: 12, marginTop: MARGINS.mt4, justifyContent: "center" }]}>
                                        <AppText bold blue h3>Your delivery location</AppText>
                                        {/* <AppText bold mt2 h3>{defaultAddress ? `
                                        ${defaultAddress?.address1 ? defaultAddress?.address1 : ""}
                                        ${defaultAddress?.address2 ? ("\n" + defaultAddress?.address2) : ""}
                                        ${defaultAddress?.address2 ? ("\n" + defaultAddress?.city + ", " + defaultAddress?.city + ", " + defaultAddress?.city) : ""}
                                        ` : "Oops! No address found"}</AppText> */}

                                        {
                                            defaultAddress ?
                                                <>
                                                    {defaultAddress?.address1 ? <AppText bold mt2 h3>{`${defaultAddress?.address1}`}</AppText> : null}
                                                    {defaultAddress?.address2 ? <AppText bold mt2={defaultAddress?.address1 == "" ? false : true} h3>{`${defaultAddress?.address2} 2`}</AppText> : null}
                                                    <AppText bold h3>{`${defaultAddress?.city}, ${defaultAddress?.state}, ${defaultAddress?.zip}`}</AppText>
                                                </>
                                                :
                                                <AppText bold mt2 h3>{"Oops! No address found"}</AppText>
                                        }
                                        <TouchableOpacity onPress={() => { setOpenAddFeild(true) }}>
                                            <AppText mt3 InkBlue textAlignRight>(<AppText underline InkBlue>Edit delivery address</AppText>)</AppText>
                                        </TouchableOpacity>
                                    </View>

                                    {
                                        defaultAddress != "" ?
                                            <AppButton
                                                onPress={() => { onSaveSameAddres() }}
                                                title={"Submit"}
                                                blue
                                                big
                                                alignSelf
                                                style={{ marginTop: MARGINS.mb4 }}
                                            /> : null
                                    }

                                </> : null

                        }

                        {
                            openAddFeild ?
                                <>
                                    <View style={[styles.boxShadow, styles.addressInputfullView, { marginBottom: isKeyboardVisible ? 150 : 0 }]}>
                                        <View>
                                            <AppText bold textAlignCenter h3 blue>Enter a new delivery Address</AppText>
                                            {
                                                defaultAddress != "" ?
                                                    <TouchableOpacity onPress={() => { setOpenAddFeild(false) }}>
                                                        <AppText textAlignRight InkBlue underline>Cancel</AppText>
                                                    </TouchableOpacity>
                                                    : null
                                            }
                                        </View>
                                        <AppText blue h3 bold>Address</AppText>
                                        <View style={styles.inputView} >
                                            <TextInput
                                                value={Address1}
                                                placeholder={"Eg: 47 W 13th St"}
                                                placeholderTextColor={COLORS.gray}
                                                onChangeText={(text) => {
                                                    setAddress1(text)
                                                }}
                                                style={[styles.dropdown2BtnStyle, styles.textInputStyle]}
                                            />
                                        </View>
                                        <AppText mt2 blue h3 bold>Address 2</AppText>
                                        <View style={styles.inputView} >
                                            <TextInput
                                                value={Address2}
                                                placeholder={"Eg: Apt 145"}
                                                placeholderTextColor={COLORS.gray}
                                                onChangeText={(text) => {
                                                    setAddress2(text)
                                                }}
                                                style={[styles.dropdown2BtnStyle, styles.textInputStyle]}
                                            />
                                        </View>
                                        <AppText mt2 blue h3 bold>City</AppText>
                                        <View style={styles.inputView} >
                                            <TextInput
                                                value={AddressCity}
                                                placeholder={"Eg: New York"}
                                                placeholderTextColor={COLORS.gray}
                                                onChangeText={(text) => {
                                                    setAddressCity(text)
                                                }}
                                                style={[styles.dropdown2BtnStyle, styles.textInputStyle]}
                                            />
                                        </View>
                                        <AppText mt2 blue h3 bold>State</AppText>
                                        <View style={styles.inputView} >
                                            <TextInput
                                                value={AddressState}
                                                placeholder={"Eg: NY"}
                                                placeholderTextColor={COLORS.gray}
                                                onChangeText={(text) => {
                                                    setAddressState(text)
                                                }}
                                                style={[styles.dropdown2BtnStyle, styles.textInputStyle]}
                                            />
                                        </View>
                                        <AppText mt2 blue h3 bold>Zip code</AppText>
                                        <View style={styles.inputView} >
                                            <TextInput
                                                value={AddressZip}
                                                placeholder={"Eg: 10011"}
                                                placeholderTextColor={COLORS.gray}
                                                onChangeText={(text) => {
                                                    setAddressZip(text)
                                                }}
                                                keyboardType={"number-pad"}
                                                style={[styles.dropdown2BtnStyle, styles.textInputStyle]}
                                            />
                                        </View>

                                        {AddressErr ? <AppText textAlignCenter red h3m mt3>{AddressErr}</AppText> : null}
                                    </View>
                                    <AppButton
                                        onPress={() => { checkWithUSPS() }}
                                        title={"Submit"}
                                        blue
                                        big
                                        alignSelf
                                        style={{ marginTop: MARGINS.mb4 }}
                                    />
                                </> : null
                        }

                    </AppContainer>
                </AppScrollView>
                <ConfirmationModal
                    open={openModal}
                    setOpen={setOpenModal}
                    header={"Attention, please!"}
                    body={modalBody}
                    buttonTitle={modalBtn1}
                    onPress={() => { onPositiveClick() }}
                    onCancelPress={() => { onCancelClick() }}

                    cancelButton={modalBtn2 != ""}
                    cancelButtonTitle={modalBtn2}
                />
            </AppLayout>
        </AppSafeAreaView>
    )

}


const styles = StyleSheet.create({
    addressInputfullView: { width: "100%", backgroundColor: Colors.white, padding: 20, borderRadius: 12, marginTop: MARGINS.mt4 },
    inputView: { width: "100%", flexDirection: "row", justifyContent: "space-between", },
    textInputStyle: { paddingLeft: 15, width: "100%", marginTop: MARGINS.mt2 },
    buttonView: {
        width: "80%",
        justifyContent: "space-around",
        flexDirection: "row",
    },
    boxShadow: {
        marginBottom: MARGINS.mb1,
        padding: 4,
        shadowColor: COLORS.primaryDark,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3
    },
    alignJustifyCenter: {
        alignItems: "center",
        justifyContent: "center"
    },
    dropdown2BtnStyle: {
        width: '100%',
        height: 40,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.mediumBlue,
        color: COLORS.black
    },
});