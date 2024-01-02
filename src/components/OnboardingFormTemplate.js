import React, { Fragment, useContext, useState, useEffect } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { useForm } from "react-hook-form";
import _ from "lodash";

import AppContainer from "./AppContainer";
import AppSafeAreaView from "./AppSafeAreaView";
import AppText from "./AppText";
import AppLayout from "./AppLayout";
import { COLORS, MARGINS, STYLEOBJECTS } from "../utils/styles";
import AppTextInput from "./AppTextInput";
import AppButton from "./AppButton";
import AppKeyboardAvoidingView from "./AppKeyboardAvoidingView";
import { AppContext } from "../context";
import { getBirthday, getPrivacyPages } from "../utils/helpers";
import AppModal from "./AppModal";
import AppScrollView from "./AppScrollView";

export default function OnboardingFormTemplate({
  body,
  header,
  inputName,
  keyboardType,
  handleInput,
  buttonText,
  button2Text,
  handle2submit,
  extraInfo,
  navigation,
  subLink,
  subLinkText,
  inputValidation,
  placeholder,
  subLinkNavigate,
  headerBig,
  type = "default",
  buttonContainerStyle,
  secondButtonText,
  handleSecondInput,
  inputValues,
  apiError,
  errorVisible,
  setErrorVisible,
  endScreen,
  modalVisible,
  modalTitle,
  modalSubtitle,
  modalClose,
  modalBody,
  bodySmall,
  showTermsAgreement,
  hideSubLink,
  getStart
}) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "onChange" });

  const {
    user: { first_name, last_name, date_of_birth },
  } = useContext(AppContext);

  const { user_State } = useContext(AppContext);

  const onSubmit = async (data) => {
    data = await getStart ? Object.assign(data, { "nycheck": checkConsent }) : data

    handleInput(data, setError, reset);
  };

  const [privacyPages, setPrivacyPages] = useState([]);

  const initialize_privacy_pages = async () => {
    const pages = await getPrivacyPages(true);
    setPrivacyPages(pages);
  };

  const [checkConsent, setCheckConsent] = useState(false)

  useEffect(() => {
    initialize_privacy_pages();
  }, []);

  return (
    <AppSafeAreaView edges={["left", "right", "bottom"]}>
      <AppKeyboardAvoidingView>
        <AppLayout onboarding>
          <AppScrollView>
            <AppContainer transparent>
              <View style={styles.container}>
                <View>
                  {endScreen ? (
                    <View style={styles.endScreen}>{body}</View>
                  ) : (
                    <View style={styles.body}>
                      <AppText
                        textAlignCenter
                        small={bodySmall}
                        mb3
                        style={styles.textContainer}
                      >
                        {body}
                      </AppText>
                      <AppText
                        center
                        h2={headerBig}
                        h3={!headerBig}
                        bold
                        blue
                        mb3
                        widthFull
                      >
                        {header}
                      </AppText>
                    </View>
                  )}
                  {type === "default" && (
                    <AppTextInput
                      name={inputName}
                      validation={inputValidation}
                      control={control}
                      keyboardType={keyboardType}
                      error={errors}
                      mb2
                      placeHolderText={placeholder}
                      apiError={apiError}
                      errorVisible={errorVisible}
                      setErrorVisible={setErrorVisible}
                      errorBottom
                    />
                  )}
                  {type === "enterDetails" && (
                    <View>
                      {inputValues?.map((input) => {
                        return (
                          <View key={input.name}>
                            <AppText small gray mb2>
                              {input.label}
                            </AppText>
                            <AppTextInput
                              name={input.name}
                              control={control}
                              keyboardType={input.keyboardType}
                              error={errors}
                              mb3
                              validation={input.validation}
                              placeholderText={input.placeholderText}
                              apiError={apiError || input.apiError}
                              errorBottom
                              secureTextEntry={input.secureTextEntry}
                              type={input.type}
                              defaultValue={input?.value}
                            />
                          </View>
                        );
                      })}
                    </View>
                  )}
                  {type === "confirmProfile" && (
                    <View style={[STYLEOBJECTS.boxShadow, styles.infoBox]}>
                      {[
                        { name: "Name", value: first_name + " " + last_name },
                        {
                          name: "Date Of Birth",
                          value: getBirthday(date_of_birth),
                        },
                      ].map((data, i) => (
                        <Fragment key={`profile-item-${i}`}>
                          <View style={styles.infoBoxItem}>
                            <AppText gray>{data.name}</AppText>
                            <AppText bold>{data.value}</AppText>
                          </View>
                          {i === 0 && <View style={styles.hr} />}
                        </Fragment>
                      ))}
                    </View>
                  )}
                  <AppText gray small mt1 mb3 textAlignCenter>
                    {extraInfo}
                  </AppText>
                </View>
                {/* <View>
                {type === "enterDetails" && (
                  <AppText small blue>Check the content</AppText>
                )}
                </View> */}
                <View style={buttonContainerStyle}>
                  {/* {(type === "enterDetails" && getStart && user_State?.id == "37") && (
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                      <Pressable onPress={() => { setCheckConsent(!checkConsent) }} style={{ marginRight: 8 }}>
                        {
                          checkConsent ?
                            <Check />
                            :
                            <Uncheck />
                        }
                      </Pressable>

                      <AppText small mb3 blue >Please agree the </AppText>
                      <Pressable
                        onPress={() =>
                          navigation.navigate("Mother Goose Support")
                        }
                        style={styles.loginLink}
                      >
                        <AppText small blue underline  style={{ color: COLORS.mediumBlue }}>
                          {"NYS consent"}
                        </AppText>
                      </Pressable>
                    </View>
                  )} */}
                  <AppButton
                    title={buttonText}
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isValid}
                    // disabled={(type === "enterDetails" && user_State?.id == "37" && getStart) ? (checkConsent ? !isValid : true) : !isValid}
                    blue={isValid}
                    gray={!isValid}
                  />
                  {
                    button2Text ?
                      <AppButton
                        title={button2Text}
                        onPress={handle2submit}
                        // disabled={!isValid}
                        // disabled={(type === "enterDetails" && user_State?.id == "37" && getStart) ? (checkConsent ? !isValid : true) : !isValid}
                        blue //={isValid}
                        gray //={!isValid}
                      />
                      : null
                  }
                  {showTermsAgreement && (
                    <View style={styles.termsStyles}>
                      <AppText small blue center>
                        By tapping Continue you are agreeing to the{" "}
                        {privacyPages.map((page, index) => {
                          // != 37 --> means, we dont how show NY for non NYS
                          if ((page.id == "57SnNoVnIdUShrOifBFQPv" && user_State?.id != "37")) {
                            return (
                              <View />
                            );
                          } else {
                            return (
                              <>
                                <AppText
                                  key={index}
                                  onPress={() =>
                                    navigation.navigate("Privacy Page", {
                                      page,
                                      onboarding: true,
                                    })
                                  }
                                  small
                                  style={{ color: COLORS.mediumBlue }}
                                  underline
                                >
                                  {page.linkTitle || page.title}
                                </AppText>
                                {index < privacyPages.length - 2 && ", "}
                                {index == privacyPages.length - 2 && ", and "}
                              </>
                            );
                          }

                        })}
                      </AppText>
                    </View>
                  )}
                  {secondButtonText && (
                    <AppButton
                      title={secondButtonText}
                      onPress={handleSecondInput}
                      disabled={false}
                      blue
                    />
                  )}
                  {!hideSubLink && (
                    <Pressable
                      onPress={() =>
                        subLinkNavigate
                          ? navigation.navigate(subLinkNavigate)
                          : navigation.navigate("Mother Goose Support")
                      }
                      style={styles.loginLink}
                    >
                      {subLinkText && (
                        <AppText small blue>
                          {" "}
                          {subLinkText}{" "}
                        </AppText>
                      )}
                      <AppText small blue underline>
                        {" "}
                        {subLink || "Log In"}{" "}
                      </AppText>
                    </Pressable>
                  )}
                </View>
              </View>
            </AppContainer>
            <AppModal
              isVisible={modalVisible}
              title={modalTitle}
              subtitle={modalSubtitle}
              body={modalBody}
              handleClose={modalClose}
            />
          </AppScrollView>
        </AppLayout>
      </AppKeyboardAvoidingView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    width: "100%",
    zIndex: -1,
  },
  container: {
    justifyContent: "space-between",
    flexGrow: 1,
    marginBottom: "26%",
  },
  endScreen: {
    alignItems: "center",
    width: "100%",
  },
  hr: {
    borderColor: COLORS.lightGray,
    borderWidth: 0.5,
    width: "100%",
  },
  infoBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: MARGINS.mb35,
    marginVertical: MARGINS.mb2,
  },
  infoBoxItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: MARGINS.mb35,
    paddingVertical: MARGINS.mb3,
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
  },
  termsStyles: {
    alignItems: "flex-start",
    marginBottom: MARGINS.mb3,
    marginHorizontal: MARGINS.mb3,
  },
  textContainer: {
    marginHorizontal: "10%",
    width: "80%",
  },
});
