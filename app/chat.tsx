import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Linking, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../lib/firebaseConfig';

export default function ChatScreen() {
  const { eventId } = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const eventDoc = await getDoc(doc(db, 'events', eventId as string));
        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() });
        }
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    const q = query(
      collection(db, 'events', eventId as string, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setChatMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [eventId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !eventId) return;
    try {
      await addDoc(collection(db, 'events', eventId as string, 'messages'), {
        text: newMessage.trim(),
        senderId: user.uid,
        senderName: user.displayName || user.email,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
      flatListRef.current?.scrollToEnd();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[
      styles.messageContainer,
      item.senderId === user?.uid ? styles.sentMessage : styles.receivedMessage
    ]}>
      <Text style={styles.messageSender}>{item.senderName}</Text>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  if (!event) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#F59E93" />
        </TouchableOpacity>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.name}</Text>
          <Text style={styles.eventLocation}>{event.locationDescription || event.location}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => {
            const scheme = Platform.select({
              ios: 'maps:',
              android: 'geo:',
            });
            const url = Platform.select({
              ios: `${scheme}?ll=${event.location.latitude},${event.location.longitude}&q=${encodeURIComponent(event.locationDescription || event.location)}`,
              android: `${scheme}0,0?q=${event.location.latitude},${event.location.longitude}(${event.locationDescription || event.location})`,
            });
            Linking.canOpenURL(url!).then((supported: boolean) => {
              if (supported) {
                Linking.openURL(url!);
              } else {
                console.log("Don't know how to open URI: " + url);
              }
            });
          }}
          style={styles.pinButton}
        >
          <Ionicons name="location" size={24} color="#F59E93" />
        </TouchableOpacity>
      </SafeAreaView>
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inputWrapper}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#F59E93" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#F59E93',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageSender: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinButton: {
    padding: 8,
  },
}); 