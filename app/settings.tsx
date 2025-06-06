import { Feather, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from '../lib/firebaseConfig';

const profilePic = require("@/assets/images/profile-picture.png");

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function SettingsScreen() {
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('');
  const [eventsAttended, setEventsAttended] = useState(0);
  const [friends, setFriends] = useState(0);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setDisplayName(userDoc.data().displayName || userDoc.data().email || '');
        setLocation(userDoc.data().location || '');
        setFriends(Array.isArray(userDoc.data().friends) ? userDoc.data().friends.length : 0);
        // Optionally, fetch events attended from another collection
      }
    };
    fetchUser();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.header}>Account</Text>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={profilePic}
            style={styles.avatarCircle}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileLocation}>{location}</Text>
            <Text style={styles.profileStats}>{eventsAttended} events attended</Text>
            <View style={styles.profileFollows}>
              <Text style={styles.profileFollowNum}>{friends}</Text>
              <Text style={styles.profileFollowLabel}>Friends</Text>
            </View>
          </View>
        </View>
        {/* Preferences */}
        <Text style={styles.sectionHeader}>Preferences</Text>
        <SettingsItem icon={<Feather name="edit-3" size={22} color="#F59E93" />} label="Edit profile" />
        <SettingsItem icon={<Ionicons name="people-outline" size={22} color="#F59E93" />} label="Friends" />
        <SettingsItem icon={<Feather name="lock" size={22} color="#F59E93" />} label="Change password" />
        <SettingsItem icon={<Ionicons name="location-outline" size={22} color="#F59E93" />} label="Change location settings" />
        <SettingsItem icon={<MaterialIcons name="privacy-tip" size={22} color="#F59E93" />} label="Privacy" />
        <SettingsItem icon={<FontAwesome name="sign-out" size={22} color="#F59E93" />} label="Log out" />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <TouchableOpacity style={styles.settingsItem}>
      <View style={styles.settingsIcon}>{icon}</View>
      <Text style={styles.settingsLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#bbb" style={{ marginLeft: "auto" }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    marginLeft: 20,
    marginBottom: 16,
    color: "#F59E93",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F59E93",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F59E93",
  },
  profileLocation: {
    fontSize: 16,
    color: "#444",
    marginTop: 2,
  },
  profileStats: {
    fontSize: 15,
    color: "#888",
    marginTop: 2,
  },
  profileFollows: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  profileFollowNum: {
    fontWeight: "bold",
    fontSize: 15,
    marginRight: 3,
    color: "#F59E93",
  },
  profileFollowLabel: {
    fontSize: 15,
    color: "#222",
    marginRight: 12,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F59E93",
    marginLeft: 20,
    marginBottom: 8,
    marginTop: 8,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0E8",
  },
  settingsIcon: {
    marginRight: 16,
  },
  settingsLabel: {
    fontSize: 17,
    color: "#222",
    fontWeight: "500",
  },
}); 