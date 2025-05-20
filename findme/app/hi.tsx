import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";

const friends = [
  {
    initials: "KA",
    name: "Karla Aguilar",
    location: "Stanford, CA | Now",
    distance: "0 mi",
    color: "#B6EBC6",
    id: "1",
  },
  {
    initials: "LC",
    name: "Luis Cruz",
    location: "Stanford, CA | Now",
    distance: "0 mi",
    color: "#B6EBC6",
    id: "2",
  },
  {
    initials: "ST",
    name: "Steven Tran",
    location: "Stanford, CA | Now",
    distance: "0 mi",
    color: "#B6EBC6",
    id: "3",
  },
  {
    initials: "BK",
    name: "Brian Kaether",
    location: "Stanford, CA | Now",
    distance: "0.3 mi",
    color: "#F7C5C5",
    id: "4",
  },
];

const NAV_ITEMS = [
  { key: "map", label: "Map", icon: "map" },
  { key: "feed", label: "Feed", icon: "rss" },
  { key: "notifications", label: "Notifications", icon: "notifications" },
  { key: "settings", label: "Settings", icon: "person" },
];

export default function HiPage() {
  const [activeTab, setActiveTab] = useState("map");
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top half (empty for now) */}
      <View style={styles.topHalf} />

      {/* Bottom half */}
      <View style={styles.bottomHalf}>
        <View style={styles.headerRow}>
          <Text style={styles.nearbyTitle}>Nearby Friends</Text>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => router.push("/add-friend")}
          >
            <Ionicons name="add" size={24} color="#222" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.friendRow}>
              <View style={[styles.avatar, { backgroundColor: item.color }]}>
                <Text style={styles.avatarText}>{item.initials}</Text>
              </View>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.name}</Text>
                <Text style={styles.friendLocation}>{item.location}</Text>
              </View>
              <Text style={styles.distance}>{item.distance}</Text>
            </View>
          )}
        />
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        {NAV_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => setActiveTab(item.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.icon}
              size={26}
              color={activeTab === item.key ? "#8B5CC7" : "#B0AEB8"}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  topHalf: {
    flex: 1,
    backgroundColor: "transparent",
  },
  bottomHalf: {
    flex: 1.2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 60, // Space for nav bar
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  nearbyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  plusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    fontWeight: "bold",
    color: "#222",
    fontSize: 16,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  friendLocation: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },
  distance: {
    color: "#888",
    fontSize: 13,
    marginLeft: 8,
    fontWeight: "500",
  },
  navBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: "#eee",
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
