

import React, { useState, useContext } from 'react'
import { Image, Platform, StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity, Dimensions, ScrollView, TextInput } from 'react-native'
import AppContainer from '../../../../components/AppContainer';
import AppSafeAreaView from '../../../../components/AppSafeAreaView';
import AppLayout from "../../../../components/AppLayout";
import AppText from '../../../../components/AppText';
import AppButton from '../../../../components/AppButton';
import Babyheart from "../../../../../assets/babyheart.png";
import Important from "../../../../../assets/Important.png";
import Bpump from "../../../../../assets/pump.jpeg";
import AppHeader from '../../../../components/AppHeader';
import { useEffect } from 'react';
import { getPumpDetails, getUserState, get_userEDWAddress, sendBFSUserResponse, sendOrderDetails, usps_address_check_API } from '../../../../api';
import { AppContext } from '../../../../context';
import { AppActiveOpacity, COLORS, MARGINS } from '../../../../utils/styles';
import ConfirmationModal from '../../../../components/ConfirmationModal';
const { width } = Dimensions.get("window");

export default function ProductDetailsScreen({ navigation, route }) {
    const { productDetails } = route?.params
    const { user } = useContext(AppContext)
    const [successTab, setSuccessTab] = useState(false)
    const [Loader, setLoader] = useState(false)
    const [isNewAddress, setIsNewAddress] = useState(false)
    const [isOrderPlaced, setIsOrderPlaced] = useState(false)

    const [Address1, setAddress1] = useState("");
    const [Address2, setAddress2] = useState("");
    const [AddressCity, setAddressCity] = useState("");
    const [AddressState, setAddressState] = useState("");
    const [AddressZip, setAddressZip] = useState("");
    const [PreReconsidedAddress, setPreReconsidedAddress] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [modalBody, setModalBody] = useState("Unable to Place Order\n\nSomething went wrong! We apologize for the inconvenience. Please try again later.");
    const [modalBtn1, setModalBtn1] = useState("ok");
    const [modalBtn2, setModalBtn2] = useState("cancel");
    const [newSugAdd, setnewSugAdd] = useState("");


    var info1 = 'Thanks!  We shared this request with your provider for approval.  Once we have received the signed order of approval, The Breastfeeding Shop team will give you a call to make sure the delivery goes well.'

    useEffect(() => {
        getEDWAddress()
    }, [])

    function addHttpsPrefixIfNeeded(url) {
        // Check if the URL starts with 'https://'
        if (url.startsWith('https://')) {
            // URL already has the 'https://' prefix, return it as is
            return url;
        } else {
            // URL doesn't have the prefix, add it and return the modified URL
            return `https://${url}`;
        }
    }

    // const checkWithUSPS = async () => {

    //     var data = {
    //         "address1": Address1,
    //         "address2": Address2,
    //         "city": AddressCity,
    //         "state": AddressState,
    //         "zip_code": AddressZip,
    //     }

    //     const res = await usps_address_check_API(data)
    //     if (res.error != "") {
    //         setModalBtn1("Close & edit again") // ok btn
    //         setModalBtn2("") // cancel btn
    //         setnewSugAdd("")
    //         setModalBody(res.error)
    //         setOpenModal(true)
    //     } else {

    //         let sug_addr = `${(res.suggested_address?.address1 ? "\n" : "") + res.suggested_address?.address1} ${(res.suggested_address?.address2 ? "\n" : "") + res.suggested_address?.address2} ${"\n" + res.suggested_address?.city + ", " + res.suggested_address?.state + ", " + res.suggested_address?.zip}`
    //         setModalBtn1("Confirm & close") // ok btn
    //         setModalBtn2("Edit again") // cancel btn
    //         setnewSugAdd(res.suggested_address)
    //         // setModalBody("Your suggested delivery address is " + removeCommaStart(res.suggested_address))
    //         setModalBody("Your order will be delivered to the following address" + sug_addr)
    //         setOpenModal(true)
    //     }

    // }

    const sendCommonResponseInBFS = async (commonData) => {
        await sendBFSUserResponse(user?.id, {
            "user_response": {
                "response_type": commonData,
                "response": true,
                "module_name": "BFS"
            }
        })
    }

    const onsubmitOrder = async () => {
        let payload = {
            productDetails: productDetails,
            // shippingDetails: {
            //     "address1": Address1,
            //     "address2": Address2,
            //     "city": AddressCity,
            //     "state": AddressState,
            //     "zip_code": AddressZip,
            // }
        }
        setLoader(true)
        await sendOrderDetails(user?.id, payload).then((response) => {
            if (response?.success === true) {
                // Order has placed, If false means, this user is not having diagnosis
                setLoader(false)
                setIsOrderPlaced(true)
            } else {
                setOpenModal(true) // Showing err alert
                setLoader(false)
            }
        }).catch((e) => {
            setOpenModal(true) // Showing err alert
            setLoader(false)
        })
    }

    const getEDWAddress = async () => {
        /**
         * Get the EDW address for populate to input placeholder
         */
        var EDW_address = await getUserState(user?.first_name, user?.last_name, user?.date_of_birth);
        await console.log("EDW_address", EDW_address)
        setAddress1(EDW_address?.bp_cuff_address?.address_one)
        setAddressCity(EDW_address?.bp_cuff_address?.city)
        setAddressState(EDW_address?.bp_cuff_address?.state)
        setAddressZip(EDW_address?.bp_cuff_address?.zip)

        /**
         * Get the USPS reconsiled address. If it is, directly allow the user to save it for cuff delivery address 
         */
        var res = await get_userEDWAddress(user.id);
        await console.log("get_userEDWAddress res", res)
        if (res?.user_address != "") {
            setPreReconsidedAddress(res?.user_address)
            setAddress1(res?.user_address?.address1)
            setAddress2(res?.user_address?.address2)
            setAddressCity(res?.user_address?.city)
            setAddressState(res?.user_address?.state)
            setAddressZip(res?.user_address?.zip)
            setOpenAddFeild(true)
        }
    }
    const onCancelClick = () => {
        console.log("onCancelClick")
        setOpenModal(false)
    }
    return (
        <AppSafeAreaView >

            <>
                <AppHeader
                    headerTitle={!isOrderPlaced ? "Please verify your choice" : ""}
                    onBackPress={() => {
                        navigation.goBack();
                        // navigation.goBack(null)
                    }}
                />
                <AppLayout onboarding>
                    {
                        !isOrderPlaced ?
                            <View style={{ padding: 10 }}>
                                {
                                    Loader ?
                                        <View style={{ height: "80%", alignItems: "center", justifyContent: "center" }}>
                                            <ActivityIndicator size={"large"} />
                                        </View>
                                        :
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            {
                                                productDetails ?
                                                    <View style={{ width: "100%" }}>
                                                        <Image source={{ uri: addHttpsPrefixIfNeeded(productDetails[1]) }} style={{ height: 300, width: width * 0.9, resizeMode: "cover", borderRadius: 20, }} />
                                                        <AppText bold black h2m mt2>{productDetails[0]}</AppText>
                                                        <AppText bold black h3 mt1>{productDetails[2]}</AppText>
                                                        {/* <AppText bold blue h2m mt3>{`Confirm the shipping address`}</AppText> */}
                                                        {/* {
                                                            // Only When the PreReconsidedAddress value is there
                                                            PreReconsidedAddress?.Address1 ?
                                                                <AppText semibold gray h3m mt1 >{`${Address1 + " " + Address2}, ${AddressState}, ${AddressCity}, ${AddressZip}`}</AppText> :
                                                                null
                                                        }

                                                        {
                                                            // Only If the PreReconsidedAddress is not empty, then only we can show users to change their address.
                                                            PreReconsidedAddress != "" ?

                                                                <>
                                                                    {
                                                                        !isNewAddress ?
                                                                            <View style={{ alignItems: "flex-end" }}>
                                                                                <TouchableOpacity
                                                                                    activeOpacity={AppActiveOpacity}
                                                                                    onPress={() => setIsNewAddress(!isNewAddress)}
                                                                                >
                                                                                    <AppText semibold InkBlue h3m mt2 underline >{`Click to change Address`}</AppText>
                                                                                </TouchableOpacity>
                                                                            </View> :
                                                                            <View style={{ alignItems: "flex-end" }}>
                                                                                <TouchableOpacity
                                                                                    activeOpacity={AppActiveOpacity}
                                                                                    onPress={() => setIsNewAddress(!isNewAddress)}
                                                                                >
                                                                                    <AppText semibold InkBlue h3m mt2 underline >{`Cancel`}</AppText>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                    }
                                                                </>
                                                                :
                                                                null

                                                        }

                                                        {
                                                            isNewAddress || (PreReconsidedAddress == "") ?
                                                                <>
                                                                    <AppText blue h3 mt2 bold>Address</AppText>
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

                                                                </>
                                                                : null
                                                        } */}


                                                        <View style={{ alignItems: "center" }}>

                                                            <View style={{ width: "100%", alignItems: "center", flexDirection: "row", padding: 10, flex: 1, borderColor: COLORS.darkBlue, borderRadius: 12, borderWidth: 1, marginTop: 20 }}>
                                                                <View style={{ flex: 0.2, height: "100%" }}>
                                                                    <Image source={Important} style={{ left: 5, top: 5, height: 50, width: 50, resizeMode: "contain" }} />
                                                                </View>

                                                                <View style={{ flex: 0.8 }}>
                                                                    <AppText semibold blue h3 >{"If there is any payment needed, The Breastfeeding Shop team will inform you before sending out your order."}</AppText>
                                                                </View>

                                                            </View>

                                                            <AppButton
                                                                mt4
                                                                onPress={async () => {
                                                                    await sendCommonResponseInBFS("place order")
                                                                    await onsubmitOrder()
                                                                }}
                                                                title={"Place Order"}
                                                                blue
                                                                style={{ width: "100%" }}
                                                                disabled={false}
                                                            />
                                                        </View>


                                                    </View>
                                                    :
                                                    <View style={{ height: "40%", alignItems: "center", justifyContent: "center" }}>
                                                        <AppText bold black h2m>Something went wrong!</AppText>
                                                    </View>
                                            }

                                        </ScrollView>

                                }


                            </View>
                            :
                            <AppLayout onboarding>
                                <AppContainer transparent style={{ alignItems: "center", justifyContent: "center" }}>

                                    <Image source={Babyheart} style={{ height: 150, width: 150, resizeMode: "contain", marginTop: 40 }} />
                                    <AppText center h3 mt2 blue bold>{info1}</AppText>
                                    <AppButton
                                        mt4
                                        onPress={() => { navigation.navigate("Home") }}
                                        title={"Home"}
                                        small
                                        blue
                                        alignSelf
                                    />
                                </AppContainer>
                            </AppLayout>
                    }

                </AppLayout>

            </>

            {/* <ConfirmationModal
                open={openModal}
                setOpen={setOpenModal}
                header={"Attention, please!"}
                body={modalBody}
                buttonTitle={modalBtn1}
                onPress={() => { onsubmitOrder() }}
                onCancelPress={() => { onCancelClick() }}

                cancelButton={modalBtn2 != ""}
                cancelButtonTitle={modalBtn2}
            /> */}

            <ConfirmationModal
                open={openModal}
                header={modalBody}
                setOpen={setOpenModal}
                // body={modalBody}
                noBody
                buttonTitle="Close"
                onPress={() => { onCancelClick() }}
            />
        </AppSafeAreaView>
    )

}

const styles = StyleSheet.create({
    buttonView: {
        width: "100%",

        flex: 1,

    },
    textInputStyle: { paddingLeft: 15, width: "100%", marginTop: MARGINS.mt2 },
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