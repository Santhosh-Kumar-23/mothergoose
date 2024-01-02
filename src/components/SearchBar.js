import React, { useCallback, useState, useContext } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import SearchIcon from "../../assets/svgs/SearchIcon.svg";
import _ from "lodash";
import { handleContentfulSearch } from "../api/contentful";
import { get_serachQuery } from "../api";
import { MARGINS, COLORS } from "../utils/styles";
import { AppContext } from "../context";

export default function SearchBar({ navigation }) {
  const { setError, query_txt, setQuery_txt, user, setSearcharticleloader, } = useContext(AppContext);

  const onChangeText = (input) => {
    setSearcharticleloader(true)
    setQuery_txt(input);
    delayedQuery(input);
  };

  // sends search after user has stopped typing for 1 second while cancelling all previous calls if a user keeps typing
  const delayedQuery = useCallback(
    _.debounce((query) => handleSearch(query, navigation), 1000),
    []
  );

  const handleSearch = async (query, navigation) => {
    try {
      // const articles = await handleContentfulSearch(query);
      if (query != "") {
        const articles = await get_serachQuery(user.id, query);

        navigation.navigate("Search", {
          articles,
        });
        setSearcharticleloader(false)
      } else {
        setSearcharticleloader(false)
      }

    } catch (error) {
      setError(error.message);
      // console.log("error in search", { error });
    }
  };

  return (
    <View style={[styles.searchBarContainer, styles.mb3]}>
      <SearchIcon width={16} height={16} />
      <TextInput
        value={query_txt}
        style={styles.searchBar}
        onChangeText={onChangeText}
        placeholder="Search for articles"
        placeholderTextColor={COLORS.gray}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flex: 1,
    marginHorizontal: MARGINS.mb3,
    color: COLORS.black
  },
  searchBarContainer: {
    alignItems: "center",
    borderColor: COLORS.mediumBlue,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    height: 40,
    marginBottom: MARGINS.mb3,
    paddingHorizontal: MARGINS.mb3,
  },
});
