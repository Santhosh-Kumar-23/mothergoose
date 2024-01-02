import React, { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, View, Linking, Image, ActivityIndicator, Alert, BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppScrollView from "../../../components/AppScrollView";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReminderCard from "../../../components/ReminderCard";
import AppText from "../../../components/AppText";
import AppContainer from "../../../components/AppContainer";
import Link from "../../../components/Link";
import { reminders, BetaFeedback, articleReminders } from "../../../fakeData";
import { Header, ProgressBar } from "../../../components/HomeScreen";
import { COLORS, MARGINS } from "../../../utils/styles";
import getAndFormatAppointmentsAndVitals from "../../../utils/getAndFormatAppointmentsAndVitals";
// import CalendarIcon from "../../../../assets/svgs/CalendarIcon.svg";
import { SurveyContext } from "../../../context/surveyContext";
import { AppContext } from "../../../context";
// import noteReminder from '../../../../assets/noteReminder.png'
import messaging from "@react-native-firebase/messaging";

import Appticon from "../../../../assets/Appticon.png"
import Dailyremindericon from "../../../../assets/Dailyremindericon.png"
import Feedbackicon from "../../../../assets/Feedbackicon.png"
import Roundchaticon from "../../../../assets/Roundchaticon.png"
import BPCuff from "../../../../assets/BPCuff.png"
import MotherfeedPNG from "../../../../assets/motherfeed.png"
import HandBaby from '../../../../assets/handBaby.png'
import BabySingleFoot from '../../../../assets/BabySingleFoot.png'
import BloodPressureArticleImage2 from '../../../../assets/BloodPressureArticleImage2.png'
import moment from 'moment'

import {
  getUserSurveys,
  getUserProviders,
  getUser,
  // getSurveyQuestions,
  // createUserSurvey,
  // getEMRAppointments,
  viewed_reminder_article,
  get_hnc_vitals,
  get_baby_details
} from "../../../api";
import _ from "lodash";
// import * as Linking from "expo-linking";
import { EventRegister } from 'react-native-event-listeners';
import { parseAppointmentDate } from "../../../utils/helpers";

import { useIsFocused } from '@react-navigation/native';
import { DaysDiff } from "../../../utils/TimeDiff";

export default function HomeScreen({ navigation }) {

  const [loader, setLoader] = useState(true)
  const [showBabyCard, setShowBabyCard] = useState(null)
  const [riskSurComp, setRiskSurComp] = useState(false)
  const { surveyReminders, getSurveyReminders, initializeSurvey } =
    useContext(SurveyContext);
  const {
    setAppointments,
    setProviders,
    setApptsToday,
    user,
    setError,
    apptsToday,
    setUserVisitVitals,
    setProviderPreferences,
    setUser,
    userQuestionAnswer,
    setUserQuestionAnswer,
    getEducationArticles,
    appointments,
    providers,
    setRecentAppointments,
    recentAppointments,
    setEmrAppointments,
    reminderArticles,
    setReminderArticles,
    handle_reminderarticle,
    setSelectedAticle, setSelectedAticleID,
    currentScreenName,
    HNC_Vitals, setHNC_Vitals,
    babyBornDetails, setBabyBornDetails,
    CounterVitailsData, setCounterVitailsData,

  } = useContext(AppContext);
  var remindersData = [...surveyReminders, ...recentAppointments, ...reminderArticles/* ...appointments,  ...apptsToday, ...articleReminders*/]

  // console.log("user ==>", user)
  const daysDiffFromRegDate = DaysDiff(user?.app_registered_at)
  const daysDiffFromStartDate = DaysDiff(user?.pregnancy?.attributes?.start_date) // pregnancy start date.


  const handleSurveys = async (user) => {
    try {
      let surveys = await getUserSurveys(user.id);
      checkRiskSurveyfinish(surveys.data)
      let userCopy = Object.assign(user, {});
      userCopy.surveys = [];
      if (surveys?.data.length) {
        userCopy.surveys = surveys?.data.map((survey) => {
          return {
            id: Number(survey.id),
            attributes: survey?.attributes,
          };
        });
        setUser(userCopy);
      }

      if (surveys?.included) {
        setUserQuestionAnswer(surveys?.included);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const setUserProviderPreferences = (user_data) => {
    const provider_preferences = _.find(user_data?.included, {
      type: "user_provider_preference",
    });

    if (!_.isEmpty(provider_preferences)) {
      setProviderPreferences(provider_preferences?.attributes);
    }
  };

  const setUserData = (user_data) => {
    const user_context = Object.assign(user, {});

    /**
     * set user sendbird_access_token
     * to make sure access_token is saved
     * for the user to start sendbird chat.
     */
    const { sendbird_access_token } = user_context;
    if (_.isEmpty(sendbird_access_token)) {
      user_context.sendbird_access_token =
        user_data?.data?.attributes?.sendbird_access_token;
    }

    user_context.physicians = [];
    const physicians = _.filter(user_data?.included, {
      type: "physician",
    });
    if (!_.isEmpty(physicians)) {
      user_context.physicians = [...physicians];
    }

    const pregnancy = _.find(user_data?.included, { type: "pregnancy" });
    if (!_.isEmpty(pregnancy)) {
      user_context.pregnancy = pregnancy;

      console.log("Is gestational Age", pregnancy?.attributes?.gestational_age)

      if (pregnancy?.attributes?.gestational_age > 0) {
        setLoader(false)
      } else {
        setTimeout(() => {
          if (pregnancy?.attributes?.gestational_age > 0) {
            setLoader(false)
          } else {
            navigation.navigate("Pregnancy Details", { Homescreen: true })
            setLoader(false)
          }
        }, 1200);
      }
    }

    user_context.care_team = [];
    const administrators = _.filter(user_data?.included, {
      type: "administrator",
    });
    if (!_.isEmpty(administrators)) {
      user_context.care_team = [...administrators];
    }

    /** Set user app preferences to user context */
    const user_app_preference = _.find(user_data?.included, {
      type: "user_app_preference",
    });
    if (!_.isEmpty(user_app_preference)) {
      user_context.user_app_preference = user_app_preference;
    }

    /** Set user insurances to user context */
    // const user_insurances = _.filter(user_data?.included, {
    //   type: "user_insurance",
    // });
    const user_insurances = user_data?.data?.attributes?.user_insurances;


    if (!_.isEmpty(user_insurances)) {
      user_context.user_insurances = user_insurances;
    }

    /**
     * can_recieve_bp_cuff : 
     * Added the can_recieve_bp_cuff', parameter; it will have a true or false value, and on the basis of these values, a Bp cuff will be sent to the patient.
     * If the user practice has enable_filter checked,then it will get the filter by filter_name: 'Blood Pressure RPM Availability', and in this filter there are some insurances and practices.
     * When filters in the practice filter include BP filters and user insurance includes BP filters, then it returns true; otherwise, it will return false.
     */
    user_context.can_recieve_bp_cuff = user_data?.data?.attributes?.can_recieve_bp_cuff


    /**
     * Once order submitted to athena then it will be false else it will be true
     */
    user_context.can_order_bfs_products = user_data?.data?.attributes?.can_order_bfs_products

    user_context.is_nest_filter_valid = user_data?.data?.attributes?.is_nest_filter_valid

    user_context.nest_attributes = user_data?.data?.attributes?.nest_attributes

    user_context.show_bp_reminder_card = user_data?.data?.attributes?.show_bp_reminder_card
    /**
     * TODO: reimplement all user related methods to store
     * user related data (user_visit_vitals, user_provider_prefernces,
     * providers) in one user state, avoiding creating more
     * contexts and reducing amount of API calls to backend.
     */

    getSurveyReminders(user_context);
    setUser(user_context);


  };

  const handleGetUserDataAndProviders = async (user) => {
    const userProviders = await getUserProviders(user.id);
    setProviders(userProviders.data);
    const user_data = await getUser(user.id);

    // console.log("getUser user_data", user_data)
    setUserProviderPreferences(user_data);
    setUserData(user_data);
  };

  const handleGetUserAppointments = async () => {
    try {
      var threedaysappoint = []
      const { appts, appointmentsToday, userVisitVitals, emrAppointments } = await getAndFormatAppointmentsAndVitals(user);
      await setAppointments(appts);

      var apptmtsarr = await [...appts, ...emrAppointments] // get both appointements in a same array
      await apptmtsarr.map((item) => {
        if (item.upcoming == true) {

          var date1 = new Date(); // today
          var date2 = item.type == "visit" ? item.startDate : item.endDate;
          var Difference_In_Time = date2.getTime() - date1.getTime();
          var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
          if (Difference_In_Days > 0 && Difference_In_Days <= 3) {
            console.log("threedaysappoint item", item)
            if (item.type == "appointment") {
              if (item.attributes.canceled == false)
                threedaysappoint.push(item)
            } else
              threedaysappoint.push(item)
          }
        }
      })

      await setRecentAppointments(threedaysappoint);

      if (!_.isEmpty(userVisitVitals)) {
        setUserVisitVitals(userVisitVitals);
      }
      setApptsToday(appointmentsToday); // provider appointments
    } catch (error) {
      setError(error.message);
    }
  };

  const getUserHNCvitals = async () => {
    const data = await get_hnc_vitals(user.id)

    if (!_.isEmpty(data)) {
      await setHNC_Vitals(data)
      console.log("HNC_Vitals ---", HNC_Vitals)
    } else {
      setHNC_Vitals([])
    }
  }

  // const handleGetReminderArtiles = async () => {
  //   const { gestational_age } = user?.pregnancy?.attributes || {};
  //   setLoader(false)
  // }

  const get_baby_delivery_details = async () => {

    setTimeout(async () => {
      if (user?.pregnancy?.id) {
        var res = await get_baby_details(user?.pregnancy?.id)
        if (res.length > 0) {
          await setBabyBornDetails(res[0])
          setShowBabyCard(false)
        } else if (res.length == 0) {
          await setBabyBornDetails("")
          setShowBabyCard(true)
        }
      }
    }, 1200);


  }

  const setkickvitalsDetails = async () => {
    var G_Age = await user?.pregnancy?.attributes?.gestational_age
    AsyncStorage.getItem("KICKTIMEARR").then(async (value) => {
      var kicksNotedDate = await AsyncStorage.getItem("TODAYDATE")
      var kicksArr = await JSON.parse(value)
      var kickscount = await AsyncStorage.getItem("KICKCOUNT")
      var sessionsaved = await AsyncStorage.getItem("SESSIONSAVED")

      var todayDate = (moment().format("MM/DD/YYYY"));

      // console.log("kicksNotedDate, todayDate", kicksNotedDate, todayDate)

      if (kicksNotedDate == todayDate) {
        var data = {
          "todayKicksCount": kickscount,
          "todayKicksDone": kicksArr ? ((kicksArr?.length == 10 && sessionsaved == "done") ? true : false) : false,
          "gestational_age": G_Age,
        }
        setCounterVitailsData(data)
        console.log("kicksArr ==", data)
      }
    }).catch((err) => {
      console.log("err", err)
    }
    )
  }


  const checkRiskSurveyfinish = async (arr) => {
    // this we have to fix if we handle diff pregnancy
    var survey = await arr.find(s => s.attributes.survey_id === 1);
    var completed = await survey?.attributes.completed_at !== null;
    setRiskSurComp(completed)
    console.log("risk completed", completed)
  }

  const isFocused = useIsFocused();
  useEffect(() => {
    // console.log("global.auth", global.auth)
    if (user) {

      // if (isFocused && user) {
      handleSurveys(user);
      handleGetUserAppointments(user);
      handleGetUserDataAndProviders(user);
      getUserHNCvitals(user.id)
      // handleGetReminderArtiles(user)
      handle_reminderarticle(user.id)
      get_baby_delivery_details() // get baby details -- need to enable
      // handleEMRAppointments(user);
      setkickvitalsDetails(); // for show few vitals details on dashboard screen
      /** Get and set education articles from contentful */
      // getEducationArticles();

      // Initialize Risk Survey questions and answers
      // Needed to pupolate pre pregnancy weight in profile
      // and weight screen.

      // initializeSurvey(1);
      EventRegister.addEventListener('myCustomEvent', (data) => {
        // console.log("Emitted data", data);
        // if (data == "article") {
        //   navigation.navigate("Education Modules")
        // }
      })

    }
    // }, [user]);
  }, [isFocused, user]);

  // const HasRiskSurveyCompleted = (user?.surveys).length > 0 ? isRiskSurveyComplete(user?.surveys, 'survey_id', 1) : false
  // console.log("HasRiskSurveyCompleted", HasRiskSurveyCompleted)

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Confirm Exit!",
          "Are you sure, you want to exit?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { text: "YES", onPress: () => BackHandler.exitApp() }
          ]);

        // Return true to stop default back navigaton
        // Return false to keep default back navigaton
        return true;
      };

      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackPress
        );
      };
    }, []),
  );

  const renderReminders = (reminders) => {


    return (
      <View style={[styles.listContainer, styles.boxShadow]}>
        <View style={styles.headerContainer}>
          <View style={styles.renderRemindersImageContainer}>
            <Image
              source={Dailyremindericon}
              style={styles.renderRemindersImageView}
            />
            <AppText style={{ paddingLeft: 10 }} bold h3>Daily Reminders</AppText>
          </View>

          {
            remindersData.length > 0 &&
            <Link onPress={() => navigation.navigate("Daily Reminders")}>
              See All
            </Link>
          }

        </View>

        {/* Reminder for BP measure*/}
        {(user?.show_bp_reminder_card) ? BPRecordReminder() : null}

        {/** after 196 days == 28 weeeks of gestational */}
        {(user?.pregnancy?.attributes?.gestational_age >= 196 && CounterVitailsData?.todayKicksDone != true) ? KickReminder() : null}

        {remindersData.length > 0 ? remindersData.map((item) => {
          /**
           * navigation props variable can be used in
           * future to send more props for navigation.
           */
          let navigationProps =
            item?.link === "Survey"
              ? {
                survey_id: item?.survey_id,
                user_survey_id: item?.user_survey_id,
                survey_title: item?.title,
              }
              : {};

          // if (!apptsToday.length && item.type === "Appointment") {
          //   return (
          //     <></>
          //   );
          // }
          if (item.type == "appointment") {

            // if (item.upcoming == true) {
            //   var date1 = new Date(); // today
            //   var date2 = item.endDate;
            //   var Difference_In_Time = date2.getTime() - date1.getTime();
            //   var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            //   if (Difference_In_Days > 0 && Difference_In_Days <= 3) {

            const apptProviderId = item?.relationships?.provider?.data?.id;
            const provider = providers.find((prov) => prov.id === apptProviderId);
            const { date, time } = parseAppointmentDate(item.startDate, item.endDate);

            return (
              <React.Fragment key={item.id}>
                <Pressable
                  onPress={() =>
                    navigation.navigate("Appointment Details", {
                      appointment: item,
                      provider,
                      date,
                      time,
                    })
                  }
                >
                  <ReminderCard
                    title={time}
                    date={date}
                    body={provider?.attributes?.full_address}
                    doc_data={provider?.attributes}
                    id={item.id}
                    appt
                    hasImage
                    photoUrl={provider?.attributes?.photo_url}
                    // boxShadow
                    noBorder
                    // morePadding
                    bigSquare
                    lightBlue={item.upcoming}
                    upcomingProviderAppt={item.upcoming}
                    gray={!item.upcoming}
                    navigation={navigation}
                    cancelLink={item?.attributes?.cancel_reschedule_link}
                  />
                </Pressable>
                <View style={[styles.divider, { marginTop: 5 }]} />
              </React.Fragment>

            )

          }
          else if (item.type == "visit") {

            const { date, time } = parseAppointmentDate(item.startDate);

            return (
              <React.Fragment key={item.id}>
                <Pressable
                  onPress={() =>
                    navigation.navigate("Appointment Details", {
                      appointment: item,
                      physician: item.physician_details,
                      date,
                      time,
                    })
                  }
                >
                  <ReminderCard
                    title={time}
                    date={date}
                    body={item.physician_details?.attributes?.full_address}
                    doc_data={item.physician_details?.attributes}
                    id={item.id}
                    appt
                    hasImage
                    noBorder
                    photoUrl={item.physician_details?.attributes?.photo_url}
                    bigSquare
                    lightBlue={item.upcoming}
                    gray={!item.upcoming}
                  />
                </Pressable>
                <View style={styles.divider} />
              </React.Fragment>

            )

          }
          else if (item.type == "article") {
            return (
              <React.Fragment key={item.id}>
                <Pressable
                  onPress={async () => {
                    await viewed_reminder_article(user.id, item.id); // ensure the viewed reminder article
                    await handle_reminderarticle(user.id) // Again get the reminder articles list

                    setSelectedAticle(item.title);
                    setSelectedAticleID(item.id); // is used to send article id for reporting.

                    await navigation.navigate("Article", {
                      item: item,
                      title: item.title,
                      subtitle: item?.subtitle,
                      body: item.body,
                      videoUrl: item?.videoUrl,
                      photo: item?.photo,
                      // myfavarticlesIds
                    })
                  }}
                >
                  <ReminderCard
                    title={"Pregnancy Education For You"}
                    body={item.title}
                    gray
                    bigSquare
                    noBorder
                    article
                    pv12
                  />
                </Pressable>
                <View style={styles.divider} />
              </React.Fragment>
            )

          } else {
            return (
              <React.Fragment key={item.id}>
                <Pressable
                  onPress={() => {
                    if (item.link) {
                      navigation.navigate(`${item.link}`, navigationProps);
                    }

                    if (item.url)
                      Linking.openURL(item.url).catch((err) =>
                        console.log("An error occurred", err)
                      );
                  }}
                >
                  <ReminderCard
                    key={item.id}
                    title={item.title}
                    body={item.body}
                    purple
                    noBorder
                    pv12
                  />
                </Pressable>
                <View style={styles.divider} />
              </React.Fragment>
            );
          }

        }) :
          !(user?.pregnancy?.attributes?.gestational_age >= 196 && CounterVitailsData?.todayKicksDone != true) ?

            <AppText bold mt3 mb3 h3 gray textAlignCenter>No reminders for today</AppText>
            : null
        }
      </View>
    );
  };

  const appointmentCard = () => {
    return (
      <Pressable onPress={() => navigation.navigate("Appointments")}>
        <View style={[styles.appointmentContainer, styles.boxShadow]}>
          <View style={styles.icon}>
            {/* <Appticon height={40} width={40} /> */}
            <Image
              source={Appticon}
              style={styles.renderRemindersImageView}
            />
          </View>
          <View style={styles.appointmentText}>
            <AppText h3 bold>
              Appointments
            </AppText>
            <AppText gray>See and schedule appointments</AppText>
          </View>
        </View>
      </Pressable>
    );
  };

  const feedingPlanCard = () => {
    return (
      <Pressable onPress={() => navigation.navigate("FeedingPlanDashboard")}>
        <View style={[styles.bpcuffcardstyle, styles.boxShadow, { padding: 10, }]}>
          <View style={[styles.icon, { flex: 0.12 }]}>
            <Image
              source={MotherfeedPNG}
              style={styles.renderRemindersImageView}
            />
          </View>
          <View style={[styles.appointmentText, styles.feedingPlanCardTextView, { flex: 0.88 }]}>
            <AppText h3 bold>Please click to let us know about your plans for feeding your newborn so we can support you</AppText>
          </View>
        </View>
      </Pressable>
    );
  };

  const isBabyBorn = () => {
    return (
      <Pressable onPress={() => navigation.navigate("BabyInfoScreen")}>
        <View style={[styles.babyBorncard, styles.boxShadow]}>
          <View style={styles.icon}>
            <Image
              source={HandBaby}
              style={styles.renderRemindersImageView}
            />
          </View>
          <View style={[styles.appointmentText, styles.feedingPlanCardTextView]}>
            <AppText h3 bold>
              Have you delivered the baby?
            </AppText>
          </View>
        </View>
      </Pressable>
    );
  };

  const isRiskSurveyComplete = (objArray, key, value) => {
    let containsValue = false;

    if (objArray?.length > 0) {
      objArray.forEach(obj => {
        // Check if the key exists in the current object
        if (obj.hasOwnProperty(key)) {
          // If the value matches, set the flag to true
          if (obj[key] === value) {
            if (obj["completed_at"] != null) {
              containsValue = true;
            }
          }
        }
        // If the key is not found, check recursively in nested objects
        else if (typeof obj === 'object') {
          containsValue = isRiskSurveyComplete(Object.values(obj), key, value);
        }
      });

      return containsValue;
    } else {
      return containsValue;
    }

  }

  // console.log("\n------set 1------")
  // console.log("can_recieve_bp_cuff //true:", user?.can_recieve_bp_cuff) // true
  // console.log("riskSurComp //true:", riskSurComp) // true
  // console.log(`bp_cuff_accept_status  //== "" || == "declined":`, user?.pregnancy?.attributes?.bp_cuff_accept_status) // == "" || == "declined"
  // console.log("daysDiffFromStartDate //>= 28:", daysDiffFromStartDate) // >= 28 // date diff from pregnancy start date

  // console.log("\n------set 2------")
  // console.log("can_recieve_bp_cuff //true:", user?.can_recieve_bp_cuff) // true
  // console.log("riskSurComp //true:", riskSurComp) // true
  // console.log(`bp_cuff_accept_status //== "" || == "declined":`, user?.pregnancy?.attributes?.bp_cuff_accept_status) // == "" || == "declined"
  // console.log("daysDiffFromRegDate  //7 days:", daysDiffFromRegDate) // 7 days from app regis
  // console.log("gestational_age //>= 112  // >= 16W :", user?.pregnancy?.attributes?.gestational_age) // >= 112  // >= 16W
  // console.log("date_to_validate //known:", user?.pregnancy?.attributes?.date_to_validate) // either estimated due date / last mensural date should be known


  const BPCuffCard = () => {

    // console.log("\n------set 1------")
    // console.log("can_recieve_bp_cuff true", user?.can_recieve_bp_cuff) // true
    // console.log("riskSurComp true", riskSurComp) // true
    // console.log(`bp_cuff_accept_status == "" || == "declined"`, user?.pregnancy?.attributes?.bp_cuff_accept_status) // == "" || == "declined"
    // console.log("daysDiffFromStartDate >= 28", daysDiffFromStartDate) // >= 28 // date diff from pregnancy start date

    // console.log("\n------set 2------")
    // console.log("can_recieve_bp_cuff true", user?.can_recieve_bp_cuff) // true
    // console.log("riskSurComp true", riskSurComp) // true
    // console.log(`bp_cuff_accept_status == "" || == "declined"`, user?.pregnancy?.attributes?.bp_cuff_accept_status) // == "" || == "declined"
    // console.log("daysDiffFromRegDate  7 days", daysDiffFromRegDate) // 7 days from app regis
    // console.log("gestational_age >= 112  // >= 16W", user?.pregnancy?.attributes?.gestational_age) // >= 112  // >= 16W
    // console.log("date_to_validate known", user?.pregnancy?.attributes?.date_to_validate) // either estimated due date / last mensural date should be known

    /**
     * date_to_validate is the estimated due data.
     * value to be retrived from estimated_delivery_date or (menstrual_period + 9m 7days)
     */

    if (
      ((user?.pregnancy?.attributes?.bp_cuff_accept_status == "" || user?.pregnancy?.attributes?.bp_cuff_accept_status == "declined")
        && daysDiffFromStartDate >= 28 // date diff from pregnancy start date
      ) ||

      ((user?.pregnancy?.attributes?.bp_cuff_accept_status == "" || user?.pregnancy?.attributes?.bp_cuff_accept_status == "declined")
        && daysDiffFromRegDate >= 7 // 7 days from app regis
        && user?.pregnancy?.attributes?.gestational_age >= 112  // >= 16W
        && (user?.pregnancy?.attributes?.date_to_validate != "" || user?.pregnancy?.attributes?.date_to_validate != null) // either estimated due date / last mensural date should be known
      )

    ) {
      return (
        <Pressable onPress={() => navigation.navigate("AgreeBPcuff")}>
          <View style={[styles.bpcuffcardstyle, styles.boxShadow]}>
            <View style={styles.icon}>
              <Image
                source={BPCuff}
                style={styles.renderRemindersImageView}
              />
            </View>
            <View style={[styles.appointmentText, styles.feedingPlanCardTextView]}>
              <AppText h3 bold>
                Free Blood Pressure Monitoring, Click Here
              </AppText>
            </View>
          </View>
        </Pressable>
      );
    } else {
      return (
        <></>
      )
    }
  };

  const KickReminder = () => {
    return (
      <Pressable onPress={() => navigation.navigate("Kick Counter")}>
        <View style={[styles.KickReminderCardContainer]}>
          <View >
            <Image
              source={BabySingleFoot}
              style={styles.renderRemindersImageView}
            />
          </View>
          <View style={[styles.appointmentText, styles.feedingPlanCardTextView]}>
            <AppText h3 bold>
              Please remember your daily kick count.
            </AppText>
          </View>
        </View>
      </Pressable>
    );
  };

  const BPRecordReminder = () => {
    return (
      <Pressable onPress={() => navigation.navigate("Blood Pressure", { article: "" })}>
        <View style={[styles.KickReminderCardContainer]}>
          <View >
            <Image
              source={BloodPressureArticleImage2}
              style={styles.renderRemindersImageView}
            />
          </View>
          <View style={[styles.appointmentText, styles.feedingPlanCardTextView]}>
            <AppText h3 bold>
              Please remember to take your blood pressure today
            </AppText>
          </View>
        </View>
      </Pressable>
    );
  };

  const betafeedbackcard = (item) => {
    return (
      <Pressable onPress={() => {
        Linking.openURL(item.url).catch((err) =>
          console.log("An error occurred", err)
        );
      }}>
        <View style={[styles.appointmentContainer, styles.boxShadow]}>
          <View style={[styles.icon, styles.betafeedbackcardImageContainer]}>
            <Image
              source={Feedbackicon}
              style={styles.renderRemindersImageView}
            />
          </View>
          <View style={[styles.feedbackTextStyle, styles.betafeedbackcardTextContainer]}>
            <AppText h3 bold>
              {item.title}
            </AppText>
            <AppText gray>{item.body}</AppText>
          </View>
        </View>
      </Pressable>
    );
  };

  const CareTeamCard = () => {
    return (
      <Pressable
        onPress={() => navigation.navigate("Care Manager")}
      >
        <View style={[styles.appointmentContainer, styles.boxShadow]}>
          <View style={[styles.icon, styles.CareTeamCardImageContainer]}>
            <Image
              source={Roundchaticon}
              style={styles.CareTeamCardImageView}
            />
          </View>
          <View style={[styles.appointmentText, styles.CareTeamCardTextContainer]}>
            <AppText h1 bold>
              Chat Live
            </AppText>
            <AppText h2m gray>Talk Pregnancy with Tara</AppText>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <>
      {loader ?
        <View style={styles.loaderDiv}>
          <ActivityIndicator size="large" />
        </View>
        :
        <AppSafeAreaView edges={["top", "left", "right"]}>
          <AppScrollView>
            <AppContainer>
              <View style={styles.pageHeader}>
                <Header />
                {CareTeamCard()}
                <View style={[styles.progressCardContainer, styles.boxShadow]}>
                  <View style={[styles.progressTextContainer, styles.divider]}>
                    <AppText>Pregnancy Progress</AppText>
                    <Link
                      onPress={() => navigation.navigate("Pregnancy Progress")}
                    >
                      See more
                    </Link>
                  </View>
                  <ProgressBar condensed />
                </View>
              </View>
              <View style={styles.boxShadow}>
                {/* leaving this here to simplify testing survey updates, etc */}
                {/* {surveyDone ? (
                  <AppButton
                    blue
                    mb3
                    title="refresh survey"
                    onPress={() => {
                      setSurveyDone(false);
                    }}
                  />
                ) : null} */}

                {(riskSurComp == true && user?.can_recieve_bp_cuff == true) ? BPCuffCard() : null}

                {/**
                 * from 196 days / 28 weeks of gestational
                 * BFS FLOW:
                 */}
                {(user?.pregnancy?.attributes?.gestational_age >= 196 || user?.can_order_bfs_products == true) ? feedingPlanCard() : null}

                {renderReminders(reminders)}

                {appointmentCard()}

                {/**
                 * after 168 days == 24 weeks of gestational // previous
                 * after 140 days == 20 weeks of gestational
                 */}
                {(user?.pregnancy?.attributes?.gestational_age > 140 && showBabyCard == true) ? isBabyBorn() : null}

                {betafeedbackcard(BetaFeedback)}
              </View>
            </AppContainer>
          </AppScrollView>
        </AppSafeAreaView>
      }
    </>
  );
}

const styles = StyleSheet.create({
  loaderDiv: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  appointmentContainer: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderRadius: 10,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    marginTop: 20,
    padding: 15,
  },
  bpcuffcardstyle: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderRadius: 10,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    // marginTop: 20,
    // marginTop: MARGINS.mb3,
    marginBottom: MARGINS.mt3,
    padding: 15,
  },
  babyBorncard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderRadius: 10,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    marginTop: 20,
    // marginTop: MARGINS.mb3,
    // marginBottom: MARGINS.mt3,
    padding: 15,
  },
  appointmentText: {
    marginLeft: 10,
  },
  feedbackTextStyle: {
    marginLeft: 10,
    marginRight: 25
  },
  boxShadow: {
    // marginBottom: 10,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  divider: {
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    borderRadius: 10,
  },
  headerContainer: {
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: MARGINS.mb2,
    paddingLeft: MARGINS.mb3,
    paddingVertical: 12,
    alignItems: "center"
  },
  icon: {
    // backgroundColor: COLORS.apptIconBackground,
    padding: MARGINS.mb1,
  },
  listContainer: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderRadius: 10,
    borderWidth: 1,
    flexShrink: 1,
    // marginHorizontal: 20,
  },
  pageHeader: {},
  progressCardContainer: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.dividerLight,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: MARGINS.mb3,
  },
  progressTextContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: MARGINS.mb2,
  },
  renderRemindersImageView: {
    height: 40,
    width: 40,
    resizeMode: "contain"
  },
  renderRemindersImageContainer: {
    flexDirection: "row", alignItems: "center"

  },
  feedingPlanCardTextView: {
    justifyContent: "center",
    width: "75%"
  },
  KickReminderCardContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: COLORS.gray,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: MARGINS.mb2,
    position: "relative",

  },
  CareTeamCardImageView: {
    height: 45, width: 45, resizeMode: "contain",
  },
  CareTeamCardTextContainer: {
    flex: 0.85
  },
  CareTeamCardImageContainer: {
    flex: 0.15
  },
  betafeedbackcardImageContainer: {
    flex: 0.12,
    alignItems: "center"
  },
  betafeedbackcardTextContainer: {
    flex: 0.88
  }
});
