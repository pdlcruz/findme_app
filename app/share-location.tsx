import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ShareLocationScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleShareLocation = async () => {
    setIsLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to share your location."
      );
      setIsLoading(false);
      return;
    }
    // Simulate broadcasting
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Broadcasting Started",
        "Your location is now being shared with friends."
      );
      router.replace("/(tabs)/map");
    }, 1200);
  };

  // NEW: Handle "Not now"
  const handleNotNow = () => {
    router.replace("/(tabs)/map");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#F59E93", "#F7B2A9"]}
        style={styles.background}
      />
      <View style={styles.content}>
        <Ionicons
          name="location"
          size={64}
          color="white"
          style={{ marginBottom: 24 }}
        />
        <Text style={styles.heading}>Share Your Location</Text>
        <Text style={styles.subtext}>
          To help your friends find you, allow Salmon to access your location.
        </Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareLocation}
          disabled={isLoading}
        >
          <Text style={styles.shareButtonText}>
            {isLoading ? "Sharing..." : "Start Sharing Location"}
          </Text>
        </TouchableOpacity>
        {/* Not now button */}
        <TouchableOpacity
          style={styles.notNowButton}
          onPress={handleNotNow}
          disabled={isLoading}
        >
          <Text style={styles.notNowButtonText}>Not now</Text>
        </TouchableOpacity>
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
  },
  content: {
    width: "90%",
    maxWidth: 350,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  subtext: {
    color: "white",
    fontSize: 15,
    opacity: 0.85,
    textAlign: "center",
    marginBottom: 32,
  },
  shareButton: {
    backgroundColor: "white",
    borderRadius: 12,
    height: 55,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  shareButtonText: {
    color: "#F59E93",
    fontSize: 16,
    fontWeight: "600",
  },
  notNowButton: {
    marginTop: 16,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  notNowButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.8,
  },
});
