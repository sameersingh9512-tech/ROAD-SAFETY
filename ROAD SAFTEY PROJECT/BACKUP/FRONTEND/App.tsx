export { default } from './App_frontend_without_login';

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
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

const trafficUpdates = [
  { id: '1', title: 'Traffic Video', detail: 'Live clip: Congestion near Ring Road junction', time: '2 min ago' },
  { id: '2', title: 'Weather Alert', detail: 'Heavy rain causing low visibility near Highway 12', time: '9 min ago' },
  { id: '3', title: 'Accident Update', detail: 'Minor collision cleared at Main Avenue', time: '18 min ago' },
  { id: '4', title: 'Sharp Turn Alert', detail: 'Vehicle approaching a sharp bend near Hill Crest with reduced visibility', time: '12 min ago' },
  { id: '5', title: 'High Speed Vehicle Warning', detail: 'High-speed vehicle detected approaching school zone', time: '24 min ago' },
  { id: '6', title: 'Speed Warning', detail: 'Recommended speed limit reduced to 40 km/h near active hazard zone', time: '31 min ago' },
];

const adminStatusCards = [
  { label: 'Your Status', value: 'Online', note: 'Monitoring active incidents', accent: '#22c55e' },
  { label: 'Team Lead Status', value: 'On Shift', note: 'Reviewing incident queue', accent: '#0f172a' },
];

const adminModules = [
  { title: 'Manage all users', description: 'Approve accounts, assign roles, and monitor access.', icon: '👥', status: 'Live' },
  { title: 'Manage reports', description: 'Review road hazard reports and assign follow-up.', icon: '🧾', status: '2 new' },
  { title: 'Manage platform settings', description: 'Adjust alert rules, safety thresholds, and alerts.', icon: '⚙️', status: 'Ready' },
  { title: 'Manage features', description: 'Control traffic, weather, emergency, and map modules.', icon: '✨', status: 'Enabled' },
];

const adminSubFeatures = [
  { title: 'Manage all user', yourStatus: 'Active', teamLeadStatus: 'Approved' },
  { title: 'Manage reports', yourStatus: 'Monitoring', teamLeadStatus: 'Assigned' },
  { title: 'Manage platform settings', yourStatus: 'Enabled', teamLeadStatus: 'Reviewed' },
  { title: 'Manage features', yourStatus: 'Live', teamLeadStatus: 'Updated' },
];

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
  role?: string;
  email?: string;
};

function AppLegacy() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'authority'>('user');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Welcome to Ruhanix Road Safety');
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'admin'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
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

  const canSubmit = useMemo(() => email.length > 3 && password.length > 3, [email, password]);
  const canSignup = useMemo(() => name.trim().length > 1 && canSubmit, [name, canSubmit]);

  const openFeature = (feature: string) => {
    const urls: Record<string, string> = {
      traffic: 'https://www.youtube.com/results?search_query=traffic+rules+video',
      tracking: 'https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=City+Center&travelmode=driving',
      emergency: 'https://www.google.com/search?q=emergency+helpline+road+safety',
      weather: 'https://weather.com/',
      accident: 'https://www.google.com/search?q=live+road+accident+news',
      sharpTurn: 'https://www.google.com/search?q=sharp+turn+road+safety+warning',
      highSpeed: 'https://www.google.com/search?q=high+speed+vehicle+approaching+alert',
      speed: 'https://www.google.com/search?q=road+safety+speed+limit+school+zone',
      quick: 'https://www.nhtsa.gov/road-safety',
    };

    const url = urls[feature] ?? 'https://www.google.com';
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    Linking.openURL(url);
  };

  const runOfflineFallback = async (path: string, payload: object): Promise<ApiResponse> => {
    const typedPayload = payload as {
      action?: string;
      role?: string;
      email?: string;
      password?: string;
      name?: string;
    };

    if (path === 'auth') {
      const role = typedPayload.role === 'authority' ? 'authority' : 'user';
      const email = typedPayload.email?.trim().toLowerCase() || 'demo@example.com';
      const isSignup = typedPayload.action === 'signup';
      const message = isSignup
        ? 'Offline demo mode: your account was created locally.'
        : 'Offline demo mode: login succeeded locally.';

      return {
        status: 'success',
        message,
        role,
        email,
      };
    }

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

  const handleSignup = async () => {
    if (!canSignup) {
      Alert.alert('Validation', 'Please enter your name, a valid email, and a password with at least 6 characters.');
      return;
    }

    const data = await callApi('auth', {
      action: 'signup',
      name: name.trim(),
      role,
      email: email.trim().toLowerCase(),
      password,
    });

    if (data?.status === 'success') {
      setIsAuthenticated(true);
      setActiveView('dashboard');
    }
  };

  const handleLogin = async () => {
    if (!canSubmit) {
      Alert.alert('Validation', 'Please enter a valid email and password.');
      return;
    }

    const data = await callApi('auth', {
      action: 'login',
      role,
      email: email.trim().toLowerCase(),
      password,
    });

    if (data?.status === 'success') {
      setIsAuthenticated(true);
      setActiveView(role === 'authority' ? 'admin' : 'dashboard');
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const submitReport = async () => {
    await callApi('reports', { type: 'hazard', description: 'Reported from Expo Go app' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('home');
    setName('');
    setEmail('');
    setPassword('');
    setMessage('You have been logged out.');
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

  const renderAdminPanel = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Ruhanix Admin Panel</Text>
      <Text style={styles.listText}>Coordinate operations, supervise incidents, and maintain safety features from one place.</Text>

      <View style={styles.adminStatusGrid}>
        {adminStatusCards.map((item) => (
          <View key={item.label} style={styles.adminStatusCard}>
            <View style={[styles.adminDot, { backgroundColor: item.accent }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.listTitle}>{item.label}</Text>
              <Text style={styles.listText}>{item.note}</Text>
            </View>
            <Text style={[styles.adminValue, { color: item.accent }]}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.adminModuleList}>
        <Text style={styles.listTitle}>Sub-feature overview</Text>
        <View style={styles.dashboardTable}>
          <View style={styles.dashboardHeaderRow}>
            <Text style={styles.dashboardHeaderText}>Sub-feature</Text>
            <Text style={styles.dashboardHeaderText}>Your Status</Text>
            <Text style={styles.dashboardHeaderText}>Team Lead Status</Text>
          </View>
          {adminSubFeatures.map((item) => (
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
      </View>

      <View style={styles.adminModuleList}>
        {adminModules.map((module) => (
          <View key={module.title} style={styles.adminModuleItem}>
            <Text style={styles.adminModuleIcon}>{module.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.listTitle}>{module.title}</Text>
              <Text style={styles.listText}>{module.description}</Text>
            </View>
            <View style={styles.adminPill}>
              <Text style={styles.adminPillText}>{module.status}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.primaryButton]} onPress={() => setActiveView('home')}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondaryButton]} onPress={submitReport}>
          <Text style={styles.buttonTextSecondary}>New Report</Text>
        </Pressable>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.secondaryButton]} onPress={handleLogout}>
          <Text style={styles.buttonTextSecondary}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.heroCard}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>Ruhanix™</Text>
              </View>
            </View>
            <Text style={styles.title}>Ruhanix Road Safety</Text>
            <Text style={styles.subtitle}>Please sign in or create an account to access the dashboard, live route planning, weather insights, and emergency support.</Text>
          </View>

          <View style={styles.switchRow}>
            <Pressable style={[styles.switchButton, role === 'user' && styles.switchButtonActive]} onPress={() => setRole('user')}>
              <Text style={[styles.switchText, role === 'user' && styles.switchTextActive]}>User</Text>
            </Pressable>
            <Pressable style={[styles.switchButton, role === 'authority' && styles.switchButtonActive]} onPress={() => setRole('authority')}>
              <Text style={[styles.switchText, role === 'authority' && styles.switchTextActive]}>Authority</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Access</Text>
            <TextInput style={styles.input} placeholder="Full name (required for sign up)" value={name} onChangeText={setName} autoCapitalize="words" />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <View style={styles.buttonRow}>
              <Pressable style={[styles.button, styles.primaryButton]} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
              </Pressable>
              <Pressable style={[styles.button, styles.secondaryButton]} onPress={handleSignup} disabled={loading || !canSignup}>
                {loading ? <ActivityIndicator color="#0f172a" /> : <Text style={styles.buttonTextSecondary}>Sign Up</Text>}
              </Pressable>
            </View>
            <Text style={styles.status}>{message}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>Ruhanix™</Text>
            </View>
          </View>
          <Text style={styles.heroEyebrow}>Live Road Safety Platform</Text>
          <Text style={styles.title}>Ruhanix Road Safety</Text>
          <Text style={styles.subtitle}>A professional live road-safety hub with route planning, weather monitoring, accident insights, and emergency access.</Text>
        </View>

        {activeView === 'admin' ? renderAdminPanel() : null}

        {renderSection('traffic', 'Traffic Rules', (
          <>
            <Text style={styles.listText}>Learn the essential traffic rules and safe driving practices.</Text>
            <FlatList
              data={trafficUpdates}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable style={styles.listItem} onPress={() => openFeature('traffic')}>
                  <Text style={styles.listTitle}>{item.title}</Text>
                  <Text style={styles.listText}>{item.detail}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </Pressable>
              )}
            />
            <Pressable style={[styles.button, styles.secondaryButton, styles.fullWidthButton]} onPress={() => openFeature('traffic')}>
              <Text style={styles.buttonTextSecondary}>Watch Traffic Rules Video</Text>
            </Pressable>
          </>
        ), 'traffic')}

        {renderSection('tracking', 'Live Tracking', (
          <>
            <View style={styles.mapCard}>
              <View style={styles.mapOverlay}>
                <Text style={styles.mapLabel}>Live Route</Text>
                <Text style={styles.mapText}>North Bridge → City Center</Text>
              </View>
              <View style={styles.mapGrid}>
                <View style={styles.mapLine} />
                <View style={styles.mapPin} />
                <View style={styles.mapPinSecondary} />
              </View>
            </View>
            <Text style={styles.listText}>Monitor current traffic conditions and route updates in real time.</Text>
            <Pressable style={[styles.button, styles.secondaryButton, styles.fullWidthButton]} onPress={() => openFeature('tracking')}>
              <Text style={styles.buttonTextSecondary}>Open Google Maps</Text>
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
            <Text style={styles.listText}>Weather source: Google Weather</Text>
            <Text style={styles.listText}>Current condition: Light rain, 24°C</Text>
            <Text style={styles.listText}>Visibility: Reduced near bridges</Text>
            <Pressable style={[styles.button, styles.secondaryButton, styles.fullWidthButton]} onPress={() => openFeature('weather')}>
              <Text style={styles.buttonTextSecondary}>Open Live Weather</Text>
            </Pressable>
          </>
        ))}

        {renderSection('sharpTurn', 'Sharp Turn Alerts', (
          <>
            {safetyAlerts
              .filter((alert) => alert.id === 'sharpTurn')
              .map((alert) => (
                <View key={alert.id} style={styles.alertPanel}>
                  <View style={styles.alertHeaderRow}>
                    <Text style={styles.alertBadge}>{alert.status}</Text>
                    <Text style={styles.alertMeta}>Last update: {alert.lastUpdated}</Text>
                  </View>
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
            <Pressable style={[styles.button, styles.secondaryButton, styles.fullWidthButton]} onPress={() => openFeature('sharpTurn')}>
              <Text style={styles.buttonTextSecondary}>View Sharp Turn Guidance</Text>
            </Pressable>
          </>
        ), 'sharpTurn')}

        {renderSection('highSpeed', 'High Speed Vehicle Approaching Alerts', (
          <>
            {safetyAlerts
              .filter((alert) => alert.id === 'highSpeed')
              .map((alert) => (
                <View key={alert.id} style={styles.alertPanel}>
                  <View style={styles.alertHeaderRow}>
                    <Text style={styles.alertBadge}>{alert.status}</Text>
                    <Text style={styles.alertMeta}>Last update: {alert.lastUpdated}</Text>
                  </View>
                  <Text style={styles.listText}>{alert.message}</Text>
                  <Text style={styles.listText}>Distance: {alert.distance}</Text>
                  <Text style={styles.listText}>Speed: {alert.speed}</Text>
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
            <Pressable style={[styles.button, styles.secondaryButton, styles.fullWidthButton]} onPress={() => openFeature('highSpeed')}>
              <Text style={styles.buttonTextSecondary}>Check High-Speed Alert Details</Text>
            </Pressable>
          </>
        ), 'highSpeed')}

        {renderSection('accident', 'Accident Update', (
          <>
            <Text style={styles.listText}>Social feeds monitored: Twitter, Facebook, local traffic pages</Text>
            <Text style={styles.listText}>Latest report: Vehicle breakdown near East Gate</Text>
            <Pressable style={[styles.button, styles.secondaryButton, styles.fullWidthButton]} onPress={() => openFeature('accident')}>
              <Text style={styles.buttonTextSecondary}>Open Accident Updates</Text>
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

        {activeView !== 'home' && activeView !== 'admin' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>User Dashboard</Text>
            <Text style={styles.listText}>Road safety tips, sharp turn alerts, high-speed warnings, emergency help, and reporting are available here.</Text>

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

            <View style={styles.buttonRow}>
              <Pressable style={[styles.button, styles.primaryButton]} onPress={() => setActiveView('home')}>
                <Text style={styles.buttonText}>Back</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.secondaryButton]} onPress={handleLogout}>
                <Text style={styles.buttonTextSecondary}>Logout</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { padding: 20, paddingBottom: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  logoCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 28, fontWeight: '800', color: '#ffffff', textAlign: 'center', letterSpacing: 0.5 },
  heroCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },

  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  heroEyebrow: { fontSize: 11, fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#475569', lineHeight: 20 },
  switchRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  switchButton: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#f8fafc' },
  switchButtonActive: { backgroundColor: '#0f172a' },
  switchText: { color: '#334155', fontWeight: '700' },
  switchTextActive: { color: '#fff' },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#0f172a', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
  expandText: { fontSize: 20, color: '#0f172a', fontWeight: '700' },
  sectionBody: { marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, marginBottom: 10, backgroundColor: '#f8fafc' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
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
  adminStatusGrid: { marginTop: 10, gap: 10 },
  adminStatusCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#f8fafc' },
  adminDot: { width: 10, height: 10, borderRadius: 999, marginRight: 10 },
  adminValue: { fontSize: 13, fontWeight: '700' },
  adminModuleList: { marginTop: 12, gap: 10 },
  adminModuleItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#ffffff' },
  adminModuleIcon: { fontSize: 22, marginRight: 10 },
  adminPill: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, backgroundColor: '#e2e8f0' },
  adminPillText: { fontSize: 11, color: '#0f172a', fontWeight: '700' },
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
