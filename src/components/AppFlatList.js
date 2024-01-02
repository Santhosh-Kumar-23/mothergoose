import React from "react";
import _ from "lodash";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { COLORS, MARGINS } from "../utils/styles";

// custom flatlist component
export default function AppFlatList(props) {
  const {
    data,
    keySignature,
    ListEmptyComponent,
    ListFooterComponent,
    ListHeaderComponent,
    ItemSeparatorComponent,
    nestedScrollEnabled,
    onEndReached,
    onRefresh,
    refreshing,
    style,
    contentContainerStyle,
    noPaddingBottom,
    noPaddingTop,
    fullWidth,
  } = props;
  return (
    <FlatList
      {...props}
      style={[styles.scrollView, style]}
      contentContainerStyle={[
        styles.contentContainerStyle,
        noPaddingBottom && styles.noPaddingBottom,
        noPaddingTop && styles.noPaddingTop,
        fullWidth && styles.fullWidth,
        contentContainerStyle,
      ]}
      nestedScrollEnabled={nestedScrollEnabled}
      keyboardShouldPersistTaps={"handled"}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      refreshControl={
        _.get(data, "length") > 0 ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : (
          <React.Fragment />
        )
      }
      ListEmptyComponent={
        refreshing ? (
          <ActivityIndicator
            size="large"
            color={COLORS.text}
            animating={refreshing}
          />
        ) : (
          ListEmptyComponent
        )
      }
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={ItemSeparatorComponent}
      data={data}
      keyExtractor={(item) =>
        `${keySignature}-${item.id ? item.id : item.title}`
      }
    />
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 30,
    paddingHorizontal: MARGINS.mb3,
    paddingTop: 20,
  },
  fullWidth: {
    paddingHorizontal: 0,
  },
  noPaddingBottom: {
    paddingBottom: 0,
  },
  noPaddingTop: {
    paddingTop: 0,
  },
  scrollView: {
    alignSelf: "stretch",
    flex: 1,
    marginHorizontal: MARGINS.mb3n,
  },
});
