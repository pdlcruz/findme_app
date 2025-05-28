import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock hangout groups
const MOCK_HANGOUTS = [
  {
    id: '1',
    name: 'Coffee Break',
    members: ['John Smith', 'Emma Wilson'],
    location: 'Starbucks Downtown',
  },
  {
    id: '2',
    name: 'Lunch Squad',
    members: ['Michael Brown', 'Sarah Davis', 'David Lee'],
    location: 'Central Park',
  },
  {
    id: '3',
    name: 'Study Group',
    members: ['Lisa Anderson', 'James Taylor'],
    location: 'University Library',
  },
  {
    id: '4',
    name: 'Gaming Night',
    members: ['Rachel Green', 'Tom Harris', 'Anna White'],
    location: 'Tom\'s Place',
  },
];

export default function FeedScreen() {
  const renderHangoutItem = ({ item }: { item: typeof MOCK_HANGOUTS[0] }) => (
    <View style={styles.hangoutCard}>
      <Text style={styles.hangoutName}>{item.name}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <View style={styles.membersContainer}>
        {item.members.map((member, index) => (
          <View key={index} style={styles.memberTag}>
            <Text style={styles.memberName}>{member}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Current Hangouts</Text>
      <FlatList
        data={MOCK_HANGOUTS}
        renderItem={renderHangoutItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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