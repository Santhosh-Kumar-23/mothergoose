import { Alert, Platform, BackHandler, Linking } from "react-native";
import VersionCheck from 'react-native-version-check';
import RNExitApp from 'react-native-exit-app';

export default async function AppUpdateCheck() {
    const latestVersion = await VersionCheck.getLatestVersion();
    // console.log("latestVersion", latestVersion)
    const currentVersion = await VersionCheck.getCurrentVersion()
    // console.log("currentVersion", currentVersion)
    let updateNeeded = await VersionCheck.needUpdate();
    if (updateNeeded?.isNeeded) {

        // var alert_body = "Looks like you're using an older version (" + currentVersion + ") of Mother Goose. update now the latest version (" + latestVersion + ") for the latest features."
        var alert_body = "It looks like you’re using an older version of mother Goose. Please upgrade now to get the latest personalized features."
        Alert.alert(
            "Upgrade to the latest version!",
            alert_body,
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        Platform.OS == "android" ?
                            BackHandler.exitApp() :
                            RNExitApp.exitApp()
                    },
                    style: "cancel"
                },
                {
                    text: "Update", onPress: () => {
                        if (Platform.OS == "ios") {
                            // https://apps.apple.com/us/app/mother-goose-health/id1579183771
                            const link = 'itms-apps://apps.apple.com/us/app/mother-goose-health/id1579183771?l=id';
                            Linking.canOpenURL(link).then(supported => {
                                supported && Linking.openURL(link);
                            }, (err) => console.log(err));
                        } else {
                            const link = "market://details?id=com.mothergoosehealth.mothergoose"
                            // Linking.openURL("market://details?id=com.mothergoosehealth.mothergoose");
                            Linking.canOpenURL(link).then(supported => {
                                supported && Linking.openURL(link);
                            }, (err) => console.log(err));
                        }
                    }
                }
            ]
        );
        return false;
    } else {
        // console.log("err")
        return true;
    }
}
