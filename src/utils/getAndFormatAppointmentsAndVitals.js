import _ from "lodash";
import { getAppointments, getUserVitals, getEMRAppointments, getUser, getUserVitals_V2API, getAppointments_V2API, getEMRAppointments_V2API } from "../api";
const isToday = (startDate, present) => {
  const startDay = startDate.getDate();
  const startTime = startDate.getTime();
  const presentDay = present.getDate();
  const presentTime = present.getTime();
  return (
    presentDay === startDay &&
    Math.abs(presentTime - startTime) < 24 * 60 * 60 * 1000
  );
};

const getAndFormatAppointmentsAndVitals = async (user) => {
  // console.log("getAndFormatAppointmentsAndVitals user", user)

  const userdata = await getUser(user.id)
  const pregnancy = await _.find(userdata?.included, { type: "pregnancy" });

  const [appointments, userVisitVitals, emrAppointments] = await Promise.all([
    // getAppointments(user.id), //  /** Provider - appts */
    // getUserVitals(user.id),
    // getEMRAppointments(user.id) // Visit -- physician  /** Physician - visits */

    getAppointments_V2API(user.id, pregnancy?.id), //  /** Provider - appts */
    getUserVitals_V2API(user.id, pregnancy?.id),
    getEMRAppointments_V2API(user.id, pregnancy?.id) // Visit -- physician  /** Physician - visits */
  ]);

  const appointmentsToday = [];
  const emrappointmentsToday = [];
  const present = new Date();

  /**
   * Visits/Schedules coming from OPGYN (Redox engine).
   */
  let visits = [];
  const visit_ids = userVisitVitals.data.map(
    (visit) => visit.attributes.visit_id
  );
  visit_ids.forEach((visit_id) => {
    const visit = _.find(userVisitVitals.included, {
      type: "visit",
      id: `${visit_id}`,
    });
    if (!visits.includes(visit)) {
      visits.push(visit);
    }
  });
  visits = visits.map((visit) => {
    const { visit_time } = visit?.attributes;
    const startDate = new Date(visit_time);

    visit.startDate = startDate;
    visit.upcoming = startDate > present;

    if (isToday(startDate, present)) {
      appointmentsToday.push(visit);
    }
    return visit;
  });

  /**
   * Appointments coming in from Acuity.
   */
  const appointmentsData = _.get(appointments, "data");
  const appts = appointmentsData.map((appt) => {
    const { scheduled_at, duration_in_minutes, canceled } = appt?.attributes;
    const startDate = new Date(scheduled_at);
    const minutes = startDate.getMinutes();

    const endDate = new Date(scheduled_at);
    endDate.setMinutes(minutes + duration_in_minutes);

    appt.startDate = startDate;
    appt.endDate = endDate;
    appt.upcoming = endDate > present;

    if (isToday(startDate, present) && canceled == false) {
      appointmentsToday.push(appt);
    }
    return appt;
  });


  const emrappointmentsData = _.get(emrAppointments, "data");

  const emrappts = emrappointmentsData.map((appt) => {

    const apptPhysicianId = appt?.relationships?.physician?.data?.id;
    const physician = emrAppointments.included.find((prov) => prov.id === apptPhysicianId);

    const { visit_time } = appt?.attributes;
    const startDate = new Date(visit_time);
    const minutes = startDate.getMinutes();

    const endDate = new Date(visit_time);
    endDate.setMinutes(minutes + 60); // duration_in_minutes is 60

    appt.startDate = startDate;
    appt.endDate = endDate;
    appt.upcoming = endDate > present;
    appt.physician_details = physician

    if (isToday(startDate, present)) {
      emrappointmentsToday.push(appt);
    }
    return appt;
  });


  const getSortedAppointments = (appointments) => {
    return appointments.sort((appointmentA, appointmentB) => {
      return appointmentA.startDate - appointmentB.startDate;
    });
  };

  var sortedAppts = getSortedAppointments(appts);
  var sortedEmrAppts = getSortedAppointments(emrappts);
  var sortedVisits = getSortedAppointments(visits);


  const filteredEmrAppts = sortedEmrAppts.filter(function (obj) {
    return obj.attributes.status !== "Cancelled";
  });

  const filteredtodayEmrAppts = emrappointmentsToday.filter(function (obj) {
    return obj.attributes.status !== "Cancelled";
  });

  return {
    appts: [...sortedAppts, ...sortedVisits],
    appointmentsToday: [...appointmentsToday, ...filteredtodayEmrAppts],
    userVisitVitals,
    emrAppointments: [...filteredEmrAppts]
  };
};

export default getAndFormatAppointmentsAndVitals;
