import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = () => {
    // TODO: Implement sign in logic
    router.push("/hi");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "#C7A6F9" }}>
          {/* Top Section */}
          <View style={styles.topSection}>
            {/* Replace this with your logo if you have one */}
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>🙂</Text>
            </View>
            <Text style={styles.appName}>Friends360</Text>
            <View style={{ height: 24 }} />
            <Text style={styles.tagline}>
              Track your friends.{"\n"}Link Up.{"\n"}Stay close.
            </Text>
          </View>

          {/* Bottom Section (Form) */}
          <View style={styles.formSection}>
            <Text style={styles.loginTitle}>Log in</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#B0AEB8"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#B0AEB8"
            />
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password</Text>
            </TouchableOpacity>
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topSection: {
    flex: 1.2,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#C7A6F9",
    paddingBottom: 20,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#B18BE4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoText: {
    fontSize: 32,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B5CC7",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 28,
  },
  formSection: {
    flex: 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 28,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#222",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F7F7F7",
    color: "#222",
  },
  button: {
    backgroundColor: "#C7A6F9",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
    shadowColor: "#C7A6F9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotText: {
    color: "#B0AEB8",
    fontSize: 13,
    textAlign: "left",
    marginBottom: 18,
    marginTop: 2,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signupText: {
    color: "#B0AEB8",
    fontSize: 14,
  },
  signupLink: {
    color: "#8B5CC7",
    fontWeight: "bold",
    fontSize: 14,
  },
});
