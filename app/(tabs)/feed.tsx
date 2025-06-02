import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const YOUR_NAME = "Mai Hoang";

// Mock hangout groups
const MOCK_HANGOUTS = [
  {
    id: "1",
    owner: "John",
    time: "2m ago",
    distance: "0.5 mi",
    name: "Studying",
    members: ["Karla Aguilar", "Steven Tran", "2 others"],
    location: "San Francisco, CA",
  },
  {
    id: "2",
    time: "1hr ago",
    distance: "0.3 mi",
    owner: "Cruzzywoozy",
    name: "getting freaky 😏",
    members: ["Cruzzywoozy"],
    location: "San Francisco, CA",
  },
  {
    id: "3",
    time: "1hr ago",
    distance: "2 mi",
    owner: "Lisa",
    name: "Study Group",
    members: ["Lisa Anderson", "James Taylor"],
    location: "San Francisco, CA",
  },
  {
    id: "4",
    time: "2hr ago",
    distance: "3 mi",
    owner: "Rachel",
    name: "Gaming Night",
    members: ["Rachel Green", "Tom Harris", "Anna White"],
    location: "San Francisco, CA",
  },
  {
    id: "5",
    time: "5m ago",
    distance: "0.7 mi",
    owner: "Mai Hoang",
    name: "Coffee Run",
    members: ["Mai Hoang", "Alex Chen"],
    location: "San Francisco, CA",
  },
  {
    id: "6",
    time: "10m ago",
    distance: "1.1 mi",
    owner: "Steven Tran",
    name: "Lunch at Park",
    members: ["Steven Tran", "Karla Aguilar", "Emma Wilson"],
    location: "San Francisco, CA",
  },
  {
    id: "7",
    time: "20m ago",
    distance: "0.2 mi",
    owner: "Tom Harris",
    name: "Quick Walk",
    members: ["Tom Harris"],
    location: "San Francisco, CA",
  },
  {
    id: "8",
    time: "30m ago",
    distance: "2.5 mi",
    owner: "Anna White",
    name: "Yoga Session",
    members: ["Anna White", "Rachel Green"],
    location: "San Francisco, CA",
  },
  {
    id: "9",
    time: "45m ago",
    distance: "1.8 mi",
    owner: "James Taylor",
    name: "Board Games",
    members: ["James Taylor", "Lisa Anderson", "David Lee"],
    location: "San Francisco, CA",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Helper to convert time string to minutes for sorting
function timeToMinutes(time: string) {
  if (time.includes("m ago")) return parseInt(time);
  if (time.includes("hr ago")) return parseInt(time) * 60;
  return 9999; // fallback for unknown format
}

export default function FeedScreen() {
  const [activeTab, setActiveTab] = useState<"distance" | "recent">("distance");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<{ [id: string]: boolean }>(
    {}
  );
  // Track current members for each group
  const [groupMembers, setGroupMembers] = useState<{ [id: string]: string[] }>(
    () => Object.fromEntries(MOCK_HANGOUTS.map((g) => [g.id, [...g.members]]))
  );

  // Sort by distance or time
  const sortedHangouts =
    activeTab === "distance"
      ? [...MOCK_HANGOUTS].sort(
          (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
        )
      : [...MOCK_HANGOUTS].sort(
          (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)
        );

  const handleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleJoinToggle = (id: string) => {
    setJoinedGroups((prev) => {
      const isJoining = !prev[id];
      setGroupMembers((membersPrev) => {
        const current = membersPrev[id] || [];
        if (isJoining) {
          // Add your name if not present
          if (!current.includes(YOUR_NAME)) {
            return { ...membersPrev, [id]: [...current, YOUR_NAME] };
          }
        } else {
          // Remove your name if present
          return {
            ...membersPrev,
            [id]: current.filter((m) => m !== YOUR_NAME),
          };
        }
        return membersPrev;
      });
      return { ...prev, [id]: isJoining };
    });
  };

  const renderHangoutItem = ({ item }: { item: (typeof MOCK_HANGOUTS)[0] }) => {
    const isJoined = joinedGroups[item.id];
    const members = groupMembers[item.id] || item.members;

    return (
      <View style={styles.hangoutCard}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleExpand(item.id)}
          style={{ width: "100%" }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.hangoutName}>{item.owner}’s group</Text>
              <Text style={styles.membersText}>{item.members.join(", ")}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <Ionicons
                  name="location-sharp"
                  size={16}
                  color="#333"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.location}>{item.location}</Text>
                <View style={styles.distanceBadge}>
                  <Text style={styles.distanceText}>
                    {activeTab === "distance" ? item.distance : item.time}
                  </Text>
                </View>
              </View>
              <Text style={styles.statusText}>{item.name}</Text>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "space-between",
                height: 60,
              }}
            >
              <TouchableOpacity
                style={[styles.joinButton, isJoined && styles.leaveButton]}
                onPress={() => handleJoinToggle(item.id)}
              >
                <Ionicons
                  name={isJoined ? "exit-outline" : "people-outline"}
                  size={18}
                  color={isJoined ? "#888" : "#333"}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.joinButtonText,
                    isJoined && styles.leaveButtonText,
                  ]}
                >
                  {isJoined ? "Leave" : "Join"}
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                {members.slice(0, 2).map((member, idx) => (
                  <View
                    key={member}
                    style={[
                      styles.avatar,
                      { marginLeft: idx === 0 ? 0 : -12, zIndex: 2 - idx },
                    ]}
                  >
                    <Text style={styles.avatarText}>{getInitials(member)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {expandedId === item.id && (
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Group Members:</Text>
            {members.map((member, idx) => (
              <View key={idx} style={styles.dropdownMemberRow}>
                <View style={styles.dropdownAvatar}>
                  <Text style={styles.dropdownAvatarText}>
                    {getInitials(member)}
                  </Text>
                </View>
                <Text style={styles.dropdownMemberName}>
                  {member === YOUR_NAME ? `${member} (you)` : member}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "distance" && styles.tabActive]}
          onPress={() => setActiveTab("distance")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "distance" && styles.tabActiveText,
            ]}
          >
            Distance
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "recent" && styles.tabActive]}
          onPress={() => setActiveTab("recent")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "recent" && styles.tabActiveText,
            ]}
          >
            Recent
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedHangouts}
        renderItem={renderHangoutItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 16,
    marginLeft: 20,
    marginBottom: 8,
    color: "#111",
  },
  tabsRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    marginBottom: 8,
    marginHorizontal: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: "#FEA993",
  },
  tabText: {
    fontSize: 20,
    color: "#888",
    fontWeight: "400",
  },
  tabActiveText: {
    color: "#444",
    fontWeight: "500",
  },
  listContainer: { paddingBottom: 50 },
  hangoutCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 1,
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  hangoutName: { fontSize: 20, fontWeight: "bold", color: "#111" },
  membersText: { fontSize: 14, color: "#666", marginTop: 2 },
  location: { fontSize: 14, color: "#333", fontWeight: "500" },
  distanceBadge: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  distanceText: { fontSize: 12, color: "#333" },
  statusText: { fontSize: 16, color: "#333", marginTop: 8 },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  joinButtonText: { fontSize: 16, color: "#333", fontWeight: "500" },
  leaveButton: {
    backgroundColor: "#eee",
    borderColor: "#bbb",
  },
  leaveButtonText: {
    color: "#888",
    fontWeight: "500",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E2E2E2",
    borderWidth: 2,
    borderColor: "#57AD43",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
    marginRight: 0,
  },
  avatarText: { color: "white", fontWeight: "bold", fontSize: 14 },
  dropdown: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  dropdownTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  dropdownMemberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dropdownAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E2E2E2",
    borderWidth: 2,
    borderColor: "#57AD43",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  dropdownAvatarText: {
    color: "#57AD43",
    fontWeight: "bold",
    fontSize: 13,
  },
  dropdownMemberName: {
    fontSize: 15,
    color: "#333",
  },
});
