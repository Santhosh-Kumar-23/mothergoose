import React from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import AppContainer from "../../../components/AppContainer";
import AppHeader from "../../../components/AppHeader";
import AppSafeAreaView from "../../../components/AppSafeAreaView"
import { MARGINS } from "../../../utils/styles";

export default function ReSchedulingScreen({ navigation, route }) {

  let { cancel_reschedule_link } = route.params;

  return (
    <>
      <AppSafeAreaView style={{ flex: 1 }}>
        <AppContainer noHVpadding>
          <AppHeader
            headerTitle="Rescheduling"
            onBackPress={() => {
              navigation.navigate("Appointments");
              // navigation.goBack(null)
            }}
          />
          <WebView style={styles.WebViewStyle} source={{ uri: cancel_reschedule_link }}></WebView>
        </AppContainer>
      </AppSafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  WebViewStyle: {
    marginLeft: MARGINS.mb3,
    marginRight: MARGINS.mb3
  }
});
