import { axiosInstance } from "../utils/axios";
import _, { result } from "lodash";
// import axios from "axios";
const axios = require('axios').default;

// gets risk survey (and will get other surveys in the future)
export const getUserSurveys = async (id) => {
  const res = await axiosInstance.get(`/users/${id}/user_surveys`);
  console.log("getUserSurveys res", res)
  return res?.data;
};

// gets user appointments from acuity--will need to be paired with /user_vitals_visit to get appointments from redox
export const getAppointments = async (id) => {
  /** Provider - appts */
  const res = await axiosInstance.get(`/users/${id}/appointments`);
  console.log("getAppointments_V1API res", res)
  return res.data;
};

export const getAppointments_V2API = async (id, currentPregnancyID) => {
  /** Provider - appts */
  const res = await axiosInstance.get(`/users/${id}/pregnancies/${currentPregnancyID}/appointments`); // for 2nd pregnancies 
  console.log("getAppointments_V2API res", res)
  return res.data;
};

export const getEMRAppointments = async (user_id) => {
  /** Physician - visits */
  console.log("getEMRAppointments userid", user_id)
  const res = await axiosInstance.get(`/users/${user_id}/visits`);
  console.log("getEMR_Appointments_V1API (physician-visit) res", res)
  return res?.data;
};

export const getEMRAppointments_V2API = async (user_id, currentPregnancyID) => {
  /** Physician - visits */
  console.log("getEMRAppointments_V2API userid, currentPregnancyID", user_id, currentPregnancyID)
  const res = await axiosInstance.get(`/users/${user_id}/pregnancies/${currentPregnancyID}/visits`); // for 2nd pregnancies
  console.log("getEMRAppointments_V2API (physician-visit) res", res)
  return res?.data;
};

// marks a survey complete with timestamp
export const completeSurvey = async (user_id, user_survey_id, pregnancy_id) => {
  const data = {
    type: "user_surveys",

    attributes: {
      pregnancy_id,
      completed_at: new Date(),
    },
  };
  console.log("completeSurvey", `/users/${user_id}/user_surveys/${user_survey_id}`)
  const res = await axiosInstance.put(
    `/users/${user_id}/user_surveys/${user_survey_id}`,
    {
      data,
    }
  );

  console.log("completeSurvey res", res)
  return res.data;
};

// handles all types of answers for risk survey--all data passed in array form for consistency despite different answer types (multi-select, single-select, etc)
export const submitSurveyAnswer = async (
  body,
  user_id,
  question_id,
  answerOptions,
  user_survey_id
) => {
  const type = "user_question_answer";

  // handles text input questions
  if (!body.length) {
    const ids = [];
    const labels = [];

    for (const key in body) {
      const x = answerOptions.find((a) => {
        return a.label === key;
      });

      ids.push(x.id);
      labels.push(body[key]);
    }
    body.id = ids;
    body.label = labels;
  }

  // handles multi-select questions
  if (body.length) {
    body.id = body.map((a) => a.id);
    body.label = body.map((a) => a.label);
  }

  const attributes = {
    user_id,
    question_id,
    answer_ids: body.id,
    user_inputs: body.label,
    user_survey_id,
  };

  var Temp_att = {}

  // if (attributes.question_id == "6") {
  //   if (attributes.answer_ids[0] == "31") { // pound
  //     let KG = Number(attributes.user_inputs[0]) * 0.453592
  //     Temp_att = {
  //       user_id: attributes.user_id,
  //       question_id: attributes.question_id,
  //       answer_ids: ["32"], // KG
  //       user_inputs: [String(KG)],
  //       user_survey_id: attributes.user_survey_id,
  //     }
  //     console.log("Temp_att", Temp_att)
  //   } else {
  //     Temp_att = attributes
  //   }
  // } else {
  //   Temp_att = attributes
  // }

  Temp_att = attributes

  const data = {
    type,
    attributes: Temp_att,
  };
  console.log(`submitSurveyAnswer -- /users/${user_id}/user_question_answers`, data)

  const res = await axiosInstance.post(
    `/users/${user_id}/user_question_answers`,
    {
      data,
    }
  );
  console.log("submitSurveyAnswer res", res)
  return res.data;
};

export const getSurveyQuestions = async (id) => {
  const res = await axiosInstance.get(`/surveys/${id}`);
  console.log("getSurveyQuestions res", res)
  return res.data;
};

export const createUserSurvey = async (user_id, survey_id, pregnancy_id) => {

  // Need to pass pregnancy_id 
  const data = {
    type: "user_surveys",
    attributes: {
      user_id,
      survey_id,
      completed_at: null,
      pregnancy_id
    },
  };

  const res = await axiosInstance.post(`/users/${user_id}/user_surveys`, {
    data,
  });

  return res.data;
};

export const submitUserProviderPreferences = async (
  user_id,
  gender,
  language,
  race,
  provider_network
) => {
  // allows for users to select multiple languages/races for provider (though only race is currently multi-select)
  const languages = language.length
    ? language.map((g) => g.label)
    : [language.label];
  const racePref = race.length ? race.map((r) => r.label) : [race.label];

  const data = {
    type: "user_provider_preferences",
    attributes: {
      gender: [gender.label],
      provider_network: provider_network.label,
      language: languages,
      race: racePref,
    },
  };

  const res = await axiosInstance.put(
    `/users/${user_id}/user_provider_preferences`,
    { data }
  );

  return res.data;
};

export const handleEmail = async (email, { mobile_number, id }) => {
  const user = {
    email,
    mobile_number,
    id,
  };

  const res = await axiosInstance.post("users/confirmation", { user });

  return res.data;
};

// verifies user code from Twilio/authenticates them
export const verifyCode = async (
  code,
  { first_name, last_name, date_of_birth }
) => {
  const data = {
    type: "login",
    attributes: {
      first_name,
      last_name,
      date_of_birth,
      ...code,
    },
  };

  const res = await axiosInstance.post("/login/verify", { data });

  console.log("verifyCode res", res)
  console.log("verifyCode auth token", res.headers.authorization)
  res?.headers?.authorization && (global.auth = res?.headers?.authorization)
  return res.data;
};

// sends a device token that will allow us to send back push notifications if user has them turned on
export const sendPushToken = async (user_id, user_agent, token) => {

  var req = {
    expo_token: {
      user_id,
      user_agent,
      token,
    },
  }

  console.log("sendPushToken ", `/users/${user_id}/expo_tokens`, req)
  const res = await axiosInstance.post(`/users/${user_id}/expo_tokens`, req);
  console.log("sendPushToken res ", res)
  return res.data;
};

export const signIn = async (email, password) => {

  const user = {
    email,
    password,
  };
  const res = await axiosInstance.post(`/users/sign_in`, { user });

  console.log("signIn user --> res", res)
  return res;
};


export const getAddress = async (user_id) => {

  const res = await axiosInstance.get(`/user/${user_id}/address`);
  console.log("getAddress res", res)
  return res.data;
};


export const createPassword = async (user_id, email, password) => {
  const data = {
    type: "users",
    attributes: {
      email,
      password,
    },
  };

  const res = await axiosInstance.put(`/users/${user_id}`, { data });

  console.log("createPassword res", res)
  return res.data;
};

// To pass the healthix base64
export const Sendhealthix = async (id, filedata) => {
  const data = {
    id,
    bucket: filedata.Bucket,
    key: filedata.Key
  };
  const res = await axiosInstance.put(`/update_healthix_consent`, data);

  console.log("Sendhealthix res", res)
  return res.data;
};

/**
 * Send user info for triggering otp for a user
 * @param {*} first_name - User first name
 * @param {*} last_name - User last name
 * @param {*} date_of_birth - User date of birth
 */
export const triggerOTP = async (first_name, last_name, date_of_birth) => {
  const data = {
    type: "login",
    attributes: {
      first_name,
      last_name,
      date_of_birth,
    },
  };

  const res = await axiosInstance.post(`/login`, { data });
  console.log("triggerOTP login res", res)
  return res.data;
};

// Get Country/ state/ city using name and DOB
export const getUserState = async (first_name, last_name, date_of_birth) => {
  const data = {
    first_name,
    last_name,
    date_of_birth,
  };

  const res = await axiosInstance.get(`/get_user_state?first_name=${first_name}&last_name=${last_name}&date_of_birth=${date_of_birth}`);
  console.log("/getuserstate res", res.data)
  return res.data;
};


// allows users to set push notification preferences--will presumably add other functionality later (like appointment reminders, etc).
export const handleSetPushNotifications = async (user_id, push_notifications_enabled, appointment_reminder_enabled, daily_kick_counter_reminder_enabled) => {
  const data = {
    type: "user_app_preference",
    attributes: {
      push_notifications_enabled,
      appointment_reminder_enabled,
      daily_kick_counter_reminder_enabled
    },
  };

  const res = await axiosInstance.put(
    `/users/${user_id}/user_app_preferences`,
    { data }
  );
  console.log("handleSetPushNotifications res", res)
  return res.data;
};

// This is untested but should work based on Postman screenshots
export const handleResetPassword = async (email) => {
  const user = { email };
  const res = await axiosInstance.post("/users/password", { user });

  return res.data;
};

// accesses user vitals data from redox. Hasn't been integrated yet.
export const getUserVitals = async (user_id) => {
  const res = await axiosInstance(`/users/${user_id}/user_visit_vitals`);
  console.log("getUserVitals_V1API res -->", res.data);
  return res.data;
};

export const getUserVitals_V2API = async (user_id, currentPregnancyID) => {
  const res = await axiosInstance(`/users/${user_id}/pregnancies/${currentPregnancyID}/user_visit_vitals`); // for 2nd pregnancies
  console.log("getUserVitals_V2API res -->", res.data);
  return res.data;
};

/**
 * Call to get providers for a specific user
 * @param {string} user_id
 */
export const getUserProviders = async (user_id) => {

  const res = await axiosInstance.get(`/users/${user_id}/providers`);
  console.log("getUserProviders res", res)
  return res.data;
};

/**
 * Update user/patient attributes (first_name, email e.t.c.)
 * @param {string} user_id - Id for the user that is logged in.
 * @param {object} patient_data - Object containing user attributes to update.
 */
export const updatePatient = async (user_id, patient_data) => {
  const data = {
    type: "users",
    attributes: patient_data,
  };

  const res = await axiosInstance.put(`/users/${user_id}`, { data });

  return res.data;
};

/**
 * Api call to send email to MG Help desk with form attributes.
 * @param {object} form_values - Object help form attributes.
 */
export const submitMGSupportForm = async (form_values) => {
  const data = {
    type: "support_form",
    attributes: form_values,
  };
  const res = await axiosInstance.post(`/support/help_form`, { data });

  return res.data;
};

/**
 * Get user data along with other relationships with the user e.g
 * user_provider_preference.
 * @param {string} user_id - Id for the user that is logged in.
 */
export const getUser = async (user_id) => {
  const res = await axiosInstance.get(`users/${user_id}`);
  console.log("getUser", res)
  return res.data;
};

/**
 * Update Paitent Pregnancy info
 * @param {string} user_id - Id for the user that is logged in.
 * @param {object} pregnancy_data - Object including pregnancy detail attributes.
 */
export const setPregnancyDetails_V1API = async (user_id, pregnancy_attributes) => {
  const data = {
    type: "pregnancy",
    attributes: pregnancy_attributes,
  };

  console.log("setPregnancyDetails_V1API", `users/${user_id}/pregnancies`, data)

  const res = await axiosInstance.put(`users/${user_id}/pregnancies`, { data });
  console.log("setPregnancyDetails_V1API res", res)
  return res.data;
};

export const setPregnancyDetails_V2API = async (user_id, pregnancy_attributes, pregnancy_id) => {
  const data = {
    type: "pregnancy",
    attributes: pregnancy_attributes,
  };

  console.log("setPregnancyDetails_V2API", `users/${user_id}/pregnancies/${pregnancy_id}`, data)

  const res = await axiosInstance.put(`users/${user_id}/pregnancies/${pregnancy_id}`, { data });
  console.log("setPregnancyDetails_V2API res", res)
  return res.data;
};

export const deleteAccount = async (user_id, email) => {
  const data = {
    user_id,
    email,
  };
  const res = await axiosInstance.post(`user/delete_account`, { data });
  console.log("deleteAccount res", res)

  return res.data;
};

export const store_favourite_article = async (user_id, article_id, article, fav) => {
  const data = {
    user_id,
    article_id,
    article,
    fav
  };

  const res = await axiosInstance.post(`/store_favourite_article`, data);
  console.log("store_favourite_article res", res)

  return res.data;
};

export const viewed_reminder_article = async (user_id, article_id) => {
  const data = {
    user_id,
    article_id,
  };
  const res = await axiosInstance.post(`/viewed_reminder_article`, data);
  console.log("viewed_reminder_article res", res)

  return res.data;
};

export const store_most_viewed_article = async (user_id, article_id, article) => {
  const data = {
    user_id,
    article_id,
    article
  };

  const res = await axiosInstance.post(`/store_most_viewed_article`, data);
  console.log("store_most_viewed_article res", res)

  return res.data;
};


export const get_mod_articles = async (user_id, gestational_age) => {

  const res = await axiosInstance.get(`/get_mod_articles/${user_id}/gestational_age/${gestational_age}`);
  console.log("get_mod_articles res", res)

  return res.data;
};

export const get_all_articles = async (user_id, offset, articleLimit) => {

  const res = await axiosInstance.get(`/get_all_articles/${user_id}/page/${offset}/limit/${articleLimit}`);
  console.log("get_all_articles res", res)

  return res.data;
};

export const mg_recommented_articles = async (user_id, gestational_age) => {
  // this we can show in MG recommented articles ar pregnancy progress page. but we show only the first artcicle from list for display in that page.
  const res = await axiosInstance.get(`/mg_recommented_articles/${user_id}/gestational_age/${gestational_age}`);
  console.log("mg_recommented_articles res", res.data.suggest_for_you)

  return res.data.suggest_for_you;
};

export const get_reminderArticles = async (user_id) => {
  // this we can show in daily reminder section at home page
  const res = await axiosInstance.get(`/reminder_articles/user/${user_id}`);
  console.log("get_reminderArticles res", res)
  return res.data;
};

export const get_serachQuery = async (user_id, query) => {

  const res = await axiosInstance.get(`/search/${user_id}/query/${query}`);
  console.log("get_serachQuery res", res)
  return res.data;
};

export const reporting_log_update = async (data) => {
  console.log(`/reporting`, data)
  const res = await axiosInstance.post(`/reporting`, data);
  console.log(`reporting res`, res)
  return res;
}

export const session_log_update = async (data) => {
  console.log(`/session_time`, data)
  const res = await axiosInstance.post(`/session_time`, data);
  console.log(`session_time res`, res)
  return res;
}

export const get_hnc_vitals = async (user_id) => {
  const res = await axiosInstance.get(`/users/${user_id}/hnc_vitals`);
  console.log("get_hnc_vitals res", res)
  return res.data;
};

export const vitals_articles = async (user_id, vital) => {
  const res = await axiosInstance.get(`/users/${user_id}/vital_articles/${vital}`);
  console.log("vitals_articles res", res)
  return res.data;

};

export const send_kicks_details = async (data) => {
  console.log(`/kick_counts`, data)
  const res = await axiosInstance.post(`/kick_counts`, data);
  console.log(`send_kicks_details_V1API res`, res)
  return res.data;
}

export const send_kicks_details_V2API = async (data, currentPregnancyID) => {
  console.log(`/kick_counts`, data)
  const res = await axiosInstance.post(`/pregnancies/${currentPregnancyID}/kick_counts`, data); // 2nd pregnancy
  console.log(`send_kicks_details_V2API res`, res)
  return res.data;
}

export const kick_history = async (user_id) => {
  const res = await axiosInstance.get(`/${user_id}/kick_count_data`);
  console.log("kick_history_V1API res", res)
  return res.data;
};

export const kick_history_V2API = async (user_id, currentPregnancyID) => {
  const res = await axiosInstance.get(`users/${user_id}/pregnancies/${currentPregnancyID}/kick_count_data`); // 2nd pregnancy
  console.log("kick_history_V2API res", res)
  return res.data;
};

export const contraction_counter_API = async (data) => {
  console.log(`/contraction_counter_API`, data)
  const res = await axiosInstance.post(`/contraction_counter`, data);
  console.log(`contraction_counter_API_V1API res`, res)
  return res.data;
}

export const contraction_counter_V2API = async (data, currentPregnancyID) => {
  console.log(`/contraction_counter_API`, data)
  const res = await axiosInstance.post(`/pregnancies/${currentPregnancyID}/contraction_counter`, data); // 2nd pregnancy
  console.log(`contraction_counter_V2API res`, res)
  return res.data;
}

export const get_contraction_counter = async (user_id) => {
  const res = await axiosInstance.get(`/${user_id}/get_contraction_counter`);
  console.log("get_contraction_counter_V1API res", res)
  return res.data;
};

export const get_contraction_counter_V2API = async (user_id, currentPregnancyID) => {
  const res = await axiosInstance.get(`users/${user_id}/pregnancies/${currentPregnancyID}/get_contraction_counter`); // 2nd pregnancy
  console.log("get_contraction_counter_V2API res", res)
  return res.data;
};

export const send_delivery_details = async (user_id, data) => {
  console.log(`/send_delivery_details`, data)
  const res = await axiosInstance.post(`/users/${user_id}/delivery_details`, data);
  console.log(`send_delivery_details res`, res)
  return res.data;
}

export const get_baby_details = async (Pregnancy_id) => {
  const res = await axiosInstance.get(`/baby_details/${Pregnancy_id}`);
  console.log("baby_details res", res)
  return res.data;
};

export const get_userEDWAddress = async (user_id) => {
  const res = await axiosInstance.get(`/user/${user_id}/address`);
  console.log("get_userAddress2 res", res)
  return res.data;
};

// export const usps_address_API = async (url) => {
//   const res = await axios.get(url);
//     console.log("usps_address_API res", res)
//   return res.data;
// };

export const bp_cuff_status_API = async (data) => {
  console.log(`/free_bp_cuff_alert`, data)
  const res = await axiosInstance.post(`/free_bp_cuff_alert`, data);
  console.log(`free_bp_cuff_alert res`, res)
  return res.data;
}


export const usps_address_check_API = async (data) => {
  console.log(`/usps_address_check`, data)
  const res = await axiosInstance.post(`/usps_address_check`, data);
  console.log(`usps_address_check res`, res)
  return res.data;
}


export const getProactiveChan_API = async (user_id) => {
  console.log(`/users/${user_id}/proactive_channels`,)
  const res = await axiosInstance.get(`/users/${user_id}/proactive_channels`);
  console.log(`getProactiveChan_API res`, res)
  return res.data;
}


export const user_replied_chan_API = async (user_id, data) => {
  console.log(`/users/${user_id}/user_replied`)
  const res = await axiosInstance.put(`/users/${user_id}/user_replied`, data);
  console.log(`user_replied res`, res)
  return res.data;
}

export const fetch_insurances = async (user_id) => {
  console.log(`/bfs/${user_id}/fetch_insurances`,)
  const res = await axiosInstance.get(`/bfs/${user_id}/fetch_insurances`);
  console.log(`fetch_insurances res`, res)
  return res.data;
}

export const getPumpDetails = async (user_id) => {
  console.log(`/bfs/${user_id}/fetch_breast_pumps`,)
  const res = await axiosInstance.get(`/bfs/${user_id}/fetch_breast_pumps`);
  console.log(`getPumpDetails res`, res)
  return res.data;
}

export const getBfsArticles = async (user_id) => {
  console.log(`/users/${user_id}/vital_articles/breast_feeding`)
  const res = await axiosInstance.get(`/users/${user_id}/vital_articles/breast_feeding`);
  console.log(`getBfsArticles res`, res)
  return res.data;
}

export const sendOrderDetails = async (user_id, data) => {
  console.log("orderProduct data", data)
  const res = await axiosInstance.post(`/bfs/${user_id}/send_dme_order_to_athena`, data);
  console.log("orderProduct res", res)
  return res.data;
}

export const sendBFSUserResponse = async (user_id, payload) => {
  console.log("sendBFSactions payload", payload)
  const res = await axiosInstance.post(`/bfs/${user_id}/user_responses`, payload);
  console.log("sendBFSactions res", res)
  return res.data;
}