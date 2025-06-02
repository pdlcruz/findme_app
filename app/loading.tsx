import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function LoadingScreen() {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/signin");
    }, 4500);

    // Create the rotation animation with pause
    const spin = Animated.sequence([
      Animated.delay(1000), // 1 second pause
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 3000, // 3 seconds for one full rotation
        useNativeDriver: true,
      }),
    ]);

    // Loop the animation
    Animated.loop(spin).start();

    return () => {
      clearTimeout(timeout);
      shakeAnim.stopAnimation();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View style={styles.content}>
        <Animated.Image
          source={require("../assets/images/logo-med.png")}
          style={[
            styles.logo,
            {
              transform: [
                {
                  rotate: shakeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#F59E93",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 32,

    elevation: 4,
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: 16,
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
});
