import React, { useState, useEffect, useContext } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View, FlatList } from "react-native";
import AppContainer from "../../../components/AppContainer";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppText from "../../../components/AppText";
import AppScrollView from "../../../components/AppScrollView";
import SearchBar from "../../../components/SearchBar";
import { MARGINS } from "../../../utils/styles";
import FeaturedArticle from "../../../components/FeaturedArticle";
import { AppContext } from "../../../context";
import { fakeArticles } from "../../../fakeData";
import ReminderCard from "../../../components/ReminderCard";
import _ from "lodash";
import ExpandingArticle from "../../../components/ExpandingArticle";
import { get_mod_articles, get_all_articles } from "../../../api"

export default function EducationScreen({ navigation }) {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listArticleLoad, setListArticleLoad] = useState(true);
  const { setSelectedAticle, setSelectedAticleID, user, setQuery_txt } = useContext(AppContext);
  const { gestational_age } = user?.pregnancy?.attributes || {};

  const [myfavarticles, setMyfavarticles] = useState("");
  const [myfavarticlesIds, setMyfavarticlesIds] = useState([]);
  const [mostViewed, setMostViewed] = useState("");
  const [suggessed, setSuggessed] = useState("");
  const [all_articles, setAll_articles] = useState("");

  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(0); // 
  const [totalAticlePages, setTotalAticlePages] = useState(1); // total articles page corresponding to per page limit
  const [articleLimit, setArticleLimit] = useState(30) // article limit for per page

  const getData = async () => {
    setListArticleLoad(true)
    // where I get All the articles with pagination
    get_all_articles(user.id, offset, articleLimit).then(async (res) => {

      if (res?.article) {
        setTotalAticlePages(res.pages)
        setOffset(offset + 1);
        setDataSource([...dataSource, ...res.article]);
        setListArticleLoad(false)
      }

    }, (error) => console.error("Oops, get_all_articles failed", error)
    )

  };

  const Get_modified_articles = async () => {
    try {
      const data = await get_mod_articles(user.id, gestational_age)

      if (data?.fav) {
        let arr = []
        await (data?.fav).map((val, key) => {
          arr.push(val.id)
        })
        setMyfavarticlesIds(arr)
      }

      await getData()
      await setAll_articles(data?.all_articles || [])
      await setMyfavarticles(data?.fav)
      await setMostViewed(data?.most_viewed)
      await setSuggessed(data?.suggest_for_you)


      await setLoading(false);
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    setRecommendArticle()
  }, [all_articles]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // setDataSource([])
      // setOffset(1)
      setMyfavarticlesIds([])
      setQuery_txt("")
      setLoading(true);
      setAll_articles("")
      setMyfavarticles("")
      setMostViewed("")
      setSuggessed("")

      if (gestational_age)
        await Get_modified_articles();
    });

    return unsubscribe;
  }, [navigation]);


  const setRecommendArticle = async () => {
    if (all_articles?.length) {
      const rec = await all_articles.slice(0, 2);
      setRecommended(rec);
    }
  }

  const renderTopview = () => {
    return (
      <View>
        <AppContainer noPaddingBottom>
          <FeaturedArticle article={fakeArticles[0]} />
        </AppContainer>
        <AppContainer noPaddingTop noPaddingHorizontal>
          {loading && (
            <ActivityIndicator style={styles.activityIndicator} size="large" />
          )}
          {!loading && (
            <>

              {/* <View style={styles.listHeader}>
                <AppText h3 bold gray>
                  Popular
                </AppText>
              </View> */}

              <View style={styles.sessionView}>
                <ExpandingArticle
                  content={myfavarticles || []}
                  title="Your Favorites"
                  editPage="Your Favorites"
                  navigation={navigation}
                  stared
                />
              </View>

              <View style={styles.sessionView}>
                <ExpandingArticle
                  content={mostViewed || []}
                  title="Most Viewed Articles"
                  editPage="Most Viewed Articles"
                  navigation={navigation}
                  myfavarticlesIds={myfavarticlesIds?.length ? myfavarticlesIds : []}
                />
              </View>

              <View style={styles.sessionView}>
                <ExpandingArticle
                  content={suggessed || []}
                  title="Mother Goose Recommends For You"
                  editPage="Suggested for you"
                  navigation={navigation}
                  myfavarticlesIds={myfavarticlesIds?.length ? myfavarticlesIds : []}
                />
              </View>

              {/* <View style={styles.recommended_listHeader}>
                <AppText h3 bold gray>
                  Recommended by Mother Goose
                </AppText>
              </View>
              <View style={styles.articlesContainer}>
                {recommended.map((article, index) =>
                  renderArticles(article, index)
                )}
              </View> */}

            </>
          )}
        </AppContainer>
      </View>
    )
  }


  const renderFooterview = () => {
    return (
      <>
        {
          listArticleLoad ?
            <View style={{ padding: 20, alignItems: "center", justifyContent: "center", width: "100%" }}>
              <AppText textAlignCenter h2m gray>Loading...</AppText>
            </View>
            :
            null
        }
      </>
    )
  }

  const renderArticles = ({ item, index }) => {
    return (
      <Pressable
        key={`${index}-item.title`}
        onPress={() => {
          setSelectedAticle(item.title);
          setSelectedAticleID(item.id)
          navigation.navigate("Article", {
            item: item,
            title: item.title,
            subtitle: item.subtitle,
            body: item.body,
            videoUrl: item.videoUrl,
            photo: item?.photo,
            myfavarticlesIds
          })
        }
        }
      >
        <ReminderCard
          title={item.title}
          body={item.subtitle}
          gray
          bigSquare
          noBorder
          article
        />
      </Pressable>
    );
  };

  return (
    <AppSafeAreaView edges={["top", "left", "right"]}>

      <AppContainer noPaddingBottom>
        <View style={styles.headerContainer}>
          <AppText h2 bold numberOfLines={1}>
            Pregnancy Education
          </AppText>
        </View>
        <SearchBar navigation={navigation} />
      </AppContainer>
      <FlatList
        style={{ marginBottom: 160 }}
        ListHeaderComponent={renderTopview}
        ListFooterComponent={renderFooterview}
        data={dataSource}
        keyExtractor={(item, index) => index.toString()}
        enableEmptySections={true}
        renderItem={renderArticles}
        onEndReached={() => { (offset <= totalAticlePages) && getData() }}
        onEndReachedThreshold={0.1}
      />
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    alignSelf: "center",
    marginVertical: MARGINS.mb4,
  },
  articlesContainer: {
    marginBottom: MARGINS.mb1,
    marginTop: MARGINS.mb2,
  },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: MARGINS.mb4,
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: MARGINS.mb2,
    marginHorizontal: MARGINS.mb3,
    marginTop: MARGINS.mb3
  },
  sessionView: {
    marginTop: MARGINS.mb2,
    marginHorizontal: MARGINS.mb3,
  },

  recommended_listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: MARGINS.mb2,
    marginHorizontal: MARGINS.mb3,
    marginTop: MARGINS.mb4
  },

  mb4: {
    marginBottom: MARGINS.mb4,
  },
});
