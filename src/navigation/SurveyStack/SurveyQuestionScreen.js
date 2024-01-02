import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, ScrollView, Text, View, Dimensions, Linking, SafeAreaView } from "react-native";
import AppLayout from "../../components/AppLayout";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import AppKeyboardAvoidingView from "../../components/AppKeyboardAvoidingView";
import AppText from "../../components/AppText";
import Link from "../../components/Link";
import {
  ShortAnswerQuestion,
  Footer,
  SingleAnswerQuestion,
  TrueFalseQuestion,
  MultipleChoiceQuestion,
  HeightInput,
} from "../../components/Survey";
import { useForm } from "react-hook-form";
import AppButton from "../../components/AppButton";
import ConfirmationModal from "../../components/ConfirmationModal";
import SurveyFinishedIcon from "../../../assets/svgs/SurveyFinishedIcon.svg";
import { COLORS, MARGINS } from "../../utils/styles";
import { SurveyContext } from "../../context/surveyContext";
import AppContainer from "../../components/AppContainer";
import { AppContext } from "../../context";
import { completeSurvey, reporting_log_update, submitSurveyAnswer } from "../../api";
import _ from "lodash";
import {
  dont_know,
  none,
  none_of_above,
  not_sure,
  not_to_answer,
  other,
  text,
  POSITIVE,
  NEGATIVE,
} from "../../utils/survey";
import { FindSessionTime } from "../../utils/TimeDiff";
import CareTeamCards from "../../components/CareTeamCards";

// import * as Linking from "expo-linking";

/**
 * TODO: Refactor to make this
 * file smaller. By centralizing
 * all copy in one file, by seprating
 * different types of surveys, by moving
 * methods in a util file.
 */

export default function SurveyQuestionScreen({ navigation, route }) {
  const { page, index, survey_id, user_survey_id, onboarding } = route.params;

  // console.log("SurveyQuestionScreen onboarding", onboarding?.onboarding)
  const [questionStartTime, setQuestionStartTime] = useState(new Date().getTime())
  const [openModal, setOpenModal] = useState(false);
  const [finsihModalData, setFinishModalData] = useState({
    header: "Wow, well done!",
    body: "You've finished our risk survey",
  });
  const [openPHQ2Modal, setOpenPHQ2Modal] = useState(false);
  const [PHQ2ModalData, setPHQ2ModalData] = useState({});
  const [nextPage, setNextPage] = useState(page + 1);
  const {
    surveyQuestions,
    surveyQuestionAnswersRelations,
    surveyAnswers,
    setSurveyDone,
    surveyDone,
    getSurveyReminders,
  } = useContext(SurveyContext);

  // console.log("surveyAnswers", surveyAnswers)
  const questionObject =
    route.params?.dependent === true
      ? _.find(surveyQuestions, { id: `${page}` })
      : _.find(surveyQuestions, { attributes: { order: page } });

  let is_last_question = questionObject?.attributes?.is_last;

  const { user, setUser, setError, userQuestionAnswer, setUserQuestionAnswer } =
    useContext(AppContext);

  const lastPage = page === surveyQuestions.length;

  const [response, setResponse] = useState([]);
  let disableBtn;

  // console.log("questionObject ::", questionObject)
  const questionAnswers = questionObject?.relationships?.answers?.data;
  // console.log("questionAnswers ::", questionAnswers)
  /**
   * Still to Test more.
   * Get Answers sorted in order they
   * were created using question_answer relation.
   */
  // const question_answer_ids =
  //   questionObject?.relationships?.question_answers?.data?.map(
  //     (question_answer) => question_answer?.id
  //   );
  // const answerOptions = question_answer_ids.map((id) => {
  //   const question_answer = surveyQuestionAnswersRelations.find(
  //     (question_answer) => question_answer.id === id
  //   );
  //   return {
  //     label: question_answer?.attributes?.answer?.label,
  //     id: question_answer?.attributes?.answer?.id,
  //     score: question_answer?.attributes?.answer?.score,
  //   };
  // });

  const question = questionObject?.attributes?.question_text;

  const answerOptions = questionAnswers?.map((a) => {
    const fullAnswer = surveyAnswers.find((answer) => answer.id === a.id);
    return {
      label: fullAnswer?.attributes?.label,
      id: fullAnswer?.id,
      score: fullAnswer?.attributes?.score,
    };
  });

  // console.log("answerOptions", answerOptions)
  // to shift any answer to end
  const shiftAnswerToEnd = (answer_label) => {
    const answer_to_shift = _.find(answerOptions, { label: answer_label });
    if (!_.isEmpty(answer_to_shift)) {
      answerOptions.splice(
        answerOptions.findIndex((answer) => answer.label === answer_label),
        1
      );
      answerOptions.push(answer_to_shift);
      // console.log("answerOptions shifted -->", answerOptions)
    }
  };

  shiftAnswerToEnd(other);
  shiftAnswerToEnd(none_of_above);
  shiftAnswerToEnd(not_sure);
  shiftAnswerToEnd(none);
  if (!_.isEmpty(questionObject) && questionObject.id === "48") {
    shiftAnswerToEnd("No");
  }
  shiftAnswerToEnd(not_to_answer);
  shiftAnswerToEnd(dont_know);

  const isTrueFalse =
    answerOptions.length === 2 &&
    (answerOptions[0]?.label === "Yes" || answerOptions[0]?.label === "No") &&
    (answerOptions[1]?.label === "Yes" || answerOptions[1]?.label === "No");

  const isMultipleChoice =
    questionObject?.attributes?.input_type === "multi_select";

  const selectOrInput =
    questionObject?.attributes?.input_type === "select_or_input";

  const hasInput = questionObject?.attributes?.input_type === "input";

  const isHeight = hasInput && answerOptions[0]?.label === "Feet";

  const orderList = surveyQuestions
    .filter((question) => question?.attributes?.order !== null)
    ?.map((question) => question?.attributes?.order);

  // console.log("orderList", orderList)

  const percentCompleted = () => {
    var percent = Math.floor((index / Math.max(...orderList)) * 100)

    // if (percent >= 100) {
    //   if (is_last_question) {
    //     return 100
    //   } else {
    //     return 99
    //   }
    // } else {
    //   return percent
    // }

    if (is_last_question) {
      return 100
    } else if (percent >= 100) {
      return 99
    } else {
      return percent
    }

  }

  // console.log("percentCompleted", percentCompleted())

  const required = questionObject?.attributes?.required;

  const dependent = questionObject?.attributes?.dependent_question_conditions;

  const text_answer = _.find(answerOptions, { label: text });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    trigger,
  } = useForm({ mode: "onChange" });

  /**
   * Method to populate answer selected for a question
   * if they exist already.
   */
  const setUserAnswers = () => {
    const question_answered =
      _.find(userQuestionAnswer, {
        attributes: {
          question_id: parseInt(questionObject?.id),
          user_survey_id: user_survey_id,
        },
      }) || [];

    let formated_question_answered = [];

    for (let i = 0; i < question_answered?.attributes?.answer_ids.length; i++) {
      const answer_score = _.find(surveyAnswers, {
        id: `${question_answered?.attributes?.answer_ids[i]}`,
      })?.attributes?.score;
      formated_question_answered.push({
        id: `${question_answered?.attributes?.answer_ids[i]}`,
        label: question_answered?.attributes?.user_inputs[i],
        score: answer_score,
      });
    }

    if (!_.isEmpty(formated_question_answered)) {
      if (hasInput) {
        //  TODO
      } else {
        setResponse(formated_question_answered);
      }
    }
  };

  /**
   * Calculate result for phq2 questions
   *
   * If total >= 3 than patient
   * is depression positive, if less
   * than 3 than negative.
   * @param {array} answers - Answer selected by user.
   */
  const calculatePHQ2Result = (answers) => {
    const phq2_question_ids = [59, 60];
    let total = 0;

    /**
     * Following question calculates if
     * the user is on the last question
     * of phq2 questions. Is so than calculate
     * score for PHQ2 answers.
     */

    if (
      answers?.length &&
      parseInt(questionObject?.id) === phq2_question_ids[1]
    ) {
      const current_answer_score = answers[0]?.score;

      const user_answer_for_phq2_question_one = _.find(userQuestionAnswer, {
        attributes: {
          question_id: phq2_question_ids[0],
          user_survey_id: user_survey_id,
        },
      });
      const score_answer_one = _.find(surveyAnswers, {
        id: `${user_answer_for_phq2_question_one?.attributes?.answer_ids[0]}`,
      })?.attributes?.score;

      if (_.isNumber(score_answer_one)) total += score_answer_one;
      if (_.isNumber(current_answer_score)) total += current_answer_score;

      if (total >= 3) {
        return POSITIVE;
      } else if (total < 3) {
        return NEGATIVE;
      }
    }
  };

  /**
   * Calculate PHQQ9 result when
   * user reaches the end of the survey.
   */
  const calculatePHQ9Result = () => {
    const phq9_question_id = 67;

    const user_answer_for_phq9_question_one = _.find(userQuestionAnswer, {
      attributes: {
        question_id: phq9_question_id,
        user_survey_id: user_survey_id,
      },
    });
    const score_answer_one = _.find(surveyAnswers, {
      id: `${user_answer_for_phq9_question_one?.attributes?.answer_ids[0]}`,
    })?.attributes?.score;

    if (is_last_question === true && score_answer_one === 0) return NEGATIVE;
    if (is_last_question === true && score_answer_one > 0) return POSITIVE;
  };

  /**
   * Previous Screen doesnot rerenders when go back.
   * Need this call to reassign answers for a question on going back
   * to previous screen.
   */
  const goBackCall = () => {
    setUserAnswers();
  };

  /**
   * Set answers for question after first render.
   */
  useEffect(() => {
    setUserAnswers();
  }, []);

  /**
   * Set text for when other option selected
   * in multi_select of single_select question
   */
  useEffect(() => {
    if (!_.isEmpty(text_answer)) {
      const text_answer_input = _.find(response, { id: text_answer.id });
      if (_.find(response, { label: other }) && !_.isEmpty(text_answer_input)) {
        setValue(text, text_answer_input.label);
        trigger();
      } else {
        _.remove(response, { id: text_answer.id });
      }
    }
  }, [response]);

  const redirect = () => {
    if (route.params?.onboarding) {
      navigation.navigate("Onboarding Complete");
    } else {
      navigation.navigate("Home");
    }
  };

  const markSurveyCompleted = async () => {
    let userCopy = Object.assign(user, {});
    try {
      const res = await completeSurvey(user.id, user_survey_id, user?.pregnancy?.id);

      /**
       * Remove survey from user surveys array upon
       * completion.
       */
      if (!route?.params?.onboarding) {
        userCopy.surveys = userCopy?.surveys.filter(
          (survey) => survey?.id !== parseInt(res?.data?.id)
        );
        getSurveyReminders(userCopy);
        setUser(userCopy);
      }

      setSurveyDone(!surveyDone);
      redirect();
    } catch (error) {
      console.log("error", error)
      setError(error.message);
    }
  };

  const getNextPage = (body) => {
    const dependent_question_id =
      questionObject?.attributes?.dependent_question_id;

    let next_page = dependent_question_id || nextPage;

    if (questionObject?.attributes?.dependent_question_conditions) {
      Object.keys(
        questionObject?.attributes?.dependent_question_conditions
      ).forEach((key) => {
        if (_.find(body, { id: key })) {
          next_page = dependent[key]?.question_id;
        }
      });
    }

    if (dependent_question_id) {
      const nextQuestion = _.find(surveyQuestions, {
        id: `${dependent_question_id}`,
      });

      // console.log(" test ", nextQuestion, nextQuestion?.attributes?.dependent_question_id)
      if (
        nextQuestion &&
        _.isNull(nextQuestion?.attributes?.dependent_question_id)
      ) {
        next_page = nextQuestion?.attributes?.order + 1;
      }
    }

    return next_page;
  };

  const checkDependecy = (body) => {
    let isDependent = false;

    if (questionObject?.attributes?.dependent_question_conditions) {
      Object.keys(
        questionObject?.attributes?.dependent_question_conditions
      ).forEach((key) => {
        if (_.find(body, { id: key })) {
          isDependent = true;
        }
      });
    }

    const dependent_question_id =
      questionObject.attributes?.dependent_question_id;
    if (dependent_question_id) {
      const nextQuestion = _.find(surveyQuestions, {
        id: `${dependent_question_id}`,
      });
      if (!_.isNull(nextQuestion?.attributes?.dependent_question_id)) {
        isDependent = true;
      }
    }

    return isDependent;
  };

  /**
   * Method to navigate to next question screen
   * along with the props that are passed to
   * the next question.
   * @param {arrray} body - answers selected by the user.
   */
  const goToNextQuestion = (body) => {
    navigation.push("Survey Question", {
      page: getNextPage(body),
      index: questionObject?.attributes?.order
        ? questionObject?.attributes?.order + 1
        : index,
      dependent: checkDependecy(body),
      onboarding: route.params?.onboarding,
      goBackCall: goBackCall,
      survey_id,
      user_survey_id,
    });
  };

  const goToExternalLink = (link = "") => {
    Linking.openURL(link).catch((err) => setError(err.message));
  };

  /**
   * TODO: Centralize all copy in survey
   * screen and survey questions screen to
   * one file.
   */
  const maintaining_good_health_links = (
    <>
      <AppText
        onPress={() =>
          goToExternalLink(
            "https://www.marchofdimes.org/complications/depression-during-pregnancy.aspx"
          )
        }
        blue
        underline
      >
        Depression During Pregnancy
      </AppText>{" "}
      and{" "}
      <AppText
        blue
        underline
        onPress={() =>
          goToExternalLink("https://www.mhanational.org/live-b4stage4")
        }
      >
        Living Mentally Healthy.
      </AppText>
    </>
  );

  /**
   * Use plus signs to keep the lines
   * short. Make the code review easy.
   */
  const depression_survey_thankyou_text =
    "Thank you for completing the depression screening survey. We will " +
    "forward this information to your doctor. Here is a resource to " +
    "maintaining good mental health during pregnancy: ";

  const depression_modal_thankyou_body = (
    <>
      <AppText>{depression_survey_thankyou_text}</AppText>
      {maintaining_good_health_links}
    </>
  );

  const suicidal_positive_modal_body = (
    <AppText error>
      Mother Goose Health is concerned about your wellness and has sent an
      urgent message to your care provider. If you are having any thoughts of
      hurting yourself, please call 911, or your physician's emergency phone
      number or the National Suicide Prevention Lifeline: 800-273-8255.
    </AppText>
  );

  const depressed_positive_modal_body = (
    <View>
      <AppText mb2 textAlignCenter>
        {` Thank you for completing the depression screening survey.\nMother Goose Health is concerned you may be at risk for depression.`}
      </AppText>
      <AppText textAlignCenter>
        {`Please take 5 minutes or less to complete the next set of questions\nso we can communicate the best information to your doctor`}
      </AppText>
    </View>
  );

  /**
   * Open modal for PHQ2.
   * @param {object} nextQuestioData - Data that is to be
   * passed to next question screen as props.
   */
  const triggerPHQ2Modal = (nextQuestioData) => {
    setPHQ2ModalData({
      buttonTitle: "Next Questions",
      content: depressed_positive_modal_body,
      onButtonClick: () => goToNextQuestion(nextQuestioData),
    });

    setOpenPHQ2Modal(true);
  };

  const onSubmit = async (formData) => {

    let body = undefined;

    // console.log("When click next button in survey, the response is -->", response)
    if (response.length && _.find(response, { label: other })) {
      body = response;
      for (const key in formData) {
        const answer = answerOptions.find((a) => {
          return a.label === key;
        });
        /**
         * If input already exists, replace it with
         * a new input.
         */
        _.remove(body, { id: answer.id });
        body.push({ id: answer.id, label: formData[key] });
      }
      formData = {};
    } else {
      body = Object.keys(formData).length ? formData : response;
    }

    /**
     * Update question answers
     */
    try {
      const res = await submitSurveyAnswer(
        body,
        user.id,
        questionObject.id,
        answerOptions,
        user_survey_id
      );

      var TimeSpentOnSurveyQuestion = await FindSessionTime(new Date().getTime(), questionStartTime);
      // console.log("TimeSpentOnSurveyQuestion", TimeSpentOnSurveyQuestion, answerOptions) // Need send to API

      var log_data = {
        user_id: user.id,
        time_spent: TimeSpentOnSurveyQuestion,
        content_id: { "question_id": questionObject.id, "answer_id": body.id },
        log_type: survey_id == 1 ? "Risk Survey" : survey_id == 2 ? "Depression Survey" : ""
      }
      // console.log("log_data", log_data)

      await reporting_log_update(log_data);
      /**
       * Update user_question_anser context after answer is submitted to
       * backend so we have new selected answers in the context. User can view
       * all latest selected answer without reloading the suurvey.
       */
      const dummyAnswersState = Object.assign(userQuestionAnswer, []);
      let quesion_answer_index = dummyAnswersState.findIndex(
        (question_answer) =>
          question_answer?.attributes?.question_id ===
          parseInt(questionObject?.id) &&
          question_answer?.attributes?.user_survey_id === user_survey_id
      );

      if (quesion_answer_index >= 0) {
        dummyAnswersState[quesion_answer_index] = res.data;
      } else {
        dummyAnswersState.push(res.data);
      }
      setUserQuestionAnswer(dummyAnswersState);
      setResponse([]);

      /**
       * Calculation for depression
       * survey phq2 and phq9 questions.
       */
      let is_depressed = calculatePHQ2Result(body);
      let is_suicidal = calculatePHQ9Result();

      if (is_suicidal === POSITIVE) {
        setFinishModalData({
          body: suicidal_positive_modal_body,
        });
      } else if (is_suicidal === NEGATIVE) {
        setFinishModalData({
          body: depression_modal_thankyou_body,
        });
      } else if (is_depressed === POSITIVE) {
        triggerPHQ2Modal(body);
        return;
      } else if (is_depressed === NEGATIVE) {
        is_last_question = true;
        setFinishModalData({
          body: depression_modal_thankyou_body,
        });
      }

      is_last_question !== true ? goToNextQuestion(body) : setOpenModal(true);

      setQuestionStartTime(new Date().getTime())
    } catch (error) {
      setError(error.message);
    }
  };

  const renderQuestion = () => {

    if (isHeight) {
      disableBtn = !isValid;
      return <HeightInput control={control} options={answerOptions} />;
    }

    if (hasInput) {
      disableBtn = !isValid && !response.length;
      return (
        <ShortAnswerQuestion
          questionid={questionObject?.id}
          control={control}
          options={answerOptions}
          measure={answerOptions[0]}
          reset={reset}
          selectOrInput={selectOrInput}
          response={response}
          setResponse={setResponse}
        />
      );
    }

    if (isTrueFalse) {
      disableBtn = !response.length;
      return (
        <TrueFalseQuestion
          question={""}
          answers={answerOptions}
          dependent={dependent}
          setNextPage={setNextPage}
          setResponse={setResponse}
          response={response}
        />
      );
    }

    if (isMultipleChoice) {
      disableBtn = !isValid || !response.length;
      return (
        <MultipleChoiceQuestion
          answers={answerOptions}
          dependent={dependent}
          setNextPage={setNextPage}
          setResponse={setResponse}
          response={response}
          control={control}
          reset={reset}
          text_answer={text_answer}
        />
      );
    }

    disableBtn = !response.length || !isValid;
    return (
      <SingleAnswerQuestion
        answers={answerOptions}
        dependent={dependent}
        setNextPage={setNextPage}
        setResponse={setResponse}
        response={response}
        control={control}
        reset={reset}
        text_answer={text_answer}
      />
    );
  };

  /**
   * TODO consider creating a field on the backend
   * called showDefaultSubText, if we have more
   * questions with the same behavior.
   */
  const multiQuestionSubtext = () => {
    let showSubtext = isMultipleChoice;
    if (questionObject?.id === "48") showSubtext = false;
    return showSubtext;
  };

  return (
    <SafeAreaView style={{ height: "100%", width: "100%", backgroundColor: "#fff" }}>
      <AppLayout onboarding>
        <AppKeyboardAvoidingView>

          <View style={{ paddingHorizontal: 20, height: "100%", width: "100%" }}>
            <ScrollView alwaysBounceVertical indicatorStyle="black" showsVerticalScrollIndicator={true} persistentScrollbar={true} style={styles.container}>
              <AppContainer transparent>
                <View style={styles.exitBtn}>
                  <Link onPress={() => redirect()} style={styles.link} dark>
                    Save and {route.params?.onboarding ? "skip" : "exit"}
                  </Link>
                </View>
                <View style={styles.question}>
                  {
                    (survey_id == 1 && questionObject.id == 83) ?
                      <View style={[{ width: "100%", backgroundColor: COLORS.white, borderRadius: 12, alignItems: "center", justifyContent: "center" }, styles.boxShadow]}>
                        <AppText RFh3 blue bold>
                          If you feel you or your baby are in immediate danger, please dial 911.
                        </AppText>
                      </View> :
                      null
                  }
                  <AppText RFh3 blue bold mb4>
                    {question}
                  </AppText>
                  {multiQuestionSubtext() && (
                    <AppText small gray mb4 textAlignCenter>
                      Select every option that applies
                    </AppText>
                  )}
                  {renderQuestion()}
                  <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-evenly" }}>

                    <AppButton
                      onPress={() => {
                        if (page > 0) {
                          goBackCall();
                          navigation.goBack();
                        }
                      }
                      }
                      verysmall
                      blue
                      alignSelf
                      // disabled={disableBtn}
                      title="Back"
                    />

                    <AppButton
                      onPress={handleSubmit(onSubmit)}
                      verysmall
                      blue
                      alignSelf
                      disabled={disableBtn}
                      title="Next"
                    />
                  </View>

                </View>
              </AppContainer>
            </ScrollView>
            {
              (!(openModal || openPHQ2Modal) && survey_id === 1) &&
              <Footer
                page={page}
                percent={percentCompleted()}
                navigation={navigation}
                required={required}
                nextPage={nextPage}
                questions={surveyQuestions}
                goBackCall={goBackCall}
                route={route}
                showProgressBar={survey_id === 1}
              />
            }

            {openModal && (
              <ConfirmationModal
                open={openModal}
                setOpen={setOpenModal}
                onPress={markSurveyCompleted}
                buttonTitle={"Finish!"}
                icon={<SurveyFinishedIcon height={80} width={80} />}
                surveyFinish
                header={finsihModalData?.header}
                body={finsihModalData?.body}
              />
            )}

            {/* 
              Depression survey modal 
              for phq2 status.
             */}
            {openPHQ2Modal && (
              <ConfirmationModal
                open={openPHQ2Modal}
                setOpen={setOpenPHQ2Modal}
                onPress={PHQ2ModalData?.onButtonClick}
                buttonTitle={PHQ2ModalData?.buttonTitle}
                icon={<SurveyFinishedIcon height={80} width={80} />}
                surveyFinish
                header={PHQ2ModalData?.header}
                body={PHQ2ModalData?.content}
              />
            )}
          </View>

        </AppKeyboardAvoidingView>
      </AppLayout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    flexGrow: 1,
    // marginBottom: 20,
    marginHorizontal: -MARGINS.mb3,
  },
  exitBtn: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  link: {
    marginBottom: 30,
    marginHorizontal: 0,
  },
  question: {
    alignSelf: "stretch",
    flexGrow: 1,
  },
  required: {
    backgroundColor: COLORS.mediumBlue,
    padding: MARGINS.mb2,
    width: "100%",
  },
  boxShadow: {
    marginBottom: MARGINS.mb3,
    padding: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3
  },
});
