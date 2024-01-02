import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, TouchableOpacity, ActivityIndicator, Platform, Text } from "react-native";
// import { LineChart } from "react-native-chart-kit";
import { LineChart } from "react-native-gifted-charts";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppText from "../../../components/AppText";
import AppScrollView from "../../../components/AppScrollView";
import AppContainer from "../../../components/AppContainer";
import TabHeader from "../../../components/TabHeader";
import VitalsHeader from "../../../components/VitalsHeader";
import { STYLEOBJECTS } from "../../../utils/styles";
import { bloodPressureScreenArticle } from "../../../fakeData";
import { COLORS, MARGINS } from "../../../utils/styles";
import VitalsFeaturedArticle from "../../../components/VitalsFeaturedArticle";
import GraphIcon from "../../../../assets/svgs/GraphIcon.svg";
import { AppContext } from "../../../context";
import {
  getVitalGraphMonthLabels,
  get_user_vitals,
  HIGH_BLOOD_PRESSURE_ARTICLE,
} from "../../../utils/pregnancy";
import _ from "lodash";
import LinkIcon from "../../../../assets/svgs/LinkIcon.svg";
import { vitals_articles, get_mod_articles } from "../../../api";
import VitalsTipsArticleViewNew from "../../../components/VitalsTipsArticleViewNew";
import { useIsFocused } from '@react-navigation/native';
/**
 * Screen that details about blood pressure.
 * Plots a graph, tells lowest highest and average gragh
 * @param {object} navigation - Object containing navigation information
 */
export default function BloodPressureScreen({ navigation, route }) {
  const { article } = route.params;

  const isIos = Platform.OS === 'ios';
  const isIpad = isIos && Platform.isPad;

  const isFocused = useIsFocused();

  const { user, userVisitVitals, HNC_Vitals } = useContext(AppContext);

  const { gestational_age } = user?.pregnancy?.attributes;

  var info4 = "Blood Pressure Cuff User Manual" // "Blood Pressure Cuff User Manual for you"

  const vitals = get_user_vitals(userVisitVitals, "BP", HNC_Vitals); // It includes both visit and HNC vitals

  // console.log("BP_Screen userVisitVitals ", userVisitVitals)
  // console.log("BP_Screen HNC_Vitals", HNC_Vitals) // systolic: val2, diastolic: val1
  // console.log("over all BP_Screen vitals to show on graph ", vitals)

  const { title, subtitle, image } = bloodPressureScreenArticle;

  const systolics = vitals?.map((vital) =>
    Number(vital?.blood_pressure_systolic)
  );
  const diastolics = vitals?.map((vital) =>
    Number(vital?.blood_pressure_diastolic)
  );

  const [systolicsGraphData, setSystolicsGrpahData] = useState([])
  const [diastolicsGraphData, setDiastolicsGrpahData] = useState([])

  const [educationDetails, setEducationDetails] = useState([])
  const [favArticleIds__, setFavArticleIds] = useState([]);

  useEffect(() => {
    if (systolics.length) {
      setSystolicsGrpahData([])
      setDiastolicsGrpahData([])
      if (systolics.length) {
        systolics.map((val, key) => {
          setSystolicsGrpahData(pre => [...pre, { value: val, dataPointText: val }])
        })
        diastolics.map((val, key) => {
          setDiastolicsGrpahData(pre => [...pre, { value: val, dataPointText: val }])
        })
      }
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

  const getBP_Articles = async () => {
    await setEducationDetails([])
    var BPArticleIds = []
    var BPArticleIds = await vitals_articles(user?.id, "bp")
    // console.log("BPArticleIds", BPArticleIds)

    await BPArticleIds.map((val) => {
      setEducationDetails(exdata => [...exdata, val])
    })
  }

  useEffect(() => {
    getBP_Articles()
  }, [])

  useEffect(() => {
    if (gestational_age)
      getFavArticlesIds()
  }, [isFocused])

  const min =
    systolics?.length &&
    Math.min(...systolics.filter((systolic) => systolic)) +
    "/" +
    Math.min(...diastolics.filter((diabetes) => diabetes));
  const max =
    systolics?.length &&
    Math.max(...systolics.filter((systolic) => systolic)) +
    "/" +
    Math.max(...diastolics.filter((systolic) => systolic));

  const filteredSystolics = systolics.filter((systolic) => systolic);
  // // console.log("filteredSystolics", filteredSystolics)
  const filteredDiastolics = diastolics.filter((diastolic) => diastolic);
  // // console.log("filteredDiastolics", filteredDiastolics)

  /** Calculate average */
  const averageSystolic = Math.round(
    _.sum(filteredSystolics) / filteredSystolics?.length
  );
  const averageDiastolic = Math.round(
    _.sum(filteredDiastolics) / filteredDiastolics?.length
  );
  const average = averageSystolic && `${averageSystolic}/${averageDiastolic}`;

  const blood_pressure_status = () => {
    const bp = average && average?.split("/");
    const systolic = bp[0];
    const diastolic = bp[1];

    if (systolic > 140 || diastolic > 90) return 1;
    else if (systolic < 90) return 2;

    return 0;
  };

  // // console.log("vitals getVitalGraphMonthLabels", vitals)
  const labels = getVitalGraphMonthLabels(
    vitals?.map((data) => data.visit_date)
  );
  // // console.log("labels", labels)

  const blood_pressure = ["normal", "high", "low"];
  const abnormal_blood_pressure = blood_pressure_status() !== 0;

  const { width } = Dimensions.get("window");

  const getHideIndexes = () => {
    return systolics.map((systolic, index) => {
      if (systolic === 0) {
        systolics[index] = (systolics[index + 1] + systolics[index - 1]) / 2;
        diastolics[index] = (diastolics[index + 1] + diastolics[index - 1]) / 2;
        return index;
      }
    });
  };

  const averageValueHeader = (
    <View style={[styles.averageHeader, STYLEOBJECTS.boxShadow]}>
      <View style={styles.headerLabel}>
        <AppText small primartDark semibold>
          Average Summary
        </AppText>
      </View>
      <View style={styles.mb3}>
        <View style={styles.flex}>
          <AppText
            h1
            green={!abnormal_blood_pressure}
            error={abnormal_blood_pressure}
            textAlignCenter
            style={styles.mr2}
          >
            {average}
          </AppText>
          <AppText
            green={!abnormal_blood_pressure}
            error={abnormal_blood_pressure}
          >
            mmhg
          </AppText>
        </View>
        <AppText
          h4
          bold
          green={!abnormal_blood_pressure}
          error={abnormal_blood_pressure}
          mb2
          textAlignCenter
        >
          Your blood pressure is {blood_pressure[blood_pressure_status()]}!
        </AppText>
        <AppText textAlignCenter>Some info message here</AppText>
      </View>
    </View>
  );

  const chartWidth =
    systolics?.length > 4 ? width + (systolics?.length - 4) * 150 : width - 30;

  return (
    <AppSafeAreaView edges={["left", "right"]}>
      <AppScrollView>
        <AppContainer>
          <VitalsHeader
            label="Monthly Blood Pressure Summary"
            left={{
              label: "Highest",
              value: max,
            }}
            center={{ label: "Average", value: average }}
            right={{ label: "Lowest", value: min }}
          />
          <View style={styles.chartContainer}>
            {/* DOCS: https://www.npmjs.com/package/react-native-chart-kit */}
            {systolics?.length ? (
              <View style={{ height: isIpad ? Dimensions.get('window').height * 0.35 : 300, flexDirection: "column", marginBottom: 10 }}>
                <View>
                  {/* <LineChart
                      data={{
                        labels,
                        datasets: [
                          {
                            data: systolics,
                            color: () => `rgba(15, 59, 111, 1)`,
                          },
                          {
                            data: diastolics,
                            color: () => `rgba(255, 104, 254, 1)`,
                          },
                        ],
                      }}
                      width={chartWidth}
                      height={200}
                      fromNumber={200}
                      fromZero={true}
                      withShadow={false}
                      hidePointsAtIndex={getHideIndexes()}
                      segments={4}
                      chartConfig={{
                        backgroundColor: COLORS,
                        backgroundGradientFrom: COLORS.white,
                        backgroundGradientTo: COLORS.white,
                        decimalPlaces: 0, // optional, defaults to 2dp
                        strokeWidth: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) =>
                          `rgba(0, 0, 0, ${opacity})`,
                        style: {
                          borderRadius: 16,
                        },
                        propsForDots: {
                          r: "4",
                          strokeWidth: "1",
                        },
                      }}
                      style={styles.chart}
                    /> */}
                  {
                    (systolicsGraphData.length > 0 && diastolicsGraphData.length) && (systolicsGraphData.length == diastolicsGraphData.length) ?
                      <LineChart
                        thickness1={2}
                        thickness2={2}
                        data={systolicsGraphData}
                        data2={diastolicsGraphData}
                        xAxisLabelTexts={labels}
                        height={isIpad ? Dimensions.get('window').height * 0.3 : 250}
                        width={isIpad ? Dimensions.get('screen').width * 0.88 : Dimensions.get('screen').width * 0.75}
                        left={10}
                        showVerticalLines
                        spacing={80}
                        initialSpacing={50}
                        color1={COLORS.darkBlue}
                        color2={COLORS.shockingPink}
                        textColor1={COLORS.darkBlue}
                        textColor2={COLORS.darkBlue}
                        dataPointsHeight={6}
                        dataPointsWidth={6}
                        dataPointsColor1={COLORS.darkBlue}
                        dataPointsColor2={COLORS.shockingPink}
                        textShiftY={-2}
                        textShiftX={-5}
                        textFontSize={12}

                        xAxisThickness={1}
                        yAxisThickness={1}
                        xAxisColor={"#a3a3a3"}
                        yAxisColor={"#a3a3a3"}
                        xAxisIndicesHeight={5}
                        xAxisLabelTextStyle={{ color: "#424242", width: 80, marginLeft: 15, fontSize: 12 }}
                        yAxisTextStyle={{ color: "#424242", fontSize: 12 }}
                      // yAxisLabelSuffix={" lbs"}
                      />
                      :
                      <Text style={{ color: COLORS.black }}>Loading graph...</Text>
                  }

                </View>
              </View>
            ) : (
              <View style={styles.iconContainer}>
                <GraphIcon style={styles.mb4} />
                <AppText textAlignCenter>
                  No sessions have been recorded
                </AppText>
              </View>
            )}
            {systolics?.length ? (
              <View style={styles.footer}>
                <View style={styles.graphLegend}>
                  <AppText gray>Systolic</AppText>
                  <View style={[styles.blue, styles.line]} />
                </View>
                <View style={styles.graphLegend}>
                  <AppText gray>Diastolic</AppText>
                  <View style={[styles.pink, styles.line]} />
                </View>
              </View>
            ) : null}

            {/* {systolics?.length ? ( */}
            <AppText textAlignCenter gray h3m mt2>There may be up to a 30 minute lag in your most recent measurement appearing here</AppText>
            {/* ) : null
            } */}
          </View>

          {/* <VitalsFeaturedArticle
            image={image}
            title={title}
            subtitle={subtitle}
            navigation={navigation}
            article={article}
            linkText="What to know about blood pressure during your pregnancy"
          /> */}

          {
            educationDetails?.length > 0 ?
              <View style={styles.mb2}>
                <VitalsTipsArticleViewNew
                  title={"About My Blood Pressure"}
                  // subTitle={""}
                  bannerImage="bpicon"
                  navigation={navigation}
                  articles={educationDetails}
                  favArticleIds={favArticleIds__ || []}
                  counterModule={"bp"}
                />
              </View>
              :
              <View style={{ height: 110, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" />
              </View>

          }

          <AppText bold h3 blue>{info4} <TouchableOpacity
            onPress={() => {
              navigation.navigate("CustomWebview", {
                WebURL: process.env.BPcuff_user_manual_link,
                headerTitle: "BP Cuff user manual",
                BackNavScreen: ""
              })
            }}
          >
            <LinkIcon height={18} width={18} />
          </TouchableOpacity>
          </AppText>


        </AppContainer>
      </AppScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  averageHeader: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderRadius: 12,
    paddingVertical: MARGINS.mb2,
  },
  blue: {
    backgroundColor: "rgb(15, 59, 111)",
  },
  chart: {
    borderRadius: 16,
    // marginHorizontal: 10,
  },
  chartContainer: {
    paddingTop: MARGINS.mb4,
    paddingBottom: MARGINS.mb2
  },
  flex: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: MARGINS.mb35,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  graphLegend: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: MARGINS.mb2,
  },
  headerLabel: {
    borderBottomColor: COLORS.dividerLight,
    borderBottomWidth: 1,
    paddingHorizontal: MARGINS.mb3,
    paddingBottom: MARGINS.mb2,
  },
  iconContainer: {
    alignItems: "center",
    paddingVertical: MARGINS.mb4,
  },
  line: {
    height: 3,
    marginLeft: MARGINS.mb1,
    width: 40,
  },
  mb3: {
    marginBottom: MARGINS.mb3,
  },
  mb4: {
    marginBottom: MARGINS.mb4,
  },
  mr2: {
    marginRight: MARGINS.mb2,
  },
  pink: {
    backgroundColor: "rgb(255, 104, 254)",
  },
  underline: {
    textDecorationLine: "underline",
  },
  comingSoon: {
    marginTop: MARGINS.mb4,
  },
  horizontalScrollStyle: {
    marginBottom: MARGINS.mb3,
  },
});
