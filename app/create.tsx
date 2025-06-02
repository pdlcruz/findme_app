import { IconSymbol } from "@/components/ui/IconSymbol";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DURATION_OPTIONS = ["1 hour", "2 hours", "3 hours", "Custom"];

export default function CreateHangoutScreen() {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.pageTitle}>Create Hangout</Text>
        <View style={styles.card}>
          {/* Hangout Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hangout Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Coffee Break, Study Session"
              placeholderTextColor="#999"
            />
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.locationInput}>
              <TextInput
                style={[styles.input, styles.locationTextInput]}
                placeholder="Enter location"
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.locationButton}>
                <IconSymbol name="location.fill" size={24} color="#F59E93" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Duration */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.durationContainer}>
              {DURATION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.durationButton,
                    selectedDuration === option &&
                      styles.durationButtonSelected,
                  ]}
                  onPress={() => setSelectedDuration(option)}
                >
                  <Text
                    style={[
                      styles.durationButtonText,
                      selectedDuration === option &&
                        styles.durationButtonTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Create Hangout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F3",
  },
  scrollViewContent: {
    paddingBottom: 40,
    paddingHorizontal: 0,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    marginTop: 24,
    marginBottom: 18,
    marginLeft: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#333",
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationTextInput: {
    flex: 1,
    marginRight: 12,
  },
  locationButton: {
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  friendsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  friendChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F59E93",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  friendChipText: {
    fontSize: 14,
    color: "#333",
  },
  addFriendButton: {
    padding: 8,
  },
  durationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  durationButton: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  durationButtonSelected: {
    backgroundColor: "#FEA993",
  },
  durationButtonText: {
    fontSize: 14,
    color: "#333",
  },
  durationButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#F59E93",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});
