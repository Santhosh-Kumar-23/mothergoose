import React, { useEffect, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { getUserVitals, getUserVitals_V2API, get_hnc_vitals } from "../../../api";
import AppContainer from "../../../components/AppContainer";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppScrollView from "../../../components/AppScrollView";
import AppText from "../../../components/AppText";
import VitalsCard from "../../../components/VitalsCard";
import { AppContext } from "../../../context";
import { SurveyContext } from "../../../context/surveyContext";
import { getPrePregnancyWeight, getVitalCards } from "../../../utils/pregnancy";
import { useIsFocused } from '@react-navigation/native';

export default function VitalsScreen({ navigation }) {
  const { user, userVisitVitals, userQuestionAnswer, educationArticles, HNC_Vitals, setHNC_Vitals, CounterVitailsData } = useContext(AppContext);
  const { surveyAnswers } = useContext(SurveyContext);
  const [vitalCards, setVitalCards] = useState([]);
  const isFocused = useIsFocused();

  const getUserHNCvitals = async () => {
    const data = await get_hnc_vitals(user.id)

    if (!_.isEmpty(data)) {
      await setHNC_Vitals(data)
    } else {
      setHNC_Vitals([])
    }
  }

  useEffect(() => {
    // getUserVitals(user.id);
    getUserVitals_V2API(user.id, user?.pregnancy?.id);
    getUserHNCvitals()
  }, [isFocused]);

  // TODO: is gonna be refactored the time gonna add
  // blood pressure functionality
  useEffect(() => {
    const prePregnancyWeight = getPrePregnancyWeight(
      userQuestionAnswer,
      surveyAnswers
    );

    const { gestational_age } = user?.pregnancy?.attributes;
    console.log("gestational_age bla bla", gestational_age)


    if (userVisitVitals)
      setVitalCards(
        getVitalCards(userVisitVitals, prePregnancyWeight, educationArticles, HNC_Vitals, CounterVitailsData, gestational_age)
      );
  }, [userVisitVitals, isFocused]);

  return (
    <AppSafeAreaView>
      <AppScrollView>
        <AppContainer>
          <AppText h1 bold mb4>
            My Vitals
          </AppText>
          <View style={styles.cardContainer}>
            {vitalCards.map((vitals, i) => (
              <VitalsCard
                key={i}
                title={vitals.title}
                body={vitals.body}
                icon={vitals.icon}
                article={vitals?.article}
                navigation={navigation}
              />
            ))}
          </View>
        </AppContainer>
      </AppScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
