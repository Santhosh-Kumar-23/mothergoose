/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from "@react-native-firebase/messaging";

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background index!');
    const channelId = await notifee.createChannel({
        id: 'MotherGoosePushNotification',
        name: 'Important Notifications MotherGoosePushNotification',
        importance: AndroidImportance.HIGH,
    });
    if (remoteMessage?.notification) {  // from firebase push
        remoteMessage.notification.title &&
            notifee.displayNotification({
                title: remoteMessage.notification.title,
                body: remoteMessage.notification.body,
                // android: {
                //     channelId,
                //     smallIcon: 'ic_launcher_trans',
                //     color: '#ffffff',
                //     // largeIcon: require('./assets/Ic_large_image.png'),
                //     importance: AndroidImportance.HIGH,
                // },
                data: {
                    notify_type: remoteMessage?.data?.type == "article" ? "article" : ""
                }
            });
    } else {
        remoteMessage?.data && // sendbird push notication
            notifee.displayNotification({
                title: "Mother Goose",
                body: "You have a new chat from your Mother Goose care team",
                android: {
                    channelId,
                    smallIcon: 'ic_launcher_trans',
                    color: '#ffffff',
                    // largeIcon: require('./assets/Ic_large_image.png'),
                    importance: AndroidImportance.HIGH,
                },
            });
    }
});

AppRegistry.registerComponent(appName, () => App);
