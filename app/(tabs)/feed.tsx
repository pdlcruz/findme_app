import { Ionicons } from '@expo/vector-icons';
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../lib/firebaseConfig';

export default function FeedScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = auth.currentUser;
  const [friends, setFriends] = useState<string[]>([]);
  const [friendMap, setFriendMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const friendsArr = userDoc.exists() && Array.isArray(userDoc.data().friends) ? userDoc.data().friends : [];
      setFriends(friendsArr);
      // Fetch display names for all friends and self
      const allUids = [user.uid, ...friendsArr];
      const friendDocs = await Promise.all(allUids.map(uid => getDoc(doc(db, 'users', uid))));
      const map: Record<string, string> = {};
      friendDocs.forEach(d => {
        if (d.exists()) map[d.id] = d.data().displayName || d.data().email;
      });
      setFriendMap(map);
    };
    fetchFriends();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Listen for events where creatorId is in [user.uid, ...friends]
    const allUids = [user.uid, ...friends];
    if (allUids.length === 0) return;
    const q = query(
      collection(db, 'events'),
      where('creatorId', 'in', allUids)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, err => setError(err.message));
    return () => { unsub(); };
  }, [user, friends]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      setEvents(events => events.filter(e => e.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const renderEventItem = ({ item }: { item: any }) => (
    <View style={styles.hangoutCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.hangoutName}>{item.name}</Text>
        {user && item.creatorId === user.uid && (
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="close-circle" size={22} color="#F59E93" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.location}>{item.locationDescription || item.location}</Text>
      {item.invitedFriends && (
        <View style={styles.membersContainer}>
          {item.invitedFriends.map((uid: string, index: number) => (
            <View key={uid} style={styles.memberTag}>
              <Text style={styles.memberName}>{friendMap[uid] || uid}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Current Events</Text>
      {error ? <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text> : null}
      {loading ? <ActivityIndicator style={{ marginTop: 40 }} /> : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  hangoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hangoutName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  membersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  memberTag: {
    backgroundColor: '#F59E93',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  memberName: {
    fontSize: 14,
    color: '#333',
  },
}); 