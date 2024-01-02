import React, { useEffect, useContext, useState } from "react";
import { Pressable, StyleSheet, View, Image, ScrollView, Platform, ActivityIndicator } from "react-native";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppContainer from "../../../components/AppContainer";
// import AppScrollView from "../../../components/AppScrollView";
import AppText from "../../../components/AppText";
import WebView from "react-native-webview";
import { COLORS, MARGINS } from "../../../utils/styles";
import convertRichTextToAppElements from "../../../utils/parseRichText";
// import Icon from 'react-native-vector-icons/AntDesign';
import { AppContext } from "../../../context";
import emptystar from '../../../../assets/emptystar.png'
import filledstar from '../../../../assets/filledstar.png'




import { store_favourite_article, store_most_viewed_article } from "../../../api";
import client from "../../../utils/contentful";
// Icon.loadFont().then();
export default function ArticleScreen({ navigation, route }) {
  // const { title, subtitle, body, tags, videoUrl } = route.params;
  const { title, body, videoUrl, item, fav, myfavarticlesIds, photo } = route.params;
  const [loader, setLoader] = useState(true)
  const [reachedEnd, setReachedEnd] = useState(false);
  const [updatedBody, setUpdatedBody] = useState({});

  const { user } = useContext(AppContext);

  const [favourite, setFovourite] = useState((fav == "1" || myfavarticlesIds?.includes(item?.id)) ? true : false)

  useEffect(() => {
    navigation.setOptions({ title });
    store_most_viewed_article(user.id, item?.id, item)

    if ((videoUrl || photo) && Platform.OS == "android") {
      setTimeout(() => {
        setLoader(false)
      }, 3000);
    } else {
      if (updatedBody) {
        setLoader(false)
      }
    }

  }, []);

  const updateBodyArray = async (dataArray) => {
    const getimageUrl = async (id) => {
      try {
        const asset = await client.getAsset(id);
        if (asset?.fields?.file?.url) {
          const imageUrl = "https:" + asset.fields.file.url;
          let imgeStyle = asset?.fields?.file?.details?.image
          return { imageUrl, imgeStyle };
        }
      } catch (error) {
        console.error("Error fetching asset:", error);
        return null;
      }
    };

    const updatedArray = await Promise.all(dataArray.map(async (item) => {
      if (item.nodeType === 'embedded-asset-block') {
        const URL = await getimageUrl(item?.data?.target?.sys?.id);
        return {
          nodeType: 'embedded-asset-block',
          data: {
            imageURL: URL?.imageUrl,
            imgeStyle: URL?.imgeStyle
          },
          content: [],
        };
      }
      return item;
    }));

    return updatedArray;
  };

  useEffect(() => {
    updateBodyArray(body?.content)
      .then((data) => {
        setUpdatedBody({
          data: {},
          nodeType: "document",
          content: [...data]
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }, [body?.content])




  // Function to handle the onScroll event
  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const screenHeight = layoutMeasurement.height;
    const scrollOffset = contentOffset.y;
    const contentHeight = contentSize.height;
    // console.log("contentHeight", contentHeight)
    // console.log("screenHeight", screenHeight)

    // Check if the scrollOffset is close to the bottom of the content
    const scrollThreshold = contentHeight - (screenHeight * 2);
    // console.log("\nscrollOffset", scrollOffset)
    // console.log("scrollThreshold", scrollThreshold)
    if (scrollOffset >= (scrollThreshold)) {
      // console.log("We've reached the end of the content")
      // We've reached the end of the content
      setReachedEnd(true);
    } else {
      // console.log("moving up")
      setReachedEnd(false);
    }
  };


  return (
    <AppSafeAreaView edges={["left", "right"]}>
      {
        loader ?
          <View style={{ height: "90%", width: "100%", alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size={"large"} />
            <AppText h3 mt3 bold blue> Loading...</AppText>
          </View>
          :
          <ScrollView
            style={{ flex: 1 }}
            onScroll={handleScroll}
            scrollEventThrottle={400}
            contentContainerStyle={{ paddingVertical: 20 }}
          >
            {/* handles embedding youtube links to articles */}
            {videoUrl && !reachedEnd ? (
              <WebView
                javaScriptEnabled
                source={{ uri: videoUrl }}
                style={styles.video}
              />
              // <LazyWebView uri={videoUrl} />
            ) : null}

            {photo && !reachedEnd ? (

              <WebView
                javaScriptEnabled
                source={{ uri: photo }}
                style={styles.video}
              />
              // <LazyWebView uri={photo} />

            ) : null}

            <AppContainer>

              <View style={styles.textContainer}>
                <View style={styles.titleContainer}>
                  <View style={{ width: "87%" }}>
                    <AppText h2 bold blue mb3 textAlignCenter>
                      {title}
                    </AppText>
                  </View>
                  <View style={{ width: "13%", alignItems: "flex-end" }}>
                    <Pressable onPress={() => {
                      setFovourite(!favourite)
                      store_favourite_article(user.id, item.id, item, favourite ? 0 : 1)
                    }}>
                      <Image
                        source={favourite ? filledstar : emptystar}
                        style={{ height: 30, width: 30, resizeMode: "contain" }}
                      />
                    </Pressable>
                  </View>



                </View>
                {convertRichTextToAppElements(updatedBody)}
                {/* {convertRichTextToAppElements(body)} */}
              </View>
            </AppContainer>
          </ScrollView>
      }

    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    marginHorizontal: MARGINS.mb1,
  },
  titleContainer: {
    flexDirection: "row",
    width: "100%"
    // justifyContent: "space-between",
    // alignItems: "center"

  },
  video: {
    flexGrow: 1,
    margin: MARGINS.mb2,
    minHeight: 300,
  },
});
