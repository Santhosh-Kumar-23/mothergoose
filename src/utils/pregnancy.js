import React from "react";
import { Image } from "react-native"
import w8 from "../../assets/baby-size-image/8w.png";
import w10 from "../../assets/baby-size-image/10w.png";
import w12 from "../../assets/baby-size-image/12w.png";
import w14 from "../../assets/baby-size-image/14w.png";
import w16 from "../../assets/baby-size-image/16w.png";
import w18 from "../../assets/baby-size-image/18w.png";
import w20 from "../../assets/baby-size-image/20w.png";
import w22 from "../../assets/baby-size-image/22w.png";
import w26 from "../../assets/baby-size-image/26w.png";
import w28 from "../../assets/baby-size-image/28w.png";
import w30 from "../../assets/baby-size-image/30w.png";
import w32 from "../../assets/baby-size-image/32w.png";
import w34 from "../../assets/baby-size-image/34w.png";
import w36 from "../../assets/baby-size-image/36w.png";
import w38 from "../../assets/baby-size-image/38w.png";
import w40 from "../../assets/baby-size-image/40w.png";
import BloodPressureIcon from "../../assets/svgs/BloodPressureIcon.svg";
import ContractionCounterIcon from "../../assets/svgs/ContractionCounterIcon.svg";
import KickCounterIcon from "../../assets/svgs/KickCounterIcon.svg";
import WeightIcon from "../../assets/svgs/WeightIcon.svg";
import moment from "moment";
import _ from "lodash";
import { FakeHNCData } from "../fakeData";

export const HIGH_BLOOD_PRESSURE_ARTICLE =
  "HIGH BLOOD PRESSURE DURING PREGNANCY";
const WEIGHT_GAIN_DURING_PREGNANCY = "Weight Gain During Pregnancy";

/**
 * Get amount of days a patient is being pregnnat
 * and return it into a week and days format (e.g 1 week 4 days).
 * @param {integer} gestational_age_in_days - Amount of days a patient is being pregnant.
 */
export const formatGestionalAgeToWeeksDays = (
  gestational_age_in_days,
  format = "string"
) => {
  const weeks = Math.floor(gestational_age_in_days / 7);
  let days = gestational_age_in_days % 7;
  let daysText = "";

  /** return weeks in number format */
  if (format === "number") return Number(weeks);

  if (days >= 1) {
    daysText = `${days} day`;
  }
  if (days > 1) {
    daysText = `${daysText}s`;
  }

  return `${weeks} week${weeks > 1 ? "s" : ""} ${daysText}`;
};

/**
 * Gets baby size details and return them as an object.
 * @param {string} monthText - "Baby month text"
 * @param {string} weightText - "Baby weight in text form"
 * @param {string} heightText - ""Baby height in text form"
 */
export const babySizeObject = (monthText, weightText, heightText) => {
  return { monthText, weightText, heightText };
};

/**
 * List baby size details, each item returns baby an
 * object for baby size details.
 */
export const babySizeDetailsList = [
  babySizeObject("first", "1⁄4 inch", "less than 1 ounce"),
  babySizeObject("second", "1 inch", "less than 1⁄4 ounce"),
  babySizeObject("third", "2 1⁄2 to 3 inches", "about 1 ounce"),
  babySizeObject("fourth", "6 to 7 inches", "about 4 to 5 ounces"),
  babySizeObject("fifth", "10 inches", "about 1⁄2 to 1 pound"),
  babySizeObject("sixth", "12 inches", "about 1 1⁄2 to 2 pounds"),
  babySizeObject("seventh", "15 to 16 inches", "about 2 1⁄2 to 3 pounds"),
  babySizeObject("eight", "18 to 19 inches", "4 to 5 pounds"),
  babySizeObject("ninth", "19 to 21 inches", "6 to 9 pounds"),
];
/**
 * Get baby size details based on
 * which month the pregnancy is in.
 */
export const getPregnancyMonth = (gestational_age) => {
  if (gestational_age <= 30) return 1;
  else if ((gestational_age > 30) & (gestational_age <= 60)) return 2;
  else if ((gestational_age > 60) & (gestational_age <= 90)) return 3;
  else if ((gestational_age > 90) & (gestational_age <= 120)) return 4;
  else if ((gestational_age > 120) & (gestational_age <= 150)) return 5;
  else if ((gestational_age > 150) & (gestational_age <= 180)) return 6;
  else if ((gestational_age > 180) & (gestational_age <= 210)) return 7;
  else if ((gestational_age > 210) & (gestational_age <= 240)) return 8;
  else if ((gestational_age > 240) & (gestational_age <= 270)) return 9;
  else return 9
};

/**
 * Patient baby details for every month (1-9)
 * TODO: move this into contentful at some point
 */
export const patientBabyDetailsList = [
  [
    `Tiny limb buds appear. These grow into you baby's arm legs.`,
    `Your baby’s heart and lungs begin to form. By the 22nd day, your baby’s heart starts to beat.`,
    `Your baby’s neural tube begins to form. This becomes the brain and spinal cord.`,
  ],

  [
    `Your baby’s major body organs, like the brain, heart and lungs, are forming.`,
    `The placenta grows in your uterus and supplies your baby with food and oxygen through the umbilical cord throughout pregnancy. But
you can pass bad things, like cigarette smoke, alcohol and drugs, through the placenta,
too. So don’t smoke, drink alcohol, use street drugs or abuse prescription drugs when you’re pregnant.`,
    `Your baby’s ears, ankles, wrists, fingers and toes are formed. Eyelids form and grow but are sealed shut.`,
  ],
  [
    `Your baby’s fingernails and toenails are formed.`,
    `Your baby’s mouth has 20 buds that grow into baby teeth.`,
    `Fine hairs begin to form on your baby’s skin.`,
    `You can hear your baby’s heartbeat for the first time. Ask your provider to let you listen.`,
  ],
  [
    `Your baby moves, kicks and swallows.`,
    `Your baby’s skin is pink and see-through.`,
    `The placenta is still providing food for the baby. But you also can pass along bad things, like cigarette smoke, alcohol and drugs, to your baby. Don’t smoke, drink alcohol, use street drugs or abuse prescription drugs when you’re pregnant.`,
  ],
  [
    `Your baby is active. They can turn from side to side and sometimes head over heels.`,
    `Your baby goes to sleep and wakes up.`,
    `Your baby grows a lot this month.`,
  ],
  [
    `Your baby’s skin is red and wrinkled. It’s covered with fine, soft hair.`,
    `Your baby can kick strongly now.`,
    `Your baby’s eyes are almost completely formed.`,
  ],
  [
    `Your baby can open and close their eyes and suck their thumb.`,
    `Your baby kicks and stretches.`,
    `Your baby responds to light and sound.`,
  ],
  [
    `You may see the shape of your baby’s elbow or heel against your belly. Tell your provider if you notice any change in how often your baby moves, especially if they move less often.`,
    `Your baby’s fingernails have grown to the tips of their fingers.`,
    `Your baby’s brain and lungs are still developing.`,
  ],
  [
    `Your baby’s lungs are ready to work on their own.`,
    `Your baby gains about 1⁄2 pound a week.`,
    `Your baby moves to a head-down position.`,
  ],
];

/**
 * Patient body details for every month (1-9)
 * TODO: move this into contentful at some point
 */
export const patientBodyDetailsList = [
  [
    `Your body is making lots of hormones that help your baby grow. Hormones can make you feel moody or cranky.`,
    `Your breasts may get bigger. They may hurt and tingle.`,
    `You may have morning sickness (also called nausea and vomiting of pregnancy or NVP). Try eating crackers and smaller meals.`,
    `You may crave some foods.`,
    `You may feel tired. Rest when you can.`,
  ],
  [
    `Your breasts may still be sore and are getting bigger. Your nipples and the area around them begin to get dark.`,
    `You may have to go to the bathroom more often.`,
    `You may still have morning sickness.`,
    `You may feel tired and need to rest more often.`,
    `Your body makes more blood.`,
  ],
  [
    `You may still feel tired and have morning sickness. For most women, morning sickness is mild and goes away during the first trimester. But if you’re losing weight and can’t keep food or drink down, tell your provider. You may
get medicine prescribed to help relieve your morning sickness.`,
    `You may have headaches and get lightheaded or dizzy. Talk to your provider before you take any medicine for a headache.`,
    `You may have gained 2 to 4 pounds by now. Your clothes may begin to feel tight.`,
  ],
  [
    `You may be more hungry and have more energy as your morning sickness goes away. If you still have morning sickness, tell your provider.`,
    `Near the end of this month, you may feel your baby move for the first time.`,
    `You gain about 1 pound a week. Your belly begins to show. You may need to wear maternity clothes and bigger bras now.`,
    `It’s OK for you and your partner to have sex if you want. It won’t hurt the baby.`,
  ],
  [
    `If you don’t feel your baby move this month, tell your provider.`,
    `Your heart beats faster.`,
    `You may need 8 or more hours of sleep each night. During the day, rest and take breaks if you can. Don’t push yourself.`,
  ],
  [
    `The skin on your belly may itch. You may see stretch marks. Use lotion and wear loose clothes.`,
    `Your back may hurt. Don’t stand for long periods of time. And don’t lift heavy things.`,
    `You may feel pain down the sides of your belly as your uterus gets bigger.`,
    `You may have constipation. Drink more water or fruit juice. Eat foods with fiber, like fruits and vegetables.`,
  ],
  [
    `Your ankles and feet may swell. Try lying down and putting your feet up. If your face and hands swell suddenly, call your provider.`,
    `You may get stretch marks on your belly and breasts as they get bigger.`,
    `You may have contractions. This is OK, but call your provider if you have more than five in 1 hour.`,
    `You may have trouble sleeping. You also may sweat more than usual.`,
  ],
  [
    `You may feel stronger contractions this month.`,
    `Colostrum may leak from your breasts. This is fluid that comes out of your breasts before your milk comes in.`,
    `You may have trouble breathing as the baby pushes on your lungs. Slow down and try to sit and stand up straight.`,
    `Your baby may crowd your stomach. Try eating four of five smaller meals during the day, instead of three larger ones.`,
    `You may gain 1 pound a week this month.`,
  ],
  [
    `Your belly button may stick out.`,
    `Your breathing gets easier once the baby moves down. But you may need to go to the bathroom more often because the baby is pressing on your bladder.`,
    `You should feel your baby kicking and moving right up until you give birth. Tell your provider if you notice any change in how often your baby moves.`,
    `You may be uncomfortable because of the pressure and the weight of the baby. Rest often.`,
    `Your feet and ankles may swell. Put your feet up. Try to stay in a cool place.`,
    `Your cervix opens up (dilates) and thins out (effaces) as it prepares for birth.`,
    `You may not gain any weight this month. You may even lose 1 or 2 pounds.`,
  ],
];

/**
 * Prenantal care details for every month (1-9)
 * TODO: to move this into contentful at some point
 */
export const prenatalCareDetailsList = [
  [
    `Call your health care provider as soon as you think you’re pregnant.`,
    `Take a multivitamin with 400 micrograms of folic acid in it each day. Your provider can switch you to a prenatal vitamin with more folic acid in it at your first prenatal care checkup.`,
  ],
  [
    {
      title: `At your first checkup, talk to your provider about:`,
      content: [
        `• Health conditions you have, like diabetes or high blood pressure.`,
        `• Taking a prenatal vitamin that has 600 micrograms of folic acid in it.`,
        `• Drugs and medicines you take.`,
        `• How much weight you should gain during pregnancy.`,
      ],
    },
  ],
  [
    `Go for one prenatal checkup this month.`,
    `Talk to your provider about prenatal tests. These are medical tests you get during pregnancy. They help your provider find out how you and your baby are doing. Talk to your provider about which tests are right for you.`,
  ],
  [
    `Go for one prenatal checkup this month.`,
    `You may get an ultrasound this month, if you haven’t already had one. You may want to bring your partner to this checkup so you can share in this special moment together. If you want, you can find out if your baby is a boy or girl.`,
    `Your provider may tell you to take an iron supplement to help prevent anemia. Anemia is when your body does not have enough red blood cells. This is common in pregnancy.`,
  ],
  [
    `Go for one prenatal checkup this month.`,
    `Eat healthy foods and do something active every day.`,
    `Take your prenatal vitamin each day.`,
    `Quit smoking, drinking alcohol, using street drugs and abusing prescription drugs. Tell your provider if you need help to quit.`,
  ],
  [
    `Go for one prenatal checkup this month.`,
    `You get a glucose screening test at 24 to 28 weeks of pregnancy. This test checks to see if you’ve developed gestational diabetes. This is diabetes that can happen during pregnancy. It can be treated to help protect you and your baby.`,
    `Ask your provider about childbirth classes. These are classes for you and your partner to learn about what happens during labor and birth.`,
  ],
  [
    `Go to two prenatal checkups this month.`,
    {
      title: `• Learn the signs of preterm labor. Preterm labor is labor that starts too early, before 37 weeks of pregnancy. Call your provider if you have even one of these signs:`,
      content: [
        `— Contractions that make your belly tighten like a fist every 10 minutes or more often.`,
        `— Change in the color of your discharge or bleeding from your vagina.`,
        `— The feeling that your baby is pushing down. This is called pelvic pressure.`,
        `— Low, dull backache.`,
        `— Cramps that feel like your period.`,
        `— Belly cramps with or without diarrhea.`,
      ],
    },
  ],
  [
    `Go for two prenatal checkups this month.`,
    `At 35 to 37 weeks of pregnancy you get a test for Group B strep, an infection you can pass to your baby during birth. If you have it, you can get medicine during labor and birth to protect your baby.`,
    `Talk to your provider about breastfeeding. Breastmilk is the best food for your baby.`,
    `Ask your provider about newborn screening. These are tests that your baby gets before he leaves the hospital that look for rare but serious and mostly treatable health conditions. All states require babies to have newborn screening.`,
  ],
  [
    `Get a prenatal checkup once a week this month.`,
    `Call your provider as soon as you think you’re in labor.`,
  ],
];

export const getBabySizeImage = (week) => {
  const baby_size_images = {
    8: w8,
    10: w10,
    12: w12,
    14: w14,
    16: w16,
    18: w18,
    20: w20,
    22: w22,
    26: w26,
    28: w28,
    30: w30,
    32: w32,
    34: w34,
    36: w36,
    38: w38,
    40: w40,
  };
  let image = baby_size_images[week];

  /**
   * If image not found for current week then
   * get image for last week for which baby size
   * image exists.
   */
  if (!image) {
    let index = week;

    while (index > 0) {
      if (baby_size_images[index]) {
        image = baby_size_images[index];
        break;
      }
      index--;
    }
  }

  return image;
};

/**
 * Find pre pregenancy weight for patient
 * @param {*} userQuestionAnswer - List of all questions that user answered
 * @param {*} surveyAnswers - List of all possible answers for surveys
 */
export const getPrePregnancyWeight = (userQuestionAnswer, surveyAnswers) => {
  let weight = "";
  weight = _.find(userQuestionAnswer, { attributes: { question_id: 6 } });
  if (_.isEmpty(weight)) {
    weight = _.find(userQuestionAnswer, { attributes: { question_id: 50 } });
  }
  if (!_.isEmpty(weight)) {
    let answer = _.find(surveyAnswers, {
      id: `${weight?.attributes?.answer_ids[0]}`,
    });

    weight = parseInt(weight?.attributes?.user_inputs[0]);

    if (answer?.attributes?.label === "Kilos") {
      weight = Math.round(weight * 2.2);
    }

    weight = `${weight} lbs`;
  }
  return weight;
};

/**
 * Returned mapped array that returns object array of all
 * visit and vitals for each visit (weoght, blood pressure).
 * @param {array} userVisitVitals - Vitals for all user visits
 */
export const get_user_vitals = (userVisitVitals = [], deviceType = "", HNC_Vitals = []) => {
  /**
   * TODO: add blood pressure info in this data
   * when client approves that feature.
   * */

  // console.log("pregnancy HNC_Vitals", deviceType, HNC_Vitals)
  // console.log("userVisitVitals", userVisitVitals)

  const sorted_visits_vitals = userVisitVitals?.data?.sort(
    (a, b) => a.id - b.id
  );
  // console.log("--> sorted_visits_vitals", sorted_visits_vitals)

  let vitals = [];

  // // console.log("****************************************")
  sorted_visits_vitals?.forEach((visit_vital) => {
    const { visit_id, vital_id } = visit_vital?.attributes;
    // // console.log("--> visit_id, vital_id", visit_id, vital_id)
    if (visit_id && vital_id) {
      const vital = _.find(userVisitVitals?.included, {
        type: "vital",
        id: `${vital_id}`,
      });
      // // console.log("--> vital", vital)
      const visit = _.find(userVisitVitals?.included, {
        type: "visit",
        id: `${visit_id}`,
      });
      // // console.log("--> visit", visit)
      // // console.log("---------------------------------------------------")
      if (vital.attributes?.weight_in_pounds) {
        vitals.push({
          vital_weight: vital.attributes?.weight_in_pounds,
          blood_pressure_systolic: vital.attributes?.blood_pressure?.split("/")[0] || 0,
          blood_pressure_diastolic: vital.attributes?.blood_pressure?.split("/")[1] || 0,
          visit_date: visit.attributes?.visit_time,
        });
        // vitals = vitals?.sort(function compare(a, b) {
        //   var dateA = new Date(a.visit_date);
        //   var dateB = new Date(b.visit_date);
        //   return dateA - dateB;
        // });
      }
    }
  });

  if (deviceType == "BP" && HNC_Vitals.length) {

    HNC_Vitals.map((item) => {
      if (item.device_type) {
        if (((item.device_type).toLowerCase() == "blood pressure" || (item.device_type).toLowerCase() == "bp") && item?.val1 != null && item?.val2 != null && item?.rec_date != null) {
          vitals.push({
            vital_weight: null,
            blood_pressure_systolic: item?.val2 || 0,
            blood_pressure_diastolic: item?.val1 || 0,
            visit_date: item?.rec_date
          });
        }
      }
    })
  } else if (deviceType == "Weight" && HNC_Vitals.length) {
    HNC_Vitals.map((item) => {
      if (item.device_type) {
        if (item.device_type == "Weight" && item?.val1 != null && item?.rec_date != null) {
          vitals.push({
            vital_weight: Number(item?.val1) || 0,
            blood_pressure_systolic: null,
            blood_pressure_diastolic: null,
            visit_date: item?.rec_date
          });
        }
      }

    })
  }

  const sorted_vitals = vitals.sort(
    (a, b) => new Date(a.visit_date) - new Date(b.visit_date)
  );

  // console.log("over all sorted_vitals to show on graph", sorted_vitals)
  return vitals;
};

/**
 * Return latest user weight by vitals data
 * @param {array} userVisitVitals - Vitals for all user visits
 */
export const getUserWeightByVitals = (userVisitVitals = [], deviceType = "", HNC_Vitals) => {
  const vitals = get_user_vitals(userVisitVitals, deviceType, HNC_Vitals);
  const weight = vitals[vitals?.length - 1]?.vital_weight || "";
  return weight && weight + " lbs";
  // it return the current wight
};

/**
 * Return latest user bp by vitals data
 * @param {array} userVisitVitals - Vitals for all user visits
 */
export const getUserBloodPressureByVitals = (userVisitVitals = [], deviceType = "", HNC_Vitals) => {
  const vitals = get_user_vitals(userVisitVitals, deviceType, HNC_Vitals);
  const latest_vital = vitals[vitals?.length - 1];
  const systolic = latest_vital?.blood_pressure_systolic || "";
  const diastolic = latest_vital?.blood_pressure_diastolic || "";
  return systolic ? `${systolic}/${diastolic}` : "";
  // it return the current BP rate
};

export const getVitalCards = (
  userVisitVitals = [],
  prePregnancyWeight,
  educationArticles,
  HNC_Vitals = [],
  CounterVitailsData,
  gestational_age
) => {
  const highBloodPressure = _.find(educationArticles, {
    title: HIGH_BLOOD_PRESSURE_ARTICLE,
  });
  const pregnancy = _.find(educationArticles, {
    title: WEIGHT_GAIN_DURING_PREGNANCY,
  });
  const currentWeight = getUserWeightByVitals(userVisitVitals, "Weight", HNC_Vitals) || prePregnancyWeight;
  const currentBloodPressure = getUserBloodPressureByVitals(userVisitVitals, "BP", HNC_Vitals);


  var bodyOFkickcounter = ((CounterVitailsData?.todayKicksCount == 10 && CounterVitailsData?.todayKicksDone == true) ? "Completed Today's" : (CounterVitailsData?.todayKicksCount > 0 ? CounterVitailsData?.todayKicksCount + "/10 counts" : ""))
  var bodyOFcontract = ""

  return [
    {
      title: "Blood Pressure",
      body: currentBloodPressure,
      icon: (
        <BloodPressureIcon
          height={80}
          width={80}
          style={{ borderRadius: 40, overflow: "hidden" }}
        />
        // <Image source={require(BloodPressureIcon)} style={{ height: 80, width: 80, borderRadius: 80 / 2 }} />
      ),
      article: highBloodPressure,
    },
    {
      title: "Weight",
      body: currentWeight,
      icon: (
        <WeightIcon
          height={80}
          width={80}
          style={{ borderRadius: 40, overflow: "hidden" }}
        />
      ),
      article: pregnancy,
    },
    {
      title: "Kick Counter",
      body: bodyOFkickcounter,
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
      body: bodyOFcontract,
      icon: (
        <ContractionCounterIcon
          height={80}
          width={80}
          style={{ borderRadius: 40, overflow: "hidden" }}
        />
      ),
    },
  ];
};

export const getVitalGraphMonthLabels = (visit_dates = []) => {

  const dates = [];

  visit_dates.map((val) => {
    var d = moment(val)
    // dates.push(d.format("DD-MMM-YYYY"));
    dates.push(d.format("MMM-D"));
  })

  // const dateStart = moment(visit_dates[0]);
  // const dateEnd = moment(visit_dates[visit_dates.length - 1]);

  // while (dateEnd >= dateStart) {
  //   dates.push(dateStart.format("MMM-YYYY"));
  //   dateStart.add(1, "month");
  // }

  return dates;
};
