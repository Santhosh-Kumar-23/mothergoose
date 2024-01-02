import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Dimensions, ActivityIndicator } from "react-native";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppScrollView from "../../../components/AppScrollView";
import AppContainer from "../../../components/AppContainer";
import AppText from "../../../components/AppText";
import AppFlatList from '../../../components/AppFlatList';
import { AppActiveOpacity, COLORS, MARGINS } from "../../../utils/styles";
import BabySimle from '../../../../assets/BabySimle.png'
import Babyfeet2 from '../../../../assets/babyfeet2.png'
import EmptyFolder from '../../../../assets/emptyFolder.png'
import Pregnant_woman from '../../../../assets/pregnant_woman.png'

import App from "../../../../App";
import { Shadow } from 'react-native-shadow-2';
// import { LineChart as LChart } from "react-native-chart-kit";
import { LineChart } from "react-native-gifted-charts";
import VitalsTipsArticleViewNew from "../../../components/VitalsTipsArticleViewNew";
import moment from "moment";
import GraphIcon from "../../../../assets/svgs/GraphIcon.svg";
import { AppContext } from "../../../context";
import { vitals_articles, get_mod_articles, send_kicks_details, kick_history, send_kicks_details_V2API } from "../../../api";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentDateTime } from "../../../utils/getCurrentDateTime";
import { CalculateAverage, DateTO_MDY, IntervalTaken, Time24hrTo12hr } from "../../../utils/TimeDiff";

import { useIsFocused } from '@react-navigation/native';

export default function KickCounterScreen({ navigation, route }) {

  const { user, setCounterVitailsData } = useContext(AppContext);
  const { gestational_age } = user?.pregnancy?.attributes;

  /**
   * Return coming soon banner
   * till the screen functionlaity
   * is not completed.
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




  const isFocused = useIsFocused();
  const screenWidth = Dimensions.get("screen").width;
  const screenHeight = Dimensions.get('screen').height;

  const { width } = Dimensions.get("window");
  // const TabObj = {
  //   tab1: true,
  //   tab2: false,
  //   tab3: false
  // };
  const [firstKickTime, setFirstKickTime] = useState("--:--");
  const [lastKickTime, setLastKickTime] = useState("--:--");
  const [sessionTotal, setSessionTotal] = useState(0);
  const [kickCount, setKickCount] = useState(0);
  const [educationDetails, setEducationDetails] = useState([])
  const [SaveloadSpinner, setSaveLoadSpinner] = useState(false)
  const [ResetloadSpinner, setResetLoadSpinner] = useState(false)
  const [todaySessionCompleted, setTodaySessionCompleted] = useState(false)
  const [everyCounts, setEveryCounts] = useState([])
  const [TimeTaken, setTimeTaken] = useState(0)

  // const babykickArticleIds = ["2ikNhRqPgqNy3G58hgc0vg"];

  const [favArticleIds__, setFavArticleIds] = useState([]);

  const [tabHeaderNum, setTabHeaderNum] = useState(1);
  const [tabGraphNum, setTabGraphNum] = useState(1);

  const [graphData, setGraphData] = useState([]);
  const [graphLabels, setGraphLabels] = useState([]);
  const [KicksRecords, setKicksRecords] = useState([]);
  const [avgKicksDuration, setAvgkickDuration] = useState("00m:00s")
  // const graphLabels = ['06/01', '06/02', '06/03', '06/04', '06/05', '06/06', '06/07', '06/08', '06/09', '06/10', '06/11', '06/12', '06/13', '06/14']


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

  const getBabykickArticles = async () => {
    await setEducationDetails([])
    var babykickArticleIds = []
    var babykickArticleIds = await vitals_articles(user?.id, "kick")

    await babykickArticleIds.map((val) => {
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

  const get_kick_history = async () => {
    const res = await kick_history(user.id, user?.pregnancy?.id)
    let Klabs = []
    let Ktimes = []
    let KtimesAlone = []
    await res.length > 0 && res.map((val, key) => {
      // Ktimes.push(Number(val.total_time_taken));
      KtimesAlone.push(Number(val.total_time_taken));
      Ktimes.push({ value: Number(val.total_time_taken), dataPointText: val.total_time_taken + ' mins' })
      Klabs.push(moment(val.kicks_date).utc().format('DD-MMM-yyyy'));
    })
    var avg = CalculateAverage(KtimesAlone) + ""
    await setAvgkickDuration(avg.split(".")[0] + "m:" + avg.split(".")[1] + "s")
    // console.log("Ktimes", Ktimes)
    await setGraphData(Ktimes)
    // console.log("Klabs", Klabs)
    await setGraphLabels(Klabs)
    await setKicksRecords(res)

    // console.log((Ktimes.slice(0, 14)).reverse())
  }

  useEffect(() => {

    // clearKickAsyncData() //  This should be hidden, for manually clear the asyncstorage
    get_kick_history() //  get history data
    getStoredData()

    setEducationDetails([])
    getBabykickArticles()
  }, [])

  useEffect(() => {
    if (gestational_age)
      getFavArticlesIds()
  }, [isFocused])


  const activityData = [
    {
      date: "06-01-2022",
      first: "10:00 AM",
      last: "3:25 PM",
      duration: "0h:15m",
      kicks: "10"
    },
    {
      date: "06-02-2022",
      first: "10:00 AM",
      last: "3:25 PM",
      duration: "0h:15m",
      kicks: "10"
    },
    {
      date: "06-03-2022",
      first: "10:00 AM",
      last: "3:25 PM",
      duration: "0h:15m",
      kicks: "10"
    },
    {
      date: "06-04-2022",
      first: "10:00 AM",
      last: "3:25 PM",
      duration: "0h:15m",
      kicks: "10"
    },
    {
      date: "06-05-2022",
      first: "10:00 AM",
      last: "3:25 PM",
      duration: "0h:15m",
      kicks: "10"
    },
    {
      date: "06-06-2022",
      first: "10:00 AM",
      last: "3:25 PM",
      duration: "0h:15m",
      kicks: "10"
    },
    {
      date: "06-07-2022",
      first: "10:00 AM",
      last: "3:25 PM",
      duration: "0h:15m",
      kicks: "10"
    },
    {
      date: "06-08-2022",
      first: "10:00 AM",
      last: "3:25 PM",
      duration: "0h:15m",
      kicks: "10"
    },
    {
      date: "06-09-2022",
      first: "10:00 AM",
      last: "3:25 PM",
      duration: "0h:15m",
      kicks: "10"
    },
    {
      date: "06-10-2022",
      first: "10:00 AM",
      last: "3:25 PM",
      duration: "0h:15m",
      kicks: "10"
    },

  ]

  const onTabPress = async (tab) => {

    if (tab == "tab1") {
      setTabHeaderNum(1)
      // await setTabData({ ...tabData, ["tab1"]: true });
      // await setTabData({ ...tabData, ["tab2"]: false });
      // await setTabData({ ...tabData, ["tab3"]: false });
    } else if (tab == "tab2") {
      setTabHeaderNum(2)
      // await setTabData({ ...tabData, ["tab1"]: false });
      // await setTabData({ ...tabData, ["tab2"]: true });
      // await setTabData({ ...tabData, ["tab3"]: false });
    } else if (tab == "tab3") {
      setTabHeaderNum(3)
      // await setTabData({ ...tabData, ["tab1"]: false });
      // await setTabData({ ...tabData, ["tab2"]: false });
      // await setTabData({ ...tabData, ["tab3"]: true });
    }
  }


  const chartWidth =
    graphData?.length > 4 ? width + (graphData?.length - 4) * 150 : width - 30;


  const getHideIndexes = () => {
    return graphData.map((systolic, index) => {
      if (systolic === 0) {
        graphData[index] = (graphData[index + 1] + graphData[index - 1]) / 2;
        return index;
      }
    });
  };

  const clearKickAsyncData = async () => {
    await AsyncStorage.removeItem("TODAYDATE")
    await AsyncStorage.removeItem("KICKCOUNT")
    await AsyncStorage.removeItem("LASTKICKTIME")
    await AsyncStorage.removeItem("KICKTIMEARR")
    await AsyncStorage.removeItem("TIMETAKEN")
    await AsyncStorage.removeItem("SESSIONSAVED")
  }

  const getStoredData = async () => {

    const { todayDate } = getCurrentDateTime()
    await setEveryCounts([])

    var TODAYDATE = await (AsyncStorage.getItem("TODAYDATE"))
    var KICKCOUNT = await (AsyncStorage.getItem("KICKCOUNT"))
    var LASTKICKTIME = await (AsyncStorage.getItem("LASTKICKTIME"))
    var KICKTIMEARR = await (AsyncStorage.getItem("KICKTIMEARR"))
    var TIMETAKEN = await (AsyncStorage.getItem("TIMETAKEN"))
    var SESSIONSAVED = await (AsyncStorage.getItem("SESSIONSAVED"))

    console.log("TODAYDATE", TODAYDATE)
    console.log("KICKCOUNT", KICKCOUNT)
    console.log("LASTKICKTIME", LASTKICKTIME)
    console.log("KICKTIMEARR", JSON.parse(KICKTIMEARR))
    console.log("TIMETAKEN ", TIMETAKEN)

    if (TODAYDATE == todayDate) {
      var kicksArr = await JSON.parse(KICKTIMEARR)
      setEveryCounts(JSON.parse(KICKTIMEARR))
      setKickCount(Number(KICKCOUNT))
      setFirstKickTime(kicksArr[0])
      kicksArr.length > 1 && setLastKickTime(kicksArr[kicksArr.length - 1])
      TIMETAKEN > 0 && setTimeTaken(TIMETAKEN)

      if (kicksArr.length == 10 && SESSIONSAVED == "done") { // directly show completed screen
        setTodaySessionCompleted(true);
        setSessionTotal(1);
      }
    } else {
      clearKickAsyncData() // If current date is not same with existing data in storage, All async data will be cleared
    }

  }

  const showStoredData = async () => {
    var TODAYDATE = await (AsyncStorage.getItem("TODAYDATE"))
    var KICKCOUNT = await (AsyncStorage.getItem("KICKCOUNT"))
    var LASTKICKTIME = await (AsyncStorage.getItem("LASTKICKTIME"))
    var KICKTIMEARR = await (AsyncStorage.getItem("KICKTIMEARR"))
    var TIMETAKEN = await (AsyncStorage.getItem("TIMETAKEN"))


    //  console.log("TODAYDATE - ", TODAYDATE)
    // console.log("KICKCOUNT - ", KICKCOUNT)
    // console.log("LASTKICKTIME - ", LASTKICKTIME)
    // console.log("KICKTIMEARR - ", JSON.parse(KICKTIMEARR))
    // console.log("TIMETAKEN - ", TIMETAKEN)
  }


  useEffect(() => {
    const { IntervalInMins } = IntervalTaken(everyCounts[0], everyCounts[9])
    // console.log("IntervalInMins", IntervalInMins)
    if (IntervalInMins > 0) {
      setTimeTaken(IntervalInMins);
      AsyncStorage.setItem("TIMETAKEN", (IntervalInMins).toString());
    }
  }, [everyCounts.length == 10])



  const setCountersDetails = async () => {
    var G_Age = await user?.pregnancy?.attributes?.gestational_age
    AsyncStorage.getItem("KICKTIMEARR").then(async (value) => {
      var kickscount = await AsyncStorage.getItem("KICKCOUNT")
      var sessionsaved = await AsyncStorage.getItem("SESSIONSAVED")
      var kicksArr = await JSON.parse(value)
      var data = {
        "todayKicksCount": kickscount,
        "todayKicksDone": kicksArr ? ((kicksArr?.length == 10 && sessionsaved == "done") ? true : false) : false,
        "gestational_age": G_Age,
      }
      setCounterVitailsData(data)
      // console.log("kicksArr ==", data)
    }).catch((err) => {
      console.log("err", err)
    }
    )
  }

  const onKickPress = async () => {
    const { currentTime, todayDate } = getCurrentDateTime()

    if (kickCount == 0) {
      setFirstKickTime(currentTime)
    } else {
      setLastKickTime(currentTime)
    }

    AsyncStorage.setItem("TODAYDATE", (todayDate).toString())
    AsyncStorage.setItem("KICKCOUNT", (kickCount + 1).toString())
    await AsyncStorage.setItem("LASTKICKTIME", (currentTime).toString()) // lastest kick press record time
    await AsyncStorage.setItem("KICKTIMEARR", JSON.stringify([...everyCounts, currentTime]))

    await setCountersDetails()
    await setKickCount(kickCount + 1)
    await setEveryCounts(time => [...time, currentTime])

    // showStoredData()
  }

  const onReseTime_count = () => {
    setResetLoadSpinner(true)
    clearKickAsyncData(); // clear all the local records
    setCounterVitailsData({})

    setFirstKickTime("--:--")
    setLastKickTime("--:--")
    setKickCount(0)
    setEveryCounts([]) // clear the times in state array
    setTimeTaken(0) // restore the interval time

    setTimeout(() => {
      setResetLoadSpinner(false)
    }, 1000);


  }

  const onSaveRecord = async () => {

    var TODAYDATE = await (AsyncStorage.getItem("TODAYDATE"))
    var KICKCOUNT = await (AsyncStorage.getItem("KICKCOUNT"))
    var LASTKICKTIME = await (AsyncStorage.getItem("LASTKICKTIME"))
    var KICKTIMEARR = await (AsyncStorage.getItem("KICKTIMEARR"))
    var TIMETAKEN = await (AsyncStorage.getItem("TIMETAKEN"))

    if (TIMETAKEN <= 120) {
      var baby_data = {
        "kicks_count_times": JSON.parse(KICKTIMEARR),
        "kicks_date": TODAYDATE,
        "total_kick_count": KICKCOUNT,
        "total_time_taken": TIMETAKEN, // in minutes
        "user_id": user.id
      }

      setSaveLoadSpinner(true) //  start spinner

      // const res = await send_kicks_details(baby_data) // API call
      const res = await send_kicks_details_V2API(baby_data, user?.pregnancy?.id) // API call

      if (res.message == "added successfully") {
        await AsyncStorage.setItem("SESSIONSAVED", "done")
        setTodaySessionCompleted(true)
        setFirstKickTime("--:--")
        setLastKickTime("--:--")
        setKickCount(0)
        setEveryCounts([])
        setSessionTotal(1)
        get_kick_history() //  reload the history records
        setSaveLoadSpinner(false) // stop spinner
      } else {
        setFirstKickTime("--:--")
        setLastKickTime("--:--")
        setKickCount(0)
        setEveryCounts([])
        setTodaySessionCompleted(false)
        setSessionTotal(1)
        setSaveLoadSpinner(false)

      }
    } else {
      alert("Your session time is more than 2 hours. so please try again with reset")
    }


  }


  const TabHeaderView = () => {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[{ backgroundColor: tabHeaderNum == 1 ? COLORS.InkBlue : COLORS.white }, styles.tabBtn, styles.alignJustifyCenter, styles.boxShadow]}
          onPress={() => { setTabHeaderNum(1) }}>
          <AppText h3 bold blue={!tabHeaderNum == 1} white={tabHeaderNum == 1}>Today</AppText>
        </TouchableOpacity>

        <TouchableOpacity style={[{ backgroundColor: tabHeaderNum == 2 ? COLORS.InkBlue : COLORS.white }, styles.tabBtn, styles.alignJustifyCenter, styles.boxShadow]}
          onPress={() => { setTabHeaderNum(2) }}>
          <AppText h3 bold blue={!tabHeaderNum == 2} white={tabHeaderNum == 2}>History</AppText>
        </TouchableOpacity>

        <TouchableOpacity style={[{ backgroundColor: tabHeaderNum == 3 ? COLORS.InkBlue : COLORS.white }, styles.tabBtn, styles.alignJustifyCenter, styles.boxShadow]}
          onPress={() => { setTabHeaderNum(3) }}>
          <AppText h3 bold blue={!tabHeaderNum == 3} white={tabHeaderNum == 3}>Graph</AppText>
        </TouchableOpacity>
      </View>
    )
  }

  const TabGraph = () => {
    return (
      <View style={[styles.tabContainer, { marginTop: MARGINS.mb3 }]}>
        <TouchableOpacity style={[{ backgroundColor: tabGraphNum == 1 ? COLORS.darkBlue : COLORS.white }, styles.tabBtn, styles.alignJustifyCenter, styles.boxShadow]}
          onPress={() => { setTabGraphNum(1) }}>
          <AppText h3 bold blue={!tabGraphNum == 1} white={tabGraphNum == 1}>Daily</AppText>
        </TouchableOpacity>

        <TouchableOpacity style={[{ backgroundColor: tabGraphNum == 2 ? COLORS.darkBlue : COLORS.white }, styles.tabBtn, styles.alignJustifyCenter, styles.boxShadow]}
          onPress={() => { setTabGraphNum(2) }}>
          <AppText h3 bold blue={!tabGraphNum == 2} white={tabGraphNum == 2}>Weekly</AppText>
        </TouchableOpacity>

        <TouchableOpacity style={[{ backgroundColor: tabGraphNum == 3 ? COLORS.darkBlue : COLORS.white }, styles.tabBtn, styles.alignJustifyCenter, styles.boxShadow]}
          onPress={() => { setTabGraphNum(3) }}>
          <AppText h3 bold blue={!tabGraphNum == 3} white={tabGraphNum == 3}>Monthly</AppText>
        </TouchableOpacity>
      </View>
    )
  }


  const renderActivities = ({ item }) => {
    return (
      <View style={styles.recActivityview}>

        <View style={[styles.recordRowView, styles.alignJustifyCenter]}>
          <AppText RFsmall>{DateTO_MDY(item?.kicks_date)}</AppText>
        </View>
        <View style={[styles.recordRowView, styles.alignJustifyCenter]}>
          <AppText RFsmall>{Time24hrTo12hr(item?.kicks_count_times[0])}</AppText>
        </View>
        <View style={[styles.recordRowView, styles.alignJustifyCenter]}>
          <AppText RFsmall>{Time24hrTo12hr(item?.kicks_count_times[item?.kicks_count_times.length - 1])}</AppText>
        </View>
        <View style={[styles.recordRowView, styles.alignJustifyCenter]}>
          <AppText RFsmall>{item?.total_time_taken} Mins</AppText>
        </View>
        <View style={[styles.recordRowView, styles.alignJustifyCenter]}>
          <AppText RFsmall>{item?.total_kick_count}</AppText>
        </View>
      </View>
    )
  }

  const renderActivityheader = () => {
    return (
      <View style={styles.recActicityHeaderStyle}>
        <View style={[styles.recordRowView, styles.alignJustifyCenter]}>
          <AppText bold>Date</AppText>
        </View>
        <View style={[styles.recordRowView, styles.alignJustifyCenter]}>
          <AppText bold>Start</AppText>
        </View>
        <View style={[styles.recordRowView, styles.alignJustifyCenter]}>
          <AppText bold>last</AppText>
        </View>
        <View style={[styles.recordRowView, styles.alignJustifyCenter]}>
          <AppText bold>Duration</AppText>
        </View>
        <View style={[styles.recordRowView, styles.alignJustifyCenter]}>
          <AppText bold>kick(s)</AppText>
        </View>
      </View>
    )
  }

  const KickSaveRestView = () => {
    return (
      <View style={[styles.saveResetViews]}>
        <View style={[styles.saveBtnView, styles.alignJustifyCenter]}>
          <TouchableOpacity activeOpacity={kickCount == 10 ? AppActiveOpacity : 1} style={[{ backgroundColor: kickCount == 10 ? COLORS.white : COLORS.lightGray2 }, styles.saveBtn, styles.alignJustifyCenter, styles.boxShadow]}
            onPress={() => { kickCount == 10 && onSaveRecord() }}
          >
            {
              SaveloadSpinner == true ?
                <ActivityIndicator size="small" />
                : <AppText h3 bold blue>Save</AppText>
            }
          </TouchableOpacity>
        </View>
        <View style={{ width: "20%" }} />

        <View style={[styles.saveBtnView, styles.alignJustifyCenter]}>
          <TouchableOpacity activeOpacity={kickCount != 0 ? AppActiveOpacity : 1} style={[{ backgroundColor: kickCount != 0 ? COLORS.white : COLORS.lightGray2 }, styles.saveBtn, styles.alignJustifyCenter, styles.boxShadow]}
            onPress={() => { kickCount != 0 && onReseTime_count() }}
          >
            {
              ResetloadSpinner == true ?
                <ActivityIndicator size="small" />
                : <AppText h3 bold blue>Reset</AppText>
            }
          </TouchableOpacity>
        </View>
      </View>
    )
  }


  const kicksSessionsCard = () => {
    return (
      <View style={[styles.todayTimeView, styles.boxShadow]}>
        <View style={styles.firstTime}>
          <AppText h3 bold blue>{firstKickTime}</AppText>
          <AppText black bold>First Kick</AppText>
        </View>
        <View style={[styles.countView, styles.alignJustifyCenter]}>
          <AppText textAlignCenter bold h3>Current Count</AppText>
          {/* <AppText bold InkBlue h1>{sessionTotal}</AppText> */}
          <AppText bold InkBlue h1>{kickCount}</AppText>

        </View>
        <View style={styles.firstTime}>
          <AppText h3 bold blue>{lastKickTime}</AppText>
          <AppText black bold>Last Kick</AppText>
        </View>
      </View>
    )
  }

  return (
    <AppSafeAreaView edges={["left", "right"]}>
      {/* <Spinner
        visible={SaveloadSpinner}
        textContent={'Processing...'}
        textStyle={{ color: '#FFF' }}

      /> */}

      <AppScrollView>
        <AppContainer>
          {TabHeaderView()}

          {tabHeaderNum == 1 ?
            <>

              {/* <View style={styles.progressTitleView}>
                <AppText h3 bold blue>KickCount is on progress</AppText>
                <AppText gray>Press the Foot button every time your baby kick</AppText>
              </View> */}

              {!todaySessionCompleted ? kicksSessionsCard() : null}

              {
                !todaySessionCompleted ?
                  <View style={[styles.kickCountView, styles.alignJustifyCenter]}>
                    <AppText bold blue h2>kicks </AppText>
                    <AppText bold InkBlue={kickCount != 10} shockingPink={kickCount == 10} h2>{kickCount} / 10</AppText>
                  </View>
                  : null
              }

              {todaySessionCompleted ?

                <View style={[styles.greetTextView, styles.alignJustifyCenter]}>
                  <Image source={BabySimle} style={[styles.SuccessImageStyle]} />
                  <AppText bold blue h2m textAlignCenter>Great Job! You have completed your kick counts for today!</AppText>
                </View>
                : null
              }

              {
                (kickCount != 10 && !todaySessionCompleted) ? // yet not completed the count
                  <>
                    <View style={[styles.kickBtnOuterView, styles.alignJustifyCenter]}>
                      <Shadow distance={15} startColor={'#eb9066d8'} endColor={'#ff00ff10'} offset={[3, 4]} containerStyle={{ borderRadius: 100 }} >
                        <TouchableOpacity style={[styles.kickBtnStyle, styles.alignJustifyCenter]} onPress={() => { onKickPress() }} >
                          <Image source={Babyfeet2} style={[styles.kickBtnImageStyle]} />
                        </TouchableOpacity>
                      </Shadow>
                    </View>
                    <AppText gray h3m textAlignCenter mt4>Press Here with Each Kick</AppText>
                  </> :
                  <>
                    <View style={[styles.achieveTextView, styles.alignJustifyCenter]}>
                      <AppText blue h2 textAlignCenter bold >It took <AppText textShadow shockingPink h2 textAlignCenter bold> {TimeTaken} minutes</AppText> to achieve 10 kicks</AppText>
                    </View>
                  </>

              }


              {!todaySessionCompleted ? KickSaveRestView() : null}


              <VitalsTipsArticleViewNew
                title={"Instructions For you"}
                subTitle={"Counting Your Baby’s Kicks and Movements"}
                bannerImage="KickCounterIcon"
                navigation={navigation}
                articles={educationDetails}
                favArticleIds={favArticleIds__ || []}
                counterModule={"kick"}
              />

            </> : null
          }

          {
            tabHeaderNum == 2 ?
              <>

                <View style={[styles.historyCardView, styles.alignJustifyCenter, styles.boxShadow]}>
                  <AppText bold h2 mt3 mb3 blue>Baby Activity</AppText>
                  <Image source={Babyfeet2} style={{ left: 10, height: 40, width: 40, resizeMode: "contain" }} />
                </View>

                {/* {TabGraph()} */}
                {
                  KicksRecords.length ?
                    <View style={[{ height: screenHeight * 0.45 }, styles.listViewStyle, styles.boxShadow]}>

                      {renderActivityheader()}


                      <AppFlatList
                        data={KicksRecords}
                        renderItem={renderActivities}
                        refreshing={false}
                      // ListHeaderComponent={renderActivityheader()}
                      // ListEmptyComponent={() => (
                      //   <View style={styles.empty}>
                      //     <AppText h2 blue semibold textAlignCenter mb4>
                      //       {`It doesn't look like you have any conversations started`}
                      //     </AppText>
                      //   </View>
                      // )}
                      // refreshing={refreshing}
                      // onRefresh={() =>
                      //   selected === "Open" ? getOpenTickets(0) : getClosedTickets(0)
                      // }
                      // onEndReached={() =>
                      //   !refreshing
                      //     ? selected === "Open"
                      //       ? !openEndReached && getOpenTickets(openOffset)
                      //       : !closedEndReached && getClosedTickets(closedOffset)
                      //     : null
                      // }
                      // keySignature="tickets-screen"
                      />


                    </View>
                    :
                    <View style={[styles.graphIconContainer, styles.alignJustifyCenter]}>
                      <Image source={EmptyFolder} style={{ height: 150, width: 200, resizeMode: "contain" }} />
                      <AppText textAlignCenter >
                        No sessions have been recorded
                      </AppText>
                    </View>
                }

                {/* <AppButton
                  // onPress={handlePress}
                  title={"Download"}
                  big
                  blue
                  mt3
                  alignSelf
                /> */}

              </> :
              null
          }

          {
            tabHeaderNum == 3 ?
              <>
                {graphData?.length ? (
                  <>

                    <View style={[styles.graphCardView, styles.alignJustifyCenter, styles.boxShadow]}>
                      <AppText bold RFh3 blue mt3 mb3 textAlignCenter>The average time to achieve 10 kicks over the past 2 weeks is {avgKicksDuration}</AppText>
                    </View>
                    {/* {TabGraph()} */}
                    <View style={[styles.chartContainer, { paddingHorizontal: 20 }]}>

                      {/* DOCS: https://www.npmjs.com/package/react-native-chart-kit */}


                      <LineChart
                        thickness1={2}
                        thickness2={2}
                        data={(graphData.slice(0, 14)).reverse()}
                        // data2={lineData2}
                        height={Dimensions.get('window').height * 0.35}
                        width={Dimensions.get('window').width * 0.7}
                        left={10}
                        showVerticalLines
                        spacing={80}
                        // initialSpacing={60}
                        color1={COLORS.InkBlue}
                        // color2="orange"
                        textColor1={COLORS.darkBlue}
                        // textColor2={"red"}
                        dataPointsHeight={6}
                        dataPointsWidth={6}
                        dataPointsColor1={COLORS.activeIcon}
                        // dataPointsColor2="red"
                        textShiftY={-2}
                        textShiftX={-5}
                        textFontSize={12}

                        xAxisLabelTexts={(graphLabels.slice(0, 14)).reverse()}
                        xAxisThickness={1}
                        yAxisThickness={1}
                        xAxisColor={"#a3a3a3"}
                        yAxisColor={"#a3a3a3"}
                        xAxisIndicesHeight={5}
                        xAxisLabelTextStyle={{ color: "#424242", width: 70, marginLeft: 10, fontSize: 10 }}
                        yAxisTextStyle={{ color: "#424242", width: 60, fontSize: 12 }}
                        yAxisLabelSuffix={" mins"}
                      />

                      {/* <AppScrollView horizontal style={styles.horizontalScrollStyle}>
                        <View style={{ display: "flex", flexDirection: "column" }}>
                          <View>
                            <LChart
                              data={{
                                labels: ((graphLabels.slice(0, 14)).reverse()),
                                datasets: [
                                  {
                                    data: ((graphData.slice(0, 14)).reverse()),
                                    color: () => `rgba(15, 59, 111, 1)`,
                                  }
                                ],
                              }}
                              verticalLabelRotation={60}
                              yAxisSuffix={"mins"}
                              width={Dimensions.get("window").width - 10} //{chartWidth}
                              height={400}
                              fromNumber={0}
                              fromZero={true}
                              withShadow={false}
                              hidePointsAtIndex={getHideIndexes()}
                              segments={graphData.length + 1}
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
                            />

                          </View>
                        </View>
                      </AppScrollView> */}
                      {/* <AppText gray h3m textAlignCenter mt1>The y-axis indicates minutes to get 10 kicks</AppText> */}

                    </View>
                  </>
                ) : (
                  <View style={[styles.graphIconContainer, styles.alignJustifyCenter]}>
                    <GraphIcon style={styles.mb4} />
                    <AppText textAlignCenter mt3>
                      No sessions have been recorded
                    </AppText>
                  </View>
                )}
              </> :
              null
          }

          {/* <AppText>Kick Counter Screen</AppText> */}
        </AppContainer>
      </AppScrollView>
    </AppSafeAreaView >
  );
}

const styles = StyleSheet.create({
  comingSoon: {
    marginTop: MARGINS.mb4,
  },
  tabContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  boxShadow: {
    marginBottom: MARGINS.mb1,
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
  alignJustifyCenter: {
    alignItems: "center",
    justifyContent: "center"
  },

  tabBtn: {
    height: "65%",
    width: "30%",
    borderRadius: 15
  },
  saveBtn: {
    height: "65%",
    width: "80%",
    borderRadius: 15,
  },
  progressTitleView: {
    width: "100%",
    alignItems: "center",
    marginVertical: MARGINS.mb4
  },
  todayTimeView: {
    width: "100%",
    height: 110,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: MARGINS.mb4,
    backgroundColor: COLORS.white,
    borderRadius: 10
  },
  firstTime: {
    width: "30%",
    height: "90%",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  countView: {
    width: "40%",
    height: "90%",
  },
  horizontalScrollStyle: {
    marginBottom: MARGINS.mb3,
  },
  chart: {
    borderRadius: 16,
    // marginHorizontal: 10,
  },
  chartContainer: {
    paddingTop: MARGINS.mb4
  },

  recordRowView: { width: "20%" },
  recActivityview: {
    flexDirection: "row",
    marginBottom: MARGINS.mt3,
    width: "100%"
  },
  recActicityHeaderStyle: {
    paddingTop: 10,
    flexDirection: "row",
    width: "100%"
  },
  kickCountView: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    marginTop: "5%"
  },
  greetTextView: {
    marginTop: "10%",
    marginBottom: "10%"
  },
  kickBtnOuterView: {
    height: 120,
    width: "100%",
    marginTop: "5%"
  },
  kickBtnStyle: {
    height: 110,
    width: 110,
    borderRadius: 55
  },
  kickBtnImageStyle: {
    height: 100,
    width: 100,
    resizeMode: "contain"
  },
  SuccessImageStyle: {
    height: 200,
    width: 200,
    resizeMode: "contain"
  },
  achieveTextView: {
    height: 70,
    width: "100%"
  },
  saveResetViews: {
    width: "100%",
    height: 55,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: MARGINS.mt5,
    marginBottom: MARGINS.mt2
  },
  saveBtnView: {
    width: "40%",
    height: "90%"
  },
  historyCardView: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginTop: MARGINS.mt3,
    flexDirection: "row"
  },
  graphCardView: {
    // height: 100,
    width: "100%",
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginTop: MARGINS.mt3,
  },
  listViewStyle: {
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginTop: MARGINS.mt4,
  },
  graphIconContainer: {
    marginTop: "40%"
  }
});
