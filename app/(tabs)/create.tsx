import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../lib/firebaseConfig';

export default function CreateEventScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [locationText, setLocationText] = useState('');
  const [eventName, setEventName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [duration, setDuration] = useState('1 hour');
  const [friendList, setFriendList] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const friends = userDoc.exists() && Array.isArray(userDoc.data().friends) ? userDoc.data().friends : [];
      if (friends.length) {
        // Fetch friend user docs
        const friendDocs = await Promise.all(friends.map((uid: string) => getDoc(doc(db, 'users', uid))));
        setFriendList(friendDocs.filter(d => d.exists()).map(d => d.data()));
      } else {
        setFriendList([]);
      }
    };
    fetchFriends();
  }, []);

  const handleSelectFriend = (uid: string) => {
    setSelectedFriends(prev => prev.includes(uid) ? prev.filter(f => f !== uid) : [...prev, uid]);
  };

  const handleSelectDuration = (d: string) => setDuration(d);

  const handleMapPress = (e: any) => {
    setSelectedLocation(e.nativeEvent.coordinate);
  };

  const handlePinButton = () => {
    setModalVisible(true);
  };

  const handleSaveLocation = () => {
    setModalVisible(false);
  };

  const handleCreateEvent = async () => {
    setError('');
    setSuccess('');
    if (!eventName || !locationText || !selectedLocation) {
      setError('Please fill in all fields and drop a pin for the location.');
      return;
    }
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('You must be signed in.');
      await addDoc(collection(db, 'events'), {
        name: eventName,
        locationDescription: locationText,
        location: selectedLocation,
        invitedFriends: selectedFriends,
        duration,
        creatorId: user.uid,
        creatorEmail: user.email,
        createdAt: serverTimestamp(),
      });
      setSuccess('Event created!');
      setEventName('');
      setLocationText('');
      setSelectedLocation(null);
      setSelectedFriends([]);
      setDuration('1 hour');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Create Event</Text>
        
        <View style={styles.formContainer}>
          {/* Event Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Coffee Break, Study Session"
              placeholderTextColor="#999"
              value={eventName}
              onChangeText={setEventName}
            />
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name the location</Text>
            <View style={styles.locationInput}>
              <TextInput
                style={[styles.input, styles.locationTextInput]}
                placeholder="e.g., Starbucks on Main St"
                placeholderTextColor="#999"
                value={locationText}
                onChangeText={setLocationText}
              />
              <TouchableOpacity style={styles.locationButton} onPress={handlePinButton}>
                <Ionicons name="pin-outline" size={24} color="#F59E93" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Pin Drop Modal */}
          <Modal visible={modalVisible} animationType="slide">
            <View style={{ flex: 1 }}>
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: 37.7749,
                  longitude: -122.4194,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                onPress={handleMapPress}
              >
                {selectedLocation && <Marker coordinate={selectedLocation} />}
              </MapView>
              <TouchableOpacity style={styles.saveLocationButton} onPress={handleSaveLocation}>
                <Text style={styles.saveLocationButtonText}>Save Location</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelLocationButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelLocationButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Friends Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Invite Friends</Text>
            <View style={styles.friendsContainer}>
              {friendList.map((friend, index) => (
                <TouchableOpacity
                  key={friend.uid}
                  style={[styles.friendChip, selectedFriends.includes(friend.uid) && { backgroundColor: '#F59E93', opacity: 1 }]}
                  onPress={() => handleSelectFriend(friend.uid)}
                >
                  <Text style={styles.friendChipText}>{friend.displayName || friend.email}</Text>
                  {selectedFriends.includes(friend.uid) && (
                    <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duration */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.durationContainer}>
              {['1 hour', '2 hours', '3 hours', 'Custom'].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.durationButton, duration === d && { backgroundColor: '#F59E93' }]}
                  onPress={() => handleSelectDuration(d)}
                >
                  <Text style={[styles.durationButtonText, duration === d && { color: '#fff' }]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Create Button */}
          {error ? <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{error}</Text> : null}
          {success ? <Text style={{ color: 'green', marginBottom: 10, textAlign: 'center' }}>{success}</Text> : null}
          <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent} disabled={isLoading}>
            <Text style={styles.createButtonText}>{isLoading ? 'Creating...' : 'Create Event'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextInput: {
    flex: 1,
    marginRight: 12,
  },
  locationButton: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  saveLocationButton: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#F59E93',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveLocationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelLocationButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelLocationButtonText: {
    color: '#F59E93',
    fontWeight: '600',
    fontSize: 16,
  },
  friendsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  friendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  friendChipText: {
    fontSize: 14,
    color: '#333',
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  durationButtonText: {
    fontSize: 14,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#F59E93',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
}); 