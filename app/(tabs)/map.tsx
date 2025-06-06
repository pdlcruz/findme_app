import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView as RNSafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { auth, db } from '../../lib/firebaseConfig';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    severity: 'default'
  }),
});

// Mock friend data with locations and last ping times
const MOCK_FRIENDS = [
  { 
    id: '1', 
    name: 'John Smith', 
    distance: '0.3 mi',
    lastPing: '2m ago',
    location: {
      latitude: 37.424107,
      longitude: -122.166077,
    }
  },
  { 
    id: '2', 
    name: 'Emma Wilson', 
    distance: '0.8 mi',
    lastPing: '30s ago',
    location: {
      latitude: 37.425892,
      longitude: -122.164123,
    }
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    distance: '1.2 mi',
    lastPing: '5m ago',
    location: {
      latitude: 37.422345,
      longitude: -122.167891,
    }
  },
  { 
    id: '4', 
    name: 'Sarah Davis', 
    distance: '1.5 mi',
    lastPing: '1m ago',
    location: {
      latitude: 37.426789,
      longitude: -122.162345,
    }
  },
  { 
    id: '5', 
    name: 'David Lee', 
    distance: '2.0 mi',
    lastPing: '45s ago',
    location: {
      latitude: 37.421234,
      longitude: -122.169012,
    }
  },
  { 
    id: '6', 
    name: 'Lisa Anderson', 
    distance: '0.5 mi',
    lastPing: '3m ago',
    location: {
      latitude: 37.424567,
      longitude: -122.165432,
    }
  },
  { 
    id: '7', 
    name: 'James Wilson', 
    distance: '0.9 mi',
    lastPing: '1m ago',
    location: {
      latitude: 37.425678,
      longitude: -122.163456,
    }
  },
  { 
    id: '8', 
    name: 'Sophia Chen', 
    distance: '1.1 mi',
    lastPing: '2m ago',
    location: {
      latitude: 37.423456,
      longitude: -122.168901,
    }
  },
  { 
    id: '9', 
    name: 'Daniel Kim', 
    distance: '1.3 mi',
    lastPing: '4m ago',
    location: {
      latitude: 37.426123,
      longitude: -122.161234,
    }
  },
  { 
    id: '10', 
    name: 'Olivia Martinez', 
    distance: '1.7 mi',
    lastPing: '30s ago',
    location: {
      latitude: 37.421789,
      longitude: -122.168345,
    }
  },
  { 
    id: '11', 
    name: 'Ethan Taylor', 
    distance: '0.4 mi',
    lastPing: '2m ago',
    location: {
      latitude: 37.424789,
      longitude: -122.166789,
    }
  },
  { 
    id: '12', 
    name: 'Ava Johnson', 
    distance: '0.7 mi',
    lastPing: '1m ago',
    location: {
      latitude: 37.425234,
      longitude: -122.164567,
    }
  },
  { 
    id: '13', 
    name: 'Noah Garcia', 
    distance: '1.0 mi',
    lastPing: '3m ago',
    location: {
      latitude: 37.423789,
      longitude: -122.167234,
    }
  },
  { 
    id: '14', 
    name: 'Isabella Rodriguez', 
    distance: '1.4 mi',
    lastPing: '45s ago',
    location: {
      latitude: 37.426456,
      longitude: -122.162789,
    }
  },
  { 
    id: '15', 
    name: 'Liam Thompson', 
    distance: '1.8 mi',
    lastPing: '2m ago',
    location: {
      latitude: 37.421567,
      longitude: -122.169456,
    }
  },
  { 
    id: '16', 
    name: 'Mia White', 
    distance: '0.6 mi',
    lastPing: '1m ago',
    location: {
      latitude: 37.424345,
      longitude: -122.165678,
    }
  },
  { 
    id: '17', 
    name: 'Lucas Harris', 
    distance: '0.9 mi',
    lastPing: '3m ago',
    location: {
      latitude: 37.425789,
      longitude: -122.163789,
    }
  },
  { 
    id: '18', 
    name: 'Charlotte Clark', 
    distance: '1.2 mi',
    lastPing: '2m ago',
    location: {
      latitude: 37.423234,
      longitude: -122.168567,
    }
  },
  { 
    id: '19', 
    name: 'Mason Lewis', 
    distance: '1.6 mi',
    lastPing: '30s ago',
    location: {
      latitude: 37.426789,
      longitude: -122.161567,
    }
  },
  { 
    id: '20', 
    name: 'Amelia Walker', 
    distance: '1.9 mi',
    lastPing: '1m ago',
    location: {
      latitude: 37.421345,
      longitude: -122.169789,
    }
  },
];

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Platform.select({
  ios: 88,
  default: 60,
});
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.75 - TAB_BAR_HEIGHT; // Full screen height minus tab bar
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.5; // Limit to 1/2 of screen height when dragged up
const ANDROID_TOP_PADDING = 60; // Base padding for Android
const MAP_CONTAINER_HEIGHT = Platform.select({
  android: (SCREEN_HEIGHT - ANDROID_TOP_PADDING) * 0.75,
  default: SCREEN_HEIGHT * 0.75,
}); // 3/4 of screen height, accounting for Android padding

export default function MapScreen() {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'hybrid' | 'hybridFlyover' | 'mutedStandard'>('standard');
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const user = auth.currentUser;

  const androidTopPadding = Platform.select({
    android: insets.top,
    default: 0,
  });

  const BOTTOM_SHEET_TOP = Platform.select({
    android: MAP_CONTAINER_HEIGHT + androidTopPadding,
    default: MAP_CONTAINER_HEIGHT,
  });

  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      translateY.value = Math.min(translateY.value, 0);
    })
    .onEnd(() => {
      if (translateY.value > -BOTTOM_SHEET_HEIGHT / 3) {
        translateY.value = withSpring(0, { damping: 50 });
      } else {
        translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP
    );

    return {
      borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // Request notification permissions
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    })();
  }, []);

  const toggleBroadcast = async () => {
    const newState = !isBroadcasting;
    setIsBroadcasting(newState);

    // Schedule notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: newState ? 'Broadcasting Started' : 'Broadcasting Stopped',
        body: newState ? 'Your location is now being shared with friends' : 'Your location is no longer being shared',
        data: { type: newState ? 'broadcast_start' : 'broadcast_stop' },
      },
      trigger: null, // Show immediately
    });
  };

  const openDirections = (friend: typeof MOCK_FRIENDS[0]) => {
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    });
    const url = Platform.select({
      ios: `${scheme}?ll=${friend.location.latitude},${friend.location.longitude}&q=${encodeURIComponent(friend.name)}`,
      android: `${scheme}0,0?q=${friend.location.latitude},${friend.location.longitude}(${friend.name})`,
    });

    Linking.canOpenURL(url!).then((supported) => {
      if (supported) {
        Linking.openURL(url!);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const renderFriendItem = ({ item }: { item: typeof MOCK_FRIENDS[0] }) => {
    const initials = item.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    return (
      <View style={styles.friendItem}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.name}</Text>
          <View style={styles.friendDetails}>
            <Text style={styles.friendDistance}>{item.distance}</Text>
            <Text style={styles.friendPing}>• {item.lastPing}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.directionsButton}
          onPress={() => openDirections(item)}
        >
          <Ionicons name="navigate" size={24} color="#F59E93" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderFriendMarker = (friend: typeof MOCK_FRIENDS[0]) => {
    const initials = friend.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    return (
      <Marker
        key={friend.id}
        coordinate={friend.location}
        anchor={{ x: 0.5, y: 0.5 }}
        onPress={() => {
          if (Platform.OS === 'ios') {
            mapRef.current?.animateToRegion({
              latitude: friend.location.latitude,
              longitude: friend.location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 1000);
          } else {
            mapRef.current?.animateCamera({
              center: {
                latitude: friend.location.latitude,
                longitude: friend.location.longitude,
              },
              zoom: 15,
              heading: 0,
              pitch: 0,
            }, { duration: 1000 });
          }
        }}
      >
        <View style={styles.markerContainer}>
          <View style={styles.markerAvatar}>
            <Text style={styles.markerText}>{initials}</Text>
          </View>
        </View>
      </Marker>
    );
  };

  const centerOnUserLocation = () => {
    if (location && mapRef.current) {
      if (Platform.OS === 'ios') {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      } else {
        mapRef.current.animateCamera({
          center: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          zoom: 15,
          heading: 0,
          pitch: 0,
        }, { duration: 1000 });
      }
    }
  };

  const renderMapTypeButton = (type: typeof mapType, icon: string) => (
    <TouchableOpacity 
      style={[styles.mapTypeButton, mapType === type && styles.mapTypeButtonActive]}
      onPress={() => setMapType(type)}
    >
      <Ionicons name={icon as any} size={20} color={mapType === type ? "#F59E93" : "#333"} />
    </TouchableOpacity>
  );

  const openAddFriendModal = async () => {
    setLoadingUsers(true);
    setAddFriendModalVisible(true);
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const users = snapshot.docs
        .map(doc => doc.data())
        .filter(u => u.uid !== user?.uid);
      setAllUsers(users);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddFriend = async (friendUid: string) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const friendRef = doc(db, 'users', friendUid);
    const userSnap = await getDoc(userRef);
    const friendSnap = await getDoc(friendRef);
    const currentFriends = userSnap.exists() && Array.isArray(userSnap.data().friends) ? userSnap.data().friends : [];
    const friendFriends = friendSnap.exists() && Array.isArray(friendSnap.data().friends) ? friendSnap.data().friends : [];
    await updateDoc(userRef, {
      friends: [...new Set([...currentFriends, friendUid])],
    });
    await updateDoc(friendRef, {
      friends: [...new Set([...friendFriends, user.uid])],
    });
    setAddFriendModalVisible(false);
  };

  return Platform.OS === 'ios' ? (
    <View style={styles.container}>
      <View style={[styles.mapContainer, { marginTop: 0 }]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={undefined}
          showsUserLocation={true}
          showsPointsOfInterest={true}
          showsScale={true}
          showsBuildings={true}
          showsIndoors={true}
          loadingEnabled={true}
          loadingIndicatorColor="#F59E93"
          loadingBackgroundColor="#F59E93"
          tintColor="#F59E93"
          mapType={Platform.OS === 'ios' ? (mapType === 'hybrid' ? 'hybridFlyover' : mapType) : (mapType === 'mutedStandard' ? 'standard' : mapType === 'hybridFlyover' ? 'hybrid' : mapType)}
          initialRegion={location ? {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          } : undefined}
        >
          {MOCK_FRIENDS.map(renderFriendMarker)}
        </MapView>
        <View style={styles.mapTypeContainer}>
          {renderMapTypeButton('standard', 'map')}
          {renderMapTypeButton('hybrid', 'globe-outline')}
          {renderMapTypeButton('mutedStandard', 'map-outline')}
        </View>
        <TouchableOpacity 
          style={[styles.locationButton, { bottom: 20 }]}
          onPress={centerOnUserLocation}
        >
          <Ionicons name="compass" size={24} color="#F59E93" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.broadcastButton, isBroadcasting && styles.broadcastingButton]} 
          onPress={toggleBroadcast}
        >
          <Text style={[styles.broadcastButtonText, isBroadcasting && styles.broadcastingButtonText]}>
            {isBroadcasting ? "Stop Sharing" : "Find Me"}
          </Text>
        </TouchableOpacity>
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle, { top: BOTTOM_SHEET_TOP }]}>
          <View style={styles.bottomSheetHeader}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetTitleContainer}>
              <Text style={styles.bottomSheetTitle}>Nearby Friends</Text>
              <TouchableOpacity onPress={openAddFriendModal}>
                <Text style={styles.addFriendsButton}>Add friends</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={MOCK_FRIENDS}
            renderItem={renderFriendItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.friendsList}
          />
        </Animated.View>
      </GestureDetector>

      {addFriendModalVisible && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, backgroundColor: 'white' }}>
          <RNSafeAreaView style={{ flex: 1, padding: 24 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Add a Friend</Text>
            {loadingUsers ? <ActivityIndicator /> : (
              <ScrollView>
                {allUsers.map((item) => (
                  <View
                    key={item.uid || item.email}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderColor: '#eee',
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#F59E93',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                        {(item.displayName || item.email || '')
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .toUpperCase()}
                      </Text>
                    </View>
                    <Text style={{ flex: 1, fontSize: 16, color: '#333' }}>
                      {item.displayName || item.email}
                    </Text>
                    <TouchableOpacity onPress={() => handleAddFriend(item.uid)} style={{ padding: 8 }}>
                      <Ionicons name="add-circle" size={24} color="#F59E93" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity onPress={() => setAddFriendModalVisible(false)} style={{ marginTop: 20, paddingBottom: TAB_BAR_HEIGHT }}>
              <Text style={{ color: '#F59E93', fontWeight: 'bold', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </RNSafeAreaView>
        </View>
      )}
    </View>
  ) : (
    <View style={[styles.container, { paddingTop: androidTopPadding }]}>
      <View style={[styles.mapContainer, { marginTop: 0 }]}>
        <MapView
          ref={mapRef}
          style={[styles.map]}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsPointsOfInterest={true}
          showsScale={true}
          showsBuildings={true}
          showsIndoors={true}
          loadingEnabled={true}
          loadingIndicatorColor="#F59E93"
          loadingBackgroundColor="#F59E93"
          mapType={Platform.OS === 'ios' ? (mapType === 'hybrid' ? 'hybridFlyover' : mapType) : (mapType === 'mutedStandard' ? 'standard' : mapType === 'hybridFlyover' ? 'hybrid' : mapType)}
          initialCamera={location ? {
            center: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            zoom: 15,
            heading: 0,
            pitch: 0,
          } : undefined}
        >
          {MOCK_FRIENDS.map(renderFriendMarker)}
        </MapView>
        <View style={styles.mapTypeContainer}>
          {renderMapTypeButton('standard', 'map')}
          {renderMapTypeButton('hybrid', 'globe-outline')}
        </View>
        <TouchableOpacity 
          style={[styles.broadcastButton, isBroadcasting && styles.broadcastingButton]} 
          onPress={toggleBroadcast}
        >
          <Text style={[styles.broadcastButtonText, isBroadcasting && styles.broadcastingButtonText]}>
            {isBroadcasting ? "Stop Sharing" : "Find Me"}
          </Text>
        </TouchableOpacity>
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle, { top: BOTTOM_SHEET_TOP }]}>
          <View style={styles.bottomSheetHeader}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetTitleContainer}>
              <Text style={styles.bottomSheetTitle}>Friends</Text>
              <TouchableOpacity onPress={openAddFriendModal}>
                <Text style={styles.addFriendsButton}>Add friends</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={MOCK_FRIENDS}
            renderItem={renderFriendItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.friendsList}
          />
        </Animated.View>
      </GestureDetector>

      {addFriendModalVisible && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, backgroundColor: 'white' }}>
          <RNSafeAreaView style={{ flex: 1, padding: 24 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Add a Friend</Text>
            {loadingUsers ? <ActivityIndicator /> : (
              <ScrollView>
                {allUsers.map((item) => (
                  <View
                    key={item.uid || item.email}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderColor: '#eee',
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#F59E93',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                        {(item.displayName || item.email || '')
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .toUpperCase()}
                      </Text>
                    </View>
                    <Text style={{ flex: 1, fontSize: 16, color: '#333' }}>
                      {item.displayName || item.email}
                    </Text>
                    <TouchableOpacity onPress={() => handleAddFriend(item.uid)} style={{ padding: 8 }}>
                      <Ionicons name="add-circle" size={24} color="#F59E93" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity onPress={() => setAddFriendModalVisible(false)} style={{ marginTop: 20, paddingBottom: TAB_BAR_HEIGHT }}>
              <Text style={{ color: '#F59E93', fontWeight: 'bold', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </RNSafeAreaView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F59E93",
  },
  mapContainer: {
    height: MAP_CONTAINER_HEIGHT,
    overflow: 'hidden',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  broadcastButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#F59E93", // Salmon background for Find Me
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    minWidth: 150,
  },
  broadcastingButton: {
    backgroundColor: "#F5F5F5", // Grey background for Stop Sharing
    borderWidth: 2,
    borderColor: "#F59E93", // Salmon border
  },
  broadcastButtonText: {
    color: "#FFFFFF", // White text for Find Me
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  broadcastingButtonText: {
    color: "#F59E93", // Salmon text for Stop Sharing
  },
  bottomSheetContainer: {
    height: BOTTOM_SHEET_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetHeader: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  bottomSheetTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  bottomSheetTitle: {
    fontSize: 24,
    color: '#333',
  },
  addFriendsButton: {
    fontSize: 16,
    color: '#F59E93',
    fontWeight: '500',
  },
  friendsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF7E70',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  friendDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  friendDistance: {
    fontSize: 14,
    color: '#666',
  },
  friendPing: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F59E93',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
  directionsButton: {
    padding: 8,
    marginLeft: 8,
  },
  locationButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapTypeContainer: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 4,
    width: 44,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapTypeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  mapTypeButtonActive: {
    backgroundColor: '#F5F5F5',
  },
});