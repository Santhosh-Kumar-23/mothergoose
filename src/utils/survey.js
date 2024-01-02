export const none_of_above = "None of the above";
export const not_at_all = "Not at all";
export const not_sure = "I am not sure";
export const not_to_answer = "I choose not to answer this question";
export const none = "None";
export const dont_know = "I don't know";
export const other = "Other";
export const text = "Text";
export const no = "No";

const RISKSURVEYTYPE = "risk_survey";
const DEPRESSIONSURVEYTYPE = "depression_survey";

export const POSITIVE = "positive";
export const NEGATIVE = "negative";

export const epds_survey_reminders_data = [
  {
    survey_id: 3,
    title: "Postpartum Depression Screening",
    survey_screen_title: "EPDS Depression Survey",
    body: "Brief Postpartum Screening Questionnaire",
    link: "Survey",
    type: DEPRESSIONSURVEYTYPE,
  },
];

export const risk_survey_reminders_data = [
  {
    survey_id: 1,
    title: "Finish Risk Survey",
    survey_screen_title: "Pregnancy Risk Survey",
    body: "This helps us personalize your journey",
    link: "Survey",
    type: RISKSURVEYTYPE,
  },
];

export const depression_survey_reminders_data = [
  {
    survey_id: 2,
    title: "1st Trimester Depression Screening",
    survey_screen_title: "Pregnancy Depression Survey",
    body: "Brief Depression Screening Questionnaire",
    link: "Survey",
    type: DEPRESSIONSURVEYTYPE,
    survey_number: 1,
  },
  {
    survey_id: 2,
    title: "2nd Trimester Depression Screening",
    survey_screen_title: "Pregnancy Depression Survey",
    body: "Brief Depression Screening Questionnaire",
    link: "Survey",
    type: DEPRESSIONSURVEYTYPE,
    survey_number: 2,
  },
  {
    survey_id: 2,
    title: "3rd Trimester Depression Screening",
    survey_screen_title: "Pregnancy Depression Survey",
    body: "Brief Depression Screening Questionnaire",
    link: "Survey",
    type: DEPRESSIONSURVEYTYPE,
    survey_number: 3,
  },
];
