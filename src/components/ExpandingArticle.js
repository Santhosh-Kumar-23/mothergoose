import React, { useState, useContext } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "./AppText";
import RightArrow from "../../assets/svgs/RightArrow.svg";
import { COLORS, MARGINS } from "../utils/styles";
import ReminderCard from "./ReminderCard";
import { AppContext } from "../context";

import _ from "lodash";
import { viewed_reminder_article } from "../api"

export default function ExpandingArticle({
  title,
  content,
  navigation,
  stared,
  myfavarticlesIds,
  editPage
}) {

  const { setSelectedAticle, setSelectedAticleID, reminderArticleIds, handle_reminderarticle, user } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [Articles, setArticles] = useState(content);
  const renderArticles = (item, index) => {
    if (open) {
      return (
        <Pressable
          key={`${index}-item.title`}
          onPress={async () => {
            if (reminderArticleIds.includes(item.id)) {
              await viewed_reminder_article(user.id, item.id);
              await handle_reminderarticle(user.id)
            }

            await setSelectedAticle(item.title);
            setSelectedAticleID(item.id)
            await navigation.navigate("Article", {
              item: item,
              title: item.title,
              subtitle: item.subtitle,
              body: item.body,
              videoUrl: item.videoUrl,
              photo: item?.photo,
              fav: stared ? "1" : "0",
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
    }
  };

  return (
    <Pressable onPress={() => setOpen(!open)}>

      <View>
        <View style={styles.boxShadow}>
          <View style={[styles.closed, open && styles.open]}>
            <AppText h3 bold>
              {title}
            </AppText>
            <RightArrow style={[styles.icon, open && styles.iconFlipped]} />
          </View>
          <View style={open && styles.openContainer}>
            {/* {renderContent()} */}
            {Articles.map((article, index) =>
              renderArticles(article, index)
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boxShadow: {
    marginVertical: MARGINS.mb2,
    margin: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    borderRadius: 12,
  },
  closed: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    flexDirection: "row",
    height: 48,
    justifyContent: "space-between",
    paddingHorizontal: MARGINS.mb2,
  },
  detail: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: MARGINS.mb3,
    paddingVertical: MARGINS.mb2,
  },
  icon: {
    marginRight: MARGINS.mb2,
    transform: [{ rotate: "90deg" }],
  },
  iconFlipped: {
    transform: [{ rotate: "270deg" }],
  },
  open: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  openContainer: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopColor: COLORS.gray,
    borderTopWidth: 1,
  },
  editContainer: {
    justifyContent: "flex-end",
    marginTop: MARGINS.mb2,
    marginBottom: MARGINS.mb1,
  },
});
