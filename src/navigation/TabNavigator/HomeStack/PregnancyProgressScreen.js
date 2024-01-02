import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Image, ActivityIndicator, Pressable } from "react-native";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppScrollView from "../../../components/AppScrollView";
import AppContainer from "../../../components/AppContainer";
import AppText from "../../../components/AppText";
import { ProgressBar } from "../../../components/HomeScreen";
import { MARGINS, COLORS } from "../../../utils/styles";
import Link from "../../../components/Link";
import ReminderCard from "../../../components/ReminderCard";
import ExpandingCard from "../../../components/ExpandingCard";
import { AppContext } from "../../../context";
import {
  babySizeDetailsList,
  formatGestionalAgeToWeeksDays,
  getBabySizeImage,
  getPregnancyMonth,
  patientBabyDetailsList,
  patientBodyDetailsList,
  prenatalCareDetailsList,
} from "../../../utils/pregnancy";

import { mg_recommented_articles, viewed_reminder_article } from "../../../api";
import _ from "lodash";

export default function PregnancyProgressScreen({ navigation, route }) {
  const [mgRecomment, setMgRecomment] = useState([])
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AppContext);
  const { gestational_age } = user?.pregnancy?.attributes || {};
  const pregnancyMonth = getPregnancyMonth(gestational_age) || 1;
  const pregnancyWeek = formatGestionalAgeToWeeksDays(
    gestational_age,
    "number"
  );
  const pregnacyDetailIndex = pregnancyMonth - 1;

  useEffect(() => {
    get_mg_recommented_articles()
  }, [])

  const get_mg_recommented_articles = async () => {

    if (gestational_age) {
      let recomment_articles = await mg_recommented_articles(user.id, gestational_age)
      await setMgRecomment(recomment_articles)
      await setLoading(false)
    } else {
      setLoading(false)
    }

  }
  /**
   * Render Pregnancy Size Text
   * @param {string} monthText - "Baby month text"
   * @param {string} weightText - "Baby weight in text form"
   * @param {string} heightText - ""Baby height in text form"
   */
  const renderBabySizeText = ({ monthText, heightText, weightText }) => (
    <View style={styles.textContainer}>
      <AppText textAlignCenter>
        By the end of the {monthText} month, your baby is about{" "}
      </AppText>
      <AppText h3 bold>
        {weightText} long
      </AppText>
      <AppText textAlignCenter>and weighs</AppText>
      <AppText h3 bold>
        {heightText}
      </AppText>
    </View>
  );

  /**
   * Render bullets points for a card. If a
   * bullet is nested, then render nested
   * bullets with title text.
   * @param {array} content - Array of bullets to render
   */
  const renderBulletsPoints = (content, nested = false) => {
    return content.map((bullet, index) => {
      if (_.isObject(bullet)) {
        return (
          <>
            <AppText key={index} style={styles.detailBulletPoint}>
              {bullet.title}
            </AppText>
            {renderBulletsPoints(bullet?.content, true)}
          </>
        );
      }
      return (
        <AppText
          key={index}
          style={[styles.detailBulletPoint, nested && styles.nestedBullet]}
        >
          {!nested && "• "}
          {bullet}
        </AppText>
      );
    });
  };

  /**
   * Returns pegnancy card for progress
   * section (body, baby, prental care).
   * @param {array} props.content - Array of text to render
   * @param {string} props.title - Tiile of card
   */
  const PregnancyProgressSection = ({ content, title }) => {
    return (
      <ExpandingCard title={title}>
        <View style={styles.progressDetailsContainer}>
          {renderBulletsPoints(content)}
        </View>
      </ExpandingCard>
    );
  };

  return (
    <AppSafeAreaView edges={["left", "right"]}>
      <AppScrollView>
        <AppContainer>
          <ProgressBar />
          <View style={[styles.babySizeCard, styles.boxShadow]}>
            <View style={[styles.expectedSizeContainer, styles.boxShadow]}>
              <AppText>Expected size of a baby</AppText>
            </View>
            <View style={[styles.expectedSizeContent, styles.boxShadow]}>
              <View style={{ width: "60%", alignItems: "center", justifyContent: "center" }}>
                {gestational_age &&
                  renderBabySizeText(babySizeDetailsList[pregnacyDetailIndex])}
              </View>

              <View style={[styles.iconContainer]}>
                <Image
                  source={getBabySizeImage(pregnancyWeek)}
                  style={styles.babyImage}
                />
              </View>
            </View>
            <View>
              <PregnancyProgressSection
                title="Your Baby"
                content={patientBabyDetailsList[pregnacyDetailIndex]}
              />
              <PregnancyProgressSection
                title="Your Body"
                content={patientBodyDetailsList[pregnacyDetailIndex]}
              />
              <PregnancyProgressSection
                title="Prenatal Care"
                content={prenatalCareDetailsList[pregnacyDetailIndex]}
              />
            </View>
            <View style={styles.education}>
              <AppText h3 bold gray>
                Mother Goose recommends for you
              </AppText>
              {
                (mgRecomment.length > 0 && loading == false) &&
                <Link onPress={() => { navigation.navigate("Education") }}>See all</Link>
              }

            </View>
            {
              loading ?
                <View style={styles.loaderDiv}>
                  <ActivityIndicator size="large" />
                </View> :
                (mgRecomment.length > 0 && loading == false) ?
                  <Pressable
                    onPress={async () => {

                      viewed_reminder_article(user.id, mgRecomment[0].id) // for Mg recomment articles also

                      navigation.navigate("Article", {
                        item: mgRecomment[0],
                        title: mgRecomment[0].title,
                        subtitle: mgRecomment[0].subtitle,
                        body: mgRecomment[0].body,
                        videoUrl: mgRecomment[0].videoUrl,
                        photo: mgRecomment[0]?.photo,
                      })

                    }
                    }
                  >
                    <ReminderCard
                      boxShadow
                      title={mgRecomment[0].title}
                      // body={"DVT during pregnancy is a serious medical condition..."}
                      bigSquare
                      gray
                      noBorder
                      article
                    />
                  </Pressable> :
                  <View style={styles.no_data}>
                    <AppText bold gray>
                      No article is found!
                    </AppText>
                  </View>
            }

          </View>
        </AppContainer>
      </AppScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  babySizeCard: {
    marginTop: MARGINS.mb4,
    // height: 100,
    // borderColor: "red",
    // borderWidth: 1,
  },
  boxShadow: {
    // marginBottom: MARGINS.mb1,
    padding: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3
  },
  dropdownContainer: {
    position: "relative",
    width: "25%",
    zIndex: 100,
  },
  education: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: MARGINS.mb3,
    marginTop: MARGINS.mb4,
    zIndex: -1,
  },
  expectedSizeContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: MARGINS.mb2,
  },
  expectedSizeContent: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopColor: COLORS.gray,
    borderTopWidth: 1,
    flexDirection: "row",
    // height: 144,
    // zIndex: -1,
    width: "100%",
    paddingVertical: 8,
    marginBottom: 7
  },
  iconContainer: {
    // alignItems: "center",
    // justifyContent: "center",
    width: "40%",
  },
  textContainer: {
    alignItems: "center",
    flexDirection: "column",
    // height: "100%",
    justifyContent: "center",
    paddingHorizontal: MARGINS.mb3,
    width: "100%",
  },
  progressDetailsContainer: {
    paddingHorizontal: MARGINS.mb2,
    paddingVertical: MARGINS.mb2,
  },
  detailBulletPoint: {
    marginBottom: MARGINS.mb2,
  },
  nestedBullet: {
    marginLeft: MARGINS.mb2,
  },
  babyImage: {
    width: "100%",
    height: 120,
    resizeMode: "contain"
  },
  loaderDiv: {
    height: 80,
    alignItems: "center",
    justifyContent: "center"
  },
  no_data: {
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  }
});
