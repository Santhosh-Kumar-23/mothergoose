import React, { useContext, useRef } from "react";
import { Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import AppHeader from "../../../../components/AppHeader";
import AppSafeAreaView from "../../../../components/AppSafeAreaView"
import { MARGINS } from "../../../../utils/styles";
import { AppContext } from "../../../../context";
import { sendBFSUserResponse } from "../../../../api";
export default function BfsBookingWebView({ navigation, route }) {
  const webViewRef = useRef(null);
    const { user } = useContext(AppContext)
    console.log("user ====>", user)
    let { headerTitle, BackNavScreen } = route.params;

    // STAGE:  https://nest-booking.web.app/1?partner=mothergoosehealth&h=0
    // PROD: https://book.nestcollaborative.com/1?partner=mothergoosehealth&h=0

    // const NESTBookingBASE_URL = process.env.NEST_COLLAB_BASE_URL

    let NESTBookingBASE_URL = "https://nest-booking.web.app" // Stage
    // let NESTBookingBASE_URL = "https://book.nestcollaborative.com" // Prod

    // var user?.nest_attributes = {
    //     partner: "mothergoosehealth",

    //     first: "ryan",
    //     last: "Morris",
    //     email: "here@there.com",
    //     phone: "123-123-1234",
    //     dob: "2001-05-15",
    //     edd: "2005-12-01",
    //     add1: "Line%201",
    //     add2: "line2",
    //     zip: "12345",
    //     city: "Brooklyn",
    //     state: "WA",

    //     // insurance details
    //     ins: "Cigna",
    //     ins_id: "1234",
    //     ins_type: "MEDICAID",
    //     ins_is_primary: "1", //Are you the primary policy holder?  0 - No, 1 - Yes
    //     ins_group: "abcd",

    //     // policy holder details
    //     pol_first: "Roger",
    //     pol_last: "First",
    //     pol_dob: "1980-01-01",
    //     pol_add1: "Rad",
    //     pol_add2: "Rad2",
    //     pol_city: "Austin",
    //     pol_state: "TX",
    //     pol_zip: "12345",
    //     pol_is_add_match: "1" // Is the address of the Policy Holder the same as the yours? 0 - No, 1 - Yes
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


    const handleNavigationStateChange = (navState) => {
        // Check the URL or other properties in navState
        const currentUrl = navState.url;
        console.log("currentUrl", currentUrl)
        // Perform actions based on the current URL or other conditions
        if (currentUrl.includes(`${NESTBookingBASE_URL}/5`)) {
            console.log("NEST Collab.. Booking Successful");
            sendCommonResponseInBFS("NEST Collaborative appointment booked successfully")
            setTimeout(() => {
                // Trigger an action when the URL contains nest-booking.web.app/5
                navigation.goBack()
            }, 5000);
        }
    };

    


    const script = `
   
  (function() {
      var originalPostMessage = window.postMessage;

      window.postMessage = function(data) {
        window.ReactNativeWebView.postMessage(data);
      };

      var originalXMLHttpRequest = window.XMLHttpRequest;

      function newXMLHttpRequest() {
        var xhr = new originalXMLHttpRequest();
        xhr.addEventListener("load", function() {
          // Send the API call response back to React Native
          window.ReactNativeWebView.postMessage({
            type: 'API_RESPONSE',
            data: xhr.responseText,
          });
        });
        return xhr;
      }

      window.XMLHttpRequest = newXMLHttpRequest;
    })();
`;


    console.log("NEST BOOKING URL: ", JSON.stringify(`${NESTBookingBASE_URL}/0?h=0&first=${user?.nest_attributes?.first}&last=${user?.nest_attributes?.last}&email=${encodeURIComponent(user?.nest_attributes?.email)}&phone=${user?.nest_attributes?.phone}&dob=${user?.nest_attributes?.dob}&edd=${user?.nest_attributes?.edd}&add1=${user?.nest_attributes?.add1}&add2=${user?.nest_attributes?.add2}&zip=${user?.nest_attributes?.zip}&city=${user?.nest_attributes?.city}&state=${user?.nest_attributes?.state}&ins=${user?.nest_attributes?.ins}&ins_id=${user?.nest_attributes?.ins_id}&ins_type=${user?.nest_attributes?.ins_type}&ins_is_primary=${user?.nest_attributes?.ins_is_primary}&ins_group=${user?.nest_attributes?.ins_group}&partner=${user?.nest_attributes?.partner}&pol_first=${user?.nest_attributes?.pol_first}&pol_last=${user?.nest_attributes?.pol_last}&pol_dob=${user?.nest_attributes?.pol_dob}&pol_add1=${user?.nest_attributes?.pol_add1}&pol_add2=${user?.nest_attributes?.pol_add2}&pol_city=${user?.nest_attributes?.pol_city}&pol_state=${user?.nest_attributes?.pol_state}&pol_zip=${user?.nest_attributes?.pol_zip}&pol_is_add_match=${user?.nest_attributes?.pol_is_add_match}&ins=${user?.nest_attributes?.ins}`))
    return (
        <>
            <AppSafeAreaView style={{ flex: 1 }}>
                <AppHeader
                    headerTitle={headerTitle}
                    onBackPress={() => {
                        BackNavScreen ?
                            navigation.navigate(BackNavScreen)
                            :
                            navigation.goBack(null)
                    }}
                />
                <WebView
                
                    injectedJavaScript={script}
                    onMessage={(event) => {
                      
                        console.log("webview event", event)
                        // Handle messages received from the WebView
                        // const message = JSON.parse(event?.nativeEvent?.data);
                        // if (message.type === 'API_RESPONSE') {
                        //     console.log('Received API response in React Native:', message.data);
                        // }
                    }}
                    
                    javaScriptEnabled={true}
                    
                    onNavigationStateChange={handleNavigationStateChange}

                    style={styles.WebViewStyle}
                    ref={webViewRef}
                    source={{ uri: `https://nest-booking.web.app/1?partner=${user?.nest_attributes?.partner}&h=0&first=${user?.nest_attributes?.first}&last=${user?.nest_attributes?.last}&email=${encodeURIComponent(user?.nest_attributes?.email)}&phone=${user?.nest_attributes?.phone}&dob=${user?.nest_attributes?.dob}&edd=${user?.nest_attributes?.edd}&add1=${user?.nest_attributes?.add1}&add2=${user?.nest_attributes?.add2}&zip=${user?.nest_attributes?.zip}&city=${user?.nest_attributes?.city}&state=${user?.nest_attributes?.state}&ins=${user?.nest_attributes?.ins}&ins_id=${user?.nest_attributes?.ins_id}&ins_type=${user?.nest_attributes?.ins_type}&ins_is_primary=${user?.nest_attributes?.ins_is_primary}&ins_group=${user?.nest_attributes?.ins_group}&pol_first=${user?.nest_attributes?.pol_first}&pol_last=${user?.nest_attributes?.pol_last}&pol_dob=${user?.nest_attributes?.pol_dob}&pol_add1=${user?.nest_attributes?.pol_add1}&pol_add2=${user?.nest_attributes?.pol_add2}&pol_city=${user?.nest_attributes?.pol_city}&pol_state=${user?.nest_attributes?.pol_state}&pol_zip=${user?.nest_attributes?.pol_zip}&pol_is_add_match=${user?.nest_attributes?.pol_is_add_match}&ins=${user?.nest_attributes?.ins}` }}></WebView>
            </AppSafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    WebViewStyle: {
        marginHorizontal: MARGINS.mb2
    }
});

