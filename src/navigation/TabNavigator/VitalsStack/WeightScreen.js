import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, ActivityIndicator, Platform, Text } from "react-native";
// import { LineChart } from "react-native-chart-kit";
import { LineChart } from "react-native-gifted-charts";
import AppContainer from "../../../components/AppContainer";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppScrollView from "../../../components/AppScrollView";
import AppText from "../../../components/AppText";
import TabHeader from "../../../components/TabHeader";
import VitalsHeader from "../../../components/VitalsHeader";
import { fakeUser, weightScreenArticle } from "../../../fakeData";
import { COLORS, MARGINS } from "../../../utils/styles";
import GraphIcon from "../../../../assets/svgs/GraphIcon.svg";
import VitalsFeaturedArticle from "../../../components/VitalsFeaturedArticle";
import { AppContext } from "../../../context";
import _ from "lodash";
import moment from "moment";
import {
  getPrePregnancyWeight,
  getVitalGraphMonthLabels,
  get_user_vitals,
  getUserWeightByVitals,
} from "../../../utils/pregnancy";
import { SurveyContext } from "../../../context/surveyContext";
import { vitals_articles, get_mod_articles } from "../../../api";
import VitalsTipsArticleViewNew from "../../../components/VitalsTipsArticleViewNew";
import { useIsFocused } from '@react-navigation/native';

export default function WeightScreen({ navigation, route }) {
  const { article } = route.params;

  const isIos = Platform.OS === 'ios';
  const isIpad = isIos && Platform.isPad;


  const isFocused = useIsFocused();

  const { userVisitVitals, userQuestionAnswer, user, HNC_Vitals } = useContext(AppContext);
  const { surveyAnswers } = useContext(SurveyContext);

  const { gestational_age } = user?.pregnancy?.attributes;

  const prePregnancyWeight = getPrePregnancyWeight(
    userQuestionAnswer,
    surveyAnswers
  );

  const getWeekData = () => {
    const startWeight = prePregnancyWeight || 0;

    return weekLabels.map((week) => {
      return startWeight + (week + 1);
    });
  };

  const weekLabels = [0, 5, 10, 15, 20, 25, 30, 35];
  // console.log("HNC_Vitals WeightScreen", HNC_Vitals)
  let vitals = get_user_vitals(userVisitVitals, "Weight", HNC_Vitals);
  // console.log("WeightScreen vitals", vitals)

  // console.log("prePregnancyWeight", prePregnancyWeight)
  if (prePregnancyWeight) {
    vitals?.unshift({
      /** Extract number from a string */
      vital_weight: Number(prePregnancyWeight.replace(/\D/g, "")),
      visit_date: user?.pregnancy?.attributes?.menstrual_period || user?.created_at,
    });
  }

  const options = ["Month"];
  const [selected, setSelected] = useState("Month");
  const [graphData, setGraphdata] = useState([])

  const [educationDetails, setEducationDetails] = useState([])
  const [favArticleIds__, setFavArticleIds] = useState([]);


  const data =
    selected === "Week"
      ? getWeekData(vitals)
      : vitals.map((data) => data.vital_weight);
  const labels =
    selected === "Week"
      ? weekLabels
      : getVitalGraphMonthLabels(vitals.map((data) => data.visit_date));
  const { image, title, subtitle } = weightScreenArticle;
  let average = data.reduce((acc, curr) => (acc += curr), 0);
  average = Math.round(average / data.filter((weight) => weight).length);
  average = average && average + " lbs";

  const currentWeight = getUserWeightByVitals(userVisitVitals, "Weight", HNC_Vitals);

  const { width } = Dimensions.get("window");


  useEffect(() => {
    if (data.length) {
      setGraphdata([])
      data.map((val, key) => {
        setGraphdata(pre => [...pre, { value: val, dataPointText: val + " lbs" }])
      })
    }
  }, [])

  const getFavArticlesIds = async () => {
    await setFavArticleIds([])
    const data = await get_mod_articles(user.id, gestational_age)
    if (data?.fav) {
      var arr = []
      await (data?.fav).map((val, key) => {
        arr.push(val.id)
      })
      setFavArticleIds([...arr])
    }
  }

  const getWeightArticles = async () => {
    await setEducationDetails([])
    var WeightArticleIds = []
    var WeightArticleIds = await vitals_articles(user?.id, "weight")
    // console.log("WeightArticleIds", WeightArticleIds)

    await WeightArticleIds.map((val) => {
      setEducationDetails(exdata => [...exdata, val])
    })
  }

  useEffect(() => {
    getWeightArticles()
  }, [])

  useEffect(() => {
    if (gestational_age)
      getFavArticlesIds()
  }, [isFocused])

  const getHideIndexes = () => {
    return data.map((data, index) => {
      if (data === 0) {
        data[index] = data[index + 1];
        return index;
      }
    });
  };

  const screenBody = (
    <>
      {/* <LineChart
        data={{
          labels,
          datasets: [
            {
              data,
              color: (opacity = 1) => `rgba(255, 104, 254, ${opacity})`,
            },
          ],
        }}
        width={data?.length > 4 ? width + (data?.length - 4) * 150 : width - 30} // from react-native
        height={250}
        fromNumber={200}
        withDots={true}
        segments={4}
        yAxisLabel=""
        xAxisLabel=""
        withVerticalLines={false}
        withShadow={false}
        yAxisInterval={10} // optional, defaults to 1
        hidePointsAtIndex={getHideIndexes()}
        chartConfig={{
          backgroundColor: COLORS,
          backgroundGradientFrom: COLORS.white,
          backgroundGradientTo: COLORS.white,
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 0.5) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "4",
          },
        }}
        style={styles.chart}
      /> */}

      {
        graphData?.length > 0 ?
          <LineChart
            thickness1={2}
            thickness2={2}
            data={graphData}
            xAxisLabelTexts={labels}
            // data2={lineData2}
            height={Dimensions.get('window').height * 0.3}
            width={isIpad ? Dimensions.get('screen').width * 0.88 : Dimensions.get('screen').width * 0.75}
            left={10}
            showVerticalLines
            spacing={90}
            initialSpacing={50}
            color1={COLORS.InkBlue}
            // color2="orange"
            textColor1={COLORS.darkBlue}
            // textColor2={"red"}
            dataPointsHeight={6}
            dataPointsWidth={6}
            dataPointsColor1={COLORS.shockingPink}
            // dataPointsColor2="red"
            textShiftY={-2}
            textShiftX={-5}
            textFontSize={12}

            xAxisThickness={1}
            yAxisThickness={1}
            xAxisColor={"#a3a3a3"}
            yAxisColor={"#a3a3a3"}
            xAxisIndicesHeight={5}
            xAxisLabelTextStyle={{ color: "#424242", width: 80, marginLeft: 20, fontSize: 12 }}
            yAxisTextStyle={{ color: "#424242", fontSize: 12 }}
          // yAxisLabelSuffix={" lbs"}
          />
          :

          <Text style={{ color: COLORS.black }}>Loading graph...</Text>
      }

    </>
  );

  return (
    <AppSafeAreaView edges={["left", "right"]}>
      <AppScrollView>
        <AppContainer style={styles.appContainerStyle}>
          <VitalsHeader
            label="Weight Summary"
            left={{
              label: "Pre-pregnancy",
              value: prePregnancyWeight || "--",
            }}
            center={{ label: "Average", value: average }}
            right={{ label: "Current", value: currentWeight }}
          />

          <View style={[styles.chartContainer, /*styles.chartContainer2*/]}>
            {data.length ? (
              <View style={{ display: "flex", height: isIpad ? Dimensions.get('window').height * 0.35 : 300, flexDirection: "column",/* marginBottom: 20 */ }}>
                <View>
                  {screenBody}
                </View>
              </View>
              // <AppScrollView horizontal>{screenBody}</AppScrollView>
            ) : (
              <View style={styles.iconContainer}>
                <GraphIcon style={styles.mb4} />
                <AppText textAlignCenter>No sessions have been recorded</AppText>
              </View>
            )}
          </View>

          {/* <VitalsFeaturedArticle
            image={image}
            title={title}
            subtitle={subtitle}
            article={article}
            navigation={navigation}
            linkText="What to know about weight gain during your pregnancy"
          /> */}

          {
            educationDetails?.length > 0 ?
              <View style={styles.mb3}>
                <VitalsTipsArticleViewNew
                  title={"Weight Gain During Pregnancy"}
                  // subTitle={""}
                  bannerImage="weighticon"
                  navigation={navigation}
                  articles={educationDetails}
                  favArticleIds={favArticleIds__ || []}
                  counterModule={"weight"}
                />
              </View>
              : <View style={{ height: 110, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" />
              </View>
          }
        </AppContainer>
      </AppScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainerStyle: {
    paddingBottom: 0,
  },
  chart: {
    borderRadius: 16,
    marginHorizontal: 10,
  },
  chartContainer: {
    paddingTop: MARGINS.mb4,
  },
  chartContainer2: {
    paddingLeft: 20,
    paddingBottom: 20
  },
  iconContainer: {
    alignItems: "center",
    paddingVertical: MARGINS.mb4,
  },
  mb4: {
    marginBottom: MARGINS.mb4,
  },
});
