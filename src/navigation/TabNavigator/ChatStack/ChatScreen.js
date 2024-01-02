import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import _ from "lodash";
import { useHeaderHeight } from "@react-navigation/stack";

import AppSafeAreaView from "../../../components/AppSafeAreaView";
import AppKeyboardAvoidingView from "../../../components/AppKeyboardAvoidingView";
import { AppContext } from "../../../context";
import { GiftedChat } from "react-native-gifted-chat";
import SendBirdDesk from "sendbird-desk";
import ChatScreenEmptyBackground from "../../../components/ChatScreenEmptyBackground";
import SendBird from "sendbird";
import notifee from '@notifee/react-native';
import { user_replied_chan_API } from "../../../api";

let openChannel = {};

export default function ChatScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [channelId, setChannelId] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { sendbird, user, setNewMsg } = useContext(AppContext);
  let { care_team } = user;
  const headerHeight = useHeaderHeight();

  const { url, care_manager_id, new_chat, unReadCount, proActiveChanURL, isProactiveChat } = route.params;
  const handler = useRef();

  /** Messages that are of system messages type */
  const system_messages_type = "SENDBIRD_DESK_ADMIN_MESSAGE_CUSTOM_TYPE";

  useEffect(() => {
    // SendBird.getInstance().getTotalUnreadMessageCount((value) => {
    //   console.log('getTotalUnreadMessageCount::: ', value, unReadCount);
    //   (value > 0 && unReadCount > 0) && notifee.decrementBadgeCount(unReadCount).then(() => console.log('Badge count removed')) //  setBadgeCount(value - unReadCount).then(() => console.log('Badge count removed'))
    // })

    unReadCount > 0 && notifee.decrementBadgeCount(unReadCount).then(() => console.log('Badge count removed'))
  }, [])

  useEffect(() => {
    if (_.get(url, "length") > 0) {
      subscribeToUpdates(url);
    } else {
      openChannel = {};
      setMessages([]);
      setLoading(false);
    }
  }, [url]);

  const handleReadMessage = () => {
    if (_.get(url, "length") > 0) {
      // SendBird.getInstance().markAsDelivered(url)
      // SendBird.getInstance().markAsReadAll() // clear all tickets notification
      SendBird.getInstance().markAsReadWithChannelUrls([url]).then(() => {
        console.log("back markAsReadAll")
        setNewMsg(false)
      });
    }
  }

  useEffect(() => {
    handleReadMessage()
    return () => {
      handleReadMessage()
    }
  }, [])

  useEffect(() => {
    const temp = `user ${user.id} is connecting at ${Date.now()}`;
    setChannelId(temp);

    // create a channelHandler to accept incoming messages
    handler.current = new sendbird.ChannelHandler();
    handler.current.onMessageReceived = (channel, message) => {
      setNewMsg(true) // true the mark 
      handleIncomingMessage(message);
    };

    /** Event handler to set typing indicator in the app */
    handler.current.onTypingStatusUpdated = (group) => {
      if (group?.isTyping()) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    };

    sendbird.addChannelHandler(channelId, handler.current);

    return () => {
      if (handler?.current && handler?.current?.removeChannelHandler) {
        handler?.current?.removeChannelHandler(channelId);
      }
    };
  }, []);

  // handle sending user message
  // note: the useCallback hook is very important here to avoid message duplication
  const onSend = useCallback((messages = []) => {
    setNewMsg(false) // false the mark 
    const params = new sendbird.UserMessageParams();
    // if a channel doesn't exist, open a new ticket
    if (!(_.get(openChannel, "url.length") > 0)) {
      createTicket(messages[0].text);
    }
    params.message = messages[0].text;
    params.mentionType = "channel";

    // otherwise send the message to the appropriate sendbird channel
    if (_.get(openChannel, "url.length") > 0) {
      openChannel.sendUserMessage(params, (userMessage, error) => {
        if (error) {
          console.log("err sending message", { error });
        }
        proActiveChanURL && user_replied_chan_API(user.id, { group_channel_url: url })
      });
    }
    // before adding the message to the screen
    setMessages((previousMessages) => {
      return GiftedChat.append(previousMessages, messages);
    });
  }, []);

  // handles incoming messages--again, useCallback is very important
  const handleIncomingMessage = useCallback(
    (incomingMessage) => {
      if (
        (incomingMessage.messageType === "admin" &&
          incomingMessage.silent === true &&
          !incomingMessage.type === `{"type": "NOTIFICATION_WELCOME"}`) ||
        openChannel.url !== incomingMessage.channelUrl ||
        /** Condition to hide sysytem messages (e.g when ticket status, assignment, priority change e.t.c.) */
        incomingMessage?.customType === system_messages_type
      ) {
        return;
      }

      const message = {};
      message._id = incomingMessage.messageId;
      message.createdAt = incomingMessage.createdAt;
      message.text = incomingMessage.message;
      message.user = {
        _id: incomingMessage?._sender?.userId,
        name: incomingMessage?._sender?.nickname,
      };

      return setMessages((previousMessages) => {
        return GiftedChat.append(previousMessages, message);
      });
    },
    [messages]
  );

  // subscribe to updates in ticket channel
  const subscribeToUpdates = (url) => {
    SendBirdDesk.Ticket.getByChannelUrl(url, (ticket, error) => {
      if (error) {
        return console.log("error getting channel url", { error });
      }
      openChannel = ticket.channel;

      console.log("ticket", ticket)
      navigation.setOptions({ title: ((ticket.title).includes("test_") || (ticket.title).includes("Proactive chat")) ? "Chat" : ticket.title });
      getPreviousMessages(ticket.channel);
    });
  };

  const care_manager = care_manager_id
    ? _.find(care_team, { id: `${care_manager_id}` })
    : care_team[0];
  /**
   * Get group_id against which chat is to be created
   * in sendbird desk.
   * If group doesn't exist in sendbird with some ID then
   * sendbird automatically creates the chat/ticket against
   * the default group "Default team".
   */
  const getGroupId = () => {
    return care_manager?.attributes?.sendbird_group_key;
  };

  const createTicket = (subject) => {
    const fullName = user.first_name + " " + user.last_name;
    // console.log("subject ", subject)
    // console.log("fullName ", fullName)
    // console.log("getGroupId ", getGroupId())

    SendBirdDesk.Ticket.create(
      subject,
      fullName,
      getGroupId(),
      (ticket, error) => {

        if (error) {
          return console.log("error with ticket", { error });
        }

        ticket?.channel?.sendUserMessage(subject, (message, error) => {
          if (error) {
            console.log("error sending first message", { error });
          }
        });
        navigation.setParams({ url: ticket?.channel?.url });
      }
    );
  };

  // if the channel exists, retrieve previous messages in thread
  const getPreviousMessages = (channel) => {
    const query = channel?.createPreviousMessageListQuery();
    query.limit = 50;
    // query.reverse = true;

    const defaultAdminMsgType = [
      `{\"type\": \"NOTIFICATION_WELCOME\"}`,
      `{\"type\": \"NOTIFICATION_AWAY_AGENT\"}`,
      `{\"type\": \"NOTIFICATION_ASSIGNMENT_DELAY\"}`,
      `{\"type\": \"NOTIFICATION_NOT_OPERATING_HOUR\"}`
      //`{\"type\": \"NOTIFICATION_PROACTIVE_CHAT\"}`
    ]

    query.load((incoming_messages, error) => {
      if (error) {
        return console.log("error loading prev messages", { error });
      }
      /**
       * Following if block helps remove first
       * chat message duplcation with the response that
       * comes in from sendbird after user enters first message.
       */
      // console.log("incoming_messages", incoming_messages)

      if (
        new_chat &&
        _.isEqual(messages[0]?.text, incoming_messages[0]?.message) &&
        incoming_messages[0]?.messageType === "user"
      ) {
        setMessages([]);
      }

      incoming_messages.map((incoming_message, index) => {
        if (isProactiveChat && (index == 0 || index == 1)) {
          if (
            !defaultAdminMsgType.includes(incoming_message?.data)
          )
            handleIncomingMessage(incoming_message);
        }
        else
          handleIncomingMessage(incoming_message);
      });
      setLoading(false);
    });
  };

  const chatBackgroundProps = {};
  if (care_manager_id) {
    chatBackgroundProps.title = "Start chatting with ";
    chatBackgroundProps.title +=
      care_manager?.attributes?.first_name || "Care Manager";
  }

  /**
   * Filter messages to remove
   * duplicate messages.
   */
  const filteredMessages = () => {
    return _.uniqBy(messages, "_id");
  };

  const chatScreenBody = loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={"large"} style={styles.loading} />
    </View>
  ) : (
    <View style={styles.chatContainer}>
      {!messages.length ? (
        <View style={styles.background}>
          <ChatScreenEmptyBackground {...chatBackgroundProps} />
        </View>
      ) : (
        <></>
      )}
      <View style={styles.body}>
        <GiftedChat
          textInputStyle={{ color: '#000' }}
          textInputProps={{
            placeholderTextColor: 'gray',
          }}
          messages={filteredMessages()}
          onSend={(messages) => onSend(messages)}
          user={{ _id: `${user.id}`, name: user.first_name }}
          alwaysShowSend
          isKeyboardInternallyHandled={false}
          isTyping={isTyping}

          onInputTextChanged={(text) => {
            if (!_.isEmpty(openChannel)) {
              if (text) openChannel?.startTyping();
              else openChannel?.endTyping();
            }
          }}
        />
      </View>
    </View>
  );
  return (
    <AppSafeAreaView edges={["left", "right"]}>
      <AppKeyboardAvoidingView keyboardVerticalOffset={headerHeight}>
        {chatScreenBody}
      </AppKeyboardAvoidingView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    height: "60%",
  },
  body: {
    flexGrow: 1,
  },
  chatContainer: {
    flexGrow: 1,
  },
  loading: {
    alignSelf: "center",
  },
  loadingContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },
});
