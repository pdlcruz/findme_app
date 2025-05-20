import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AddByNumber() {
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setPhone((prev) => prev.slice(0, -1));
    } else {
      setPhone((prev) => (prev.length < 15 ? prev + key : prev));
    }
  };

  const renderKey = (key: string | number) => (
    <TouchableOpacity
      key={key}
      style={styles.key}
      onPress={() => handleKeyPress(key.toString())}
    >
      <Text style={styles.keyText}>{key}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add by Number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        placeholder="+1 501 984 68"
        placeholderTextColor="#888"
        editable={false}
      />
      <View style={styles.keypad}>
        <View style={styles.keypadRow}>{["1", "2", "3"].map(renderKey)}</View>
        <View style={styles.keypadRow}>{["4", "5", "6"].map(renderKey)}</View>
        <View style={styles.keypadRow}>{["7", "8", "9"].map(renderKey)}</View>
        <View style={styles.keypadRow}>
          {["0"].map(renderKey)}
          <TouchableOpacity
            style={styles.key}
            onPress={() => handleKeyPress("backspace")}
          >
            <Ionicons name="backspace-outline" size={24} color="#222" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Send Friend Request</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 24,
    alignSelf: "flex-start",
    marginLeft: "8%",
  },
  input: {
    width: "84%",
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    fontSize: 18,
    paddingHorizontal: 14,
    marginBottom: 32,
    color: "#222",
  },
  keypad: {
    width: "84%",
    marginBottom: 32,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  key: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  keyText: {
    fontSize: 26,
    color: "#222",
    fontWeight: "400",
  },
  sendButton: {
    width: "84%",
    backgroundColor: "#C7A6F9",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
