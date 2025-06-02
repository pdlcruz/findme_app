"use client";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function SignInScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typedLines, setTypedLines] = useState(["", "", ""]);
  const catchphrases = [
    "Find your friends.",
    "Move together.",
    "Stay in the same stream.",
  ];

  const line1Anim = useRef(new Animated.Value(-300)).current;
  const line2Anim = useRef(new Animated.Value(-300)).current;
  const line3Anim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    let line = 0;
    let char = 0;
    let typingTimeout: NodeJS.Timeout;

    function typeNextChar() {
      if (line < catchphrases.length) {
        if (char < catchphrases[line].length) {
          setTypedLines((prev) => {
            const updated = [...prev];
            updated[line] = catchphrases[line].slice(0, char + 1);
            return updated;
          });
          char++;
          typingTimeout = setTimeout(typeNextChar, 40); // typing speed
        } else {
          line++;
          char = 0;
          typingTimeout = setTimeout(typeNextChar, 400); // pause before next line
        }
      }
    }

    typeNextChar();
    return () => clearTimeout(typingTimeout);
  }, []);

  const handleSignIn = (method: string) => {
    setIsLoading(true);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to share location page after sign in
      router.replace("/share-location");
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#F59E93", "#F7B2A9"]}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo-med.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Catchphrase */}
        <View style={styles.catchphraseContainer}>
          {typedLines.map((line, idx) => (
            <Text key={idx} style={styles.catchphrase}>
              {line}
              {line.length < catchphrases[idx].length &&
              idx ===
                typedLines.findIndex(
                  (l) => l.length < catchphrases[idx].length
                ) ? (
                <Text style={{ opacity: 0.5 }}>|</Text>
              ) : null}
            </Text>
          ))}
        </View>

        {/* Sign In Section */}
        <View style={styles.formWrapper}>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Log in</Text>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#F67164"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#BDBDBD"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => handleSignIn("phone")}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Signing In..." : "Sign In with Phone"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Sign In */}
            <View style={styles.socialRow}>
              {/* Google Sign In */}
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSignIn("google")}
                disabled={isLoading}
              >
                <Ionicons name="logo-google" size={20} color="#F67164" />
                <Text style={[styles.socialButtonText, { color: "#F67164" }]}>
                  Google
                </Text>
              </TouchableOpacity>

              {/* Apple Sign In */}
              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={() => handleSignIn("apple")}
                disabled={isLoading}
              >
                <Ionicons name="logo-apple" size={20} color="#F67164" />
                <Text style={[styles.socialButtonText, { color: "#F67164" }]}>
                  Apple
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don&apos;t have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 0,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 200,
  },
  catchphraseContainer: {
    paddingHorizontal: 32,
  },
  catchphrase: {
    color: "#F67164",
    fontSize: 34,
    fontWeight: "bold",
    lineHeight: 45,
    textAlign: "left",
  },
  formWrapper: {
    backgroundColor: "#fff",
    borderRadius: 32,
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    alignSelf: "stretch",
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
    alignSelf: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 24,
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#222",
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: "#F67164",
    borderRadius: 12,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#F59E93",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  dividerText: {
    color: "#BDBDBD",
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: "600",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.4,
    maxWidth: 160,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  googleButton: {
    backgroundColor: "#fff",
  },
  appleButton: {
    backgroundColor: "#fff",
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  signupText: {
    color: "#888",
    fontSize: 14,
  },
  signupLink: {
    color: "#F67164",
    fontWeight: "bold",
    fontSize: 14,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: "center",
  },
  footerText: {
    color: "white",
    textAlign: "center",
    fontSize: 13,
    opacity: 0.8,
    maxWidth: "80%",
  },
});
