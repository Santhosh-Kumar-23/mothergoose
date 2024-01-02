

import React, { useState, useContext } from 'react'
import { Image, Platform, StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import AppContainer from '../../../../components/AppContainer';
import AppSafeAreaView from '../../../../components/AppSafeAreaView';
import AppLayout from "../../../../components/AppLayout";
import AppText from '../../../../components/AppText';
import AppButton from '../../../../components/AppButton';
import Babyheart from "../../../../../assets/babyheart.png";
import Tbfs_Logo from "../../../../../assets/tbfs_Logo.png";
import Bpump from "../../../../../assets/pump.jpeg";
import AppHeader from '../../../../components/AppHeader';
import { useEffect } from 'react';
import { getPumpDetails } from '../../../../api';
import { AppContext } from '../../../../context';
import { AppActiveOpacity, COLORS } from '../../../../utils/styles';

export default function ShopScreen({ navigation }) {
    const { user } = useContext(AppContext)
    const [successTab, setSuccessTab] = useState(false)
    const [Loader, setLoader] = useState(true)
    const [pumpsList, setPumpsList] = useState([])
    var info1 = 'Thank you. Your order has been submitted.'
    var info2 = 'Explore the breast pumps covered by your insurance and choose the one that you prefer'

    const breastPumps = [
        { name: "Medela Pump in Style Advanced", price: 299.99 },
        { name: "Spectra S1 Plus", price: 179.95 },
        { name: "Lansinoh Signature Pro", price: 129.99 },
        { name: "Ameda Mya", price: 199.00 },
        { name: "Philips Avent Comfort Electric", price: 149.99 },
        { name: "Willow Wearable Breast Pump", price: 499.00 },
        { name: "Elvie Pump", price: 449.99 },
        { name: "NUK Simply Natural", price: 119.99 },
        { name: "Freemie Double Electric Breast Pump", price: 219.95 },
        { name: "BelleMa Effective Pro", price: 159.99 },
        { name: "Motif Luna Double Electric Breast Pump", price: 169.00 },
        { name: "Haakaa Manual Breast Pump", price: 29.99 },
        { name: "Freemie Liberty Mobile Hands-Free Breast Pump", price: 249.00 },
        { name: "Ardo Calypso Double Plus", price: 239.95 },
        { name: "NatureBond Silicone Manual Breast Pump", price: 19.99 },
        { name: "Medela Sonata Smart Breast Pump", price: 379.00 },
        { name: "Evenflo Advanced Double Electric Breast Pump", price: 119.99 },
        { name: "Lansinoh SmartPump", price: 189.99 },
        { name: "Spectra 9 Plus Portable Breast Pump", price: 149.99 },
        { name: "Philips Avent Manual Breast Pump", price: 39.99 }
    ];



    useEffect(() => {
        getPumpDetails(user?.id).then((res) => {
            if (res?.pump_list?.length > 0) {
                setPumpsList(res?.pump_list)
                setLoader(false)
            } else {
                setLoader(false)
            }
            setLoader(false)
        }).catch((e) => {
            setLoader(false)
        })
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

    const renderPumps = ({ item }) => {


        return (
            <TouchableOpacity style={{
                flexDirection: "column",
                backgroundColor: "white",
                padding: 10,
                margin: 10,
                width: "45%",

                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                ...Platform.select({
                    ios: {
                        shadowColor: "black",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                    },
                    android: {
                        elevation: 2,
                    },
                }),
            }}
                onPress={() => {
                    navigation.navigate("ProductDetailsScreen", {
                        productDetails: item
                    })
                }}
                activeOpacity={AppActiveOpacity}
            >
                <Image source={{ uri: addHttpsPrefixIfNeeded(item[1]) }} style={{ height: 150, width: "100%", resizeMode: "cover", borderRadius: 20, }} />
                <View style={{ width: "100%", }}>
                    <AppText black bold mt2 textAlignCenter>{item[0]}</AppText>
                    <AppText black bold mt2 textAlignCenter>{item[2]}</AppText>
                </View>

            </TouchableOpacity>

        )
    }

    return (
        <AppSafeAreaView >
            {
                !successTab ?
                    <>
                        <AppHeader
                            headerTitle="Choose a suitable pump"
                            onBackPress={() => {
                                navigation.goBack();
                                // navigation.goBack(null)
                            }}
                        />
                        <AppLayout onboarding>
                            <View style={{ padding: 10 }}>
                                {
                                    Loader ?
                                        <View s tyle={{ height: "80%", alignItems: "center", justifyContent: "center" }}>
                                            <ActivityIndicator size={"large"} />
                                        </View>
                                        :
                                        <>
                                            {
                                                pumpsList?.length > 0 ?
                                                    <>
                                                        <AppText center bold blue mb2>{info2}</AppText>
                                                        <FlatList
                                                            style={{ width: "100%" }}
                                                            data={pumpsList}
                                                            renderItem={renderPumps}
                                                            // ListHeaderComponent={() => (
                                                            //     <View style={styles.title}>
                                                            //         <AppText h3 semibold>Popular</AppText>
                                                            //         <Link
                                                            //             onPress={() => {
                                                            //                 setQuery_txt("")
                                                            //                 navigation.navigate("Education Modules")
                                                            //             }}
                                                            //         >See all</Link>
                                                            //     </View>
                                                            // )}
                                                            // keySignature="articles-search"
                                                            // fullWidth
                                                            // noPaddingTop
                                                            ListFooterComponent={() => (

                                                                <View style={{ marginBottom: 40 }} />
                                                            )
                                                            }
                                                            numColumns={2}
                                                        />
                                                    </>
                                                    :
                                                    <View style={{ height: "40%", alignItems: "center", justifyContent: "center" }}>

                                                        <AppText bold black h2m>No Data Found</AppText>
                                                    </View>
                                            }
                                        </>
                                }
                            </View>
                        </AppLayout>
                        <View style={{ width: "100%", alignItems: "center", justifyContent: "center", position: "absolute", bottom: 0, height: 70, backgroundColor: COLORS.white }}>
                            <Image source={Tbfs_Logo} style={{ height: 45, width: "100%", resizeMode: "contain" }} />
                            <AppText h3m gray>{`Prices are best estimates`}</AppText>
                        </View>
                    </>
                    :
                    <AppLayout onboarding>
                        <AppContainer transparent style={{ alignItems: "center", justifyContent: "center" }}>

                            <Image source={Babyheart} style={{ height: 150, width: 150, resizeMode: "contain", marginTop: 40 }} />
                            <AppText center h2m mt2 blue bold>{info1}</AppText>
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


        </AppSafeAreaView>
    )

}

const styles = StyleSheet.create({
    buttonView: {
        width: "100%",

        flex: 1,

    }
});