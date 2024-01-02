import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Pressable, Keyboard } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import SendBirdDesk from "sendbird-desk";

import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppKeyboardAvoidingView from "../../../components/AppKeyboardAvoidingView";
import AppButton from "../../../components/AppButton";
import AppFlatList from "../../../components/AppFlatList";
import { COLORS, MARGINS } from "../../../utils/styles";
import AppText from "../../../components/AppText";
import AppContainer from "../../../components/AppContainer";
import TabHeader from "../../../components/TabHeader";
import { AppContext } from "../../../context";
import SendBird from "sendbird";
import notifee from '@notifee/react-native';
import { getProactiveChan_API } from "../../../api";

export default function ChatLobbyScreen({ navigation, route }) {
  const { sendbirdAccessToken, handleSendbirdAccessToken, setError, user, setNewMsg, setSelectedChatDetails } =
    useContext(AppContext);
  const { care_manager_id } = route.params || {};
  const [openTickets, setOpenTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);
  const [openOffset, setOpenOffset] = useState(0);
  const [closedOffset, setClosedOffset] = useState(0);
  const [openEndReached, setOpenEndReached] = useState(false);
  const [closedEndReached, setClosedEndReached] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [proActive_groups, setProActive_groups] = useState([]);

  const [selected, setSelected] = useState("Open");
  const headers = ["Open", "Closed"];

  const getproactiveGroups = async () => {
    const data = await getProactiveChan_API(user.id)
    console.log("getProactiveChan_API data", data)
    setProActive_groups(data)
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      getproactiveGroups()
    });

    SendBird.getInstance().getTotalUnreadMessageCount((value) => {
      (value == 0) && notifee.setBadgeCount(0).then(() => console.log('Badge count removed'))
    })

    return unsubscribe;
  }, [navigation]);

  // const getGroupchannelsTickets = async () => {
  //   const sb = await SendBird.getInstance();

  //   SendBirdDesk.Ticket.getAllTickets(0, (tickets, error) => {
  //     console.log("getAllTickets tickets", tickets)
  //   })

  //   const Schannel = sb.GroupChannel.getChannel("sendbird_group_channel_765");
  //   const messageListQuery = Schannel.createPreviousMessageListQuery();
  //   messageListQuery.load(100, true, (messages, error) => {
  //     if (error) {
  //       console.error(error);
  //     } else {
  //       console.log("List of messages", messages)
  //     }
  //   });

  //   // **GET OPEN CHANNELS**
  //   // const open_query = sb.OpenChannel.createOpenChannelListQuery();
  //   // open_query.memberStateFilter = 'joined_only'; // Filter the channels by the user's membership
  //   // open_query.limit = 20; // Limit the number of channels to retrieve
  //   // open_query.next((channels, error) => {
  //   //   if (error) {
  //   //     console.error('Failed to get open channels:', error);
  //   //   } else {
  //   //     console.log("All open channels",channels)
  //   //     const userChannels = channels.filter(channel => {
  //   //       const participants = channel.participantCount;
  //   //       return participants && participants.hasOwnProperty(sb?.currentUser?.userId);
  //   //     });
  //   //     console.log('Open channels that user has joined:', userChannels);
  //   //   }
  //   // });

  //   // **JOIN TO GROUP CHANNEL**
  //   const groupChannelUrl = "Group channel URL"
  //   sb.GroupChannel.getChannel(groupChannelUrl, (groupChannel, error) => {
  //     if (error) {
  //       console.log("GroupChannelerror", error);
  //       return;
  //     }
  //     groupChannel.join((response, error) => {
  //       if (error) {
  //         console.log("groupChannel.join err", error);
  //         return;
  //       }
  //       console.log("join response", response)
  //       console.log(`Successfully joined channel ${groupChannelUrl}`);
  //     });
  //   });

  //   // **GET ALL GROUP CHANNELS AGAINTS TO SPECIFIC USER**
  //   const query = sb.GroupChannel.createMyGroupChannelListQuery();
  //   query.includeEmpty = true;
  //   query.limit = 100;
  //   // query.memberStateFilter = 'all';
  //   // query.hiddenChannelFilter = "hidden_only";
  //   // query.unreadChannelFilter = "all";
  //   // query.includeFrozen = true;
  //   query.order = 'latest_last_message';
  //   query.queryType = 'AND';
  //   query.userIdsIncludeFilter = [sb?.currentUser?.userId];
  //   query.next((groupChannels, error) => {
  //     if (error) {
  //       console.log('Error getting group channels:', error);
  //       return;
  //     }
  //     console.log('Lobby - Group channels:', groupChannels);
  //     groupChannels.length > 0 && groupChannels?.map((val, key) => {
  //       // setOpenTickets(pre => [...pre, { channel: val }]);
  //     })
  //   });
  // }

  const getOpenTickets = async (offset) => {
    setRefreshing(true);
    SendBirdDesk.Ticket.getOpenedList(offset, (tickets, error) => {
      if (error) {
        setRefreshing(false);
        console.log("error getting opened tickets", { error });
        setError("Error getting opened tickets");
        return;
      }
      if (offset === 0) {
        setOpenTickets(tickets);
        setOpenEndReached(false);
      } else {
        if (tickets.length > 0) {
          setOpenTickets(openTickets.concat(tickets));
        } else {
          setOpenEndReached(true);
        }
      }
      setOpenOffset(offset + tickets.length);
      setRefreshing(false);
    });
  };

  const getClosedTickets = async (offset) => {
    setRefreshing(true);
    SendBirdDesk.Ticket.getClosedList(offset, (tickets, error) => {
      if (error) {
        setRefreshing(false);
        console.log("error getting closed tickets", { error });
        setError("Error getting closed tickets");
        return;
      }
      if (offset === 0) {
        setClosedTickets(tickets);
        setClosedEndReached(false);
      } else {
        if (tickets.length > 0) {
          setClosedTickets(closedTickets.concat(tickets));
        } else {
          setClosedEndReached(true);
        }
      }
      setClosedOffset(offset + tickets.length);
      setRefreshing(false);
    });
  };

  const resetTickets = async () => {
    setRefreshing(true);
    SendBirdDesk.Ticket.getOpenedList(0, (tickets, error) => {
      if (error) {
        setRefreshing(false);
        console.log("error getting opened tickets", { error });
        setError("Error getting open tickets");
        return;
      }

      setOpenTickets(tickets);
      // getGroupchannelsTickets();
      setOpenEndReached(false);
      setOpenOffset(tickets.length);
      setRefreshing(false);
    });
    SendBirdDesk.Ticket.getClosedList(0, (tickets, error) => {
      if (error) {
        setRefreshing(false);
        console.log("error getting closed tickets", { error });
        setError("Error getting closed tickets");
        return;
      }

      setClosedTickets(tickets);
      setClosedEndReached(false);
      setClosedOffset(tickets.length);
    });
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused && sendbirdAccessToken) {
      resetTickets();
    }
  }, [isFocused, sendbirdAccessToken]);

  useEffect(() => {
    if (user && !sendbirdAccessToken) {
      handleSendbirdAccessToken(user);
    }
  }, [user, sendbirdAccessToken]);

  const redirect = (props = {}) => {
    navigation.navigate("Chat", props);
  };

  const renderTicket = ({ item }) => {
    return (
      <Pressable
        key={item?.id}
        style={[
          styles.ticketCard,
          item?.status === "CLOSED" ? styles.ticketClosed : {},
          item?.channel?.unreadMessageCount > 0 && styles.boxShadow,
          { flexDirection: "row" }
        ]}
        onPress={() => {
          setSelectedChatDetails(item)
          redirect({
            url: item?.channel?.url,
            new_chat: undefined,
            unReadCount: item?.channel?.unreadMessageCount,
            isProactiveChat: (item?.title).includes("Proactive chat") ? true : false
          })
        }
        }
      >
        <View style={{ width: "92%" }}>
          <AppText bold mb1>
            {item?.agent?.name || "Mother Goose Team"}
          </AppText>
          <AppText numberOfLines={1} gray mb1>
            {item?.channel?.lastMessage?.message}
          </AppText>
        </View>
        <View style={styles.countCol}>
          {
            item?.channel?.unreadMessageCount > 0 &&
            <View style={styles.countCircle}>
              <AppText small white>
                {item?.channel?.unreadMessageCount > 9 ? "9+" : item?.channel?.unreadMessageCount}
              </AppText>
            </View>
          }
        </View>
      </Pressable>
    );
  };

  /**
   * Redirect directly to chat screen if patient
   * request a chat directly from care_manager's
   * demographics screen.
   * Also attach care_manager_id to params to start
   * chat with the desired care_manager.
   */
  useEffect(() => {
    setNewMsg(false)
    if (care_manager_id) redirect({ care_manager_id, new_chat: true, url: "" });
  }, []);


  const render_ProActiveChat = () => {
    return (
      <View>
        {
          proActive_groups.length > 0 ?
            proActive_groups.map((val, key) => {
              return (
                <Pressable
                  key={val?.id}
                  style={[
                    styles.ticketCard,
                    // item?.status === "CLOSED" ? styles.ticketClosed : {},
                    styles.boxShadow,
                    { flexDirection: "row" }
                  ]}
                  onPress={() =>
                    redirect({
                      url: val?.message?.channel_url,
                      new_chat: undefined,
                      unReadCount: 1,
                      channel_data: {},
                      proActiveChanURL: true,
                      isProactiveChat: true
                    })
                  }
                >
                  <View style={{ width: "92%" }}>
                    <AppText bold mb1>
                      {"Your Care Manager"}
                    </AppText>
                    <AppText numberOfLines={1} gray mb1>
                      {val?.message?.message}
                    </AppText>
                  </View>
                  <View style={styles.countCol}>
                    <View style={styles.countCircle}>
                      <AppText small white>
                        {"1"}
                      </AppText>
                    </View>

                  </View>
                </Pressable>
              )
            })
            : null
        }
      </View>

    )
  }

  const renderEmptyComp = () => {
    return (
      <View style={styles.empty}>
        <AppText h2 blue semibold textAlignCenter mb4>
          {`It doesn't look like you have any conversations started`}
        </AppText>
      </View>
    )
  }
  // Handles getting all of a user's messages
  return (
    <AppSafeAreaView edges={["top", "left", "right"]}>
      <AppKeyboardAvoidingView>
        <AppContainer noPaddingBottom>
          <AppText h1 bold mb4>
            Messages
          </AppText>
          <TabHeader
            headers={headers}
            selected={selected}
            setSelected={setSelected}
          />
          <AppFlatList
            ListHeaderComponent={selected === "Open" ? render_ProActiveChat : null}
            data={selected === "Open" ? openTickets : closedTickets}
            // data={[]}
            renderItem={renderTicket}
            ListEmptyComponent={() => (
              <>
                {
                  selected === "Open" ?
                    proActive_groups.length > 0 ?
                      <></>
                      :
                      renderEmptyComp()
                    :
                    renderEmptyComp()
                }
              </>
            )}
            refreshing={refreshing}
            onRefresh={() =>
              selected === "Open" ? getOpenTickets(0) : getClosedTickets(0)
            }
            onEndReached={() =>
              !refreshing
                ? selected === "Open"
                  ? !openEndReached && getOpenTickets(openOffset)
                  : !closedEndReached && getClosedTickets(closedOffset)
                : null
            }
            keySignature="tickets-screen"
          />
          <View style={styles.buttonContainerStyle}>
            <AppButton
              onPress={() => redirect({ url: "", new_chat: true })}
              title="Start a new conversation"
              schedule
            />
          </View>
        </AppContainer>
      </AppKeyboardAvoidingView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainerStyle: {
    backgroundColor: COLORS.white,
  },
  empty: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },
  ticketCard: {
    borderColor: COLORS.lightGray,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: MARGINS.mb3,
    paddingHorizontal: MARGINS.mb3,
    paddingVertical: MARGINS.mb2,
  },
  ticketClosed: {
    backgroundColor: COLORS.lightGray,
  },
  countCol: {
    width: "8%",
    alignItems: "center",
    justifyContent: "center"
  },
  countCircle: {
    height: 21,
    width: 21,
    borderRadius: 21 / 2,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center"
  },
  boxShadow: {
    shadowColor: COLORS.darkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    backgroundColor: "#fff"
  },
});
