import fakeArticle from "../../assets/fakeArticle.png";
import BloodPressureIcon from "../../assets/svgs/BloodPressureIcon.svg";
import ContractionCounterIcon from "../../assets/svgs/ContractionCounterIcon.svg";
import KickCounterIcon from "../../assets/svgs/KickCounterIcon.svg";
import FakeLogo2 from "../../assets/svgs/fakeLogo2.svg";
import WeightIcon from "../../assets/svgs/WeightIcon.svg";
import fakeAvatar from "../../assets/fakeAvatar.png";
import fakeNurse from "../../assets/fakeNurse.png";
import fakePatrickBoye from "../../assets/fakePatrickBoye.png";
import fakeEricMoore from "../../assets/fakeEricMoore.png";
import WeightScreenArticle from "../../assets/WeightScreenArticle.png";
import fakeCareManager from "../../assets/fakeCareManager.png";
import BloodPressureArticleImage from "../../assets/BloodPressureArticleImage.png";

import React from "react";
import { View } from "react-native";
import AppText from "../components/AppText";
import { COLORS } from "../utils/styles";

export const reminders = [
  {
    id: 2,
    title: "You have an appointment today",
    body: "Please check your appointments for details",
    link: "Appointments",
    type: "Appointment",
  }
];

export const BetaFeedback = {
  id: 3,
  title: "Feedback",
  body: "Help improve our app for you and other pregnant women",
  url: "https://www.surveymonkey.com/r/mothergoosefeedback",
}

export const articleReminders = [
  {
    id: 4,
    title: "Recommended Educational MaterialS",
    body: "Read your suggested articles",
    link: "Education Modules",
    type: "Article",
  }
];


export const allReminders = {
  todos: [
    {
      id: 3,
      title: "Water Tracker",
      body: "Enter your water intake for today",
    },
    {
      id: 4,
      title: "Blood Pressure",
      body: "Enter today's blood pressure",
    },
    {
      id: 5,
      title: "Body Weight",
      body: "Enter today's body weight",
    },
    {
      id: 6,
      title: "Kick Counter",
      body: "Track your baby activity",
    },
  ],
  urgent: [
    {
      id: 1,
      title: "Finish Risk Survey",
      body: "This helps us personalize your journey",
      link: "Survey",
      type: "Survey",
    },
  ],
  appts: [
    {
      id: 2,
      date: "May 04",
      time: "10:30 AM - 11:30 AM",
      address: "200 1st St SW, Rochester, MN 55905",
      doctor_id: 1,
    },
  ],
};

export const appointments = [
  {
    id: 3,
    date: "June 10",
    time: "9:30 AM - 10:00 AM",
    address: "200 1st St SW, Rochester, MN 55905",
    upcoming: true,
    doctor_id: 1,
  },
  {
    id: 2,
    date: "Aug 12",
    time: "11 AM - 11:45 AM",
    address: "200 1st St SW, Rochester, MN 55905",
    upcoming: true,
    doctor_id: 2,
  },
  {
    id: 11,
    date: "Oct 05",
    time: "1:15 PM - 2:00 PM",
    address: "200 1st St SW, Rochester, MN 55905",
    upcoming: true,
    doctor_id: 1,
  },
  {
    id: 5,
    date: "Dec 17",
    time: "11:30 AM - 1:00 PM",
    address: "200 1st St SW, Rochester, MN 55905",
    upcoming: true,
    doctor_id: 1,
  },
  {
    id: 6,
    date: "Mar 09",
    time: "9:30 AM - 10:00 AM",
    address: "200 1st St SW, Rochester, MN 55905",
    upcoming: false,
    doctor_id: 2,
  },
  {
    id: 7,
    date: "Apr 10",
    time: "11 AM - 11:45 AM",
    address: "200 1st St SW, Rochester, MN 55905",
    upcoming: false,
    doctor_id: 1,
  },
  {
    id: 8,
    date: "May 02",
    time: "1:15 PM - 2:00 PM",
    address: "200 1st St SW, Rochester, MN 55905",
    upcoming: false,
    doctor_id: 2,
  },
  {
    id: 1,
    date: "May 04",
    time: "10:30 AM - 11:30 AM",
    address: "200 1st St SW, Rochester, MN 55905",
    upcoming: false,
    doctor_id: 1,
  },
];

export const apptDetails = [
  {
    id: 1,
    name: "Natalie Smoak, MD",
    bio: [
      "Dr. Natalie Smoak is an obstetrician and gynecologist (OB-GYN). She is certified by the American Board of Obstetrics and Gynecology. Dr. Smoak is a member of the American Congress of Obstetricians and Gynecologists, the Psi Chi International Honor Society in Psychology, and the New York Gynecological Society (Vice President). Dr. Smoak earned her Bachelor’s degree at Colgate University in Hamilton, NY. ",
      "She studied medicine at New York University before completing her residency in obstetrics and gynecology at Columbia Presbyterian Medical Center. Women trust Dr. Smoak to perform a number of services. Some of these include HPV managment and treatment, evaluation and management of cervical lesions, high & low risk pregnancy, contraceptive management, and many others. Dr. Smoak enjoys yoga, swimming, hiking, tennis, and cooking.",
    ],
    specialty: "OB-GYN",
  },
  {
    id: 2,
    name: "Steven Smith, MD",
    bio: [
      "Dr. Steven Smith is an obstetrician and gynecologist (OB-GYN). He is certified by the American Board of Obstetrics and Gynecology. Dr. Smith is a member of the American Congress of Obstetricians and Gynecologists, the Psi Chi International Honor Society in Psychology, and the New York Gynecological Society (Vice President). Dr. Smith earned his Bachelor’s degree at Colgate University in Hamilton, NY.",
      "He studied medicine at New York University before completing his residency in obstetrics and gynecology at Columbia Presbyterian Medical Center. Women trust Dr. Smith to perform a number of services. Some of these include HPV managment and treatment, evaluation and management of cervical lesions, high & low risk pregnancy, contraceptive management, and many others. Dr. Smith enjoys yoga, swimming, hiking, tennis, and cooking.",
    ],
    specialty: "OB-GYN",
  },
];

export const fakeUser = {
  first_name: "Emma",
  last_name: "Smith",
  id: 1,
  _id: "143567",
  email: "emma@example.com",
  mobile_number: "1-555-555-5555",
  daysRemaining: 95,
  pregnancyWeeks: 26,
  pregnancyDays: 3,
  date_of_birth: "September 19, 1993",
  firstPregnancy: true,
  dueDate: new Date(2021, 8, 8),
  pregnantWith: 1,
  pregnancyMethod: "Natural",
  height: `5'4`,
  prePregnancyWeight: 118,
  image: fakeAvatar,
};

export const fakeInsurance = {
  company: "One Medical",
  memberId: "639539",
  groupId: "3903993",
};

export const fakeArticles = [
  {
    id: 1,
    title: "Second Trimester",
    subtitle: "What to expect in the first few weeks",
    image: fakeArticle,
  },
  {
    id: 2,
    title: "Article 2",
    subtitle: "Placeholder for the subtitle",
    image: fakeArticle,
  },
  {
    id: 3,
    title: "Article 3",
    subtitle: "Placeholder for the subtitle",
    image: fakeArticle,
  },
  {
    id: 4,
    title: "Article 4",
    subtitle: "Placeholder for the subtitle",
    image: fakeArticle,
  },
  {
    id: 5,
    title: "Article 5",
    subtitle: "Placeholder for the subtitle",
    image: fakeArticle,
  },
];

export const weightScreenArticle = {
  id: 6,
  title: "Weight Gain During Pregnancy",
  subtitle:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam accumsan vel risus sollicitudin ullamcorper ...",
  image: WeightScreenArticle,
};

export const bloodPressureScreenArticle = {
  id: 7,
  title: "About My Blood Pressure",
  subtitle:
    "Blood pressure is the amount of force exerted by the blood against the walls of the arteries...",
  image: BloodPressureArticleImage,
};

export const getWeeks = () => {
  const res = [];

  for (let i = 1; i < 40; i++) {
    res.push("Week " + i);
  }

  return res;
};

export const fakeBabyData = {
  size: 14,
  weight: 1.7,
  comparison: "coconut",
};

export const fakeVitals = [
  {
    title: "Blood Pressure",
    body: "Coming Soon",
    icon: (
      <BloodPressureIcon
        height={80}
        width={80}
        style={{ borderRadius: 40, overflow: "hidden" }}
      />
    ),
  },
  {
    title: "Weight",
    body: "",
    icon: (
      <WeightIcon
        height={80}
        width={80}
        style={{ borderRadius: 40, overflow: "hidden" }}
      />
    ),
  },
  {
    title: "Kick Counter",
    body: "Not logged yet",
    icon: (
      <KickCounterIcon
        height={80}
        width={80}
        style={{ borderRadius: 40, overflow: "hidden" }}
      />
    ),
  },
  {
    title: "Contraction Counter",
    body: "Not logged yet",
    icon: (
      <ContractionCounterIcon
        height={80}
        width={80}
        style={{ borderRadius: 40, overflow: "hidden" }}
      />
    ),
  },
];

export const fakeCareManagers = [
  {
    id: 1,
    email: "sivabala143@gmail.com",
    created_at: "2022-05-30T09:00:49.558Z",
    updated_at: "2022-05-30T09:00:49.558Z",
    first_name: null,
    last_name: null,
    care_manager_type: "Social worker",
    sendbird_group_key: null
  },
  {
    id: 2,
    email: "hchandranss@gmail.com",
    created_at: "2022-05-30T09:54:24.690Z",
    updated_at: "2022-05-30T09:54:24.690Z",
    first_name: null,
    last_name: null,
    care_manager_type: "Obstetrical Registered nurse",
    sendbird_group_key: null
  },
  {
    id: 3,
    email: "prasanna@yopmail.com",
    created_at: "2022-06-27T14:12:07.653Z",
    updated_at: "2022-06-27T14:12:07.653Z",
    first_name: "Prasanna",
    last_name: "Venkatesh",
    care_manager_type: "Social Worker",
    sendbird_group_key: ""
  }
]

const fakeMGTeam = [
  { name: "Theresa Park", title: "Nurse", avatar: fakeNurse, id: 1 },
  {
    name: "Sophia Jackson",
    title: "Care Manager",
    avatar: fakeCareManager,
    id: 2,
  },
  { name: "Patrick Boye", title: "Social", avatar: fakePatrickBoye, id: 3 },
  { name: "Eric Moore", title: "Placeholder", avatar: fakeEricMoore, id: 4 },
];

const fakeProviders = [
  {
    name: "Obstetrical Care Providers",
    title: "Physician Profile",
    icon: <FakeLogo2 height={40} width={40} />,
    phone: "+1 (213) 225-5668",
    email: "obsterical.care.providers@doctor.com",
    address: "393 South Rockville Street, San Francisco, CA 94112",
    id: 3,
    fax_number: "+1 (323) 555 1234",
    description: `Dr. Alan Stern was born in DuBois, Pennsylvania and is a graduate of Villanova University. He obtained his medical degree at Thomas Jefferson University in Philadelphia. His residency was at Thomas Jefferson and its affiliated Wills Eye Hospital, and he completed his training with fellowships at the University of Connecticut in cataract and corneal surgery.
      
Dr. Stern has thirty years’ experience in ophthalmic surgery, with special interest in cataract surgery, corneal transplantation, and laser refractive procedures. He is a founding member of Precision LASIK Group, Chief of Ophthalmology at The Hospital of Central Connecticut, and co-medical director of the Connecticut eye bank.
      
In addition to his surgical practice, he is on the board of Vision Health International, an organization providing eye care and surgery to indigent patients in Central and South America.`,
  },
];

export const fakeCareTeams = [
  {
    name: "Mother Goose Care Team",
    label: "Team Profile",
    team: fakeMGTeam,
    icon: (
      <View
        style={{
          height: 40,
          width: 40,
          borderRadius: 20,
          backgroundColor: COLORS.blueLogo,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AppText h3 semibold style={{ color: COLORS.white }}>
          MG
        </AppText>
      </View>
    ),
  },
  {
    name: "Obstetrical Care Providers",
    label: "Physician Profile",
    team: fakeProviders,
    icon: <FakeLogo2 height={40} width={40} />,
  },
];

export const termsConditions = `1.1. These Terms of Service (hereinafter referred to as "Terms") govern the “MotherGoose Health“ mobile application (referred to as “Mother Goose” or the "Mother Goose Health App") including all services provided through the Mother Goose Health App and the Mother Goose Health website https://mothergoosehealth.com/ ("Mother Goose Health Services"). 

The Mother Goose Health Services are operated at 90 Maiden Lane, Suite 300, New York, NY 10038.`;

export const months = [
  { label: "Jan", id: 1 },
  { label: "Feb", id: 2 },
  { label: "March", id: 3 },
  { label: "April", id: 4 },
  { label: "May", id: 5 },
  { label: "June", id: 6 },
  { label: "July", id: 7 },
  { label: "Aug", id: 8 },
  { label: "Sept", id: 9 },
  { label: "Oct", id: 10 },
  { label: "Nov", id: 11 },
  { label: "Dec", id: 12 },
];

export const FakeHNCData =
  [
    {
      "user_id": 53,
      "device_type": "Blood Pressure",
      "val1": "125", // systolic
      "val2": "95", // diastolic
      "val3": "90", // Pulse -- beats per minute
      "is_irregular": false,
      "rec_date": '2022-10-14T16:30:00.000Z'
    },
    {
      "user_id": 53,
      "device_type": "Blood Pressure",
      "val1": "155", // systolic
      "val2": "115", // diastolic
      "val3": "90", // Pulse -- beats per minute
      "is_irregular": false,
      "rec_date": '2023-01-14T16:30:00.000Z'
    },
    {
      "user_id": 53,
      "device_type": "Blood Pressure",
      "val1": "125", // systolic
      "val2": "95", // diastolic
      "val3": "90", // Pulse -- beats per minute
      "is_irregular": false,
      "rec_date": '2022-07-14T16:30:00.000Z'
    },

    {
      "user_id": 53,
      "device_type": "Weight",
      "val1": "155", // in pound
      "val2": null,
      "val3": null,
      "is_irregular": false,
      "rec_date": '2022-08-14T16:30:00.000Z'
    },
    {
      "user_id": 53,
      "device_type": "Weight",
      "val1": "150", // in pound
      "val2": null,
      "val3": null,
      "is_irregular": false,
      "rec_date": '2023-05-14T16:30:00.000Z'
    },
    {
      "user_id": 53,
      "device_type": "Weight",
      "val1": "149", // in pound
      "val2": null,
      "val3": null,
      "is_irregular": false,
      "rec_date": '2022-04-14T16:30:00.000Z'
    }
  ]