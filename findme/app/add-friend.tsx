import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function AddFriend() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Find Your{"\n"}Friends</Text>
        <Text style={styles.subtitle}>
          See which of your friends already use Friends360, or add manually by
          number.
        </Text>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Allow Contacts Access</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.push("/add-by-number")}
        >
          <Text style={styles.outlineButtonText}>Add By Number</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "85%",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111",
    textAlign: "left",
    alignSelf: "flex-start",
    marginBottom: 8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: "#444",
    textAlign: "left",
    alignSelf: "flex-start",
    marginBottom: 28,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#C7A6F9",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  outlineButton: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#222",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  outlineButtonText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 16,
  },
});
