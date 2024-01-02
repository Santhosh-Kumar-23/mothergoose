import React, { useContext } from "react";
import { Pressable, StyleSheet, View, Linking } from "react-native";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppContainer from "../../../components/AppContainer";
import AppText from "../../../components/AppText";
import ReminderCard from "../../../components/ReminderCard";
import { allReminders, reminders } from "../../../fakeData";
import { MARGINS } from "../../../utils/styles";
import { SurveyContext } from "../../../context/surveyContext";
import AppScrollView from "../../../components/AppScrollView";
import { AppContext } from "../../../context";
import { parseAppointmentDate } from "../../../utils/helpers";
// import * as Linking from "expo-linking";

export default function RemindersScreen({ navigation, route }) {
  const { todos, urgent } = allReminders;
  const { apptsToday, providers } = useContext(AppContext);
  const { surveyReminders } = useContext(SurveyContext);

  const renderUrgent = (urgent) => (
    <View style={styles.listContainer}>
      {[...surveyReminders, ...reminders].map((reminder) => {
        let navigationProps = {
          survey_id: reminder?.survey_id,
          user_survey_id: reminder?.user_survey_id,
          survey_title: reminder?.title,
        };
        if (reminder?.type === "Appointment") return null;
        return (
          <React.Fragment key={reminder.id}>
            <Pressable
              onPress={() => {
                if (reminder.link)
                  navigation.navigate(`${reminder.link}`, navigationProps);
                if (reminder.url)
                  Linking.openURL(reminder.url).catch((err) =>
                    console.log("An error occurred", err)
                  );
              }}
            >
              <ReminderCard
                noBorder
                title={reminder.title}
                body={reminder.body}
                purple
                boxShadow
                pv12
              />
            </Pressable>
            <View style={styles.divider} />
          </React.Fragment>
        );
      })}
    </View>
  );

  const renderAppts = (appts) => {
    if (!appts.length) {
      return (
        <>
          <AppText h2m bold>Appointments for today</AppText>
          <View style={styles.emptyAppt}>
            <AppText gray h3>
              You don't have any appointments for today
            </AppText>
          </View>
        </>
      );
    }

    return (
      <>
        <AppText mb3>Appointments for today</AppText>
        {appts.map((item) => {

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
                    boxShadow
                    noBorder
                    morePadding
                    bigSquare
                    lightBlue={item.upcoming}
                    gray={!item.upcoming}
                    navigation={navigation}
                    cancelLink={item?.attributes?.cancel_reschedule_link}
                  />
                </Pressable>
                <View style={[styles.divider, { marginTop: 5 }]} />
              </React.Fragment>

            )

          } else if (item.type == "visit") {

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
                    photoUrl={item.physician_details?.attributes?.photo_url}
                    boxShadow
                    noBorder
                    morePadding
                    bigSquare
                    lightBlue={item.upcoming}
                    gray={!item.upcoming}
                  />
                </Pressable>
                <View style={styles.divider} />
              </React.Fragment>

            )

          } else {
            return (
              <>
              </>
            )
          }
        })}
      </>
    );
  };

  return (
    <AppSafeAreaView edges={["left", "right"]}>
      <AppScrollView>
        <AppContainer>
          {renderUrgent(urgent)}
          {renderAppts(apptsToday)}
        </AppContainer>
      </AppScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyAppt: {
    marginBottom: MARGINS.mb4,
    marginTop: MARGINS.mb2,
  },
  listContainer: {
    flexShrink: 1,
    marginBottom: MARGINS.mb3,
    paddingTop: MARGINS.mb1,
  },
});
