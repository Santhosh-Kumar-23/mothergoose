import moment from "moment";
import { getContentfulPrivacyPages } from "../api/contentful";
import { months } from "../fakeData";
import _ from "lodash";
import jwt_decode from "jwt-decode";

export const getNextPage = (item, questions) => {
  const question = questions.find((q) => q.id === `${item.question_id}`);

  return parseInt(question?.attributes?.order) - 1;
};

export const getBirthday = (DOB) => {
  if (!DOB) {
    return;
  }
  const year = DOB.slice(0, 4);
  let month = parseInt(DOB.slice(5, 7));
  month = months[month - 1]?.label;
  const day = parseInt(DOB.slice(8));

  return `${month} ${day}, ${year}`;
};

const getTimeStamp = (date) => {
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let hours = date.getHours();
  let isAM;
  if (hours > 12) {
    hours = hours - 12;
    isAM = false;
  } else if (hours === 12) {
    isAM = false;
  } else {
    isAM = true;
  }

  const end = isAM ? "AM" : "PM";

  return `${hours}:${minutes} ${end}`;
};

export const parseAppointmentDate = (startDate, endDate) => {
  if (!startDate) {
    return;
  }

  const day = startDate.getDate();
  let month = startDate.getMonth();
  month = months[month]?.label;

  const time = endDate
    ? getTimeStamp(startDate) + " - " + getTimeStamp(endDate)
    : getTimeStamp(startDate);

  const date = `${month} ${day}`;

  return { date, time };
};

export const getTimeOfDay = () => {
  const dateObj = new Date();
  const currentHours = dateObj.getHours();

  if (currentHours < 12) {
    return "Morning";
  } else if (currentHours < 17) {
    return "Afternoon";
  } else {
    return "Evening";
  }
};

/**
 * Convert Date in format MM/DD/YYYY.
 * Approach helps to receive date exactly it is
 * without months/days being shown less than actual.
 * @param {String} date
 */
export const dateInFormatMMDDYYY = (date) => {
  if ((date.includes("T")) == false) {
    date = date + "T00:00:00.000Z"
  }
  return moment(moment(date).toISOString().substring(0, 10)).format(
    "MM/DD/YYYY"
  );
};

export const getPrivacyPages = async (is_onboarding = false) => {
  const res = await getContentfulPrivacyPages();
  let pages = res?.items.map((page) => Object.assign(page.fields, { "id": page.sys.id }));

  pages = pages.filter((page) => page?.onboarding === is_onboarding);
  return _.orderBy(pages, "title", "asc");
};

/**
 * Check JWT token expiration
 * @param {string} token JWT token
 */
export const is_jwt_token_expired = (token) => {
  if (!token) return false;
  const decodedJwt = jwt_decode(token);
  return decodedJwt?.exp * 1000 < Date.now();
};
