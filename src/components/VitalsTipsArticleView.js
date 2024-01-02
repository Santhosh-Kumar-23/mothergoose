import React, { useContext } from "react";
import { StyleSheet, View, Pressable, Image } from "react-native";
import AppText from "./AppText";
import { MARGINS, COLORS } from "../utils/styles";
import ContractionCounterIcon from '../../assets/svgs/ContractionCounterIcon.svg';
import KickCounterIcon from '../../assets/svgs/KickCounterIcon.svg';
import BloodPressureArticleImage from "../../assets/BloodPressureArticleImage.png";
import WeightScreenArticle from "../../assets/WeightScreenArticle.png";
import RightArrow from "../../assets/svgs/RightArrow.svg";
import { viewed_reminder_article } from "../api"
import { AppContext } from "../context";


export default function VitalsTipsArticleView({
  title,
  bannerImage,
  navigation,
  articles,
  favArticleIds,
  subTitle,
  counterModule
}) {

  const { user, setSelectedAticle, setSelectedAticleID, } = useContext(AppContext);


  var educationDetails = articles || [];

  return (
    <View style={[styles.boxShadow, styles.container]}>

      <View style={styles.titleView}>
        <View style={styles.titleStyle}>
          <AppText h2 blue bold>{title}</AppText>
        </View>
        <View style={styles.bannerStyle}>
          {
            bannerImage == "ContractionCounterIcon" ?
              <ContractionCounterIcon height={80} width={80} style={{ borderRadius: 40, overflow: "hidden" }} />
              :
              bannerImage == "KickCounterIcon" ?
                <KickCounterIcon
                  height={80}
                  width={80}
                  style={{ borderRadius: 40, overflow: "hidden" }}
                /> :

                bannerImage == "bpicon" ?
                  <Image source={BloodPressureArticleImage} style={{ height: 80, width: 80, borderRadius: 40, overflow: "hidden" }} />
                  :
                  bannerImage == "weighticon" ?
                    <Image source={WeightScreenArticle} style={{ height: 80, width: 80, borderRadius: 40, overflow: "hidden" }} />
                    :
                    null
          }
        </View>
      </View>

      {
        educationDetails.map((val) => {
          return (
            <Pressable style={styles.PressableContainer}
              onPress={async () => {

                await setSelectedAticle(val?.title);
                await setSelectedAticleID(val?.id);

                await navigation.navigate("Article", {
                  item: val,
                  title: val?.title,
                  subtitle: val?.subtitle,
                  body: val?.body,
                  videoUrl: val?.videoUrl,
                  photo: val?.photo,
                  myfavarticlesIds: favArticleIds
                })
              }
              }
            >
              <View style={styles.articletitleView}>
                <AppText h3 capitalize bold blue>{counterModule == "kick" ? subTitle : val?.title}</AppText>
              </View>
              <View style={styles.arrowView}>
                <RightArrow height={12} width={12} style={styles.extraPadding} />
              </View>
            </Pressable>
          )
        })
      }

    </View>
  );
}

const styles = StyleSheet.create({
  boxShadow: {
    marginBottom: MARGINS.mb3,
    padding: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3
  },
  PressableContainer: {
    flexDirection: "row",
    marginBottom: MARGINS.mb1,
    paddingTop: MARGINS.mb3,
    width: "100%",
  },
  extraPadding: {
    padding: MARGINS.mb2,
  },

  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: "100%",
    padding: 20,
    marginVertical: MARGINS.mt3
  },
  titleView: {
    flexDirection: "row",
    marginBottom: MARGINS.mb2
  },
  titleStyle: {
    width: "75%"
  },
  bannerStyle: {
    alignItems: "flex-end",
    width: "25%"
  },
  articletitleView: {
    width: "90%"
  },
  arrowView: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center"
  }

});
