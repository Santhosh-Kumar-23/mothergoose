import React from "react";
import { Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import AppHeader from "../../../components/AppHeader";
import AppSafeAreaView from "../../../components/AppSafeAreaView"
import { MARGINS } from "../../../utils/styles";
export default function CustomWebview({ navigation, route }) {

  let { WebURL, headerTitle, BackNavScreen } = route.params;
  const pdfBase = Platform.OS === "android" ? process.env.PDF_BASE_URL : ""

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
        <WebView style={styles.WebViewStyle} source={{ uri: pdfBase + WebURL }}></WebView>
      </AppSafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  WebViewStyle: {
    marginHorizontal: MARGINS.mb2
  }
});

