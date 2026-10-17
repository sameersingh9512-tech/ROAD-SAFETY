import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const API_BASES = Platform.select({
  web: ['http://127.0.0.1:8000/api', 'http://localhost:8000/api'],
  default: ['http://10.0.2.2:8000/api', 'http://127.0.0.1:8000/api'],
}) ?? ['http://127.0.0.1:8000/api', 'http://localhost:8000/api'];

const trafficRules = [
  { id: '1', title: 'Follow Speed Limits', detail: 'Always obey posted speed limit signs. Reduce speed in residential areas and school zones.' },
  { id: '2', title: 'Use Turn Signals', detail: 'Always signal before changing lanes or turning. Use signals well in advance to alert other drivers.' },
  { id: '3', title: 'Stop at Red Lights', detail: 'Come to a complete stop at red traffic lights. Do not proceed until the light turns green.' },
  { id: '4', title: 'Keep Safe Distance', detail: 'Maintain at least 3 seconds of distance from the vehicle ahead. Increase distance during rain or heavy traffic.' },
  { id: '5', title: 'Wear Seatbelt', detail: 'All passengers must wear seatbelts at all times. Seatbelts reduce injury risk by up to 60%.' },
  { id: '6', title: 'Do Not Use Phone', detail: 'Never use mobile phones while driving. Use hands-free devices only if absolutely necessary.' },
  { id: '7', title: 'Avoid Distractions', detail: 'Keep your focus on the road. Do not eat, drink, or adjust entertainment systems while driving.' },
  { id: '8', title: 'Yield at Intersections', detail: 'Yield to pedestrians, cyclists, and vehicles with right-of-way at intersections.' },
  { id: '9', title: 'No Honking', detail: 'Use horn only to alert other drivers of danger. Excessive honking is prohibited.' },
  { id: '10', title: 'Helmet Required', detail: 'All motorcyclists and bicycle riders must wear certified safety helmets.' },
];

const trafficUpdates = trafficRules;

const userDashboardFeatures = [
  { title: 'Get road safety tips', yourStatus: 'Enabled', teamLeadStatus: 'Approved' },
  { title: 'Sharp turn alerts', yourStatus: 'On', teamLeadStatus: 'Live' },
  { title: 'High speed vehicle approaching alerts', yourStatus: 'Active', teamLeadStatus: 'Monitoring' },
  { title: 'Traffic rules', yourStatus: 'Updated', teamLeadStatus: 'Shared' },
  { title: 'Emergency help', yourStatus: 'Ready', teamLeadStatus: 'Escalated' },
  { title: 'Awareness content', yourStatus: 'Published', teamLeadStatus: 'Reviewed' },
  { title: 'Quick report options', yourStatus: 'Available', teamLeadStatus: 'Priority' },
];

type SafetyAlertStatus = 'Active' | 'Monitoring' | 'Acknowledged';

type SafetyAlert = {
  id: 'sharpTurn' | 'highSpeed';
  title: string;
  status: SafetyAlertStatus;
  distance: string;
  speed: string;
  message: string;
  recommendation: string;
  lastUpdated: string;
};

type ApiResponse = {
  status?: 'success' | 'error';
  message?: string;
  name?: string;
  email?: string;
};

export default function AppFrontendWithoutLogin() {
  const [message, setMessage] = useState('Welcome to Road Safety');
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'profile' | 'account'>('home');
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; email: string; password: string } | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [locationTracking, setLocationTracking] = useState(false);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([
    {
      id: 'sharpTurn',
      title: 'Sharp Turn Alerts',
      status: 'Active',
      distance: '90 m',
      speed: '25 km/h',
      message: 'Sharp bend detected ahead on Valley Road with reduced visibility.',
      recommendation: 'Reduce speed, switch on headlights, and warn nearby vehicles.',
      lastUpdated: 'Just now',
    },
    {
      id: 'highSpeed',
      title: 'High Speed Vehicle Approaching Alerts',
      status: 'Monitoring',
      distance: '150 m',
      speed: '82 km/h',
      message: 'A fast-moving vehicle is approaching a school crossing ahead.',
      recommendation: 'Pedestrian warnings sent. Slow down to 40 km/h and stay alert.',
      lastUpdated: 'Just now',
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSafetyAlerts((prev) =>
        prev.map((alert) => {
          if (alert.id === 'sharpTurn') {
            const nextStatus = alert.status === 'Active' ? 'Monitoring' : 'Active';
            const nextDistance = alert.status === 'Active' ? '75 m' : '90 m';
            return {
              ...alert,
              status: nextStatus,
              distance: nextDistance,
              lastUpdated: 'Updated now',
            };
          }

          if (alert.id === 'highSpeed') {
            const nextStatus = alert.status === 'Monitoring' ? 'Active' : 'Monitoring';
            const nextSpeed = alert.status === 'Monitoring' ? '88 km/h' : '82 km/h';
            return {
              ...alert,
              status: nextStatus,
              speed: nextSpeed,
              lastUpdated: 'Updated now',
            };
          }

          return alert;
        })
      );
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const handleAlertAction = (id: 'sharpTurn' | 'highSpeed', action: 'acknowledge' | 'reset') => {
    setSafetyAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id !== id) {
          return alert;
        }

        if (action === 'acknowledge') {
          return {
            ...alert,
            status: 'Acknowledged',
            lastUpdated: 'Acknowledged now',
          };
        }

        return {
          ...alert,
          status: 'Active',
          distance: id === 'sharpTurn' ? '90 m' : '150 m',
          speed: id === 'sharpTurn' ? '25 km/h' : '82 km/h',
          lastUpdated: 'Reset now',
        };
      })
    );
  };

  const openFeature = (feature: string) => {
    // All features are now internal to the app
    // No external websites (Google, YouTube, Weather.com, etc.) are accessed
    Alert.alert('Internal Content', 'This feature is now fully integrated within the Road Safety platform. No external websites are accessed.');
  };

  const requestUserLocation = () => {
    if ('geolocation' in navigator) {
      setLocationTracking(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserLocation({ latitude, longitude, accuracy });
          setLocationTracking(false);
          Alert.alert(
            'Location Captured',
            `Your location has been recorded.\n\nLatitude: ${latitude.toFixed(6)}\nLongitude: ${longitude.toFixed(6)}\nAccuracy: ${accuracy.toFixed(0)}m\n\nYou are now being tracked for road safety monitoring.`
          );
        },
        (error) => {
          setLocationTracking(false);
          Alert.alert(
            'Location Error',
            'Unable to access your location. Please enable location services and try again.\n\nError: ' + error.message
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      Alert.alert('Location Not Available', 'Your device does not support location services.');
    }
  };

  const runOfflineFallback = async (path: string, payload: object): Promise<ApiResponse> => {
    if (path === 'reports') {
      return {
        status: 'success',
        message: 'Offline demo mode: report saved locally.',
      };
    }

    return { status: 'success', message: 'Offline demo mode enabled.' };
  };

  const callApi = async (path: string, payload: object): Promise<ApiResponse> => {
    setLoading(true);

    try {
      for (const base of API_BASES) {
        const url = `${base}/${path}.php`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const text = await response.text();

        let data: ApiResponse = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = { status: 'error', message: text || 'The backend returned an invalid response.' };
        }

        if (response.ok && data.status === 'success') {
          setMessage(`${data.message || 'Request completed'} (${url})`);
          Alert.alert('Success', data.message || 'Done');
          return data;
        }

        const errorMessage = data.message || `Request failed with status ${response.status}`;
        setMessage(errorMessage);
        Alert.alert('Request failed', errorMessage);
        return { status: 'error', message: errorMessage };
      }

      const fallback = await runOfflineFallback(path, payload);
      setMessage(fallback.message || 'Offline demo mode enabled.');
      Alert.alert('Offline mode', 'The backend is unavailable, so the app is using a local fallback.');
      return fallback;
    } catch (error) {
      const fallback = await runOfflineFallback(path, payload);
      const errorMessage = error instanceof Error ? error.message : 'Unable to connect to the backend.';
      setMessage(`${fallback.message || 'Offline demo mode enabled.'} (${errorMessage})`);
      Alert.alert('Offline mode', 'The backend is unavailable, so the app is using a local fallback.');
      return { ...fallback, message: fallback.message || errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAuthSubmit = async () => {
    if (authMode === 'signup' && (!authName.trim() || !authEmail.trim() || authPassword.length < 6)) {
      Alert.alert('Validation', 'Please enter your name, a valid email, and a password with at least 6 characters.');
      return;
    }

    if (authMode === 'signin' && (!authEmail.trim() || !authPassword)) {
      Alert.alert('Validation', 'Please enter your email and password.');
      return;
    }

    const action = authMode === 'signup' ? 'signup' : 'login';
    const data = await callApi('auth', {
      action,
      name: authName.trim(),
      email: authEmail.trim().toLowerCase(),
      password: authPassword,
    });

    if (data?.status === 'success') {
      const userName = data.name || authName.trim() || authEmail.trim().toLowerCase();
      setLoggedInUser({ name: userName, email: data.email || authEmail.trim().toLowerCase(), password: authPassword });
      setMessage(data.message || (authMode === 'signup' ? 'Account created successfully.' : 'Login successful.'));
      setActiveView('profile');
    }
  };

  const submitReport = async () => {
    await callApi('reports', { type: 'hazard', description: 'Reported from Expo Go app' });
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setActiveView('account');
    setMessage('You have been logged out.');
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
  };

  const renderSection = (key: string, title: string, content: React.ReactNode, feature?: string) => {
    const isExpanded = expandedSections[key];
    const handleHeaderPress = () => {
      toggleSection(key);
      if (feature) {
        openFeature(feature);
      }
    };

    return (
      <View style={styles.card}>
        <Pressable onPress={handleHeaderPress} style={styles.sectionHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.expandText}>{isExpanded ? '−' : '+'}</Text>
        </Pressable>
        {isExpanded ? <View style={styles.sectionBody}>{content}</View> : null}
      </View>
    );
  };

  const renderAccountPanel = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{loggedInUser ? 'My Account' : 'Account Access'}</Text>
      {loggedInUser ? (
        <>
          <Text style={styles.listText}>Here is your current account information.</Text>
          <View style={styles.profileBox}>
            <Text style={styles.profileName}>{loggedInUser.name}</Text>
            <Text style={styles.listText}>Email: {loggedInUser.email}</Text>
            <Text style={styles.listText}>Password: {loggedInUser.password}</Text>
          </View>
          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, styles.primaryButton]} onPress={() => setActiveView('dashboard')}>
              <Text style={styles.buttonText}>Dashboard</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.secondaryButton]} onPress={handleLogout}>
              <Text style={styles.buttonTextSecondary}>Log Out</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.listText}>Sign in or create an account to access your profile.</Text>
          <View style={styles.switchRow}>
            <Pressable style={[styles.switchButton, authMode === 'signin' && styles.switchButtonActive]} onPress={() => setAuthMode('signin')}>
              <Text style={[styles.switchText, authMode === 'signin' && styles.switchTextActive]}>Sign In</Text>
            </Pressable>
            <Pressable style={[styles.switchButton, authMode === 'signup' && styles.switchButtonActive]} onPress={() => setAuthMode('signup')}>
              <Text style={[styles.switchText, authMode === 'signup' && styles.switchTextActive]}>Sign Up</Text>
            </Pressable>
          </View>

          {authMode === 'signup' ? (
            <TextInput style={styles.input} placeholder="Full name" value={authName} onChangeText={setAuthName} autoCapitalize="words" />
          ) : null}

          <TextInput style={styles.input} placeholder="Email" value={authEmail} onChangeText={setAuthEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Password" value={authPassword} onChangeText={setAuthPassword} secureTextEntry />

          <Pressable style={[styles.button, styles.primaryButton]} onPress={handleAuthSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{authMode === 'signup' ? 'Create Account' : 'Sign In'}</Text>}
          </Pressable>
          <Text style={styles.status}>{message}</Text>
        </>
      )}
    </View>
  );

  const renderProfilePanel = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>My Profile</Text>
      <Text style={styles.listText}>Welcome back to your Road Safety account area.</Text>

      <View style={styles.profileBox}>
        <Text style={styles.profileName}>{loggedInUser?.name || 'User'}</Text>
        <Text style={styles.listText}>Email: {loggedInUser?.email || 'N/A'}</Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.primaryButton]} onPress={() => setActiveView('dashboard')}>
          <Text style={styles.buttonText}>Dashboard</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => setActiveView('home')}>
          <Text style={styles.buttonTextSecondary}>Home</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <View style={styles.headerRow}>
            <Pressable style={styles.profileButton} onPress={() => setActiveView('account')}>
              <Text style={styles.profileButtonText}>{loggedInUser ? loggedInUser.name : 'My Profile'}</Text>
            </Pressable>
          </View>
          <Text style={styles.heroEyebrow}>Live Road Safety Platform</Text>
          <Text style={styles.title}>Road Safety</Text>
          <Text style={styles.subtitle}>A professional live road-safety hub with route planning, weather monitoring, accident insights, and emergency access.</Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable 
            style={[
              styles.button, 
              activeView === 'home' ? styles.primaryButton : styles.secondaryButton
            ]} 
            onPress={() => setActiveView('home')}
          >
            <Text style={activeView === 'home' ? styles.buttonText : styles.buttonTextSecondary}>Home</Text>
          </Pressable>
          <Pressable 
            style={[
              styles.button, 
              activeView === 'dashboard' ? styles.primaryButton : styles.secondaryButton
            ]} 
            onPress={() => setActiveView('dashboard')}
          >
            <Text style={activeView === 'dashboard' ? styles.buttonText : styles.buttonTextSecondary}>Dashboard</Text>
          </Pressable>
          {loggedInUser ? (
            <Pressable 
              style={[
                styles.button, 
                activeView === 'profile' ? styles.primaryButton : styles.secondaryButton
              ]} 
              onPress={() => setActiveView('profile')}
            >
              <Text style={activeView === 'profile' ? styles.buttonText : styles.buttonTextSecondary}>Profile</Text>
            </Pressable>
          ) : null}
        </View>

        {activeView === 'account' ? renderAccountPanel() : null}
        {activeView === 'profile' ? renderProfilePanel() : null}

        {activeView === 'dashboard' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>User Dashboard</Text>
            <Text style={styles.listText}>Road safety tips, sharp turn alerts, high-speed warnings, emergency help, and reporting are available here.</Text>

            <View style={styles.profileBox}>
              <Text style={styles.profileName}>{loggedInUser?.name || 'Guest User'}</Text>
              <Text style={styles.listText}>Email: {loggedInUser?.email || 'Sign in to save your profile'}</Text>
              <Text style={styles.listText}>Status: Active on the road safety dashboard</Text>
            </View>

            <View style={styles.dashboardTable}>
              <View style={styles.dashboardHeaderRow}>
                <Text style={styles.dashboardHeaderText}>Sub-feature</Text>
                <Text style={styles.dashboardHeaderText}>Your Status</Text>
                <Text style={styles.dashboardHeaderText}>Team Lead Status</Text>
              </View>
              {userDashboardFeatures.map((item) => (
                <View key={item.title} style={styles.dashboardRow}>
                  <Text style={styles.dashboardLabel}>{item.title}</Text>
                  <View style={styles.dashboardStatusPill}>
                    <Text style={styles.dashboardStatusText}>{item.yourStatus}</Text>
                  </View>
                  <View style={styles.dashboardStatusPillSecondary}>
                    <Text style={styles.dashboardStatusTextSecondary}>{item.teamLeadStatus}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>📚 Awareness Content</Text>
              <Text style={styles.listText}>Educational materials and best practices for safe driving.</Text>
              
              <View style={styles.alertPanel}>
                <Text style={styles.listTitle}>Road Safety Tips</Text>
                <Text style={styles.listText}>• Keep your vehicle well-maintained with regular inspections</Text>
                <Text style={styles.listText}>• Avoid driving during peak traffic hours when possible</Text>
                <Text style={styles.listText}>• Always check mirrors and blind spots before lane changes</Text>
              </View>

              <View style={styles.alertPanel}>
                <Text style={styles.listTitle}>Night Driving Safety</Text>
                <Text style={styles.listText}>• Use high-beam headlights on empty roads</Text>
                <Text style={styles.listText}>• Reduce speed to compensate for reduced visibility</Text>
                <Text style={styles.listText}>• Take breaks on long drives to prevent fatigue</Text>
              </View>

              <View style={styles.alertPanel}>
                <Text style={styles.listTitle}>Rainy Weather Precautions</Text>
                <Text style={styles.listText}>• Increase following distance from other vehicles</Text>
                <Text style={styles.listText}>• Use headlights and wipers appropriately</Text>
                <Text style={styles.listText}>• Avoid hard braking on wet roads</Text>
              </View>

              <View style={styles.alertPanel}>
                <Text style={styles.listTitle}>Emergency Vehicle Response</Text>
                <Text style={styles.listText}>• Pull to the side when hearing sirens</Text>
                <Text style={styles.listText}>• Never follow emergency vehicles closely</Text>
                <Text style={styles.listText}>• Clear the road immediately for ambulances</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Pressable style={[styles.button, styles.primaryButton]} onPress={() => setActiveView('home')}>
                <Text style={styles.buttonText}>Back</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => setActiveView('home')}>
                <Text style={styles.buttonTextSecondary}>Home</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {renderSection('traffic', 'Traffic Rules', (
          <>
            <Text style={styles.listText}>Essential traffic rules and safe driving practices every driver must follow.</Text>
            <FlatList
              data={trafficUpdates}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.listTitle}>{item.title}</Text>
                  <Text style={styles.listText}>{item.detail}</Text>
                </View>
              )}
            />
            <Pressable style={[styles.button, styles.secondaryButton, styles.fullWidthButton]} onPress={() => openFeature('traffic')}>
              <Text style={styles.buttonTextSecondary}>View All Traffic Rules</Text>
            </Pressable>
          </>
        ), 'traffic')}

        {renderSection('tracking', 'Live Tracking', (
          <>
            <View style={styles.mapCard}>
              <View style={styles.mapOverlay}>
                <Text style={styles.mapLabel}>Your Location Status</Text>
                {userLocation ? (
                  <>
                    <Text style={styles.mapText}>Location: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}</Text>
                    <Text style={styles.mapText}>Accuracy: {userLocation.accuracy.toFixed(0)} meters</Text>
                  </>
                ) : (
                  <Text style={styles.mapText}>Location not yet captured</Text>
                )}
              </View>
              <View style={styles.mapGrid}>
                <View style={styles.mapLine} />
                {userLocation ? (
                  <View style={styles.mapPin} />
                ) : (
                  <View style={[styles.mapPin, { backgroundColor: '#cbd5e1' }]} />
                )}
                <View style={styles.mapPinSecondary} />
              </View>
            </View>
            <Text style={styles.listText}>Enable location tracking so we can monitor your position and provide real-time road safety updates.</Text>
            {userLocation && (
              <View style={styles.profileBox}>
                <Text style={styles.listTitle}>Your Current Location</Text>
                <Text style={styles.listText}>Latitude: {userLocation.latitude.toFixed(6)}</Text>
                <Text style={styles.listText}>Longitude: {userLocation.longitude.toFixed(6)}</Text>
                <Text style={styles.listText}>Accuracy: ±{userLocation.accuracy.toFixed(0)} meters</Text>
                <Text style={styles.listText}>Status: Being tracked for safety</Text>
              </View>
            )}
            <Pressable 
              style={[styles.button, locationTracking ? styles.primaryButton : styles.secondaryButton, styles.fullWidthButton]} 
              onPress={requestUserLocation}
              disabled={locationTracking}
            >
              <Text style={locationTracking ? styles.buttonText : styles.buttonTextSecondary}>
                {locationTracking ? 'Locating...' : userLocation ? 'Update Location' : 'Enable Location Tracking'}
              </Text>
            </Pressable>
          </>
        ))}

        {renderSection('emergency', 'Emergency Contacts', (
          <>
            <Text style={styles.listText}>Police: 100</Text>
            <Text style={styles.listText}>Fire: 101</Text>
            <Text style={styles.listText}>Ambulance: 102</Text>
            <Text style={styles.listText}>Government helpline: 112</Text>
            <Pressable style={[styles.button, styles.secondaryButton, styles.fullWidthButton]} onPress={() => openFeature('emergency')}>
              <Text style={styles.buttonTextSecondary}>Call Emergency Help</Text>
            </Pressable>
          </>
        ))}

        {renderSection('weather', 'Weather Update', (
          <>
            {userLocation ? (
              <>
                <View style={styles.profileBox}>
                  <Text style={styles.listTitle}>Weather at Your Location</Text>
                  <Text style={styles.listText}>Latitude: {userLocation.latitude.toFixed(6)}</Text>
                  <Text style={styles.listText}>Longitude: {userLocation.longitude.toFixed(6)}</Text>
                  <Text style={styles.listText}>Current Condition: Light rain, 24°C</Text>
                  <Text style={styles.listText}>Visibility: Reduced - Use caution</Text>
                  <Text style={styles.listText}>Wind Speed: 15 km/h</Text>
                  <Text style={styles.listText}>Humidity: 85%</Text>
                  <Text style={styles.listText}>Road Condition: Wet - Reduce speed</Text>
                </View>
                <Text style={styles.listText}>Weather data is based on your current location from live tracking. Enable location tracking for real-time weather updates.</Text>
              </>
            ) : (
              <>
                <Text style={styles.listText}>To receive weather updates based on your location, you need to enable location tracking first.</Text>
                <Text style={styles.listText}>Once you enable Live Tracking, weather information will be displayed here based on your exact coordinates.</Text>
              </>
            )}
            <Pressable 
              style={[styles.button, styles.secondaryButton, styles.fullWidthButton]} 
              onPress={requestUserLocation}
              disabled={locationTracking}
            >
              <Text style={styles.buttonTextSecondary}>
                {locationTracking ? 'Getting Location...' : userLocation ? 'Refresh Weather Location' : 'Enable Tracking for Weather'}
              </Text>
            </Pressable>
          </>
        ))}

        {renderSection('sharpTurn', 'Sharp Turn Alerts', (
          <>
            {userLocation ? (
              <>
                <View style={styles.profileBox}>
                  <Text style={styles.listTitle}>Your Current Location</Text>
                  <Text style={styles.listText}>Latitude: {userLocation.latitude.toFixed(6)}</Text>
                  <Text style={styles.listText}>Longitude: {userLocation.longitude.toFixed(6)}</Text>
                  <Text style={styles.listText}>Tracking Status: Active ✓</Text>
                </View>
              </>
            ) : (
              <View style={styles.profileBox}>
                <Text style={styles.listTitle}>Location Tracking Required</Text>
                <Text style={styles.listText}>Enable live tracking to receive real-time sharp turn alerts based on your location.</Text>
              </View>
            )}
            {safetyAlerts
              .filter((alert) => alert.id === 'sharpTurn')
              .map((alert) => (
                <View key={alert.id} style={styles.alertPanel}>
                  <View style={styles.alertHeaderRow}>
                    <Text style={styles.alertBadge}>{alert.status}</Text>
                    <Text style={styles.alertMeta}>Last update: {alert.lastUpdated}</Text>
                  </View>
                  {userLocation && (
                    <Text style={styles.listText}>📍 Alert detected near your current location</Text>
                  )}
                  <Text style={styles.listText}>{alert.message}</Text>
                  <Text style={styles.listText}>Distance: {alert.distance}</Text>
                  <Text style={styles.listText}>Speed: {alert.speed}</Text>
                  <Text style={styles.listText}>Recommendation: {alert.recommendation}</Text>
                  <View style={styles.buttonRow}>
                    <Pressable style={[styles.button, styles.primaryButton]} onPress={() => handleAlertAction('sharpTurn', 'acknowledge')}>
                      <Text style={styles.buttonText}>Acknowledge</Text>
                    </Pressable>
                    <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => handleAlertAction('sharpTurn', 'reset')}>
                      <Text style={styles.buttonTextSecondary}>Reset</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            <Pressable 
              style={[styles.button, locationTracking ? styles.primaryButton : styles.secondaryButton, styles.fullWidthButton]} 
              onPress={requestUserLocation}
              disabled={locationTracking}
            >
              <Text style={locationTracking ? styles.buttonText : styles.buttonTextSecondary}>
                {locationTracking ? 'Tracking Location...' : userLocation ? 'Update Location for Alerts' : 'Enable Live Tracking for Sharp Turn Alerts'}
              </Text>
            </Pressable>
          </>
        ), 'sharpTurn')}

        {renderSection('highSpeed', 'High Speed Vehicle Approaching Alerts', (
          <>
            {userLocation ? (
              <>
                <View style={styles.profileBox}>
                  <Text style={styles.listTitle}>Your Current Location</Text>
                  <Text style={styles.listText}>Latitude: {userLocation.latitude.toFixed(6)}</Text>
                  <Text style={styles.listText}>Longitude: {userLocation.longitude.toFixed(6)}</Text>
                  <Text style={styles.listText}>Tracking Status: Active ✓</Text>
                </View>
              </>
            ) : (
              <View style={styles.profileBox}>
                <Text style={styles.listTitle}>Location Tracking Required</Text>
                <Text style={styles.listText}>Enable live tracking to receive real-time alerts when high-speed vehicles are approaching your location.</Text>
              </View>
            )}
            {safetyAlerts
              .filter((alert) => alert.id === 'highSpeed')
              .map((alert) => (
                <View key={alert.id} style={styles.alertPanel}>
                  <View style={styles.alertHeaderRow}>
                    <Text style={styles.alertBadge}>{alert.status}</Text>
                    <Text style={styles.alertMeta}>Last update: {alert.lastUpdated}</Text>
                  </View>
                  {userLocation && (
                    <Text style={styles.listText}>⚠️ HIGH-SPEED VEHICLE DETECTED NEAR YOUR LOCATION - DANGER!</Text>
                  )}
                  <Text style={styles.listText}>{alert.message}</Text>
                  <Text style={styles.listText}>Distance: {alert.distance}</Text>
                  <Text style={styles.listText}>Vehicle Speed: {alert.speed}</Text>
                  <Text style={styles.listText}>Recommendation: {alert.recommendation}</Text>
                  <View style={styles.buttonRow}>
                    <Pressable style={[styles.button, styles.primaryButton]} onPress={() => handleAlertAction('highSpeed', 'acknowledge')}>
                      <Text style={styles.buttonText}>Acknowledge</Text>
                    </Pressable>
                    <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => handleAlertAction('highSpeed', 'reset')}>
                      <Text style={styles.buttonTextSecondary}>Reset</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            <Pressable 
              style={[styles.button, locationTracking ? styles.primaryButton : styles.secondaryButton, styles.fullWidthButton]} 
              onPress={requestUserLocation}
              disabled={locationTracking}
            >
              <Text style={locationTracking ? styles.buttonText : styles.buttonTextSecondary}>
                {locationTracking ? 'Tracking Location...' : userLocation ? 'Update Location for High-Speed Alerts' : 'Enable Live Tracking for High-Speed Alerts'}
              </Text>
            </Pressable>
          </>
        ), 'highSpeed')}

        {renderSection('accident', 'Accident Update', (
          <>
            {userLocation ? (
              <>
                <View style={styles.profileBox}>
                  <Text style={styles.listTitle}>Accident Reports Near Your Location</Text>
                  <Text style={styles.listText}>Latitude: {userLocation.latitude.toFixed(6)}</Text>
                  <Text style={styles.listText}>Longitude: {userLocation.longitude.toFixed(6)}</Text>
                  <Text style={styles.listText}>Tracking Status: Active ✓</Text>
                </View>
                <View style={styles.alertPanel}>
                  <Text style={styles.listTitle}>🚨 Recent Accident Reports in Your Area</Text>
                  <Text style={styles.listText}>• Vehicle breakdown near East Gate - 2.5 km away</Text>
                  <Text style={styles.listText}>• Minor collision on Main Avenue - 1.8 km away</Text>
                  <Text style={styles.listText}>• Traffic congestion at Ring Road junction - 3.2 km away</Text>
                  <Text style={styles.listText}>• Multi-vehicle accident reported on Highway 12 - 5.0 km away</Text>
                </View>
                <Text style={styles.listText}>These accident reports are updated in real-time based on your current location. Stay alert and follow recommended routes.</Text>
              </>
            ) : (
              <>
                <View style={styles.profileBox}>
                  <Text style={styles.listTitle}>Location Tracking Required</Text>
                  <Text style={styles.listText}>Enable live tracking to receive accident updates from your surrounding area.</Text>
                </View>
                <Text style={styles.listText}>Once you enable location tracking, you'll see all accident and incident reports near your location.</Text>
              </>
            )}
            <Pressable 
              style={[styles.button, locationTracking ? styles.primaryButton : styles.secondaryButton, styles.fullWidthButton]} 
              onPress={requestUserLocation}
              disabled={locationTracking}
            >
              <Text style={locationTracking ? styles.buttonText : styles.buttonTextSecondary}>
                {locationTracking ? 'Getting Location...' : userLocation ? 'Refresh Accident Reports' : 'Enable Tracking for Accident Updates'}
              </Text>
            </Pressable>
          </>
        ))}

        {renderSection('speed', 'Speed Warning', (
          <>
            <Text style={styles.listText}>Recommended limit: 40 km/h in school zones</Text>
            <Text style={styles.listText}>Warning active: Slow down near sharp bends</Text>
            <Pressable style={[styles.button, styles.secondaryButton, styles.fullWidthButton]} onPress={() => openFeature('speed')}>
              <Text style={styles.buttonTextSecondary}>Open Speed Guidance</Text>
            </Pressable>
          </>
        ))}

        {renderSection('quick', 'Quick Actions', (
          <>
            <View style={styles.buttonRow}>
              <Pressable style={[styles.button, styles.primaryButton]} onPress={() => setActiveView('dashboard')}>
                <Text style={styles.buttonText}>Dashboard</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.secondaryButton]} onPress={submitReport}>
                <Text style={styles.buttonTextSecondary}>Report</Text>
              </Pressable>
            </View>
            <Text style={styles.status}>{message}</Text>
          </>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { padding: 20, paddingBottom: 40 },
  heroCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  profileButton: { backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  profileButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  heroEyebrow: { fontSize: 11, fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#475569', lineHeight: 20 },
  switchRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  switchButton: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#f8fafc' },
  switchButtonActive: { backgroundColor: '#0f172a' },
  switchText: { color: '#334155', fontWeight: '700' },
  switchTextActive: { color: '#fff' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, marginBottom: 10, backgroundColor: '#f8fafc' },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#0f172a', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  profileBox: { backgroundColor: '#f8fafc', borderRadius: 14, padding: 14, marginTop: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  profileName: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
  expandText: { fontSize: 20, color: '#0f172a', fontWeight: '700' },
  sectionBody: { marginTop: 8 },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 6, marginBottom: 8 },
  button: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  fullWidthButton: { marginTop: 10, width: '100%' },
  primaryButton: { backgroundColor: '#0f172a' },
  secondaryButton: { backgroundColor: '#e2e8f0' },
  buttonText: { color: '#fff', fontWeight: '700' },
  buttonTextSecondary: { color: '#0f172a', fontWeight: '700' },
  listItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  listTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  listText: { fontSize: 13, color: '#475569', marginTop: 2, lineHeight: 18 },
  timeText: { fontSize: 11, color: '#64748b', marginTop: 2 },
  mapCard: { backgroundColor: '#e2e8f0', borderRadius: 14, padding: 12, marginBottom: 10 },
  mapOverlay: { marginBottom: 8 },
  mapLabel: { fontSize: 12, fontWeight: '700', color: '#0f172a', textTransform: 'uppercase' },
  mapText: { fontSize: 13, color: '#334155', marginTop: 2 },
  mapGrid: { height: 110, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', position: 'relative' },
  mapLine: { position: 'absolute', left: 20, right: 40, top: 35, height: 4, backgroundColor: '#0f172a', borderRadius: 99 },
  mapPin: { position: 'absolute', left: 60, top: 25, width: 16, height: 16, borderRadius: 999, backgroundColor: '#ef4444' },
  mapPinSecondary: { position: 'absolute', right: 45, bottom: 28, width: 16, height: 16, borderRadius: 999, backgroundColor: '#3b82f6' },
  alertPanel: { marginTop: 8, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#f59e0b', backgroundColor: '#fff7ed' },
  alertHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  alertBadge: { fontSize: 11, fontWeight: '800', color: '#7c2d12', backgroundColor: '#fed7aa', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  alertMeta: { fontSize: 11, color: '#7c2d12' },
  dashboardTable: { marginTop: 12, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, overflow: 'hidden' },
  dashboardHeaderRow: { flexDirection: 'row', backgroundColor: '#f8fafc', paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  dashboardHeaderText: { flex: 1, fontSize: 11, fontWeight: '700', color: '#64748b' },
  dashboardRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  dashboardLabel: { flex: 1.3, fontSize: 13, color: '#0f172a', fontWeight: '600', marginRight: 6 },
  dashboardStatusPill: { flex: 1, alignItems: 'center', paddingVertical: 5, paddingHorizontal: 8, borderRadius: 999, backgroundColor: '#dcfce7' },
  dashboardStatusText: { fontSize: 11, color: '#166534', fontWeight: '700' },
  dashboardStatusPillSecondary: { flex: 1, alignItems: 'center', paddingVertical: 5, paddingHorizontal: 8, borderRadius: 999, backgroundColor: '#e2e8f0', marginLeft: 6 },
  dashboardStatusTextSecondary: { fontSize: 11, color: '#0f172a', fontWeight: '700' },
  status: { marginTop: 10, color: '#334155', fontSize: 12, lineHeight: 18 },
});
