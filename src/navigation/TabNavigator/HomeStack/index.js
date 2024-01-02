import React, { useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AppointmentDetailsScreen from "./AppointmentDetailsScreen";
import AppointmentsScreen from "./AppointmentsScreen";
import HomeScreen from "./HomeScreen";
import PregnancyProgressScreen from "./PregnancyProgressScreen";
import RemindersScreen from "./RemindersScreen";
import SchedulingScreen from "./SchedulingScreen";
import CareManagerScreen from './CareManagerScreen';
import ManagerDemographics from './ManagerDemographics';
import SurveyStack from '../../SurveyStack/SurveyScreen';
import SurveyQuestionScreen from "../../SurveyStack/SurveyQuestionScreen";
import ArticleScreen from "../EducationStack/ArticleScreen";
import EducationScreen from "../EducationStack/EducationScreen";
import ProviderListScreen from './ProviderListScreen';
import ReSchedulingScreen from './ReSchedulingScreen';
import BfsBookingWebView from "./FeedingPlan/bfsBookingWebView";

import BabyInfoScreen from './babyInfoScreen'
import AgreeBPcuff from './AgreeBPcuffScreen'
import AddressEnterScreen from './AddressEnterScreen'
import BPSuccessOrder from './BPSuccessOrder'
import DeclineOptionScreen from './DeclineOptionScreen'

import CustomWebview from './CustomWebview'
import KickCounterScreen from '../VitalsStack/KickCounterScreen'
import BloodPressureScreen from '../VitalsStack/BloodPressureScreen'


// Feeding plan screens
import FeedingPlanDashboard from "./FeedingPlan";
import EducationMaterial from "./FeedingPlan/EducationMaterial";
import ShopScreen from "./FeedingPlan/ShopScreen";
import ProductDetailsScreen from "./FeedingPlan/ProductDetailsScreen";
import LearnMoreScreen from "./FeedingPlan/LearnMoreScreen";

import PregnancyDetails from "../../OnboardingStack/PregnancyDetails";
import { AppContext } from "../../../context";


export default function HomeStack() {

  // useEffect(() => {
  //   const { user } = useContext(AppContext);
  //   console.log("HomeStack user::", user)
  // }, [])



  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={"Home"}
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <HomeScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Daily Reminders">
        {(props) => <RemindersScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Appointments">
        {(props) => <AppointmentsScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Appointment Details">
        {(props) => <AppointmentDetailsScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Scheduling">
        {(props) => <SchedulingScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Pregnancy Progress">
        {(props) => <PregnancyProgressScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Survey" options={{ headerShown: false }}>
        {(props) => <SurveyStack {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Survey Question">
        {(props) => <SurveyQuestionScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Education Modules" options={{ headerShown: false }}>
        {(props) => <EducationScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Care Manager">
        {(props) => <CareManagerScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Manager Demographics">
        {(props) => <ManagerDemographics {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Article" options={{ headerShown: true }}>
        {(props) => <ArticleScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Providers List" options={{ headerShown: true, title: "Schedule Appointment" }}>
        {(props) => <ProviderListScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="ReScheduling" options={{ headerShown: false, title: "ReScheduling" }}>
        {(props) => <ReSchedulingScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="BabyInfoScreen" options={{ headerShown: true, title: "Delivery Information" }}>
        {(props) => <BabyInfoScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Kick Counter">
        {(props) => <KickCounterScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Blood Pressure"
        options={{
          headerTitle: "My Blood Pressure",
        }}
      >
        {(props) => <BloodPressureScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="AgreeBPcuff" options={{ headerShown: true, title: "BP cuff information" }}>
        {(props) => <AgreeBPcuff {...props} />}
      </Stack.Screen>
      <Stack.Screen name="AddressEnterScreen" options={{ headerShown: true, title: "Address details" }}>
        {(props) => <AddressEnterScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="BPSuccessOrder" options={{ headerLeft: false, headerShown: true, title: "BP Cuff" }}>
        {(props) => <BPSuccessOrder {...props} />}
      </Stack.Screen>
      <Stack.Screen name="DeclineOptionScreen" options={{ headerLeft: false, headerShown: true, title: "" }}>
        {(props) => <DeclineOptionScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="CustomWebview" options={{ headerShown: false }}>
        {(props) => <CustomWebview {...props} />}
      </Stack.Screen>
      <Stack.Screen name="BfsBookingWebView" options={{ headerShown: false }}>
        {(props) => <BfsBookingWebView {...props} />}
      </Stack.Screen>

      <Stack.Screen name="FeedingPlanDashboard" options={{ headerShown: false }}>
        {(props) => <FeedingPlanDashboard {...props} />}
      </Stack.Screen>
      <Stack.Screen name="EducationMaterial" options={{ headerShown: false }}>
        {(props) => <EducationMaterial {...props} />}
      </Stack.Screen>
      <Stack.Screen name="ShopScreen" options={{ headerShown: false }}>
        {(props) => <ShopScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="ProductDetailsScreen" options={{ headerShown: false }}>
        {(props) => <ProductDetailsScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="LearnMoreScreen" options={{ headerShown: false }}>
        {(props) => <LearnMoreScreen {...props} />}
      </Stack.Screen>



      <Stack.Screen
        name="Pregnancy Details"
        options={{
          headerTitle: "",
        }}
      >
        {(props) => <PregnancyDetails {...props} />}
      </Stack.Screen>

    </Stack.Navigator>
  );
}
