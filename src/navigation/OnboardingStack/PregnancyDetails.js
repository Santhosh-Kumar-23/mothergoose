import React, { useContext, useEffect } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { getUserSurveys, setPregnancyDetails, setPregnancyDetails_V1API, setPregnancyDetails_V2API, getUser } from "../../api";
import { AppContext } from "../../context";
import AppButton from "../../components/AppButton";
import AppLayout from "../../components/AppLayout";
import AppScrollView from "../../components/AppScrollView";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import AppContainer from "../../components/AppContainer";
import AppText from "../../components/AppText";
import AppKeyboardAvoidingView from "../../components/AppKeyboardAvoidingView";
import AppDropDown from "../../components/AppDropDown";
import { useForm } from "react-hook-form";
import { COLORS, MARGINS } from "../../utils/styles";
import _ from "lodash";
import AppTextInput from "../../components/AppTextInput";
import { pregnancy_details_validation } from "../../utils/validations";
import moment from "moment";
import { dateInFormatMMDDYYY } from "../../utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { RemoveAllAsync } from "../../utils/removeAllAsync";
import { useState } from "react";

export default function PregnancyDetails({ navigation, route }) {
  const { user, setError, setUser, handle_reminderarticle } = useContext(AppContext);
  const { settings } = route.params || {};
  const { pregnancy } = user || {};
  const [pregnancy_id, setPregnancy_id] = useState("")
  const [currentPregAttri, setCurrentPregAttri] = useState({})

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(pregnancy_details_validation),
  });

  /**
   * Trigger form validation to validate
   * form data on first render.
   */
  useEffect(() => {
    trigger();
  }, []);


  useEffect(() => {
    getUser(user?.id).then((res) => {
      const _pregnancy = _.find(res?.included, { type: "pregnancy" });
      console.log("_pregnancy", _pregnancy)
      if (!_.isEmpty(_pregnancy)) {
        setPregnancy_id(_pregnancy?.id);
        setCurrentPregAttri(_pregnancy?.attributes)
      }
    })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  /**
   * Convert default dates to format MM/DD/YYY to pass fields
   * validation (if already exist).
   */
  let due_date = pregnancy?.attributes?.estimated_delivery_date;
  if (!_.isEmpty(due_date)) {
    due_date = dateInFormatMMDDYYY(due_date);
  }
  let menstrual_period = pregnancy?.attributes?.menstrual_period;
  if (!_.isEmpty(menstrual_period)) {
    menstrual_period = dateInFormatMMDDYYY(menstrual_period);
  }
  const number_of_babies = pregnancy?.attributes?.number_of_babies;

  const handleProviderPreferences = async (formData) => {
    formData.number_of_babies = await formData.number_of_babies.label;
    formData.pregnancy_method = await formData.pregnancy_method.label;

    for (const key in formData) {
      if (_.isEmpty(formData[key])) {
        delete formData[key];
      }
      if (moment(formData[key], "MM/DD/YYYY", true).isValid()) {
        formData[key] = moment(formData[key]).format("YYYY/MM/DD");
      }
    }

    try {

      if (formData?.estimated_delivery_date == undefined) {
        await Object.assign(formData, { estimated_delivery_date: null });
      } else if (formData?.menstrual_period == undefined) {
        await Object.assign(formData, { menstrual_period: null });
      }

      // const res = await setPregnancyDetails_V1API(user.id, formData);
      const res = await setPregnancyDetails_V2API(user.id, formData, pregnancy_id);
      const surveys = await getUserSurveys(user.id);
      const risk_survey = _.find(surveys?.data, {
        attributes: { survey_id: 1, survey_number: 1 },
      });

      /**
       * Update user context to update pregnancy
       * data without app reload.
       */
      let user_context = await Object.assign(user, {});
      user_context.pregnancy = await res.data;

      await setUser(user_context);

      if (settings || route?.params?.Homescreen) {
        await handle_reminderarticle(user.id)
        if (route?.params?.Homescreen) {
          await RemoveAllAsync()
        }
        await navigation.goBack();
      } else {
        navigation.navigate("Survey", {
          onboarding: "onboarding",
          survey_id: risk_survey?.attributes?.survey_id, // Risk survey ID
          user_survey_id: Number(risk_survey?.id), // user survey ID (risk survey)
          survey_title: "Finish Risk Survey" // In onboarding, given risk survey ID, So here is "Finish Risk Survey"
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const pregnancyInputValues = [
    {
      name: "number_of_babies",
      placeholder: "Babies Count",
      type: "dropdown",
      selections: [{ label: "1" }, { label: "2" }, { label: "3" }],
      defaultValue: {
        label: number_of_babies ? `${number_of_babies}` : "1",
      },
      label: "How many babies are you pregnant with",
      required: true,
    },
    {
      name: "pregnancy_method",
      placeholder: "Pregnancy Method",
      type: "dropdown",
      selections: [{ label: "Naturally" }, { label: "IVF/Embryo Transfer" }],
      defaultValue: {
        label: pregnancy?.attributes?.pregnancy_method || "Naturally",
      },
      label: "How did you get pregnant?",
      required: true,
    },
  ];
  return (
    <AppSafeAreaView edges={["left", "right", "bottom"]}>
      <AppKeyboardAvoidingView>
        <AppLayout onboarding>
          <AppScrollView>
            <AppContainer transparent style={styles.containerStyle}>
              <AppText h3 bold center mb3>
                Your Pregnancy Details
              </AppText>
              {pregnancyInputValues.map((input, i) => (
                <View
                  key={`provider-input-${i}`}
                  style={[
                    styles.mb3,
                    { zIndex: pregnancyInputValues.length - i },
                  ]}
                >
                  <AppText gray mb1>
                    {input.label}
                    {input.required && (
                      <AppText style={styles.requiredStyle}>
                        {" "}
                        (required)
                      </AppText>
                    )}
                  </AppText>
                  <AppDropDown
                    name={input.name}
                    defaultValue={input.defaultValue}
                    selections={input.selections}
                    control={control}
                    label={input.label}
                    rounded
                    multiSelect={input.multiSelect}
                  />
                </View>
              ))}
              <AppText mb2>
                To provide personalized care, we need to know how far along you are. Please enter one of the following dates
                <AppText style={styles.requiredStyle}> (required)</AppText>
              </AppText>
              {[
                {
                  name: "estimated_delivery_date",
                  label: "What is your due date?",
                  defaultValue: due_date,
                },
                {
                  name: "menstrual_period",
                  label:
                    "What was the first day of your last menstrual period?",
                  defaultValue: menstrual_period,
                },
              ].map((input, index) => (
                <View key={index}
                // style={styles.mb3}
                >
                  <AppText gray mb1>
                    {input.label}
                  </AppText>
                  <AppTextInput
                    editable={currentPregAttri?.final_due_date != null ? false : true} // for MGHP528
                    name={input.name}
                    type="date"
                    control={control}
                    defaultValue={input.defaultValue}
                    mb2
                    placeholderText={"mm/dd/YYYY"}
                    errorBottom
                  />
                </View>
              ))}



              <AppText gray small mt3 mb2 textAlignCenter>
                {currentPregAttri?.final_due_date == null ? "Don't worry - you can change all of this in settings" : ""}
              </AppText>


              <AppButton
                title={settings ? "Save changes" : "Continue"}
                onPress={handleSubmit(handleProviderPreferences)}
                disabled={!isValid && currentPregAttri?.final_due_date != null ? true : false} // for MGHP528
                // disabled={!isValid}
                blue={isValid}
                gray={!isValid}
              // mt3
              />

              {!settings && (
                <Pressable
                  onPress={() => navigation.navigate("Mother Goose Support")}
                  style={styles.loginLink}
                >
                  <AppText small blue>
                    {" "}
                    Need help?
                  </AppText>
                  <AppText small blue underline>
                    {" "}
                    We are here{" "}
                  </AppText>
                </Pressable>
              )}



            </AppContainer>
          </AppScrollView>
        </AppLayout>
      </AppKeyboardAvoidingView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    display: "flex",
    paddingTop: MARGINS.mb2,
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
  },
  mb3: {
    marginBottom: MARGINS.mb3,
  },
  textContainer: {
    marginHorizontal: "10%",
    width: "80%",
  },
  requiredStyle: {
    color: COLORS.errorRed,
  },
});
