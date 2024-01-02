import React, { useState, useRef, useEffect } from "react";
import { AppState, Alert, Platform, StatusBar, Dimensions, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import * as ExpoNotifications from "expo-notifications";
import { NavigationContainer, useNavigationContainerRef, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import _ from "lodash";
import moment from "moment";
import SendBird from "sendbird";
import SendBirdDesk from "sendbird-desk";
import { AppContextProvider } from "./src/context";
import { SurveyContextProvider } from "./src/context/surveyContext";
import LoginStack from "./src/navigation/LoginStack";
import TabNavigator from "./src/navigation/TabNavigator";
import SplashScreen from "./src/navigation/SplashScreen";
import OnboardingStack from "./src/navigation/OnboardingStack";
import SurveyStack from "./src/navigation/SurveyStack";
// import Constants from "expo-constants";
import WithAxios from "./src/api/WithAxios";
import AppModal from "./src/components/AppModal";
import { getSurveyQuestions, sendPushToken, signIn, getAddress, get_reminderArticles, reporting_log_update, session_log_update, get_baby_details, kick_history, get_contraction_counter, getUser, kick_history_V2API } from "./src/api";
// import * as Sentry from "sentry-expo";
import * as Sentry from "@sentry/react-native";
import DeviceInfo from 'react-native-device-info';

import {
  depression_survey_reminders_data,
  epds_survey_reminders_data,
  risk_survey_reminders_data,
} from "./src/utils/survey";
import { getPregnancyMonth } from "./src/utils/pregnancy";
// import * as SecureStore from "expo-secure-store";
import EncryptedStorage from 'react-native-encrypted-storage';

import { axiosInstance } from "./src/utils/axios";
import { getAllContentfulArticles } from "./src/api/contentful";

import messaging from "@react-native-firebase/messaging";

// import * as Analytics from 'expo-firebase-analytics';
// import analytics from '@react-native-firebase/analytics';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native';

import UserAgent from 'react-native-user-agent';
import { EventRegister } from 'react-native-event-listeners'

import AppUpdateCheck from './src/utils/AppUpdateCheck'
// import NetInfo from "@react-native-community/netinfo";

import { useNetInfo } from "@react-native-community/netinfo";

import { FindSessionTime, ParseMillisecondsIntoReadableTime } from './src/utils/TimeDiff';
import Session_update from "./src/utils/session_update";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Draggable from 'react-native-draggable';


LogBox.ignoreAllLogs();
const window_hight = Dimensions.get("window").height
const window_width = Dimensions.get("window").width

let systemVersion = DeviceInfo.getSystemVersion();

const sentry_init = () => {
  // Need enble the sentry comment line before store upload

  // Sentry.init({
  //   dsn: process.env.SENTRY_DSN,
  //   // enableInExpoDevelopment: true,
  //   debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  // });
}

if (Platform.OS == "android") {
  if (systemVersion > 8) {
    sentry_init();
  }
} else {
  sentry_init();
}

// initialize sendbird instance
const sendbird = new SendBird({
  appId: process.env.SENDBIRD_APP_ID_STAGING,
});

SendBirdDesk.init(SendBird)

// ExpoNotifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });
export default function App() {

  const [user, setUser] = useState({}); // will update while Login
  const [userAddress, setUserAddress] = useState({}); // will update while Login

  const [user_State, setUser_State] = useState({}); // will update while Register
  const [regUser, setRegUser] = useState({}); // will update while Register
  const [is_test, setIs_user] = useState(true);
  const [reminderArticles, setReminderArticles] = useState([]);
  const [reminderArticleIds, setReminderArticleIds] = useState([]);
  const [newMsg, setNewMsg] = useState(false);
  const [HNC_Vitals, setHNC_Vitals] = useState([]);
  const [babyBornDetails, setBabyBornDetails] = useState("");
  const [CounterVitailsData, setCounterVitailsData] = useState({});

  const [query_txt, setQuery_txt] = useState("")
  const [searcharticleloader, setSearcharticleloader] = useState(false)
  const [surveyId, setSurveyId] = useState(null);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [surveyAnswers, setSurveyAnswers] = useState([]);
  const [surveyQuestionAnswersRelations, setSurveyQuestionAnswersRelations] =
    useState([]);
  const [surveyDone, setSurveyDone] = useState(false);
  const [sendbirdAccessToken, setSendbirdAccessToken] = useState(null);
  const [channelUrl, setChannelUrl] = useState("");
  const navRef = useRef(null);
  const pushNotificationListener = useRef();
  const responseListener = useRef();
  const [navigationReady, setNavigationReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [pushNotification, setPushNotification] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [emrAppointments, setEmrAppointments] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);

  const [notificationPressed, setNotificationPressed] = useState(false);
  const [userSurvey, setUserSurvey] = useState(null);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState([]);
  const [apptsToday, setApptsToday] = useState([]);
  const [userVisitVitals, setUserVisitVitals] = useState([]);
  const [providerPreferences, setProviderPreferences] = useState([]);
  const [userQuestionAnswer, setUserQuestionAnswer] = useState([]);
  const [surveyReminders, setSurveyReminders] = useState([]);
  const [userJwtToken, setUserJwtToken] = useState("");
  const [DeviceToken, setDeviceToken] = useState("null");
  const [iOSAPNsToken, setiOSAPNsToken] = useState("");

  const [educationArticles, setEducationArticles] = useState([]);
  const [selectedAticle, setSelectedAticle] = useState("");
  const [selectedAticleID, setSelectedAticleID] = useState("");

  const [selectedChatDetails, setSelectedChatDetails] = useState("");

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const netInfo = useNetInfo();

  // const sendSessionData = async (AppOpenTime) => {
  //   let ES_user_id = await EncryptedStorage.getItem("user_id");
  //   var offTime = new Date().getTime();
  //   var singleSessionTime = FindSessionTime(offTime, AppOpenTime); // send to API
  //   var session_data = {
  //     session_time: singleSessionTime,
  //     user_id: JSON.parse(ES_user_id)?.user_id
  //   }
  //   JSON.parse(ES_user_id)?.user_id != null && session_log_update(session_data);
  // }

  useEffect(() => {

    var AppOpenTime = new Date().getTime();
    EncryptedStorage.setItem("AppOpenTime", JSON.stringify({ AppOpenTime }));
    // console.log("AppOpenTime", AppOpenTime)
    // console.log("AppState Fresh open");
    const subscription = AppState.addEventListener("change", async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // console.log("App has come to the foreground!");
        AppOpenTime = new Date().getTime();
        EncryptedStorage.setItem("AppOpenTime", JSON.stringify({ AppOpenTime }));
        // console.log("AppOpenTime", AppOpenTime)
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      // console.log("AppState", appState.current);
      if (Platform.OS == "android") {
        if (appState.current == "background") {
          // sendSessionData(AppOpenTime)
          Session_update()
        }
      } else {
        if (appState.current == "inactive") {
          // sendSessionData(AppOpenTime)
          Session_update()
        }
      }

    });
    return () => {
      subscription.remove();
    };
  }, []);




  // Fireabase push notification Logic
  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   console.log('Message handled in the background!');

  //   // notifee.setBadgeCount(1).then(() => console.log('Badge count set'));

  //   EventRegister.emit('myCustomEvent', remoteMessage?.data?.type);

  //   const channelId = await notifee.createChannel({
  //     id: 'MotherGoosePushNotification',
  //     name: 'Important Notifications MotherGoosePushNotification',
  //     importance: AndroidImportance.HIGH,
  //   });

  //   if (remoteMessage?.notification) {  // from firebase push

  //     remoteMessage.notification.title &&
  //       notifee.displayNotification({
  //         title: remoteMessage.notification.title,
  //         body: remoteMessage.notification.body,
  //         // android: {
  //         //   channelId,
  //         //   smallIcon: 'ic_launcher_trans',
  //         //   color: '#ffffff',
  //         //   // largeIcon: require('./assets/Ic_large_image.png'),
  //         //   // channelId: "default",
  //         //   importance: AndroidImportance.HIGH,
  //         // },
  //         data: {
  //           notify_type: remoteMessage?.data?.type == "article" ? "article" : ""
  //         }
  //       });
  //   } else {

  //     console.log("sendbird push notication at bg", remoteMessage)
  //     // sendbird push notication
  //     remoteMessage?.data &&
  //       notifee.displayNotification({
  //         title: "Mother Goose",
  //         body: "You have a new chat from your Mother Goose care team", //remoteMessage?.data?.message || "Notification received",
  //         android: {
  //           channelId,
  //           smallIcon: 'ic_launcher_trans',
  //           color: '#ffffff',
  //           // largeIcon: require('./assets/Ic_large_image.png'),
  //           // channelId: "default",
  //           // badgeCount: 20,
  //           importance: AndroidImportance.HIGH,
  //         },
  //       });
  //   }
  // });

  // notifee.onBackgroundEvent(async ({ type, detail }) => {
  //   // console.log("type", type)
  //   // console.log("detail", detail)
  // })

  notifee.requestPermission({
    title: 'Allow Notifications',
    message: 'We would like to send you notifications for important updates.',
    options: ['Open settings', 'Not now'], // Customize button options
  }); // Request permissions (required for iOS)

  async function checkNotificationPermission() {
    const settings = await notifee.getNotificationSettings();

    // console.log('settings.authorizationStatus', settings.authorizationStatus);

  }

  const getAPNsToken_iOS = () => {
    if (Platform.OS == "ios") {
      // messaging().ios.registerForRemoteNotifications().then(() => {
      messaging().getAPNSToken().then(token => {
        // console.log("getAPNSToken -->", token)
        setiOSAPNsToken(token)
        // token not null
      });
      // })
    }
  }

  const AppUpdateCheck_func = () => {
    netInfo.isConnected == true && AppUpdateCheck();
  }

  useEffect(() => {

    getAPNsToken_iOS()
    AppUpdateCheck_func() // Check the latest app version is available in Store
    requestUserPermission();
    checkNotificationPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {

      const channelId = await notifee.createChannel({
        id: 'important',
        name: 'Important Notifications',
        importance: AndroidImportance.HIGH,
      });

      console.log('Message handled in the foreground!', remoteMessage);

      if (remoteMessage?.notification) {
        remoteMessage.notification.title &&
          notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
              channelId,
              smallIcon: 'ic_launcher_trans',
              color: '#ffffff',
              // largeIcon: require('./assets/Ic_large_image.png'),
              // channelId: "default",
              importance: AndroidImportance.HIGH,
            },
            data: {
              notify_type: remoteMessage?.data?.type == "article" ? "article" : ""
            }
          });
      } else {
        console.log('Foreground sendbird push noti!');
        // remoteMessage?.data &&
        //   notifee.displayNotification({
        //     title: "Mother Goose",
        //     body: "You have a new chat from your Mother Goose care team", // remoteMessage?.data?.message,
        //     android: {
        //       channelId,
        //       // channelId: "default",
        //       importance: AndroidImportance.HIGH,
        //     }
        //   });
      }

    });

    notifee.onForegroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;

      // console.log("notifee Foreground-event")
      if (type === EventType.PRESS) {
        EventRegister.emit('myCustomEvent', notification.data.notify_type);
      }
      if (Platform.OS == "ios") {
        notifee.cancelNotification(notification.id);
      }
    });

    return unsubscribe;

  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      getFcmToken()
    }
  }

  const getFcmToken = async () => {

    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      setDeviceToken(fcmToken)
      // console.log("Your Firebase Token is: ", fcmToken);

    } else {
      console.log("Failed", "No token received");
    }
  }

  // // PUSH NOTIFICATION LOGIC
  // useEffect(() => {
  //   if (Constants.isDevice && navigationReady) {
  //     console.log("Constants.isDevice", Constants.isDevice)

  //     registerForPushNotifications().then((token) => {
  //       console.log("Expo token -->", token)
  //       // this is the token proper, which is the only part backend wants apparently
  //       setExpoPushToken(token);
  //     });

  //     // When notification is recieved while user is in the app
  //     pushNotificationListener.current =
  //       ExpoNotifications.addNotificationReceivedListener((notification) =>
  //         setPushNotification(notification)
  //       );

  //     // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  //     responseListener.current =
  //       ExpoNotifications.addNotificationResponseReceivedListener((res) => {
  //         // const type = res?.notification?.request?.content?.data.type;
  //         // console.log({ type })

  //         setNotificationPressed(true);
  //       });

  //     return () => {
  //       ExpoNotifications.removeNotificationSubscription(
  //         pushNotificationListener.current
  //       );
  //       ExpoNotifications.removeNotificationSubscription(
  //         responseListener.current
  //       );
  //     };
  //   }
  // }, [navigationReady]);

  // // gets permission from user to use push notifications, retrieves device token if approved
  // const registerForPushNotifications = async () => {
  //   let token;
  //   if (Constants.isDevice) {
  //     const { status: existingStatus } =
  //       await ExpoNotifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== "granted") {
  //       const { status } = await ExpoNotifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== "granted") {
  //       return console.log("declined request");
  //     }
  //     token = (await ExpoNotifications.getExpoPushTokenAsync()).data;
  //   } else {
  //     console.log("Must use physical device for Push Notifications");
  //   }
  //   return token;
  // };

  // // send device token to BE so we can send users push notifications
  // useEffect(() => {
  //   const setServerExpoPushToken = async () => {
  //     const user_agent = await Constants.getWebViewUserAgentAsync();

  //     try {
  //       const res = await sendPushToken(user.id, user_agent, expoPushToken);
  //       console.log("push token response", res.data);
  //     } catch (error) {
  //       console.log("error with push notification registry", error);
  //     }
  //   };
  //   if (loggedIn && expoPushToken && expoPushToken.length) {
  //     setServerExpoPushToken();
  //   }
  // }, [loggedIn, expoPushToken]);


  const handleSendbirdAccessToken = async (user) => {
    const { sendbird_access_token } = user;
    try {
      connectToSendbird(sendbird_access_token);
    } catch (error) {
      console.log("error getting sendbirdUser", { error });
    }
  };

  const connectToSendbird = (accessToken) => {
    // handle connecting to and initiating sendbird as soon as user logs in
    sendbird.connect(`${user.id}`, accessToken, (sbUser, error) => {
      if (error) {
        console.log("got an error", { error });
        return;
      }
      // console.log("sendbird.connect sbUser -->", sbUser)

      SendBirdDesk.init(SendBird);
      SendBirdDesk.authenticate(`${user.id}`, accessToken, async (sbUser, error) => {
        if (error) {
          console.log("error from desk authentication", { error });
        }

        const sb = await SendBird.getInstance();
        // console.log('getSubscribedTotalUnreadMessageCount::: ', SendBird.getInstance().getSubscribedTotalUnreadMessageCount())
        // SendBird.getInstance().getGroupChannelCount((value) => { console.log('getGroupChannelCount::: ', value) })
        // SendBird.getInstance().getTotalUnreadChannelCount((value) => { console.log('getTotalUnreadChannelCount::: ', value) })
        // console.log('getSubscribedCustomTypeTotalUnreadMessageCount::: ', SendBird.getInstance().getSubscribedCustomTypeTotalUnreadMessageCount())
        SendBird.getInstance().getTotalUnreadMessageCount((value) => {
          // console.log('getTotalUnreadMessageCount::: ', value)
          value > 0 && setNewMsg(true)
        })

        if (Platform.OS === 'ios') {
          // const token = await messaging().getToken();
          try {
            if (iOSAPNsToken) {
              const response = await sb.registerAPNSPushTokenForCurrentUser(iOSAPNsToken);
              // await console.log("ios registerAPNSPushTokenForCurrentUser res", response)
            }
            // Do something in response to a successful registration.
          } catch (error) {
            // Handle error.
          }
        } else {
          const token = await messaging().getToken();
          // await console.log("token", token)
          try {
            const response = await sb.registerGCMPushTokenForCurrentUser(token);
            // await console.log("registerGCMPushTokenForCurrentUser res", response)
            // Do something in response to a successful registration.
          } catch (error) {
            // Handle error.
          }
        }
        // console.log("SendBirdDesk.authenticate sbUser", sbUser) // return the token 

        setSendbirdAccessToken(accessToken);
      });
    });
  };

  /**
   * Initialize Survey with questions
   */

  const initializeSurvey = async (survey_id) => {
    try {
      const res = await getSurveyQuestions(survey_id);

      const survey = res?.included;
      // console.log("survey -->", survey)
      const answers = [];
      const questions = [];
      const question_answers_relations = [];
      survey.forEach((item) => {
        if (item.type === "answer") {
          answers.push(item);
        } else if (item.type === "question_answer") {
          /**
           * Store relation between question and answer
           * that helps sort answers for a question
           * is order they were created in the backend.
           * This helps remove code for manually setting
           * an answer postion for a question when
           * required.
           * Refactor to only used these question_answers
           * and remove surveyAnswers state.
           * More testing reuquired.
           */
          question_answers_relations.push(item);
        } else if (item.type === "question") {
          questions.push(item);
        }
      });
      questions.sort(
        (questionA, questionB) =>
          questionA.attributes.order - questionB.attributes.order
      );

      // console.log("sorted questions", questions)
      // console.log("answers", answers)
      // console.log("question_answers_relations", question_answers_relations)
      setSurveyAnswers(answers);
      setSurveyQuestions(questions);
      setSurveyQuestionAnswersRelations(question_answers_relations);
    } catch (error) {
      setError(error.message);
    }
  };

  /** Survey reminders functionality */

  /**
   * Method that return all incompleted
   * depression surveys for a patient.
   * @param {*} surveys - All survey for a patient
   */
  const get_depression_survey_reminders = (surveys, user) => {
    const { pregnancy } = user;
    const { gestational_age } = pregnancy?.attributes || {};

    let pregnancy_month = getPregnancyMonth(gestational_age);
    // console.log("pregnancy_month", pregnancy_month)

    let depression_surveys = surveys?.filter(
      ({ attributes }) =>
        attributes?.survey_id === 2 && !attributes?.completed_at  // && (user?.pregnancy?.id == (attributes?.pregnancy_id + ""))
    );

    // const is_second_trimster = gestational_age >= 112; // 3.7 months == 16W // OLD: pregnancy_month > 5; 
    // const is_third_trimster = gestational_age >= 196;  // 6.5 months == 28W// OLD: pregnancy_month > 7;

    // const is_first_trimster = (gestational_age >= 1 && gestational_age < 112);
    // const is_second_trimster = (gestational_age >= 112 && gestational_age < 196);
    // const is_third_trimster = gestational_age >= 196;

    const is_first_trimster = (gestational_age >= 1 && gestational_age <= 91);  // ranging 1W to 13W
    const is_second_trimster = (gestational_age >= 92 && gestational_age <= 181); // ranging from 13W to 25W
    const is_third_trimster = (gestational_age >= 182 && gestational_age <= 294); // ranging from 25W to 42W



    const survey_reminders = [];

    depression_survey_reminders_data.forEach((reminder_data) => {
      const depression_survey = _.find(depression_surveys, {
        attributes: { survey_number: reminder_data.survey_number },
      });
      if (
        (is_first_trimster &&
          depression_survey?.attributes?.survey_number === 1) ||
        (is_second_trimster &&
          depression_survey?.attributes?.survey_number === 2) ||
        (is_third_trimster &&
          depression_survey?.attributes?.survey_number === 3)
      ) {
        survey_reminders.push({
          ...reminder_data,
          user_survey_id: depression_survey?.id,
        });
      }
    });

    return survey_reminders;
  };

  /**
   * Method that return incompleted risk survey
   * @param {*} surveys - All survey for a patient
   */
  const get_risk_survey_reminders = (surveys) => {
    let risk_surveys = surveys.filter(
      ({ attributes }) =>
        attributes?.survey_id === 1 && !attributes?.completed_at  // && (user?.pregnancy?.id == (attributes?.pregnancy_id + ""))
    );
    // console.log("get_risk_survey_reminders risk_surveys", risk_surveys)
    if (risk_surveys?.length) {
      return risk_surveys.map((survey) => {
        // console.log("user_survey_id", survey?.id)
        return {
          ...risk_survey_reminders_data[0],
          user_survey_id: survey?.id,
        };
      });
    }
    return [];
  };

  /**
   * Method that return incompleted epds survey
   * TDOD: Use this method to create a support
   * for more than one epds surveys when it's
   * and requirement in the future.
   * @param {*} surveys - All survey for a patient
   */
  const get_epds_survey_reminders = (surveys) => {
    let epds_surveys = surveys.filter(
      ({ attributes }) =>
        attributes?.survey_id === 3 && !attributes?.completed_at  // && (user?.pregnancy?.id == (attributes?.pregnancy_id + ""))
    );

    if (epds_surveys?.length) {
      return epds_surveys.map((survey) => {
        return {
          ...epds_survey_reminders_data[0],
          user_survey_id: survey?.id,
        };
      });
    }
    return [];
  };
  /**
   * Create onbject array that is used to
   * create reminders card for unfinished
   * surveys (risk, depression).
   */
  const getSurveyReminders = (user) => {
    let surveys = user?.surveys;
    if (surveys?.length) {
      setSurveyReminders([
        ...get_risk_survey_reminders(surveys),
        ...get_depression_survey_reminders(surveys, user),
        // ...get_epds_survey_reminders(surveys) // Postpartum Depression Screening
      ]);
    }
    return [];
  };

  /**
   * Get user credentials (email, password) from
   * expo secure storage. Expo Secure Storage uses
   * keychain principles.
   */
  const getUserCredentials = async () => {
    let user_credentials = await EncryptedStorage.getItem("user_credentials");
    // console.log("user_credentials", user_credentials)
    user_credentials = user_credentials && JSON.parse(user_credentials);
    return user_credentials;
  };

  const handle_reminderarticle = async (id) => {
    try {
      var ids = []
      const data = await get_reminderArticles(id)

      await data.reminder.map((val) => {
        ids.push(val.id)
      })
      let formated_articles = await data.reminder.map((arti) => Object.assign(arti, { "type": "article" }));
      // console.log("formated_articles", formated_articles)

      await setReminderArticleIds([...reminderArticleIds, ...ids])
      await setReminderArticles([...formated_articles])
    }
    catch (e) {
      console.log("address err", e)
    }
  }


  const getKickCounterHistory = async (id) => {
    const userdata = await getUser(id)
    const pregnancy = await _.find(userdata?.included, { type: "pregnancy" });

    // const kickHistory_res = await kick_history(id) // get kick counter history
    const kickHistory_res = await kick_history_V2API(id, pregnancy?.id) // get kick counter history
    if (kickHistory_res.length > 0) {
      var created_at = (kickHistory_res[0].created_at).split("T")[0]
      var todayDate = (moment().format("YYYY-MM-DD")).split("T")[0];

      if (todayDate == created_at) {
        var kick_date = moment(kickHistory_res[0].kicks_date).format("MM/DD/YYYY")
        await AsyncStorage.setItem("TODAYDATE", (kick_date).toString())
        await AsyncStorage.setItem("KICKCOUNT", (kickHistory_res[0].total_kick_count).toString())
        await AsyncStorage.setItem("KICKTIMEARR", JSON.stringify(kickHistory_res[0].kicks_count_times))
        await AsyncStorage.setItem("TIMETAKEN", (kickHistory_res[0].total_time_taken).toString())
        await AsyncStorage.setItem("SESSIONSAVED", "done")
      }
    }
  }

  const signInUser = async (email, password) => {
    const authorization = axiosInstance.defaults.headers.common.authorization;
    // console.log("signInUser authorization -->", authorization)
    /**
     * Reset the authorization to remove old tokens
     * while siging back in.
     */

    if (!_.isEmpty(authorization)) {
      // console.log("isEmpty(authorization) condition pass")
      axiosInstance.defaults.headers.common.authorization = null;
    }

    const res = await signIn(email, password);
    const user_data = await res.data;
    // console.log("user_data", user_data)

    var storedID = await AsyncStorage.getItem("USER_ID")

    if (storedID != res.data.id) {
      await AsyncStorage.clear()
      await AsyncStorage.setItem("USER_ID", (res.data.id).toString());
    }

    if (res.data.id) {
      await getKickCounterHistory(res.data.id); // if login with diff user, get her counters details from history and store in async storage
    }


    if (user_data.login_status == true) {

      try {
        const address_res = await getAddress(res.data.id)
        setUserAddress(address_res);
      }
      catch (e) {
        console.log("address err", e)
      }

      // for get the reminder article list
      handle_reminderarticle(res.data.id)


      try {
        const user_agent = await UserAgent.getWebViewUserAgent();
        // console.log("user_agent -->", user_agent)
        // if (user_data?.id && user_agent && DeviceToken) {
        //   const res = await sendPushToken(user_data?.id, user_agent, DeviceToken);
        //   console.log("push token response", res);
        // }
        const res = await sendPushToken(user_data?.id, user_agent, DeviceToken);
        // console.log("push token response", res);

      } catch (error) {
        console.log("error with push notification registry", error);
      }

      global.auth = res?.headers?.authorization
      setUserJwtToken(res?.headers?.authorization.replace("Bearer", ""));
      setUser(user_data);

      const user_credentials = {
        email: user_data?.email,
        password: password,
        // user_id: res.data.id
      };

      if (user_data.is_test == true) {
        setIs_user(user_data.is_test)
      } else {
        setIs_user(false)
      }


      try {
        await EncryptedStorage.setItem("user_credentials", JSON.stringify(user_credentials));
        EncryptedStorage.setItem("user_id", JSON.stringify({ user_id: res.data.id }));
      } catch (error) {
        console.log("error", error)
        // There was an error on the native side
      }
      setLoggedIn(true);

      // Hidden it to resolve the ad related err in playconsole

      // if (is_test != true) {

      //   // console.log("analytics update -!-!-! signin is_test", is_test)
      //   try {
      //     // for test the logEvent
      //     await analytics().logEvent('userLogin', {
      //       email: user_data?.email,
      //       ID: user_data?.id
      //     });
      //     // await console.log("userLogin logEvent !!!")
      //   }
      //   catch (e) {
      //     console.log("logEvent", e);
      //   }

      //   try {
      //     // for test the setUserProperty

      //     await analytics().setUserProperty('UserEmail', user_data?.email)

      //   }
      //   catch (err) {
      //     console.log("Prop_email setUserProperty", err)
      //   }

      //   try {
      //     analytics().setUserId(user_data.id + "")
      //   }
      //   catch (e) {
      //     console.log("setUserId err", e)
      //   }
      // }

      return "success"
    } else {
      return user_data.message
    }

  };

  useEffect(() => {
    if (loggedIn && !_.isEmpty(user)) {
      // gets token from sendbird for user chat when user logs in
      user.sendbird_access_token != null && handleSendbirdAccessToken(user);
    }
  }, [loggedIn, user]);

  useEffect(() => {
    if (loggedIn) {
      // handles push notifications being pressed when a user is in-app and logged in
      if (notificationPressed && navigationReady) {
        navRef.current.navigate("Appointments");
      }
    }
  }, [loggedIn, notificationPressed, navigationReady]);

  /**
 * Pull in education articles from contentful
 */
  const getEducationArticles = async () => {
    try {
      const res = await getAllContentfulArticles();

      // Articles sorted by alphabet order
      const articles = _.sortBy(
        res?.map((article) => Object.assign(article.fields, { "id": article.sys.id })),
        ["title"]
      );

      setEducationArticles(articles);
    } catch (error) {
      setError(error.message);
    }
  };



  // context handling most core user logic
  const contextValue = {
    user,
    setUser,
    userAddress,
    sendbird,
    loggedIn,
    setLoggedIn,
    sendbirdAccessToken,
    handleSendbirdAccessToken,
    error,
    setError,
    channelUrl,
    setChannelUrl,
    appointments,
    setAppointments,
    recentAppointments,
    setRecentAppointments,
    emrAppointments,
    setEmrAppointments,
    providers,
    setProviders,
    apptsToday,
    setApptsToday,
    userVisitVitals,
    setUserVisitVitals,
    providerPreferences,
    setProviderPreferences,
    userQuestionAnswer,
    setUserQuestionAnswer,
    getUserCredentials,
    userJwtToken,
    setUserJwtToken,
    signInUser,
    educationArticles,
    setEducationArticles,
    getEducationArticles,
    selectedAticle,
    setSelectedAticle,
    selectedAticleID,
    setSelectedAticleID,
    user_State,
    setUser_State,
    query_txt,
    setQuery_txt,
    searcharticleloader, setSearcharticleloader,
    regUser, setRegUser,
    is_test, setIs_user,
    reminderArticles, setReminderArticles,
    handle_reminderarticle,
    reminderArticleIds, setReminderArticleIds,
    newMsg, setNewMsg,
    HNC_Vitals, setHNC_Vitals,
    babyBornDetails, setBabyBornDetails,
    CounterVitailsData, setCounterVitailsData,
    selectedChatDetails, setSelectedChatDetails
  };

  // context for survey logic
  const surveyValue = {
    surveyQuestions,
    setSurveyQuestions,
    surveyAnswers,
    setSurveyAnswers,
    surveyQuestionAnswersRelations,
    setSurveyQuestionAnswersRelations,
    surveyDone,
    setSurveyDone,
    surveyId,
    setSurveyId,
    userSurvey,
    setUserSurvey,
    initializeSurvey,
    getSurveyReminders,
    surveyReminders,
    setSurveyReminders,
  };

  const Stack = createStackNavigator();

  let timestamp = new Date();

  const routeNameRef = React.useRef();
  const navigationRef = React.useRef(); // instead of this, using "navRef"
  return (
    <AppContextProvider value={contextValue}>
      <SurveyContextProvider value={surveyValue}>
        <WithAxios>
          <SafeAreaProvider>
            <StatusBar
              backgroundColor={'#fff'}
              barStyle={'dark-content'}
            />
            <NavigationContainer
              ref={navRef}
              onReady={() => {
                setNavigationReady(true);
                routeNameRef.current = navRef.current.getCurrentRoute().name;
              }}

              onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navRef.current.getCurrentRoute().name;
                if (previousRouteName !== currentRouteName) {
                  if (is_test != true) {
                    // console.log("analytics update -!-!-! screenNav is_test", is_test)
                    try {
                      if (user.id) {


                        // Hidden it to resolve the ad related err in playconsole

                        /**
                         await analytics().logScreenView({
                          screen_name: currentRouteName,
                          screen_class: currentRouteName,
                        });

                        await analytics().logEvent('AppUsage', {
                          // screen_count: currentRouteName,
                          // users_screens: `${currentRouteName} ${user.first_name ? user.first_name : "unknown"}`,

                          // if currentRouteName is Article screen means, mention the artile title!!
                          screenTime: `MGHP-${user.id}-${previousRouteName == "Article" ? previousRouteName + " '" + selectedAticle + "' " : previousRouteName} (${ParseMillisecondsIntoReadableTime(new Date() - timestamp)})`
                        });
                         */


                        // await analytics().logEvent('article_events', {
                        //   id: '123123',
                        //   value: 'value',
                        //   variable: 'variable',
                        // });

                        if (previousRouteName == "Article") {
                          // await analytics().logEvent('article_events', {
                          //   id: 3745092,
                          //   item: 'Education track',
                          //   article_name: selectedAticle
                          // })
                          var time_spent = await FindSessionTime(new Date().getTime(), timestamp);
                          // var TimeSpentOnArticle = `userID:${user.id} ${previousRouteName + ":'" + selectedAticle + "' "}(${FindSessionTime(new Date().getTime(), timestamp)})`
                          // console.log("TimeSpentOnArticle", TimeSpentOnArticle, "articleID: ", selectedAticleID) // need send to API
                          if (selectedAticleID) {
                            var report_data = {
                              user_id: user.id,
                              time_spent,
                              content_id: { "article_id": selectedAticleID },
                              log_type: "Educational Content"
                            }
                            // console.log("article report_data", report_data)
                            await reporting_log_update(report_data)
                          }
                        }

                        // await analytics().setUserProperties({
                        //   MGHuserEventReport: `MGHP-${user.id}-${previousRouteName == "Article" ? previousRouteName + " '" + selectedAticle + "' " : previousRouteName} (${ParseMillisecondsIntoReadableTime(new Date() - timestamp)})`
                        // });

                      }

                      console.log(
                        previousRouteName == "Article" ? previousRouteName + " '" + selectedAticle + "' " : previousRouteName,
                        ' time -- ', ParseMillisecondsIntoReadableTime(new Date() - timestamp),
                      );

                      // await analytics().setCurrentScreen(currentRouteName);
                    }
                    catch (e) {
                      console.log("analytics err", e)
                    }
                  }


                }
                routeNameRef.current = currentRouteName;
              }}


            >
              <Stack.Navigator
                mode="modal"
                initialRouteName="Splash"
                screenOptions={{
                  headerShown: false,
                  headerBackTitleVisible: false,
                }}
              >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen
                  name="Login Stack"
                  options={{ gestureEnabled: false }}
                >
                  {(props) => (
                    <LoginStack {...props} setLoggedIn={setLoggedIn} />
                  )}
                </Stack.Screen>
                {/* NOT ENTIRELY SURE WE NEED ONBOARDING STACK AT ALL */}
                <Stack.Screen
                  name="Onboarding Stack"
                  options={{ gestureEnabled: false }}
                >
                  {(props) => <OnboardingStack {...props} />}
                </Stack.Screen>
                <Stack.Screen
                  name="Tab Navigator"
                  options={{ gestureEnabled: false, headerShown: false }}
                  screenOptions={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                  }}
                >
                  {(props) => <TabNavigator {...props} />}
                </Stack.Screen>
                <Stack.Screen name="Survey" options={{ headerShown: false }}>
                  {(props) => <SurveyStack {...props} />}
                </Stack.Screen>
              </Stack.Navigator>
              {/* Error Modal */}
              <AppModal isVisible={!!error} handleClose={() => setError("")} />
              {/* <AppModal
                isVisible={networkStateModal}
                handleClose={() => { setNetworkStateModal(false) }}
                title={"We are sorry"}
                subtitle={"Please ensure the internat connection!"}
              /> */}

              {/* {
                user?.id &&
                <Draggable
                  imageSource={require('./assets/dragchaticon.png')}
                  renderSize={80}
                  x={window_width - ((12 / 100) * window_width)}
                  y={window_hight - ((15 / 100) * window_hight)}
                  minX={((2 / 100) * window_width)} // min X value for left edge of component
                  minY={((5 / 100) * window_hight)} // min Y value for top edge of component
                  maxX={window_width - ((2 / 100) * window_width)} // max X value for right edge of component
                  maxY={window_hight - ((5 / 100) * window_hight)} // max Y value for bottom edge of component
                  onDragRelease={(x, y) => console.log('onDragRelease', x, y)}
                  onLongPress={() => console.log('long press')}
                  onShortPressRelease={() => console.log('press drag')}
                  onPressIn={() => console.log('in press')}
                  onPressOut={() => console.log('out press')}
                />
              } */}

            </NavigationContainer>
          </SafeAreaProvider>
        </WithAxios>
      </SurveyContextProvider>
    </AppContextProvider>
  );
}