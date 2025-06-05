"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { auth } from "../lib/firebaseConfig"

const { width } = Dimensions.get("window")

export default function SignInScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [resetMessage, setResetMessage] = useState("")

  const handleSignIn = async () => {
    setIsLoading(true)
    setError("")
    setResetMessage("")
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.replace("/(tabs)/map")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAccount = async () => {
    setIsLoading(true)
    setError("")
    setResetMessage("")
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.replace("/(tabs)/map")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setError("")
    setResetMessage("")
    if (!email) {
      setError("Please enter your email to reset your password.")
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setResetMessage("Password reset email sent! Check your inbox.")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <LinearGradient colors={["#F59E93", "#F7B2A9"]} style={styles.background} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>salmon</Text>
        </View>

        {/* Sign In Section */}
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Welcome Back</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="white" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="white" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={{ padding: 4 }}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
            <Text style={{ color: 'white', fontWeight: '500' }}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Error or Reset Message */}
          {error ? <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{error}</Text> : null}
          {resetMessage ? <Text style={{ color: 'green', marginBottom: 10, textAlign: 'center' }}>{resetMessage}</Text> : null}

          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? "Signing In..." : "Sign In"}</Text>
          </TouchableOpacity>
          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
            <Text style={{ color: 'white', marginHorizontal: 10 }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
          </View>
          {/* Create Account Button */}
          <TouchableOpacity style={[styles.signInButton, { backgroundColor: '#F59E93' }]} onPress={() => router.push('/signup')} disabled={isLoading}>
            <Text style={[styles.buttonText, { color: 'white' }]}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
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
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logoText: {
    fontFamily: "SourceCodePro-Medium",
    fontSize: 42,
    color: "white",
    letterSpacing: 1,
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
    alignSelf: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "white",
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: "white",
    borderRadius: 12,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#F59E93",
    fontSize: 16,
    fontWeight: "600",
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
})
