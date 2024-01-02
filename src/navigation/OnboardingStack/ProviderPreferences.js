import React, { useContext, useEffect } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { submitUserProviderPreferences } from "../../api";
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
import { MARGINS } from "../../utils/styles";
import _ from "lodash";

export default function ProviderPreferences({ navigation, route }) {
  const { user, setError, providerPreferences, setProviderPreferences } =
    useContext(AppContext);
  const { settings } = route.params || {};

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm({ mode: "onChange" });

  /**
   * Set iniitial form values for provider
   * preferences (if exists in context)
   */
  useEffect(() => {
    if (!_.isEmpty(providerPreferences)) {
      /**
       * For each input, lookup for provider preference
       * value in context. If exists set that value for
       * form field as default.
       *
       * if preference value is more than one that
       * means it is a multi select and must be set as an
       * arrary.
       * If no more, set value as an object.
       */
      inputValues.forEach((input) => {
        let preferences = providerPreferences[input.name];
        if (!_.isEmpty(preferences)) {
          if (!Array.isArray(preferences)) {
            preferences = [preferences];
          }
          if (preferences.length > 1) {
            preferences = preferences.map((preference) => {
              return { label: preference };
            });
          } else {
            preferences = { label: preferences[0] };
          }
          setValue(input.name, preferences);
        }
      });
    }
  }, []);

  const handleProviderPreferences = async ({
    gender,
    language,
    race,
    provider_network,
  }) => {
    try {
      const res = await submitUserProviderPreferences(
        user.id,
        gender,
        language,
        race,
        provider_network
      );
      setProviderPreferences(res.data?.attributes);

      if (settings) {
        navigation.goBack();
      } else {
        navigation.navigate("Pregnancy Details");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AppSafeAreaView edges={["left", "right", "bottom"]}>
      <AppKeyboardAvoidingView>
        <AppLayout onboarding>
          <AppScrollView>
            <AppContainer transparent style={styles.containerStyle}>
              {!settings && (
                <>
                  <AppText
                    textAlignCenter
                    small
                    mb3
                    style={styles.textContainer}
                  >
                    You may choose to see or may be referred to a member of the
                    Mother Goose care team. This may be a lactation consultant,
                    doula, mental health professional, physical therapist or
                    nutritionist.
                  </AppText>
                  <AppText
                    textAlignCenter
                    small
                    mb3
                    style={styles.textContainer}
                  >
                    We want to be sure you are matched with someone who makes
                    you most confortable. Please choose your preferences for
                    that person.
                  </AppText>
                  <AppText center h3 bold blue mb3 widthFull>
                    Choose your provider preferences
                  </AppText>
                </>
              )}
              {inputValues.map((input, i) => (
                <View
                  key={`provider-input-${i}`}
                  style={[styles.mb3, { zIndex: inputValues.length - i }]}
                >
                  <AppText gray mb1>
                    {input.label}
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
              <AppButton
                title={settings ? "Save changes" : "Continue"}
                onPress={handleSubmit(handleProviderPreferences)}
                disabled={!isValid}
                blue={isValid}
                gray={!isValid}
                mt3
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
    justifyContent: "center",
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
});

const inputValues = [
  {
    name: "gender",
    placeholder: "Sex",
    type: "dropdown",
    selections: [{ label: "Female" }, { label: "Male" }],
    defaultValue: "",
    label: "Sex",
  },
  {
    name: "language",
    placeholder: "Last Name",
    type: "dropdown",
    selections: [{ label: "English" }, { label: "Spanish" }],
    defaultValue: "",
    label: "Language",
  },
  {
    name: "provider_network",
    placeholder: "Provider Network",
    type: "dropdown",
    selections: [
      { label: "In Network" },
      { label: "Out of Network" },
      { label: "No Preference" },
    ],
    defaultValue: "",
    label: "Provider Network",
  },
  {
    name: "race",
    placeholder: "Last Name",
    type: "dropdown",
    selections: [
      { label: "American Indian or Alaska Native" },
      { label: "Asian" },
      { label: "Black or African American" },
      { label: "Native Hawaiian or Other Pacific Islander" },
      { label: "White" },
      { label: "No Preference" },
    ],
    defaultValue: "",
    label: "Race (Select all that apply)",
    multiSelect: true,
  },
];
