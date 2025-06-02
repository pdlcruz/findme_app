// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });

import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import mapStyle from "../../assets/mapStyle.json"; // adjust the path as needed

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    severity: "default",
  }),
});

// Mock friend data with locations and last ping times
const MOCK_FRIENDS = [
  {
    id: "1",
    name: "John Smith",
    distance: "0.3 mi",
    locationName: "San Francisco, CA",
    lastPing: "2m ago",
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
  {
    id: "2",
    name: "Emma Wilson",
    locationName: "San Francisco, CA",
    distance: "0.8 mi",
    lastPing: "30s ago",
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
    },
  },
  {
    id: "3",
    name: "Michael Brown",
    locationName: "San Francisco, CA",
    distance: "1.2 mi",
    lastPing: "5m ago",
    location: {
      latitude: 37.7855,
      longitude: -122.4067,
    },
  },
  {
    id: "4",
    name: "Sarah Davis",
    locationName: "San Francisco, CA",
    distance: "1.5 mi",
    lastPing: "1m ago",
    location: {
      latitude: 37.7875,
      longitude: -122.4,
    },
  },
  {
    id: "5",
    name: "David Lee",
    locationName: "San Francisco, CA",
    distance: "2.0 mi",
    lastPing: "45s ago",
    location: {
      latitude: 37.7895,
      longitude: -122.39,
    },
  },
  {
    id: "6",
    name: "Olivia Martinez",
    locationName: "San Francisco, CA",
    distance: "2.3 mi",
    lastPing: "10m ago",
    location: {
      latitude: 37.7905,
      longitude: -122.395,
    },
  },
  {
    id: "7",
    name: "Liam Chen",
    locationName: "San Francisco, CA",
    distance: "0.5 mi",
    lastPing: "3m ago",
    location: {
      latitude: 37.781,
      longitude: -122.41,
    },
  },
  {
    id: "8",
    name: "Sophia Patel",
    locationName: "San Francisco, CA",
    distance: "1.8 mi",
    lastPing: "8m ago",
    location: {
      latitude: 37.792,
      longitude: -122.4,
    },
  },
  {
    id: "9",
    name: "Noah Kim",
    locationName: "San Francisco, CA",
    distance: "0.9 mi",
    lastPing: "1m ago",
    location: {
      latitude: 37.784,
      longitude: -122.42,
    },
  },
  {
    id: "10",
    name: "Ava Johnson",
    locationName: "San Francisco, CA",
    distance: "3.1 mi",
    lastPing: "15m ago",
    location: {
      latitude: 37.793,
      longitude: -122.405,
    },
  },
];

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT;
const PEEK_HEIGHT = BOTTOM_SHEET_HEIGHT / 2.5;
const MIN_HEIGHT = PEEK_HEIGHT;
const MAX_HEIGHT = SCREEN_HEIGHT * 0.85;

export default function MapScreen() {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  // Adjust top inset for Android, but not for iOS
  const topInset = Platform.select({
    android: 0, // Remove top safe area for Android
    ios: 0, // Remove top safe area for iOS (map goes to top)
    default: insets.top, // fallback
  });

  const sheetHeight = useSharedValue(MIN_HEIGHT);
  const context = useSharedValue({ h: MIN_HEIGHT });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { h: sheetHeight.value };
    })
    .onUpdate((event) => {
      let newHeight = context.value.h - event.translationY;
      newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
      sheetHeight.value = newHeight;
    })
    .onEnd(() => {
      if (sheetHeight.value < (MIN_HEIGHT + MAX_HEIGHT) / 2) {
        sheetHeight.value = withSpring(MIN_HEIGHT, { damping: 50 });
      } else {
        sheetHeight.value = withSpring(MAX_HEIGHT, { damping: 50 });
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => ({
    height: sheetHeight.value,
    borderRadius: 25,
  }));

  const [title, setTitle] = useState("Friends");

  useDerivedValue(() => {
    if (sheetHeight.value >= MAX_HEIGHT - 10) {
      runOnJS(setTitle)("All Friends");
    } else {
      runOnJS(setTitle)("Nearby Friends");
    }
  }, [sheetHeight]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
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
      if (status !== "granted") {
        console.log("Notification permissions not granted");
      }
    })();
  }, []);

  const toggleBroadcast = async () => {
    const newState = !isBroadcasting;
    setIsBroadcasting(newState);

    // Schedule notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: newState ? "Broadcasting Started" : "Broadcasting Stopped",
        body: newState
          ? "Your location is now being shared with friends"
          : "Your location is no longer being shared",
        data: { type: newState ? "broadcast_start" : "broadcast_stop" },
      },
      trigger: null, // Show immediately
    });
  };

  const renderFriendItem = ({
    item,
    index,
  }: {
    item: (typeof MOCK_FRIENDS)[0];
    index: number;
  }) => {
    const initials = item.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const avatarStyle =
      index < 2 ? styles.avatarListDoNotDisturb : styles.avatarListAvailable;

    return (
      <View style={styles.friendItem}>
        <View style={avatarStyle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={styles.friendMeta}>
            {item.locationName} | {item.lastPing}
          </Text>
        </View>
        <Text style={styles.friendDistance}>{item.distance}</Text>
      </View>
    );
  };

  const renderFriendMarker = (
    friend: (typeof MOCK_FRIENDS)[0],
    index: number
  ) => {
    const initials = friend.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    // First 2: DoNotDisturb, next 3: Available
    const avatarStyle =
      index < 2
        ? styles.markerAvatarDoNotDisturb
        : styles.markerAvatarAvailable;

    return (
      <Marker
        key={friend.id}
        coordinate={friend.location}
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <View style={styles.markerContainer}>
          <View style={avatarStyle}>
            <Text style={styles.markerText}>{initials}</Text>
          </View>
        </View>
      </Marker>
    );
  };

  return Platform.OS === "ios" ? (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
        customMapStyle={mapStyle}
      >
        {MOCK_FRIENDS.map((friend, idx) => renderFriendMarker(friend, idx))}
      </MapView>
      <View
        style={[
          styles.logoContainer,
          {
            paddingTop: Platform.select({
              android: insets.top + 16,
              default: insets.top,
            }),
          },
        ]}
      ></View>
      <TouchableOpacity
        style={[
          styles.addHangoutButton,
          { top: insets.top + 16 }, // Respect safe area
        ]}
        onPress={() => {
          router.push("/create");
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.addHangoutButtonText}>add hangout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.broadcastButton}
        onPress={toggleBroadcast}
      >
        <Text>{isBroadcasting ? "Stop Broadcasting" : "Find Me"}</Text>
      </TouchableOpacity>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={styles.bottomSheetHeader}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetTitleContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>{title}</Text>
              <TouchableOpacity>
                <Text style={styles.addFriendsButton}>Add friends</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          <FlatList
            data={MOCK_FRIENDS}
            renderItem={({ item, index }) => renderFriendItem({ item, index })}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.friendsList,
              { paddingBottom: insets.bottom + 24 },
            ]}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  ) : (
    <SafeAreaView style={[styles.container, { paddingTop: topInset }]}>
      <MapView
        style={[styles.map, { marginTop: -topInset }]}
        provider={PROVIDER_GOOGLE} // Use Google Maps on Android
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
        customMapStyle={mapStyle}
      >
        {MOCK_FRIENDS.map((friend, idx) => renderFriendMarker(friend, idx))}
      </MapView>
      <View
        style={[
          styles.logoContainer,
          {
            paddingTop: Platform.select({
              android: insets.top + 16,
              default: insets.top,
            }),
          },
        ]}
      >
        <View style={styles.logoBackground}>
          <Text style={styles.logoText}>salmon</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.broadcastButton}
        onPress={toggleBroadcast}
      >
        <Text>{isBroadcasting ? "Stop Broadcasting" : "Find Me"}</Text>
      </TouchableOpacity>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={styles.bottomSheetHeader}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetTitleContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>{title}</Text>
              <TouchableOpacity>
                <Text style={styles.addFriendsButton}>Add friends</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          <FlatList
            data={MOCK_FRIENDS}
            renderItem={({ item, index }) => renderFriendItem({ item, index })}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.friendsList,
              { paddingBottom: insets.bottom + 20 },
            ]}
          />
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F59E93",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  bottomSheetContainer: {
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    bottom: 40,
    borderRadius: 25,
    elevation: 10,
  },
  bottomSheetHeader: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 1,
  },
  bottomSheetHandle: {
    width: 50,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  bottomSheetTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  addFriendsButton: {
    // fix because it's not a button
    fontSize: 16,
    color: "#F59E93",
    fontWeight: "500",
  },
  friendsList: {
    padding: 16,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
  },
  friendInfo: {
    flex: 1,
    justifyContent: "center",
  },
  friendName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },
  friendMeta: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  friendDistance: {
    fontSize: 15,
    color: "#555",
    minWidth: 48,
    textAlign: "right",
    fontWeight: "400",
  },
  avatarContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E2E2E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  markerAvatarDoNotDisturb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#BEBEBE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: "#C30606",
  },
  markerAvatarAvailable: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#BEBEBE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: "#9BBD93",
    shadowColor: "#333",
  },
  markerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  friendChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F59E93",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  avatarListDoNotDisturb: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#BEBEBE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 3,
    borderColor: "#C30606",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarListAvailable: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#BEBEBE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 3,
    borderColor: "#9BBD93",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#D3D3D3",
    width: "100%",
    marginTop: 12,
    marginBottom: 0,
  },
  avatarContainerDoNotDisturb: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E2E2E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: "#C30606",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarContainerAvailable: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: "#E2E2E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: "#1DB954", // Spotify green, or use your preferred green
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  addHangoutButton: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -80 }], // half of button width for perfect centering
    zIndex: 20,
    width: 160,
    height: 40,
    backgroundColor: "#F59E93",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addHangoutButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 1,
    textTransform: "capitalize",
  },
});
