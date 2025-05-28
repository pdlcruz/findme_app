import { IconSymbol } from '@/components/ui/IconSymbol';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateHangoutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Create Hangout</Text>
        
        <View style={styles.formContainer}>
          {/* Hangout Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hangout Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Coffee Break, Study Session"
              placeholderTextColor="#999"
            />
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.locationInput}>
              <TextInput
                style={[styles.input, styles.locationTextInput]}
                placeholder="Enter location"
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.locationButton}>
                <IconSymbol name="location.fill" size={24} color="#F59E93" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Friends Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Invite Friends</Text>
            <View style={styles.friendsContainer}>
              {/* Mock friend chips */}
              {['John Smith', 'Emma Wilson', 'Michael Brown'].map((friend, index) => (
                <TouchableOpacity key={index} style={styles.friendChip}>
                  <Text style={styles.friendChipText}>{friend}</Text>
                  <IconSymbol name="xmark.circle.fill" size={16} color="#666" />
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addFriendButton}>
                <IconSymbol name="plus.circle.fill" size={24} color="#F59E93" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Duration */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.durationContainer}>
              <TouchableOpacity style={styles.durationButton}>
                <Text style={styles.durationButtonText}>1 hour</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.durationButton}>
                <Text style={styles.durationButtonText}>2 hours</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.durationButton}>
                <Text style={styles.durationButtonText}>3 hours</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.durationButton}>
                <Text style={styles.durationButtonText}>Custom</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Create Hangout</Text>
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
  friendsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  friendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E93',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  friendChipText: {
    fontSize: 14,
    color: '#333',
  },
  addFriendButton: {
    padding: 8,
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