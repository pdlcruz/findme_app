import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../lib/firebaseConfig';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const validate = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    setError('');
    setSuccess('');
    if (!validate()) return;
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          // photoURL: image, // To fully support this, upload to Firebase Storage and get a URL
        });
        // Save user info to Firestore
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          uid: auth.currentUser.uid,
          displayName: name,
          email: auth.currentUser.email,
          friends: [],
        });
      }
      setSuccess('Account created! Redirecting...');
      setTimeout(() => router.replace('/(tabs)/map'), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Create Account</Text>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle-outline" size={80} color="#F59E93" />
          )}
          <Text style={styles.avatarText}>Upload Profile Picture (optional)</Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#F59E93" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#F59E93"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#F59E93" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#F59E93"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#F59E93" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#F59E93"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={{ padding: 4 }}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#F59E93" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#F59E93" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#F59E93"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)} style={{ padding: 4 }}>
            <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#F59E93" />
          </TouchableOpacity>
        </View>
        {error ? <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{error}</Text> : null}
        {success ? <Text style={{ color: 'green', marginBottom: 10, textAlign: 'center' }}>{success}</Text> : null}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.signUpButtonText}>Create Account</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#F59E93', textAlign: 'center' }}>Back to Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F59E93',
    marginBottom: 24,
    marginTop: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  avatarText: {
    color: '#F59E93',
    fontSize: 13,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,158,147,0.08)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
    height: 50,
    width: '100%',
    maxWidth: 350,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#F59E93',
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#F59E93',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 