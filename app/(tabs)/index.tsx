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


import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

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
      latitude: 37.7749,
      longitude: -122.4194,
    }
  },
  { 
    id: '2', 
    name: 'Emma Wilson', 
    distance: '0.8 mi',
    lastPing: '30s ago',
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
    }
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    distance: '1.2 mi',
    lastPing: '5m ago',
    location: {
      latitude: 37.7855,
      longitude: -122.4067,
    }
  },
  { 
    id: '4', 
    name: 'Sarah Davis', 
    distance: '1.5 mi',
    lastPing: '1m ago',
    location: {
      latitude: 37.7875,
      longitude: -122.4000,
    }
  },
  { 
    id: '5', 
    name: 'David Lee', 
    distance: '2.0 mi',
    lastPing: '45s ago',
    location: {
      latitude: 37.7895,
      longitude: -122.3900,
    }
  },
];

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;
const MAX_TRANSLATE_Y = -BOTTOM_SHEET_HEIGHT + 50;

export default function MapScreen() {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

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
      >
        <View style={styles.markerContainer}>
          <View style={styles.markerAvatar}>
            <Text style={styles.markerText}>{initials}</Text>
          </View>
        </View>
      </Marker>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.logoContainer, { paddingTop: insets.top }]}>
        <View style={styles.logoBackground}>
          <Text style={styles.logoText}>salmon</Text>
        </View>
      </View>
      <MapView
        style={[styles.map, { marginTop: -insets.top }]}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : undefined}
      >
        {MOCK_FRIENDS.map(renderFriendMarker)}
      </MapView>
      <TouchableOpacity 
        style={[styles.broadcastButton, isBroadcasting && styles.broadcastingButton]} 
        onPress={toggleBroadcast}
      >
        <Text style={styles.broadcastButtonText}>
          {isBroadcasting ? "Stop Broadcasting" : "Find Me"}
        </Text>
      </TouchableOpacity>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={styles.bottomSheetHeader}>
            <View style={styles.bottomSheetHandle} />
          </View>
          <FlatList
            data={MOCK_FRIENDS}
            renderItem={renderFriendItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.friendsList}
          />
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'flex-start',
    zIndex: 1,
    paddingLeft: 20,
  },
  logoBackground: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoText: {
    fontFamily: 'SourceCodePro-Medium',
    fontSize: 32,
    color: '#F59E93',
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  map: {
    width: "100%",
    height: "100%",
  },
  broadcastButton: {
    position: "absolute",
    bottom: "25%",
    alignSelf: "center",
    backgroundColor: "#F59E93",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    minWidth: 200,
  },
  broadcastingButton: {
    backgroundColor: "#FFB380",
  },
  broadcastButtonText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  bottomSheetContainer: {
    height: BOTTOM_SHEET_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: -BOTTOM_SHEET_HEIGHT + 100,
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
    height: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
  },
  friendsList: {
    padding: 16,
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
});