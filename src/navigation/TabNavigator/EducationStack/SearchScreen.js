import React, { useState, useContext } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import AppContainer from "../../../components/AppContainer";
import AppSafeAreaView from "../../../components/AppSafeAreaView";
import { MARGINS } from "../../../utils/styles";
import AppFlatList from "../../../components/AppFlatList";
import SearchBar from "../../../components/SearchBar";
import ReminderCard from "../../../components/ReminderCard";
import AppText from "../../../components/AppText";
import Link from "../../../components/Link";
import { AppContext } from "../../../context";

export default function SearchScreen({ navigation, route }) {
  const { articles, query } = route.params;

  const { setQuery_txt, query_txt, searcharticleloader } = useContext(AppContext);

  // const [query_txt, setQuery_txt] = useState(query)

  const renderArticle = ({ item }) => (
    <Pressable
      key={item.title}
      onPress={() =>
        navigation.navigate("Article", {
          item: item,
          title: item.title,
          subtitle: item.subtitle,
          body: item.body,
          videoUrl: item.videoUrl,
          photo: item?.photo,
        })
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

  return (
    <AppSafeAreaView edges={["top", "left", "right"]}>
      <AppContainer noPaddingBottom>
        <SearchBar
          // query_txt={query_txt}
          navigation={navigation} />

        {
          searcharticleloader ?
            <AppText textAlignCenter>Searching...</AppText> :
            articles?.length == 0 ?
              <View style={styles.defautTitle}>
                <View style={{ alignItems: "flex-end" }}>
                  <Link
                    onPress={() => {
                      setQuery_txt("")
                      navigation.navigate("Education Modules")
                    }}
                  >See all</Link>
                </View>
                <View style={{ marginTop: 50, alignItems: "center" }}>
                  <AppText h3>Oops! No article is found for "{query_txt}".</AppText>
                </View>

              </View>
              : null
        }

        {(searcharticleloader == false && articles?.length) ?
          <AppFlatList
            data={articles}
            renderItem={renderArticle}
            ListHeaderComponent={() => (
              <View style={styles.title}>
                <AppText h3 semibold>Popular</AppText>
                <Link
                  onPress={() => {
                    setQuery_txt("")
                    navigation.navigate("Education Modules")
                  }}
                >See all</Link>
              </View>
            )}
            keySignature="articles-search"
            fullWidth
            noPaddingTop
          />
          :
          null
        }

      </AppContainer>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingHorizontal: MARGINS.mb3,
  },
  defautTitle: {

  }
});
