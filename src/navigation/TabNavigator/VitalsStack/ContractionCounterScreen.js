import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Pressable } from "react-native";
import AppContainer from "../../../components/AppContainer";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppScrollView from "../../../components/AppScrollView";
import AppText from "../../../components/AppText";
import { MARGINS, COLORS, AppActiveOpacity } from "../../../utils/styles";
import StartButton from '../../../../assets/StartButton.png'
import StopButton from '../../../../assets/StopButton.png'
import MgAppIcon from '../../../../assets/mgAppIcon.png'
import BellRing from '../../../../assets/bellRing.png'
import Pregnant_woman from '../../../../assets/pregnant_woman.png'
import Timeline from 'react-native-timeline-flatlist'
import { vitals_articles, get_mod_articles, contraction_counter_API, get_contraction_counter, contraction_counter_V2API, get_contraction_counter_V2API } from "../../../api";
import { getSpecificContentfulArticles } from "../../../api/contentful";
import { AppContext } from "../../../context";
import client from "../../../utils/contentful";
import VitalsTipsArticleViewNew from "../../../components/VitalsTipsArticleViewNew";
import { getCurrentDateTime } from "../../../utils/getCurrentDateTime";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get('screen').height;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTimer } from "../../../utils/counterhook/useTimer" //"./counterhook/useTimer";
import { DateToAMPM, DateTO_MDY, hmsTOshortwords, hmsTOwords, IntervalinHMS, SecondsToHMS, SecondsToHMSwords } from "../../../utils/TimeDiff";
import EmptyFolder from '../../../../assets/emptyFolder.png'
import { useIsFocused } from '@react-navigation/native';
import ExpandingInfo from "../../../components/ExpandingInfo";

export default function ContractionCounterScreen({ navigation, route }) {
  const { user } = useContext(AppContext);
  const { gestational_age } = user?.pregnancy?.attributes;
  var contractionIntruction = [
    "When you feel the tightening begin, press the START button",
    "When the tightening eases, press the STOP button",
    "The final time is the length of the contraction",
    "Go to the HISTORY screen to see how far apart the contractions are"
  ]
  /**
 * Return coming soon banner
 * till the screen functionlaity
 * is not working with real data.
 */
  // return (
  //   <AppSafeAreaView edges={["left", "right"]}>
  //     <AppText gray center h2 style={styles.comingSoon}>
  //       Coming soon!
  //     </AppText>
  //   </AppSafeAreaView>
  // );

  if (gestational_age < 196) { // 28 weeeks of gestational

    return (
      <AppSafeAreaView edges={["left", "right"]}>
        <View style={[styles.alignJustifyCenter, { height: "100%", width: "100%", padding: 15 }]}>
          <Image source={Pregnant_woman} style={{ height: 120, width: 120, resizeMode: "contain" }} />
          <AppText blue center h3 >
            Oops! This feature will be available after you reach 28 weeks of pregnancy.
          </AppText>
        </View>
      </AppSafeAreaView>
    );
  }

  const { todayDate, currentTime, currentTimeStamp } = getCurrentDateTime()

  const isFocused = useIsFocused();

  const { pause, reset, running, seconds, start, stop } = useTimer();
  // const contractArticleIds = ["2O54kwIcEeuT6El9sUYTkN", "7xGn0PoD9Nf5lHPnPbOm1O"];

  const [educationDetails, setEducationDetails] = useState([]);
  const [tabHeaderNum, setTabHeaderNum] = useState(1);
  const [CounterStart, setCounterStart] = useState(false);
  const [contractSecs, setContractSecs] = useState(0);

  const [countStartTime, setCountStartTime] = useState("--:--")
  const [countEndTime, setCountEndTime] = useState("--:--")

  const [countStartTimeStamp, setCountStartTimeStamp] = useState("")
  const [countEndTimeStamp, setCountEndTimeStamp] = useState("")
  const [contractionHistory, setContractionHistory] = useState([])

  const [sessionRecordDate, setsessionRecordDate] = useState("")

  const [favArticleIds__, setFavArticleIds] = useState([]);


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

  const getContractionArticles = async () => {
    setEducationDetails([])
    var contractArticleIds = []
    var contractArticleIds = await vitals_articles(user?.id, "contraction")
    contractArticleIds.map((val) => {
      setEducationDetails(exdata => [...exdata, val])
      // client.getEntry(val).then(async entry => {
      //   var image = await entry?.fields?.photo?.fields?.file?.url;
      //   if (image)
      //     var result = await Object.assign(entry.fields, { "id": entry.sys.id, "photo": "https:" + image });
      //   else
      //     result = await Object.assign(entry.fields, { "id": entry.sys.id, });
      //   setEducationDetails(exdata => [...exdata, result])
      // })
    })
  }

  const getStoredData = async () => {

    var started_time = await AsyncStorage.getItem("STARTTIMESTAMP")
    var stopped_time = await AsyncStorage.getItem("LASTTIMESTAMP")
    var recorded_date = await AsyncStorage.getItem("SESSIONDATE")

    // console.log("stopped_time", stopped_time)
    // console.log("recorded_date", recorded_date)
    var lastContractiontime = await AsyncStorage.getItem("C_TIMETAKEN") // In seconds

    var d = await SecondsToHMS(lastContractiontime)
    // await console.log("lastContractiontime", d)
    if (lastContractiontime > 0) {
      setContractSecs(lastContractiontime);
      setCountStartTimeStamp(started_time);
      setCountEndTimeStamp(stopped_time);
      setsessionRecordDate(recorded_date)
    }
  }

  const getHistorydata = async () => {
    // const res = await get_contraction_counter(user.id)
    const res = await get_contraction_counter_V2API(user.id, user?.pregnancy?.id)

    if (res.length > 0) {
      var arr = await res.map((data) => Object.assign(data, { "icon": MgAppIcon }));
      await setContractionHistory(arr)
    }
  }

  useEffect(() => {
    getStoredData()
    getHistorydata()
    setEducationDetails([])
    getContractionArticles()
  }, [])


  useEffect(() => {
    if (gestational_age)
      getFavArticlesIds()
  }, [isFocused])



  const clearContractionAsyncData = () => {
    AsyncStorage.removeItem("C_TIMETAKEN");
    AsyncStorage.removeItem("STARTTIME");
    AsyncStorage.removeItem("LASTTIME");
    AsyncStorage.removeItem("SESSIONDATE");
    AsyncStorage.removeItem("STARTTIMESTAMP");
    AsyncStorage.removeItem("LASTTIMESTAMP");
  }

  const sampleTimeLineData = [
    {
      time: '0 sec',
      title: '7 seconds',
      interval: "5m:34s",
      description:
        'Lorem Ipsum is simply dummy text of the printing.',
      lineColor: '#009688',
      icon: MgAppIcon,
      imageUrl:
        'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=250&w=250',
    },
    {
      time: '7 sec',
      title: '7 seconds',
      interval: "5m:34s",
      description:
        'Lorem Ipsum is simply dummy text of the printing.',
      icon: MgAppIcon,
      imageUrl:
        'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=250&w=250',
    },
    {
      time: '10 sec',
      title: '7 seconds',
      interval: "25m:34s",
      description:
        'Lorem Ipsum is simply dummy text of the printing.',
      icon: MgAppIcon,
      imageUrl:
        'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=250&w=250',
    },
    {
      time: '5 min',
      title: '7 seconds',
      interval: "3m:34s",
      description:
        'Lorem Ipsum is simply dummy text of the printing.',
      icon: MgAppIcon,
      imageUrl:
        'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=250&w=250',
    },
    {
      time: '10 sec',
      title: '7 seconds',
      interval: "",
      description:
        'Lorem Ipsum is simply dummy text of the printing.',
      icon: MgAppIcon,
      imageUrl:
        'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=250&w=250',
    }

  ];

  const TabHeaderView = () => {
    return (
      <View style={[styles.tabContainer, styles.alignJustifyBetween]}>
        <TouchableOpacity style={[{ backgroundColor: tabHeaderNum == 1 ? COLORS.InkBlue : COLORS.white }, styles.tabBtn, styles.alignJustifyCenter, styles.boxShadow]}
          onPress={() => { setTabHeaderNum(1) }}>
          <AppText h3 bold blue={!tabHeaderNum == 1} white={tabHeaderNum == 1}>Record</AppText>
        </TouchableOpacity>

        <TouchableOpacity style={[{ backgroundColor: tabHeaderNum == 2 ? COLORS.InkBlue : COLORS.white }, styles.tabBtn, styles.alignJustifyCenter, styles.boxShadow]}
          onPress={() => { setTabHeaderNum(2) }}>
          <AppText h3 bold blue={!tabHeaderNum == 2} white={tabHeaderNum == 2}>History</AppText>
        </TouchableOpacity>
      </View>
    )
  }

  const renderProgressTitle = () => {
    return (
      <>
        <View style={styles.progressTitleView}>
          {/* {
            CounterStart ?
              <>
                <AppText h3 bold blue>Contraction Counter is on progress</AppText>
                <AppText gray>Press the following button to stop the counter </AppText>
              </> :
              <>
                <AppText h3 bold blue>Contraction Counter is ready to start</AppText>
                <AppText gray>Press the following button to start the counter </AppText>
              </>
          } */}
          {/* <AppText bold textAlignCenter blue>When you feel the tightening begin, then press the start button. When the tightening eases completely then press the stop button. The final time is the length of the contraction. Then you can go to the history screen to see how far apart they are.</AppText> */}
        </View>
      </>
    )
  }

  const onStartCounter = () => {
    setContractSecs(0)
    setCounterStart(!CounterStart);
    start();
    setCountStartTime(currentTime);
    setCountStartTimeStamp(currentTimeStamp)
  }

  const onStopCounter = async () => {
    setContractSecs(seconds)
    setCounterStart(!CounterStart);
    stop();
    setCountEndTime(currentTime);
    await setCountEndTimeStamp(currentTimeStamp)
    setsessionRecordDate(todayDate)

    if (seconds > 0) {
      await AsyncStorage.setItem("C_TIMETAKEN", (seconds).toString());
      await AsyncStorage.setItem("STARTTIME", (countStartTime).toString());
      await AsyncStorage.setItem("STARTTIMESTAMP", (countStartTimeStamp).toString());
      await AsyncStorage.setItem("LASTTIME", (countEndTime).toString());
      await AsyncStorage.setItem("LASTTIMESTAMP", (currentTimeStamp).toString());
      await AsyncStorage.setItem("SESSIONDATE", (todayDate).toString());
    }
  }

  const renderStartStopBtn = () => {
    return (
      <>
        {
          !CounterStart ?
            <>
              <TouchableOpacity onPress={() => { onStartCounter() }}>
                <Image source={StartButton} style={styles.startBtnStyle} />
              </TouchableOpacity>
              <AppText bold RFh3 blue mt3>Start</AppText>
            </> :
            <>
              <TouchableOpacity onPress={() => { onStopCounter() }}>
                <Image source={StopButton} style={styles.startBtnStyle} />
              </TouchableOpacity>
              <AppText bold RFh3 blue mt3>Stop</AppText>
            </>
        }
      </>
    )
  }

  const renderStartEndTime = () => {
    return (
      <View style={[styles.saveRowView, styles.alignJustifyBetween]}>
        <View style={[styles.saveBtnView, styles.alignJustifyCenter]}>
          <AppText h3 blue>{countStartTime}</AppText>
          <AppText h3 bold blue>Start Time</AppText>
        </View>
        <View style={styles.saveBtnRowCenter} />
        <View style={[styles.saveBtnView, styles.alignJustifyCenter]}>
          <AppText h3 blue>{countEndTime}</AppText>
          <AppText h3 bold blue>End Time</AppText>
        </View>
      </View>
    )
  }


  const onResetClick = () => {
    if (CounterStart == false) {
      setContractSecs(0); // reset the last contract duration
      stop(); // stop the counter
      setCounterStart(false) // reset to start mode the button
      setCountStartTime("--:--")
      setCountEndTime("--:--")

      setCountStartTimeStamp("");
      setCountEndTimeStamp("");
      setsessionRecordDate("")

      clearContractionAsyncData();
    }

  }

  const onSaveClick = async () => {

    if (CounterStart == false) { // ensure the timer is stop.
      var data = {
        "user_id": user.id,
        "start_time": countStartTimeStamp,
        "end_time": countEndTimeStamp,
        "date": sessionRecordDate, //todayDate,
        "time_taken": SecondsToHMS(contractSecs)
      }
      // var res = await contraction_counter_API(data)
      var res = await contraction_counter_V2API(data, user?.pregnancy?.id)

      if (res.message == "added successfully") {
        getHistorydata(); // get the records history
        setContractSecs(0); // reset the last contract duration
        stop(); // stop the counter
        setCounterStart(false) // reset to start mode the button

        setCountStartTime("--:--")
        setCountEndTime("--:--")

        setCountStartTimeStamp("")
        setCountEndTimeStamp("")

        clearContractionAsyncData()
      } else {
        setContractSecs(0); // reset the last contract duration
        stop(); // stop the counter
        setCounterStart(false) // reset to start mode the button

        setCountStartTime("--:--")
        setCountEndTime("--:--")

        setCountStartTimeStamp("")
        setCountEndTimeStamp("")
      }
    }

  }

  const renderSaveResetBtn = () => {
    return (
      <View style={[styles.saveRowView, styles.alignJustifyBetween]}>
        <View style={[styles.saveBtnView, styles.alignJustifyCenter]}>
          <TouchableOpacity style={[styles.saveBtn, styles.alignJustifyCenter, styles.boxShadow, { backgroundColor: contractSecs ? COLORS.white : COLORS.lightGray2 }]}
            activeOpacity={contractSecs ? AppActiveOpacity : 1}
            onPress={() => {
              contractSecs && onSaveClick()
            }} >
            <AppText h3 bold blue>Save</AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.saveBtnRowCenter} />
        <View style={[styles.saveBtnView, styles.alignJustifyCenter]}>
          <TouchableOpacity style={[styles.saveBtn, styles.alignJustifyCenter, styles.boxShadow, { backgroundColor: contractSecs ? COLORS.white : COLORS.lightGray2 }]}
            activeOpacity={contractSecs ? AppActiveOpacity : 1}
            onPress={() => {
              contractSecs && onResetClick()
            }}
          >
            <AppText h3 bold blue>Reset</AppText>
          </TouchableOpacity>
        </View>
      </View>
    )
  }


  const renderTimeLineDetail = (rowData, sectionID, rowID) => {

    // if (rowData.description &&rowData.imageUrl)
    return (
      <View style={[styles.timeLineDescView]}>

        <View style={[styles.boxShadow, styles.timeLineDescInView, styles.alignJustifyStart]}>
          <View style={styles.timeLineDescLeftView}>
            <Image source={BellRing} style={styles.descImage} />
            <AppText bold h3 ml2>{hmsTOwords(rowData?.time_taken)}</AppText>
          </View>

          <View style={styles.timeLineDescRightView}>
            <AppText small gray mr2> {DateTO_MDY(rowData?.start_time)}</AppText>
            <AppText small gray mr2>{DateToAMPM(rowData?.start_time)}</AppText>
          </View>
        </View>
        {
          rowData?.delay_from_previous != "00:00:00" ? (
            Number(rowData?.delay_from_previous) > 3540 ?
              <AppText mb3>Time Between Contractions is more than 1 hour</AppText>
              : <AppText mb3>Time Between Contractions {SecondsToHMSwords((rowData?.delay_from_previous)?.split(".")[0])}</AppText>
          ) : null
        }
      </View>
    );
  };

  return (
    <AppSafeAreaView edges={["left", "right"]}>
      <AppScrollView>
        <AppContainer>
          {TabHeaderView()}

          {
            tabHeaderNum == 1 ?
              <>
                <View style={[styles.recordView, styles.alignJustifyCenter]}>
                  {/* {renderProgressTitle()} */}
                  <View style={{ width: "100%", marginBottom: MARGINS.mt3 }}>
                    <ExpandingInfo
                      content={contractionIntruction}
                      title="How to Use the Contraction Counter"
                      navigation={navigation}
                    />
                  </View>

                  <View style={[styles.counterSecView, styles.alignJustifyCenter]}>
                    <AppText RFh1 blue bold>{seconds}</AppText>
                    <AppText h3 gray bold>In Seconds</AppText>
                  </View>
                  {renderStartStopBtn()}

                  {
                    contractSecs ?

                      <AppText h3 mt3 bold blur>Last Contraction Duration: <AppText h3 mt3 bold shockingPink>{contractSecs} Seconds</AppText></AppText>
                      : null
                  }


                  {renderStartEndTime()}
                  {renderSaveResetBtn()}

                  <VitalsTipsArticleViewNew
                    title={"About Contraction in pregnancy"}
                    bannerImage="ContractionCounterIcon"
                    navigation={navigation}
                    articles={educationDetails}
                    favArticleIds={favArticleIds__}
                    counterModule={"contraction"}

                  />

                </View>
              </> :
              null
          }
          {
            tabHeaderNum == 2 ?
              <>
                <View style={[styles.durationView, styles.alignJustifyCenter, styles.boxShadow]}>

                  <View style={[styles.durationLeftView, styles.alignJustifyCenter]}>
                    <AppText h2m InkBlue bold textAlignCenter>{contractionHistory.length ? hmsTOshortwords(contractionHistory[0]?.time_taken) : "--"}</AppText>
                    <AppText textAlignCenter blue h4 bold>Last contraction Duration</AppText>
                  </View>
                  <View style={{
                    height: '70%',
                    width: 1,
                    backgroundColor: '#a3a3a3',
                    // width: "10%", backgroundColor: "red"
                  }} />
                  <View style={[styles.durationLeftView, styles.alignJustifyCenter]}>
                    <AppText h2m shockingPink bold>{contractionHistory.length ? (IntervalinHMS(contractionHistory[0]?.end_time) + " ago") : "--"}</AppText>
                    <AppText textAlignCenter blue h4 bold>Time since last contraction</AppText>
                  </View>

                </View>

                <View style={styles.container}>
                  {
                    contractionHistory.length ?
                      <Timeline
                        data={contractionHistory}
                        circleSize={20}
                        circleColor="rgba(0,0,0,0)"
                        lineColor="rgb(45,156,219)"
                        timeContainerStyle={{ minWidth: 52, marginTop: 5, }}
                        timeStyle={{
                          textAlign: 'center',
                          backgroundColor: COLORS.darkBlue,
                          color: 'white',
                          padding: 5,
                          borderRadius: 13,
                        }}
                        descriptionStyle={{ color: 'gray', marginTop: 5 }}
                        options={{
                          style: { paddingTop: 5 },
                        }}
                        innerCircle={'icon'}
                        // onEventPress={(item) =>
                        //   alert(`${item.title} at ${item.time}`)
                        // }
                        renderDetail={renderTimeLineDetail}
                        showTime={false}
                      />
                      :

                      <View style={[styles.graphIconContainer, styles.alignJustifyCenter]}>
                        <Image source={EmptyFolder} style={{ height: 150, width: 200, resizeMode: "contain" }} />
                        <AppText textAlignCenter >
                          No sessions have been recorded
                        </AppText>
                      </View>
                  }

                </View>
              </> :
              null
          }

        </AppContainer>
      </AppScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  comingSoon: {
    marginTop: MARGINS.mb4,
  },
  alignJustifyCenter: {
    alignItems: "center",
    justifyContent: "center"
  },
  alignJustifyStart: {
    alignItems: "center",
    justifyContent: "flex-start"
  },
  alignJustifyBetween: {
    alignItems: "center",
    justifyContent: "space-between"
  },
  tabContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row"
  },
  boxShadow: {
    marginBottom: MARGINS.mb3,
    padding: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3
  },
  tabBtn: {
    height: "65%",
    width: "45%",
    borderRadius: 15,
  },
  saveBtn: {
    height: "65%",
    width: "80%",
    borderRadius: 15,
    backgroundColor: COLORS.white
  },
  progressTitleView: {
    width: "100%",
    alignItems: "center",
    marginBottom: MARGINS.mb4
  },
  firstTime: {
    width: "30%",
    height: "90%",
    alignItems: "center",
    justifyContent: "flex-end"
  },

  horizontalScrollStyle: {
    marginBottom: MARGINS.mb3,
  },
  chart: {
    borderRadius: 16,
    // marginHorizontal: 10,
  },
  chartContainer: {
    paddingVertical: MARGINS.mb4,
  },



  container: {
    flex: 1,
  },
  title: {
    padding: 16,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    flexDirection: 'row',
    paddingRight: 50,
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textDescriptionStyle: {
    // marginLeft: 10,
    color: 'gray',
  },
  timeLineDescView: { marginRight: 10 },
  timeLineDescInView: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingRight: 5,
    flexDirection: "row",
    width: "100%",
    top: -5
  },
  timeLineDescLeftView: {
    width: "70%",
    flexDirection: "row"
  },
  timeLineDescRightView: {
    alignItems: "flex-end",
    width: "30%",
  },
  descImage: {
    height: 20,
    width: 20
  },
  durationView: {
    backgroundColor: COLORS.white,
    width: "100%",
    height: 100,
    marginTop: MARGINS.mt3,
    padding: MARGINS.mb3,
    borderRadius: 12,
    flexDirection: "row"
  },
  durationLeftView: {
    width: "49%",
    height: "100%",
    paddingHorizontal: 15
  },
  recordView: {
    width: "100%",
    // marginTop: MARGINS.mt3
  },
  counterSecView: {
    width: "100%",
    marginBottom: MARGINS.mt4
  },
  startBtnStyle: {
    height: 100,
    width: 100,
    resizeMode: "contain"
  },
  saveBtnView: {
    width: "40%",
    height: "90%"
  },
  saveBtnRowCenter: {
    width: "20%",
  },
  saveRowView: {
    width: "100%",
    height: 55,
    flexDirection: "row",
    marginTop: MARGINS.mt4
  },
  extraPadding: {
    padding: MARGINS.mb2,
  },
  PressableContainer: {
    flexDirection: "row",
    marginBottom: MARGINS.mb1,
    paddingTop: MARGINS.mb3,
    width: "100%",
  },
  graphIconContainer: {
    marginTop: "40%"
  }

});
