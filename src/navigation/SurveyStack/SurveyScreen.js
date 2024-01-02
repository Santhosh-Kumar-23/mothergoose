import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import AppButton from "../../components/AppButton";
import AppText from "../../components/AppText";
import Link from "../../components/Link";
import AppKeyboardAvoidingView from "../../components/AppKeyboardAvoidingView";
import AppLayout from "../../components/AppLayout";
import AppContainer from "../../components/AppContainer";
import { MARGINS } from "../../utils/styles";
import AppCheckBox from "../../components/AppCheckbox";
import { useForm } from "react-hook-form";
import { SurveyContext } from "../../context/surveyContext";
import { AppContext } from "../../context";
import {
  getSurveyQuestions,
  createUserSurvey,
  getUserSurveys,
} from "../../api";
import _ from "lodash";
import AppScrollView from "../../components/AppScrollView";

export default function SurveyScreen({ navigation, route }) {
  const { survey_id, user_survey_id, onboarding, survey_title } =
    route?.params || {};
  // const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AppContext);
  const { setUserSurvey, initializeSurvey } = useContext(SurveyContext);

  const { surveyQuestions, setSurveyId } = useContext(SurveyContext);

  const { setLoggedIn, setError, userQuestionAnswer, setUserQuestionAnswer } =
    useContext(AppContext);

  const is_risk_survey = survey_id === 1;
  const is_depression_survey = survey_id === 2;

  /**
   * Find answer for a question from user_question_answer
   * list.
   * @param {Integer} question_id - Question id to search question against.
   */
  const findAnswerForQuestion = (question_id) => {
    // console.log("findAnswerForQuestion question_id", question_id)
    return _.find(userQuestionAnswer, {
      attributes: {
        question_id: parseInt(question_id),
        user_survey_id: user_survey_id,
      },
    });
  };
  /**
   * Find question by id from survey questions array
   * Convert id as a string because every question Id is
   * a string.
   * @param {Integer} question_id - Id for a question to find
   */
  const findQuestion = (question_id) => {

    // console.log("findQuestion question_id", question_id)
    return _.find(surveyQuestions, {
      id: `${question_id}`,
    });
  };

  /**
   * Find a question that is not answered in dependent question
   * series (a series is number of question dependet on the
   * next question in chain, once series check is complete it reverts back to
   * original order of the survey questions).
   * @param {Integer} question_id_to_start - Dependent question Id to start
   * question search from risk survey.
   */
  const checkQuestionDependency = (question_id_to_start) => {
    let dependent = true;
    let question_to_check_id = question_id_to_start;

    if (question_to_check_id && question_to_check_id >= 1) {
      while (dependent) {
        const nested_dependent_question = findQuestion(question_to_check_id);
        const question_answer = findAnswerForQuestion(
          nested_dependent_question?.id
        );

        if (_.isEmpty(question_answer)) {
          return nested_dependent_question?.id;
        }
        if (nested_dependent_question?.attributes?.dependent_question_id) {
          question_to_check_id =
            nested_dependent_question?.attributes?.dependent_question_id;
        } else {
          dependent = false;
        }
      }
    }

    return undefined;
  };

  /**
   * Calculate for how many survey questions user has already
   * provided answer for last time logged in.
   * Start from last unanswered question.
   *
   * Find a question in order, find answer for that question in user_question_answer
   * list, keep searching until answers not found for a question and return id for that
   * question to start survey from.
   * If all questions are answered, take to the last question.
   */
  const calculateSurveyProgress = () => {
    const orderArray = surveyQuestions?.map(
      (survey_question) => survey_question?.attributes.order
    );
    let orderCount = 1;
    const maxOrder = Math.max(...orderArray);

    const response = {
      start_question: orderCount,
      dependent: false,
    };

    try {
      while (orderCount <= maxOrder) {
        const question = _.find(surveyQuestions, {
          attributes: { order: orderCount },
        });
        const user_question_answer = _.find(userQuestionAnswer, {
          attributes: {
            question_id: parseInt(question.id),
            user_survey_id: user_survey_id,
          },
        });

        if (_.isEmpty(user_question_answer)) {
          return {
            start_question: parseInt(question?.attributes?.order),
            dependent: false,
            index: orderCount,
          };
        } else {
          const dependent_question_conditions =
            question?.attributes?.dependent_question_conditions;
          if (!_.isEmpty(dependent_question_conditions)) {
            Object.keys(dependent_question_conditions).forEach((key) => {
              if (
                user_question_answer?.attributes?.answer_ids.includes(
                  parseInt(key)
                )
              ) {
                const dependent_question = dependent_question_conditions[key];
                const dependent_question_answer = _.find(userQuestionAnswer, {
                  attributes: {
                    question_id: dependent_question?.question_id,
                    user_survey_id: user_survey_id,
                  },
                });
                if (_.isEmpty(dependent_question_answer)) {
                  throw {
                    start_question: parseInt(dependent_question?.question_id),
                    dependent: true,
                  };
                }
                const nested_dependent_question = findQuestion(
                  dependent_question?.question_id
                );
                const nested_dependent_start_question = checkQuestionDependency(
                  nested_dependent_question?.attributes?.dependent_question_id
                );
                if (nested_dependent_start_question) {
                  throw {
                    start_question: nested_dependent_start_question,
                    dependent: true,
                  };
                }
              }
            });
          }
        }
        orderCount = orderCount + 1;
      }
    } catch (exeption) {
      return { ...exeption, index: orderCount };
    }

    return {
      start_question: maxOrder,
      index: maxOrder,
      dependent: false,
    };
  };

  /**
   * Navigate to survey questions screen
   * with all defined props.
   */
  const start_survey = async () => {
    const { start_question, dependent, index } = await calculateSurveyProgress();
    var quesParam = {
      page: start_question,
      index: index,
      onboarding,
      dependent: dependent,
      survey_id,
      user_survey_id,
    }

    // console.log("quesParam", quesParam)

    await navigation.navigate("Survey Question", {
      page: start_question,
      index: index,
      onboarding,
      dependent: dependent,
      survey_id,
      user_survey_id,
    });
  };

  /**
   * handleUserSurvey method used to make
   * sure user answers for a survey are
   * always up to date.
   */
  const handleUserSurvey = async () => {
    try {
      const surveys = await getUserSurveys(user.id);

      const unfinished = await surveys?.data.filter(
        (survey) => !survey?.attributes?.completed_at
      );
      if (unfinished.length) {
        await setUserQuestionAnswer(surveys?.included);
      }
      await setTimeout(() => {
        setLoading(false);
      }, 2000);
      // TODO:
      // For next deploy
      /**
       * If is depression survey, then start survey directly without
       * requesting for proceed instructions from user
       */
      // is_depression_survey && start_survey();
    } catch (error) {
      setError(error.message);

      // TODO:
      // For next deploy
      /**
       * Go back to home screen if error
       * in initiliazing depression survey.
       */
      // is_depression_survey && navigation.goBack();
    }
  };
  useEffect(() => {
    /**
     * Initialize Survey based on the
     * which survey user selects from
     * home screen.
     */
    initializeSurvey(survey_id);
    handleUserSurvey();
  }, []);

  /**
   * TODO: Centralize all copy in survey
   * screen and survey questions screen to
   * one file.
   */
  /**
   * Render risk survey paragraph
   */
  const render_risk_survey_content = () => (
    <AppText h3 gray textAlignCenter mb4>
      Please take the Mother Goose pregnancy survey. Having answers from you is
      the best way for us to tell your obstetrician about any issues we can help
      improve as a team. We will work with you and your obstetrician to help you
      have the best chance for a healthy pregnancy and new baby.
    </AppText>
  );

  /**
   * Render buttons on the screen,
   * Giving instructions to either
   * proceed the survey or go back.
   */
  const render_buttons_section = () => (
    <View style={styles.buttonContainer}>
      <AppButton
        big
        blue
        onPress={start_survey}
        title="Let's start"
        disabled={loading}
        alignSelf
      />
      <Link
        h3
        dark
        alignSelfCenter
        onPress={() =>
          navigation.navigate(onboarding ? "Onboarding Complete" : "Home")
        }
      >
        I'll come back later
      </Link>
    </View>
  );

  return (
    <AppSafeAreaView>
      <AppLayout onboarding>
        <AppKeyboardAvoidingView>
          <AppScrollView>
            <AppContainer transparent>
              <View style={styles.body}>
                <View style={styles.topSection}>
                  <AppText h3 bold blue textAlignCenter mb4>
                    {survey_title}
                  </AppText>
                  {is_risk_survey && render_risk_survey_content()}
                  {loading ? <ActivityIndicator size={"large"} /> : null}
                </View>
                {render_buttons_section()}
              </View>
            </AppContainer>
          </AppScrollView>
        </AppKeyboardAvoidingView>
      </AppLayout>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flexGrow: 1,
    height: "70%",
    justifyContent: "space-between",
    marginTop: "30%",
  },
  buttonContainer: {
    marginHorizontal: MARGINS.mb3,
  },
  checkbox: {
    marginRight: MARGINS.mb2,
    marginTop: 2,
  },
  disclaimerContainer: {
    flexDirection: "row",
    marginBottom: MARGINS.mb3,
  },
  topSection: {
    marginHorizontal: MARGINS.mb4,
  },
});
