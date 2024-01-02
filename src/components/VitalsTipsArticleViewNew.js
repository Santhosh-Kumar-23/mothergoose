import React, { useContext } from "react";
import { StyleSheet, View, Pressable, Image, Text } from "react-native";
import AppText from "./AppText";
import { MARGINS, COLORS } from "../utils/styles";
import ContractionCounterIcon from '../../assets/svgs/ContractionCounterIcon.svg';
import KickCounterIcon from '../../assets/svgs/KickCounterIcon.svg';
import BloodPressureArticleImage2 from "../../assets/BloodPressureArticleImage2.png";
import WeightScreenArticle from "../../assets/WeightScreenArticle.png";
import Babyheart from "../../assets/babyheart.png";
import RightArrow from "../../assets/svgs/RightArrow.svg";
import { viewed_reminder_article } from "../api"
import { AppContext } from "../context";
import { RFValue } from "react-native-responsive-fontsize";

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


      <View style={{ justifyContent: "flex-start", width: RFValue(60) }}>
        {
          bannerImage == "ContractionCounterIcon" ?
            <ContractionCounterIcon height={RFValue(60)} width={RFValue(60)} style={{ borderRadius: RFValue(30), overflow: "hidden" }} />
            :
            bannerImage == "KickCounterIcon" ?
              <KickCounterIcon
                height={RFValue(60)}
                width={RFValue(60)}
                style={{ borderRadius: RFValue(30), overflow: "hidden" }}
              /> :

              bannerImage == "bpicon" ?
                <Image source={BloodPressureArticleImage2} style={{ height: RFValue(60), width: RFValue(60), resizeMode: "contain" }} />
                :
                bannerImage == "weighticon" ?
                  <Image source={WeightScreenArticle} style={{ height: RFValue(60), width: RFValue(60), borderRadius: RFValue(30), overflow: "hidden" }} />
                  :
                  bannerImage == "Babyheart" ?
                    <Image source={Babyheart} style={{ height: RFValue(60), width: RFValue(60), borderRadius: RFValue(30), overflow: "hidden" }} />
                    :
                    null
        }
      </View>

      <View style={styles.dividerView} />
      <View style={[styles.titleStyle]}>
        <Text style={{ fontSize: RFValue(15), fontWeight: "700", color: COLORS.darkBlue, marginBottom: 10 }}>{title}</Text>
        {/* <AppText h2m blue bold>{title}</AppText> */}

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

                <Text numberOfLines={1} style={{ textTransform: "capitalize", fontSize: RFValue(12), fontWeight: "300", color: COLORS.darkBlue }}>{counterModule == "kick" ? subTitle : val?.title}</Text>
                {/* <AppText h3 capitalize bold blue>{counterModule == "kick" ? subTitle : val?.title}</AppText> */}
                <RightArrow height={RFValue(10)} width={RFValue(10)} style={{ left: 10 }} />


              </Pressable>
            )
          })
        }



      </View>







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
    alignItems: "center",
    marginVertical: 5,
    // marginBottom: MARGINS.mb1,
    // paddingTop: MARGINS.mb1,
    // width: "100%",
  },
  extraPadding: {
    padding: MARGINS.mb2,
    marginBottom: 5
  },

  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: "100%",
    padding: 20,
    marginVertical: MARGINS.mt3,
    flexDirection: "row"
  },
  titleView: {
    flexDirection: "row",
    marginBottom: MARGINS.mb2
  },
  titleStyle: {
    width: "70%",
    paddingRight: 20,
    justifyContent: "space-between"
  },
  dividerView: { width: RFValue(2), backgroundColor: COLORS.darkBlue, marginHorizontal: RFValue(10), borderRadius: 20 },
  bannerStyle: {
    // alignItems: "center",
    justifyContent: "flex-start",
  },
  articletitleView: {

    // width: "100%"
  },
  arrowView: {

    width: "5%",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  }
});
