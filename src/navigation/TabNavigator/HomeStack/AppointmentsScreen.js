import React, { useState, useEffect, useContext } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import AppButton from "../../../components/AppButton";
import AppContainer from "../../../components/AppContainer";
import AppFlatList from "../../../components/AppFlatList";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppText from "../../../components/AppText";
import ReminderCard from "../../../components/ReminderCard";
import TabHeader from "../../../components/TabHeader";
import { AppContext } from "../../../context";
import getAndFormatAppointmentsAndVitals from "../../../utils/getAndFormatAppointmentsAndVitals";
import { parseAppointmentDate } from "../../../utils/helpers";
import _ from "lodash";

export default function AppointmentsScreen({ navigation }) {
  const [selected, setSelected] = useState("Scheduled");
  const [refreshing, setRefreshing] = useState(false);
  const headers = ["Scheduled", "Previous"];
  const {
    user,
    appointments,
    providers,
    setAppointments,
    // setUserVisitVitals,
    setApptsToday,
    setError,
    emrAppointments,
    setEmrAppointments
  } = useContext(AppContext);

  const getCurrentAppointments = (appts) => {
    const past = [];
    const future = [];
    const canceledApptList = [];
    // const pastCanceled = [];
    // const futureCanceled = [];

    // Divide appointments into upcoming or past appointments
    appts.forEach((appt) => {
      appt?.upcoming === true ? future.push(appt) : past.push(appt);
      appt?.attributes?.canceled === true ? canceledApptList.push(appt) : null;
      // (appt?.upcoming === true && appt?.attributes?.canceled === true) ? futureCanceled.push(appt) : null;
      // (appt?.upcoming === false && appt?.attributes?.canceled === true) ? pastCanceled.push(appt) : null;
    });

    return { past, future, /* pastCanceled, futureCanceled, */ canceledApptList };
  };

  const { past, future, /* pastCanceled, futureCanceled, */ canceledApptList } = getCurrentAppointments([...appointments, ...emrAppointments]);

  // console.log("canceledApptList", canceledApptList)

  const handleGetUserAppointments = async () => {
    try {
      setRefreshing(true);
      // const { appts, appointmentsToday, userVisitVitals } =
      const { appts, appointmentsToday, emrAppointments } =
        await getAndFormatAppointmentsAndVitals(user);
      setAppointments(appts);
      setEmrAppointments(emrAppointments)
      // if (!_.isEmpty(userVisitVitals)) {
      //   setUserVisitVitals(userVisitVitals);
      // }
      setApptsToday(appointmentsToday);
      setRefreshing(false);
    } catch (error) {
      setError(error.message);
      setRefreshing(false);
    }
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused && user) {
      handleGetUserAppointments(user);
    }
  }, [isFocused, user]);

  const renderApptCard = ({ item }) => {
    if (item.type == "appointment") {
      if (item.attributes?.canceled === false) {

        const { date, time } = parseAppointmentDate(item.startDate, item.endDate);
        const apptProviderId = item?.relationships?.provider?.data?.id;
        const provider = providers.find((prov) => prov.id === apptProviderId);
        return (
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
              navigation={navigation}
              canceledAppt={item?.attributes?.canceled}
              cancelLink={item?.attributes?.cancel_reschedule_link}
              title={time}
              date={date}
              body={provider?.attributes?.full_address}
              doc_data={provider?.attributes}
              id={item.id}
              appt
              hasImage
              photoUrl={provider?.attributes?.photo_url}
              boxShadow
              noBorder
              morePadding
              bigSquare
              lightBlue={item.upcoming}
              upcomingProviderAppt={item.upcoming}
              gray={!item.upcoming}
            />
          </Pressable>
        );
      }
    } else {
      if (user.physicians?.length > 0) {
        // if (item.attributes.status != "Cancelled") {
        const { date, time } = parseAppointmentDate(item.startDate);
        const apptPhysicianId = item?.relationships?.physician?.data?.id;
        const physician = user.physicians.find((prov) => prov.id === apptPhysicianId);

        return (
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
              photoUrl={item.physician_details?.attributes?.photo_url}
              boxShadow
              noBorder
              morePadding
              bigSquare
              lightBlue={item.upcoming}
              gray={!item.upcoming}
            />
          </Pressable>);
        // }

      }

    }

  };

  const renderFooterApptCard = (CancelledAppts) => {

    if (CancelledAppts.length > 0) {
      return (
        CancelledAppts.map((item, index) => {
          if (item.type == "appointment") {
            const { date, time } = parseAppointmentDate(item.startDate, item.endDate);
            const apptProviderId = item?.relationships?.provider?.data?.id;
            const provider = providers.find((prov) => prov.id === apptProviderId);
            return (
              <>
                {index == 0 ?
                  <AppText bold blue mt1 mb3 h3>Canceled Appointments</AppText>
                  : null
                }
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
                    canceledAppt={item?.attributes?.canceled}
                    title={time}
                    date={date}
                    body={provider?.attributes?.full_address}
                    doc_data={provider?.attributes}
                    id={item.id}
                    appt
                    hasImage
                    photoUrl={provider?.attributes?.photo_url}
                    boxShadow
                    noBorder
                    morePadding
                    bigSquare
                    lightBlue={item.upcoming}
                    gray={!item.upcoming}
                  />
                </Pressable>
              </>
            );
          } else {
            return (<View />)
          }
        })
      )
    } else {
      return (<View />)
    }
  }

  return (
    <AppSafeAreaView edges={["left", "right"]}>
      <AppContainer noPaddingBottom>
        <TabHeader
          headers={headers}
          selected={selected}
          setSelected={setSelected}
        />
        <AppFlatList
          data={selected === "Scheduled" ? future : past}
          renderItem={renderApptCard}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <AppText h2 blue semibold textAlignCenter mb4>
                {`It doesn't look like you have any appointments`}
              </AppText>
            </View>
          )}
          keySignature="appointments-screen"
          refreshing={refreshing}
          onRefresh={() => handleGetUserAppointments(user)}
          ListFooterComponent={() => renderFooterApptCard(selected === "Scheduled" ? [] : canceledApptList)}
        />
        {!_.isEmpty(providers) && (
          <AppButton
            // onPress={() => navigation.navigate("Scheduling")}
            onPress={() => navigation.navigate("Providers List")}
            title="Schedule an appointment"
            schedule
          />
        )}
      </AppContainer>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },
});
