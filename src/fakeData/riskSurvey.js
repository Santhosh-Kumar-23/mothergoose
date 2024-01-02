export const surveyData = {
  data: {
    id: "1",
    type: "survey",
    attributes: {
      title: "Risk Survey",
      description: "This is a risk Survey",
      is_open: false,
    },
    relationships: {
      questions: {
        data: [
          {
            id: "1",
            type: "question",
          },
          {
            id: "2",
            type: "question",
          },
          {
            id: "3",
            type: "question",
          },
          {
            id: "4",
            type: "question",
          },
          {
            id: "5",
            type: "question",
          },
          {
            id: "6",
            type: "question",
          },
          {
            id: "7",
            type: "question",
          },
          {
            id: "8",
            type: "question",
          },
          {
            id: "9",
            type: "question",
          },
          {
            id: "10",
            type: "question",
          },
          {
            id: "11",
            type: "question",
          },
          {
            id: "12",
            type: "question",
          },
          {
            id: "13",
            type: "question",
          },
          {
            id: "14",
            type: "question",
          },
          {
            id: "15",
            type: "question",
          },
          {
            id: "16",
            type: "question",
          },
          {
            id: "17",
            type: "question",
          },
          {
            id: "18",
            type: "question",
          },
          {
            id: "19",
            type: "question",
          },
          {
            id: "20",
            type: "question",
          },
          {
            id: "21",
            type: "question",
          },
          {
            id: "22",
            type: "question",
          },
          {
            id: "23",
            type: "question",
          },
          {
            id: "24",
            type: "question",
          },
          {
            id: "25",
            type: "question",
          },
          {
            id: "26",
            type: "question",
          },
          {
            id: "27",
            type: "question",
          },
          {
            id: "28",
            type: "question",
          },
          {
            id: "29",
            type: "question",
          },
          {
            id: "30",
            type: "question",
          },
          {
            id: "31",
            type: "question",
          },
          {
            id: "32",
            type: "question",
          },
          {
            id: "33",
            type: "question",
          },
          {
            id: "34",
            type: "question",
          },
        ],
      },
    },
  },
  included: [
    {
      id: "1",
      type: "answer",
      attributes: {
        label: "Yes",
      },
    },
    {
      id: "2",
      type: "answer",
      attributes: {
        label: "No",
      },
    },
    {
      id: "1",
      type: "question",
      attributes: {
        question_text: "Is this your first pregnancy?",
        required: false,
        input_type: "select",
        order: 1,
        dependent_question_conditions: {
          1: {
            question_id: 5,
          },
        },
      },
      relationships: {
        answers: {
          data: [
            {
              id: "1",
              type: "answer",
            },
            {
              id: "2",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [
            {
              id: "5",
              type: "question",
            },
          ],
        },
      },
    },
    {
      id: "2",
      type: "question",
      attributes: {
        question_text: "Have you had a cesarean delivery in the past?",
        required: false,
        input_type: "select",
        order: 2,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "1",
              type: "answer",
            },
            {
              id: "2",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "3",
      type: "question",
      attributes: {
        question_text:
          "In a prior pregnancy did the baby weight over 4000 grams (approximately 9 lbs)?",
        required: false,
        input_type: "select",
        order: 3,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "1",
              type: "answer",
            },
            {
              id: "2",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "4",
      type: "question",
      attributes: {
        question_text:
          "In a prior pregnancy did you have gestational diabetes?",
        required: false,
        input_type: "select",
        order: 4,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "1",
              type: "answer",
            },
            {
              id: "2",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "68",
      type: "answer",
      attributes: {
        label: "Feet",
      },
    },
    {
      id: "69",
      type: "answer",
      attributes: {
        label: "Inches",
      },
    },
    {
      id: "5",
      type: "question",
      attributes: {
        question_text: "How tall are you?",
        required: false,
        input_type: "input",
        order: 8,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "68",
              type: "answer",
            },
            {
              id: "69",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "70",
      type: "answer",
      attributes: {
        label: "Pounds",
      },
    },
    {
      id: "71",
      type: "answer",
      attributes: {
        label: "Kilos",
      },
    },
    {
      id: "6",
      type: "question",
      attributes: {
        question_text: "Just before you got pregnant, how much did you weigh?",
        required: false,
        input_type: "input",
        order: 10,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "70",
              type: "answer",
            },
            {
              id: "71",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "3",
      type: "answer",
      attributes: {
        label: "not at all",
      },
    },
    {
      id: "4",
      type: "answer",
      attributes: {
        label: "1 to 3 times a week",
      },
    },
    {
      id: "5",
      type: "answer",
      attributes: {
        label: "4 to 6 times a week",
      },
    },
    {
      id: "6",
      type: "answer",
      attributes: {
        label: "Every day of the week",
      },
    },
    {
      id: "7",
      type: "question",
      attributes: {
        question_text:
          "During the month before you got pregnant, how many times a week did you take a multivitamin, a prenatal vitamin, or a folic acid vitamin?",
        required: false,
        input_type: "select",
        order: 11,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "3",
              type: "answer",
            },
            {
              id: "4",
              type: "answer",
            },
            {
              id: "5",
              type: "answer",
            },
            {
              id: "6",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "8",
      type: "question",
      attributes: {
        question_text:
          "In the 12 months before you got pregnant did you have any health care visits with a doctor, nurse, or other health care worker, including a dental or mental health worker?",
        required: false,
        input_type: "select",
        order: 12,
        dependent_question_conditions: {
          2: {
            question_id: 11,
          },
        },
      },
      relationships: {
        answers: {
          data: [
            {
              id: "1",
              type: "answer",
            },
            {
              id: "2",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [
            {
              id: "11",
              type: "question",
            },
          ],
        },
      },
    },
    {
      id: "7",
      type: "answer",
      attributes: {
        label: "Regular checkup at my family doctor's office",
      },
    },
    {
      id: "8",
      type: "answer",
      attributes: {
        label: "Regular checkup at my OB/GYN's office",
      },
    },
    {
      id: "9",
      type: "answer",
      attributes: {
        label: "Visit for an illness or chronic condition",
      },
    },
    {
      id: "10",
      type: "answer",
      attributes: {
        label: "Visit for an injury",
      },
    },
    {
      id: "11",
      type: "answer",
      attributes: {
        label: "Visit for family planning or birth control",
      },
    },
    {
      id: "12",
      type: "answer",
      attributes: {
        label: "Visit for depression or anxiety",
      },
    },
    {
      id: "13",
      type: "answer",
      attributes: {
        label:
          "Visit to have my teeth cleaned by a dentist or dental hygienist",
      },
    },
    {
      id: "14",
      type: "answer",
      attributes: {
        label: "Visit for an illness or chronic condition",
      },
    },
    {
      id: "15",
      type: "answer",
      attributes: {
        label: "Other",
      },
    },
    {
      id: "9",
      type: "question",
      attributes: {
        question_text:
          "What type of health care visit did you have in the 12 months before you got pregnant",
        required: false,
        input_type: "multi_select",
        order: 6,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "7",
              type: "answer",
            },
            {
              id: "8",
              type: "answer",
            },
            {
              id: "9",
              type: "answer",
            },
            {
              id: "10",
              type: "answer",
            },
            {
              id: "11",
              type: "answer",
            },
            {
              id: "12",
              type: "answer",
            },
            {
              id: "13",
              type: "answer",
            },
            {
              id: "14",
              type: "answer",
            },
            {
              id: "15",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "16",
      type: "answer",
      attributes: {
        label: "Tell me to take a vitamin with folic acid",
      },
    },
    {
      id: "17",
      type: "answer",
      attributes: {
        label: "Talk to me about maintaining a healthy weight",
      },
    },
    {
      id: "18",
      type: "answer",
      attributes: {
        label:
          "Talk to me about controlling any medical conditions such as diabetes or high blood pressure",
      },
    },
    {
      id: "19",
      type: "answer",
      attributes: {
        label: "Talk to me about my desire to have or not have children",
      },
    },
    {
      id: "20",
      type: "answer",
      attributes: {
        label: "Talk to me about using birth control to prevent pregnancy",
      },
    },
    {
      id: "21",
      type: "answer",
      attributes: {
        label:
          "Talk to me about how I could improve my health before a pregnancy",
      },
    },
    {
      id: "22",
      type: "answer",
      attributes: {
        label:
          "Talk to me about sexually transmitted infections such as chlamydia,gonorrhea, or syphilis",
      },
    },
    {
      id: "23",
      type: "answer",
      attributes: {
        label: "Ask me if I was smoking cigarettes",
      },
    },
    {
      id: "24",
      type: "answer",
      attributes: {
        label: "Ask me if someone was hurting me emotionally or physically",
      },
    },
    {
      id: "25",
      type: "answer",
      attributes: {
        label: "Ask me if I was feeling down or depressed",
      },
    },
    {
      id: "26",
      type: "answer",
      attributes: {
        label: "Ask me about the kind of work I do",
      },
    },
    {
      id: "27",
      type: "answer",
      attributes: {
        label: "Test me for HIV (the virus that causes AIDS)",
      },
    },
    {
      id: "10",
      type: "question",
      attributes: {
        question_text:
          "During any of your health care visits in the 12 months before you got pregnant, did a doctor, nurse, or other health care worker do any of the following things?",
        required: false,
        input_type: "multi_select",
        order: 13,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "16",
              type: "answer",
            },
            {
              id: "17",
              type: "answer",
            },
            {
              id: "18",
              type: "answer",
            },
            {
              id: "19",
              type: "answer",
            },
            {
              id: "20",
              type: "answer",
            },
            {
              id: "21",
              type: "answer",
            },
            {
              id: "22",
              type: "answer",
            },
            {
              id: "23",
              type: "answer",
            },
            {
              id: "24",
              type: "answer",
            },
            {
              id: "25",
              type: "answer",
            },
            {
              id: "26",
              type: "answer",
            },
            {
              id: "27",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "28",
      type: "answer",
      attributes: {
        label: "I have housing",
      },
    },
    {
      id: "29",
      type: "answer",
      attributes: {
        label: "I do not have housing",
      },
    },
    {
      id: "11",
      type: "question",
      attributes: {
        question_text: "What is your current housing situation?",
        required: false,
        input_type: "select",
        order: 14,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "28",
              type: "answer",
            },
            {
              id: "29",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "12",
      type: "question",
      attributes: {
        question_text:
          "Do you now or have you required in the past Government assistant to receive adequate nutrition?",
        required: false,
        input_type: "select",
        order: 15,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "1",
              type: "answer",
            },
            {
              id: "2",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "30",
      type: "answer",
      attributes: {
        label: "I wanted to be pregnant later",
      },
    },
    {
      id: "31",
      type: "answer",
      attributes: {
        label: "I wanted to be pregnant sooner",
      },
    },
    {
      id: "32",
      type: "answer",
      attributes: {
        label: "I wanted to be pregnant then",
      },
    },
    {
      id: "33",
      type: "answer",
      attributes: {
        label: "I didn't want to be pregnant then or at any time in the future",
      },
    },
    {
      id: "34",
      type: "answer",
      attributes: {
        label: "I wasn't sure what I wanted",
      },
    },
    {
      id: "13",
      type: "question",
      attributes: {
        question_text:
          "Thinking back to just before you got pregnant, how did you feel about becoming pregnant?",
        required: false,
        input_type: "select",
        order: 16,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "30",
              type: "answer",
            },
            {
              id: "31",
              type: "answer",
            },
            {
              id: "32",
              type: "answer",
            },
            {
              id: "33",
              type: "answer",
            },
            {
              id: "34",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "72",
      type: "answer",
      attributes: {
        label: "Weeks",
      },
    },
    {
      id: "73",
      type: "answer",
      attributes: {
        label: "Months",
      },
    },
    {
      id: "14",
      type: "question",
      attributes: {
        question_text:
          "How many weeks or months pregnant were you when you had your first visit for prenatal care?",
        required: false,
        input_type: "input",
        order: 17,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "72",
              type: "answer",
            },
            {
              id: "73",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "35",
      type: "answer",
      attributes: {
        label: "If I knew how much weight I should gain during pregnancy",
      },
    },
    {
      id: "36",
      type: "answer",
      attributes: {
        label: "If I was taking any prescription medication",
      },
    },
    {
      id: "37",
      type: "answer",
      attributes: {
        label: "If I was smoking cigarettes",
      },
    },
    {
      id: "38",
      type: "answer",
      attributes: {
        label: "If I was drinking alcohol",
      },
    },
    {
      id: "39",
      type: "answer",
      attributes: {
        label: "If someone was hurting me emotionally or physically",
      },
    },
    {
      id: "40",
      type: "answer",
      attributes: {
        label: "If I was feeling down or depressed",
      },
    },
    {
      id: "41",
      type: "answer",
      attributes: {
        label:
          "If I was using drugs such as marijuana, cocaine, crack, or meth",
      },
    },
    {
      id: "42",
      type: "answer",
      attributes: {
        label: "If I wanted to be tested for HIV (the virus that causes AIDS)",
      },
    },
    {
      id: "43",
      type: "answer",
      attributes: {
        label: "If I planned to breastfeed my new baby",
      },
    },
    {
      id: "44",
      type: "answer",
      attributes: {
        label: "If I planned to use birth control after my baby was born",
      },
    },
    {
      id: "15",
      type: "question",
      attributes: {
        question_text:
          "During your most recent pregnancy, did a doctor, nurse, or other health care worker ask you any of the things listed below?",
        required: false,
        input_type: "multi_select",
        order: 5,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "35",
              type: "answer",
            },
            {
              id: "36",
              type: "answer",
            },
            {
              id: "37",
              type: "answer",
            },
            {
              id: "38",
              type: "answer",
            },
            {
              id: "39",
              type: "answer",
            },
            {
              id: "40",
              type: "answer",
            },
            {
              id: "41",
              type: "answer",
            },
            {
              id: "42",
              type: "answer",
            },
            {
              id: "43",
              type: "answer",
            },
            {
              id: "44",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "45",
      type: "answer",
      attributes: {
        label:
          "Gestational diabetes (diabetes that started during the pregnancy)",
      },
    },
    {
      id: "46",
      type: "answer",
      attributes: {
        label:
          "High blood pressure (that started during this pregnancy), pre-eclampsia or eclampsia",
      },
    },
    {
      id: "47",
      type: "answer",
      attributes: {
        label: "Depression",
      },
    },
    {
      id: "16",
      type: "question",
      attributes: {
        question_text:
          "During your most recent pregnancy, did you have any of the following health conditions?",
        required: false,
        input_type: "multi_select",
        order: 7,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "45",
              type: "answer",
            },
            {
              id: "46",
              type: "answer",
            },
            {
              id: "47",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "17",
      type: "question",
      attributes: {
        question_text:
          "During the 12 months before the delivery of your most recent child, did you get a flu shot?",
        required: false,
        input_type: "select",
        order: 9,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "1",
              type: "answer",
            },
            {
              id: "2",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "18",
      type: "question",
      attributes: {
        question_text: "In the prior 12 months have you had a flu shot?",
        required: false,
        input_type: "select",
        order: 18,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "1",
              type: "answer",
            },
            {
              id: "2",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "19",
      type: "question",
      attributes: {
        question_text:
          "In the past 12 months, did you have your teeth cleaned by a dentist or dental hygienist?",
        required: false,
        input_type: "select",
        order: 19,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "1",
              type: "answer",
            },
            {
              id: "2",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "74",
      type: "answer",
      attributes: {
        label: "Cigarettes",
      },
    },
    {
      id: "75",
      type: "answer",
      attributes: {
        label: "E-Cigarettes",
      },
    },
    {
      id: "76",
      type: "answer",
      attributes: {
        label: "Hookah",
      },
    },
    {
      id: "20",
      type: "question",
      attributes: {
        question_text:
          "Have you smoked any of the following in the past 2 years?",
        required: false,
        input_type: "multi_select",
        order: 20,
        dependent_question_conditions: {
          74: {
            question_id: 22,
          },
          75: {
            question_id: 24,
          },
          76: {
            question_id: 26,
          },
        },
      },
      relationships: {
        answers: {
          data: [
            {
              id: "74",
              type: "answer",
            },
            {
              id: "75",
              type: "answer",
            },
            {
              id: "76",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [
            {
              id: "22",
              type: "question",
            },
            {
              id: "24",
              type: "question",
            },
            {
              id: "26",
              type: "question",
            },
          ],
        },
      },
    },
    {
      id: "21",
      type: "question",
      attributes: {
        question_text:
          "Do you currently live in a household with someone who smokes tobaccos products on a regular basis?",
        required: false,
        input_type: "select",
        order: 21,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "1",
              type: "answer",
            },
            {
              id: "2",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "48",
      type: "answer",
      attributes: {
        label: "I didn't smoke then",
      },
    },
    {
      id: "49",
      type: "answer",
      attributes: {
        label: "Less than 1 cigarette",
      },
    },
    {
      id: "50",
      type: "answer",
      attributes: {
        label: "1 to 5 cigarettes",
      },
    },
    {
      id: "51",
      type: "answer",
      attributes: {
        label: "6 to 10 cigarettes",
      },
    },
    {
      id: "52",
      type: "answer",
      attributes: {
        label: "11 to 20 cigarettes",
      },
    },
    {
      id: "53",
      type: "answer",
      attributes: {
        label: "21 to 40 cigarettes",
      },
    },
    {
      id: "54",
      type: "answer",
      attributes: {
        label: "41 cigarettes or more",
      },
    },
    {
      id: "22",
      type: "question",
      attributes: {
        question_text:
          "In the 3 months before you got pregnant, how many cigarettes did you smoke on an average day? A pack has 20 cigarettes.",
        required: false,
        input_type: "select",
        order: 22,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "48",
              type: "answer",
            },
            {
              id: "49",
              type: "answer",
            },
            {
              id: "50",
              type: "answer",
            },
            {
              id: "51",
              type: "answer",
            },
            {
              id: "52",
              type: "answer",
            },
            {
              id: "53",
              type: "answer",
            },
            {
              id: "54",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "23",
      type: "question",
      attributes: {
        question_text:
          "How many cigarettes do you smoke on an average day now? A pack has 20 cigarettes.",
        required: false,
        input_type: "select",
        order: 23,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "48",
              type: "answer",
            },
            {
              id: "49",
              type: "answer",
            },
            {
              id: "50",
              type: "answer",
            },
            {
              id: "51",
              type: "answer",
            },
            {
              id: "52",
              type: "answer",
            },
            {
              id: "53",
              type: "answer",
            },
            {
              id: "54",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "56",
      type: "answer",
      attributes: {
        label: "1 day a week or less",
      },
    },
    {
      id: "57",
      type: "answer",
      attributes: {
        label: "2-6 days a week",
      },
    },
    {
      id: "58",
      type: "answer",
      attributes: {
        label: "Once a day",
      },
    },
    {
      id: "59",
      type: "answer",
      attributes: {
        label: "More than once a day",
      },
    },
    {
      id: "24",
      type: "question",
      attributes: {
        question_text:
          "During the 3 months before you got pregnant, on average, how often did you use e-cigarettes or other electronic nicotine products?",
        required: false,
        input_type: "select",
        order: 24,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "56",
              type: "answer",
            },
            {
              id: "57",
              type: "answer",
            },
            {
              id: "58",
              type: "answer",
            },
            {
              id: "59",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "25",
      type: "question",
      attributes: {
        question_text:
          "Currently on average, how often do you use e-cigarettes or other electronic nicotine products?",
        required: false,
        input_type: "select",
        order: 25,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "56",
              type: "answer",
            },
            {
              id: "57",
              type: "answer",
            },
            {
              id: "58",
              type: "answer",
            },
            {
              id: "59",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "26",
      type: "question",
      attributes: {
        question_text:
          "During the 3 months before you got pregnant, on average, how often did you use a hookah?",
        required: false,
        input_type: "select",
        order: 26,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "56",
              type: "answer",
            },
            {
              id: "57",
              type: "answer",
            },
            {
              id: "58",
              type: "answer",
            },
            {
              id: "59",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "27",
      type: "question",
      attributes: {
        question_text: "Currently on average, how often do you use a hookah?",
        required: false,
        input_type: "select",
        order: 27,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "56",
              type: "answer",
            },
            {
              id: "57",
              type: "answer",
            },
            {
              id: "58",
              type: "answer",
            },
            {
              id: "59",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "28",
      type: "question",
      attributes: {
        question_text:
          "Have you had any alcoholic drinks in the past 2 years? A drink is 1 glass of wine, wine cooler, can or bottle of beer, shot of liquor, or mixed drink.",
        required: false,
        input_type: "select",
        order: 28,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "1",
              type: "answer",
            },
            {
              id: "2",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "60",
      type: "answer",
      attributes: {
        label: "I didn't drink then",
      },
    },
    {
      id: "61",
      type: "answer",
      attributes: {
        label: "Less than 1 drink a week",
      },
    },
    {
      id: "62",
      type: "answer",
      attributes: {
        label: "1 to 3 drinks a week",
      },
    },
    {
      id: "63",
      type: "answer",
      attributes: {
        label: "4 to 7 drinks a week",
      },
    },
    {
      id: "64",
      type: "answer",
      attributes: {
        label: "8 to 13 drinks a week",
      },
    },
    {
      id: "65",
      type: "answer",
      attributes: {
        label: "14 drinks or more a week",
      },
    },
    {
      id: "29",
      type: "question",
      attributes: {
        question_text:
          "During the 3 months before you got pregnant, how many alcoholic drinks did you have in an average week?",
        required: false,
        input_type: "select",
        order: 29,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "60",
              type: "answer",
            },
            {
              id: "61",
              type: "answer",
            },
            {
              id: "62",
              type: "answer",
            },
            {
              id: "63",
              type: "answer",
            },
            {
              id: "64",
              type: "answer",
            },
            {
              id: "65",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "30",
      type: "question",
      attributes: {
        question_text:
          "Currently, how many alcoholic drinks did you have in an average week?",
        required: false,
        input_type: "select",
        order: 30,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "61",
              type: "answer",
            },
            {
              id: "62",
              type: "answer",
            },
            {
              id: "63",
              type: "answer",
            },
            {
              id: "64",
              type: "answer",
            },
            {
              id: "65",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "77",
      type: "answer",
      attributes: {
        label: "My husband or partner",
      },
    },
    {
      id: "78",
      type: "answer",
      attributes: {
        label: "My ex-husband or ex-partner",
      },
    },
    {
      id: "79",
      type: "answer",
      attributes: {
        label: "Another family member",
      },
    },
    {
      id: "80",
      type: "answer",
      attributes: {
        label: "Someone else",
      },
    },
    {
      id: "81",
      type: "answer",
      attributes: {
        label: "None of the above",
      },
    },
    {
      id: "31",
      type: "question",
      attributes: {
        question_text:
          "In the 12 months before you got pregnant with your new baby, did any of the following people push, hit, slap, kick, choke, or physically hurt you in any other way? For each person, check No if they did not hurt you during this time or Yes if they did.",
        required: false,
        input_type: "multi_select",
        order: 31,
        dependent_question_conditions: {
          77: {
            question_id: 32,
          },
          78: {
            question_id: 32,
          },
          79: {
            question_id: 32,
          },
          80: {
            question_id: 32,
          },
          81: {
            question_id: 33,
          },
        },
      },
      relationships: {
        answers: {
          data: [
            {
              id: "77",
              type: "answer",
            },
            {
              id: "78",
              type: "answer",
            },
            {
              id: "79",
              type: "answer",
            },
            {
              id: "80",
              type: "answer",
            },
            {
              id: "81",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [
            {
              id: "32",
              type: "question",
            },
            {
              id: "33",
              type: "question",
            },
          ],
        },
      },
    },
    {
      id: "32",
      type: "question",
      attributes: {
        question_text: "Do you feel safe from that person now?",
        required: false,
        input_type: "select",
        order: 32,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "1",
              type: "answer",
            },
            {
              id: "2",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "66",
      type: "answer",
      attributes: {
        label: "Sister",
      },
    },
    {
      id: "67",
      type: "answer",
      attributes: {
        label: "Mother",
      },
    },
    {
      id: "33",
      type: "question",
      attributes: {
        question_text:
          "Did anyone of the following people in your family have gestational diabetes?",
        required: false,
        input_type: "multi_select",
        order: 33,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "66",
              type: "answer",
            },
            {
              id: "67",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
    {
      id: "34",
      type: "question",
      attributes: {
        question_text:
          "Does anyone in your immediate family (father,sister, mother, brother) currently have diabetes?",
        required: false,
        input_type: "select",
        order: 34,
        dependent_question_conditions: null,
      },
      relationships: {
        answers: {
          data: [
            {
              id: "1",
              type: "answer",
            },
            {
              id: "2",
              type: "answer",
            },
          ],
        },
        dependent_questions: {
          data: [],
        },
      },
    },
  ],
};

export const questions = surveyData.included
  .filter((d) => d.type === "question")
  .sort((a, b) => a.attributes.order - b.attributes.order);

export const answers = surveyData.included.filter((d) => d.type === "answer");
