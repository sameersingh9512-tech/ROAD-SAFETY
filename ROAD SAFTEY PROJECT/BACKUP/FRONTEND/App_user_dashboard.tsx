import React, { useEffect, useState } from 'react';
import { Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type FeatureTab = 'tips' | 'sharpTurn' | 'highSpeed' | 'awareness';
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

const userDashboardFeatures = [
  { title: 'Get road safety tips', yourStatus: 'Enabled', teamLeadStatus: 'Approved' },
  { title: 'Sharp turn alerts', yourStatus: 'On', teamLeadStatus: 'Live' },
  { title: 'High speed vehicle approaching alerts', yourStatus: 'Active', teamLeadStatus: 'Monitoring' },
  { title: 'Traffic rules', yourStatus: 'Updated', teamLeadStatus: 'Shared' },
  { title: 'Emergency help', yourStatus: 'Ready', teamLeadStatus: 'Escalated' },
  { title: 'Awareness content', yourStatus: 'Published', teamLeadStatus: 'Reviewed' },
  { title: 'Quick report options', yourStatus: 'Available', teamLeadStatus: 'Priority' },
];

const roadSafetyTips = [
  'Always wear your seatbelt and keep a safe following distance.',
  'Slow down at night and in rain when visibility drops.',
  'Check mirrors and blind spots before changing lanes or turning.',
  'Use indicators early and avoid sudden braking in traffic.',
];

const awarenessCards = [
  { title: 'School Zone Safety', detail: 'Stay alert near crossings and reduce speed near children.', tag: 'Priority' },
  { title: 'Night Driving', detail: 'Use headlights properly and keep a wider safety margin.', tag: 'Live' },
  { title: 'Helmet and Seatbelt Campaign', detail: 'Protect every passenger with consistent safety habits.', tag: 'Updated' },
];

export default function AppUserDashboard() {
  const [activeTab, setActiveTab] = useState<FeatureTab>('tips');
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([
    {
      id: 'sharpTurn',
      title: 'Sharp turn alerts',
      status: 'Active',
      distance: '90 m',
      speed: '25 km/h',
      message: 'Sharp bend detected ahead on Valley Road with reduced visibility.',
      recommendation: 'Reduce speed, switch on headlights, and warn nearby vehicles.',
      lastUpdated: 'Just now',
    },
    {
      id: 'highSpeed',
      title: 'High speed vehicle approaching alerts',
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
            return { ...alert, status: nextStatus, distance: nextDistance, lastUpdated: 'Updated now' };
          }

          if (alert.id === 'highSpeed') {
            const nextStatus = alert.status === 'Monitoring' ? 'Active' : 'Monitoring';
            const nextSpeed = alert.status === 'Monitoring' ? '88 km/h' : '82 km/h';
            return { ...alert, status: nextStatus, speed: nextSpeed, lastUpdated: 'Updated now' };
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
          return { ...alert, status: 'Acknowledged', lastUpdated: 'Acknowledged now' };
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

  const openResource = (url: string) => {
    Linking.openURL(url);
  };

  const renderAlertCard = (alertId: 'sharpTurn' | 'highSpeed') => {
    const alert = safetyAlerts.find((item) => item.id === alertId);
    if (!alert) {
      return null;
    }

    return (
      <View key={alert.id} style={styles.alertCard}>
        <View style={styles.alertHeaderRow}>
          <Text style={styles.alertBadge}>{alert.status}</Text>
          <Text style={styles.alertMeta}>Last update: {alert.lastUpdated}</Text>
        </View>
        <Text style={styles.alertTitle}>{alert.title}</Text>
        <Text style={styles.listText}>{alert.message}</Text>
        <Text style={styles.listText}>Distance: {alert.distance}</Text>
        <Text style={styles.listText}>Speed: {alert.speed}</Text>
        <Text style={styles.listText}>Recommendation: {alert.recommendation}</Text>
        <View style={styles.buttonRow}>
          <Pressable style={[styles.button, styles.primaryButton]} onPress={() => handleAlertAction(alert.id, 'acknowledge')}>
            <Text style={styles.buttonText}>Acknowledge</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => handleAlertAction(alert.id, 'reset')}>
            <Text style={styles.buttonTextSecondary}>Reset</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.title}>User Dashboard</Text>
          <Text style={styles.subtitle}>Road safety tips, sharp turn alerts, high-speed warnings, emergency help, and awareness content are available here.</Text>
        </View>

        <View style={styles.tabRow}>
          {[
            { key: 'tips', label: 'Tips' },
            { key: 'sharpTurn', label: 'Sharp turn' },
            { key: 'highSpeed', label: 'High speed' },
            { key: 'awareness', label: 'Awareness' },
          ].map((tab) => (
            <Pressable
              key={tab.key}
              style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab.key as FeatureTab)}
            >
              <Text style={[styles.tabButtonText, activeTab === tab.key && styles.tabButtonTextActive]}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        {activeTab === 'tips' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Road Safety Tips</Text>
            {roadSafetyTips.map((tip, index) => (
              <View key={tip} style={styles.tipItem}>
                <Text style={styles.tipNumber}>{index + 1}</Text>
                <Text style={styles.listText}>{tip}</Text>
              </View>
            ))}
            <Pressable style={[styles.button, styles.primaryButton, styles.fullWidth]} onPress={() => openResource('https://www.nhtsa.gov/road-safety')}>
              <Text style={styles.buttonText}>Read More Tips</Text>
            </Pressable>
          </View>
        )}

        {activeTab === 'sharpTurn' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sharp Turn Alerts</Text>
            {renderAlertCard('sharpTurn')}
          </View>
        )}

        {activeTab === 'highSpeed' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>High Speed Vehicle Approaching Alerts</Text>
            {renderAlertCard('highSpeed')}
          </View>
        )}

        {activeTab === 'awareness' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Awareness Content</Text>
            {awarenessCards.map((item) => (
              <View key={item.title} style={styles.awarenessCard}>
                <View style={styles.awarenessHeader}>
                  <Text style={styles.listTitle}>{item.title}</Text>
                  <Text style={styles.tag}>{item.tag}</Text>
                </View>
                <Text style={styles.listText}>{item.detail}</Text>
              </View>
            ))}
            <Pressable style={[styles.button, styles.secondaryButton, styles.fullWidth]} onPress={() => openResource('https://www.who.int/roadsafety') }>
              <Text style={styles.buttonTextSecondary}>View Awareness Resources</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.card}>
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
        </View>

        <View style={styles.buttonRow}>
          <Pressable style={[styles.button, styles.primaryButton]} onPress={() => setActiveTab('tips')}>
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => setActiveTab('tips')}>
            <Text style={styles.buttonTextSecondary}>Home</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { padding: 20, paddingBottom: 40 },
  heroCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#475569', lineHeight: 20 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  tabButton: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, backgroundColor: '#e2e8f0', marginRight: 8, marginBottom: 8 },
  tabButtonActive: { backgroundColor: '#0f172a' },
  tabButtonText: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  tabButtonTextActive: { color: '#fff' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  tipNumber: { backgroundColor: '#dbeafe', color: '#1d4ed8', width: 24, height: 24, borderRadius: 12, textAlign: 'center', lineHeight: 24, fontWeight: '700', marginRight: 10 },
  listTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  listText: { fontSize: 13, color: '#475569', lineHeight: 18, flex: 1 },
  alertCard: { marginTop: 8, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#f59e0b', backgroundColor: '#fff7ed' },
  alertHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  alertBadge: { fontSize: 11, fontWeight: '800', color: '#7c2d12', backgroundColor: '#fed7aa', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  alertMeta: { fontSize: 11, color: '#7c2d12' },
  alertTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  awarenessCard: { backgroundColor: '#f8fafc', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 12, marginBottom: 12 },
  awarenessHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tag: { fontSize: 10, fontWeight: '700', color: '#0f172a', backgroundColor: '#e2e8f0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  dashboardTable: { marginTop: 6, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, overflow: 'hidden' },
  dashboardHeaderRow: { flexDirection: 'row', backgroundColor: '#f8fafc', paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  dashboardHeaderText: { flex: 1, fontSize: 11, fontWeight: '700', color: '#64748b' },
  dashboardRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  dashboardLabel: { flex: 1.3, fontSize: 13, color: '#0f172a', fontWeight: '600', marginRight: 6 },
  dashboardStatusPill: { flex: 1, alignItems: 'center', paddingVertical: 5, paddingHorizontal: 8, borderRadius: 999, backgroundColor: '#dcfce7' },
  dashboardStatusText: { fontSize: 11, color: '#166534', fontWeight: '700' },
  dashboardStatusPillSecondary: { flex: 1, alignItems: 'center', paddingVertical: 5, paddingHorizontal: 8, borderRadius: 999, backgroundColor: '#e2e8f0', marginLeft: 6 },
  dashboardStatusTextSecondary: { fontSize: 11, color: '#0f172a', fontWeight: '700' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  button: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  primaryButton: { backgroundColor: '#0f172a' },
  secondaryButton: { backgroundColor: '#e2e8f0' },
  fullWidth: { width: '100%', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },
  buttonTextSecondary: { color: '#0f172a', fontWeight: '700' },
});
