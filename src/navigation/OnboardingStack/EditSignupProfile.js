import React, { useContext } from "react";
import OnboardingFormTemplate from "../../components/OnboardingFormTemplate";
import { months } from "../../fakeData";
import { nameWithHyphensRegex } from "../../utils/validations";
import { AppContext } from "../../context";

export default function EditSignupProfile({ navigation }) {
  const { user, setUser } = useContext(AppContext);
  const { date_of_birth } = user;

  const year = parseInt(date_of_birth?.slice(0, 4));
  const month = parseInt(date_of_birth?.slice(5, 7)) - 1;
  const day = parseInt(date_of_birth?.slice(8));

  const inputValues = [
    {
      name: "first_name",
      defaultValue: user.first_name,
      placeholder: "First Name",
      type: "text",
      validation: {
        required: { value: true, message: "First Name is required" },
        validate: (val) =>
          nameWithHyphensRegex.test(val ? val.trim() : val) ||
          "Not a valid format",
      },
    },
    {
      name: "last_name",
      defaultValue: user.last_name,
      placeholder: "Last Name",
      type: "text",
      validation: {
        required: { value: true, message: "Last Name is required" },
        validate: (val) =>
          nameWithHyphensRegex.test(val ? val.trim() : val) ||
          "Not a valid format",
      },
    },
    {
      name: "month",
      placeholder: "Last Name",
      type: "dropdown",
      selections: months,
      defaultValue: months[month],
    },
    {
      name: "day",
      placeholder: "Last Name",
      type: "dropdown",
      selections: [
        { label: 1 },
        { label: 2 },
        { label: 3 },
        { label: 4 },
        { label: 5 },
        { label: 6 },
        { label: 7 },
        { label: 8 },
        { label: 9 },
        { label: 10 },
        { label: 11 },
        { label: 12 },
        { label: 13 },
        { label: 14 },
        { label: 15 },
        { label: 16 },
        { label: 17 },
        { label: 18 },
        { label: 19 },
        { label: 20 },
        { label: 21 },
        { label: 22 },
        { label: 23 },
        { label: 24 },
        { label: 25 },
        { label: 26 },
        { label: 27 },
        { label: 28 },
        { label: 29 },
        { label: 30 },
        { label: 31 },
      ],
      defaultValue: { label: day },
    },
    {
      name: "year",
      placeholder: "Last Name",
      type: "dropdown",
      selections: getYears(),
      defaultValue: { label: year },
    },
  ];

  return (
    <OnboardingFormTemplate
      body={[
        "Well done! Your account is created!",
        "\n",
        "Now let’s set up your profile.",
      ]}
      header="Please confirm your information"
      buttonText="Continue"
      handleInput={(data) => {
        const { day, month, year, first_name, last_name } = data;
        const date_of_birth = `${year.label}-${month.id}-${day.label}`;
        setUser({ ...user, date_of_birth, first_name, last_name });
        navigation.goBack();
      }}
      navigation={navigation}
      subLink="We are here"
      subLinkText="Need help"
      type="editprofile"
      inputValues={inputValues}
    />
  );
}

const getYears = (startYear) => {
  const currentYear = new Date().getFullYear(),
    years = [];
  startYear = startYear || 1980;
  while (startYear <= currentYear) {
    years.push({ label: startYear++ });
  }
  return years;
};

export const getDaysInMonth = (month, year) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

// const styles = StyleSheet.create({});
