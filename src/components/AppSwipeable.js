import React from "react";
import { StyleSheet, Text, View, Animated, Button } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

export default function AppSwipeable({ children }) {
  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 1],
      outputRange: [-1, 0],
    });

    return (
      <Animated.View
        style={{
          transform: [{ translateX: scale }],
        }}
      >
        <Button title="test" onPress={() => console.log("pressed")} />
      </Animated.View>
    );
  };

  const renderLeftActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 1],
      outputRange: [-1, 0],
    });

    return (
      <Animated.View
        style={{
          transform: [{ translateX: scale }],
        }}
      >
        <Button title="test" onPress={() => console.log("pressed")} />
      </Animated.View>
    );
  };

  return (
    <Swipeable
      friction={2}
      rightThreshold={80}
      leftThreshold={41}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({});
