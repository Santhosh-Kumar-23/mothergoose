import * as React from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
// import Leftarrow from "../../assets/images/Leftarrow.png"
import { COLORS, MARGINS } from "../utils/styles";
import LeftIcon from '../../assets/LeftIcon.png'
import LeftArrowAndroid from "../../assets/LeftArrowAndroid.png"
import AppText from './AppText';
const AppHeader = ({
    route,
    navigation,
    onBackPress,
    headerTitle
}) => {
    let Active_Opacity = 0.85
    return (
        <SafeAreaView>
            <View style={styles.heaederView}>
                <TouchableOpacity activeOpacity={Active_Opacity} style={styles.leftIconView} onPress={onBackPress}>
                    <Image
                        source={Platform.OS == "ios" ? LeftIcon : LeftArrowAndroid}
                        style={Platform.OS == "ios" ? styles.leftIconstyleiOS : styles.leftIconstyleAndroid}
                    />
                </TouchableOpacity>
                <View style={styles.headerTextView}>
                    <AppText bold h3>{headerTitle}</AppText>
                    {/* <Text style={styles.headerText}>{headerTitle}</Text> */}
                </View>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    heaederView: {
        height: 50,
        width: "100%",
        // paddingHorizontal: 5,
        flexDirection: "row",
        // backgroundColor: "red",
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.gray
    },
    leftIconView: {
        width: "10%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftIconstyleAndroid: {
        height: 18, width: 18, resizeMode: "contain"
    },
    leftIconstyleiOS: {
        height: 33, width: 33, resizeMode: "contain"
    },
    headerTextView: {
        width: "80%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: "bold",
        color: "#000"
    }
});
export default AppHeader;
