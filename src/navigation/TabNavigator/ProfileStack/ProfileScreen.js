import React, { useState, useEffect, useContext } from "react";
import { Pressable, StyleSheet, Image, View } from "react-native";
import AppContainer from "../../../components/AppContainer";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppScrollView from "../../../components/AppScrollView";
import AppText from "../../../components/AppText";
import SettingsIcon from "../../../../assets/svgs/SettingsIcon.svg";
import { MARGINS } from "../../../utils/styles";
import { fakeCareTeams, fakeInsurance, fakeUser } from "../../../fakeData";
import CareTeamCards from "../../../components/CareTeamCards";
import ExpandingCard from "../../../components/ExpandingCard";
import OptionsModal from "../../../components/OptionsModal";
// import * as ImagePicker from "expo-image-picker";
import { ImagePicker, launchCamera, launchImageLibrary } from "react-native-image-picker";
import { AppContext } from "../../../context";
import { dateInFormatMMDDYYY, getBirthday } from "../../../utils/helpers";
import {
  formatGestionalAgeToWeeksDays,
  getPrePregnancyWeight,
} from "../../../utils/pregnancy";
import _ from "lodash";
import { SurveyContext } from "../../../context/surveyContext";

const photoOptions = [
  "Remove current photo",
  "Take photo",
  "Choose from library",
];

export default function ProfileScreen({ navigation, route }) {
  const [openModal, setOpenModal] = useState(false);
  const [photo, setPhoto] = useState(fakeUser.image);
  const [selected, setSelected] = useState("");
  const { user, userQuestionAnswer } = useContext(AppContext);
  const { surveyAnswers } = useContext(SurveyContext);

  const { user_insurances } = user || {};
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      setPhoto(result);
    }
  };

  const takeImage = async () => {
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!res.cancelled) {
      setPhoto(result);
    }
  };

  /**
   * Method to return user insurance data.
   */
  const getUserInsuranceData = () => {
    const insurance_info = user_insurances?.length
      ? user_insurances[user_insurances?.length - 1] // ?.attributes
      : {};
    return insurance_info;
  };

  useEffect(() => {
    if (selected === photoOptions[0]) {
      setPhoto(null);
    } else if (selected === photoOptions[1]) {
      takeImage();
    } else if (selected === photoOptions[2]) {
      pickImage();
    }
  }, [selected]);

  /**
   * Return boolean of if it is patient's first pregnancy
   * */
  const isFirstPregnancy = () => {
    let firstPregnancy = null;
    let answer = _.find(userQuestionAnswer, { attributes: { question_id: 1 } });

    if (!_.isEmpty(answer)) {
      firstPregnancy = answer.attributes?.user_inputs[0] === "Yes";
    }
    return firstPregnancy;
  };

  /**
   * Find answer from user_question_answer based on
   * find_type provided (label, question_id).
   * @param {object} findObject - object to find data against
   */
  const findAnswer = (findObject) => {
    return _.find(userQuestionAnswer, {
      attributes: findObject,
    });
  };

  /**
   * Returns user pregnancy info
   */
  const userPregnancyInfo = () => {
    let pregnancyInfo = {};
    let height = null;
    height = findAnswer({ question_id: 5 });
    if (_.isEmpty(height)) {
      height = findAnswer({ question_id: 55 });
    }

    if (!_.isEmpty(height)) {
      const { user_inputs } = height?.attributes;
      pregnancyInfo.height = `${user_inputs[0]}'${user_inputs[1]}`;
    }
    pregnancyInfo.prePregnancyWeight = getPrePregnancyWeight(
      userQuestionAnswer,
      surveyAnswers
    );
    pregnancyInfo.firstPregnancy = isFirstPregnancy();

    if (!_.isEmpty(user.pregnancy)) {
      const { attributes } = user?.pregnancy || {};
      const {
        estimated_delivery_date,
        pregnancy_method,
        number_of_babies,
        gestational_age,
      } = attributes || {};

      if (!_.isEmpty(estimated_delivery_date)) {
        pregnancyInfo.dueDate = dateInFormatMMDDYYY(estimated_delivery_date);
      }
      pregnancyInfo.pregnancyMethod = pregnancy_method;
      if (number_of_babies) {
        pregnancyInfo.numberOfBabies = number_of_babies;
      }

      /**
       * Gestational age is returned as number of
       * days from pregnancy start_date.
       */
      if (gestational_age) {
        pregnancyInfo.gestational_age =
          formatGestionalAgeToWeeksDays(gestational_age);
      }
    }

    return pregnancyInfo;
  };

  const birthday = getBirthday(user.date_of_birth);

  return (
    <AppSafeAreaView edges={["top", "left", "right"]}>
      <AppScrollView>
        <AppContainer>
          <View style={styles.headingContainer}>
            <AppText h1 bold>
              My Profile
            </AppText>
            <Pressable
              style={styles.settings}
              onPress={() => navigation.navigate("Profile Settings")}
            >
              <SettingsIcon height={16} width={16} />
            </Pressable>
          </View>
          <View style={styles.userCard}>
            <View>
              <AppText h2 bold mb1>
                {user.first_name} {user.last_name}
              </AppText>
              <AppText gray>
                Date of Birth:{" "}
                <AppText bold gray>
                  {birthday}
                </AppText>
              </AppText>
            </View>
          </View>
          <AppText h3 bold>
            My care team
          </AppText>
          {fakeCareTeams.map((team, i) => (
            <View key={"care-teams-" + i} style={styles.mv2}>
              <CareTeamCards
                name={team.name}
                label={team.label}
                icon={team.icon}
                team={team.team}
                teamProfile={i % 2 === 0}
                navigation={navigation}
              />
            </View>
          ))}
          <ExpandingCard
            content={userPregnancyInfo()}
            pregnancy
            title="Pregnancy Details"
            editPage="Pregnancy Details"
            navigation={navigation}
          />
          <ExpandingCard
            content={getUserInsuranceData()}
            insurance
            title="Insurance Information"
          />
        </AppContainer>
      </AppScrollView>
      <OptionsModal
        open={openModal}
        setOpen={setOpenModal}
        setSelected={setSelected}
        title={"Change profile photo"}
        options={photoOptions}
        getPermission
      />
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 32,
    height: 64,
    width: 64,
  },
  headingContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: MARGINS.mb4,
  },
  mv2: {
    marginVertical: MARGINS.mb2,
  },
  settings: {
    padding: MARGINS.mb3,
  },
  userCard: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 24,
  },
});
