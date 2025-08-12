import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Bell, Shield, LogOut, CircleHelp as HelpCircle, Info, Phone, Mail, MapPin, CreditCard as Edit, Camera } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState({
    orders: true,
    quotations: true,
    reminders: true,
    marketing: false,
  });

  const userInfo = {
    name: 'John Smith',
    email: 'john.smith@salesforce.com',
    phone: '+1 234-567-8900',
    territory: 'Northeast Region',
    employeeId: 'SF-2024-001',
    department: 'Sales',
    joinDate: '2023-03-15',
  };

  const stats = [
    { label: 'Total Quotations', value: '156', period: 'This Year' },
    { label: 'Closed Orders', value: '89', period: 'This Year' },
    { label: 'Revenue Generated', value: '$2.4M', period: 'This Year' },
    { label: 'Success Rate', value: '67%', period: 'Overall' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            console.log('User logged out');
            // Implement logout logic here
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing functionality will be implemented.');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contacting support...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={40} color="#FFFFFF" />
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userRole}>{userInfo.department} • {userInfo.territory}</Text>
            <Text style={styles.employeeId}>ID: {userInfo.employeeId}</Text>
          </View>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Mail size={20} color="#6B7280" />
              <Text style={styles.contactText}>{userInfo.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Phone size={20} color="#6B7280" />
              <Text style={styles.contactText}>{userInfo.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <MapPin size={20} color="#6B7280" />
              <Text style={styles.contactText}>{userInfo.territory}</Text>
            </View>
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statPeriod}>{stat.period}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          <View style={styles.notificationSettings}>
            {Object.entries(notifications).map(([key, value]) => (
              <View key={key} style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                  </Text>
                  <Text style={styles.notificationDescription}>
                    Receive notifications about {key === 'marketing' ? 'promotional content' : `${key} updates`}
                  </Text>
                </View>
                <Switch
                  value={value}
                  onValueChange={(newValue) => 
                    setNotifications(prev => ({ ...prev, [key]: newValue }))
                  }
                  trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                  thumbColor={value ? '#2563EB' : '#FFFFFF'}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings & Support</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem}>
              <Settings size={20} color="#6B7280" />
              <Text style={styles.menuText}>App Settings</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Shield size={20} color="#6B7280" />
              <Text style={styles.menuText}>Privacy & Security</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleSupport}>
              <HelpCircle size={20} color="#6B7280" />
              <Text style={styles.menuText}>Help & Support</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Info size={20} color="#6B7280" />
              <Text style={styles.menuText}>About</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Salesman App v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 Sales Distribution Co.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  employeeId: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  editButton: {
    padding: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  contactInfo: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 2,
  },
  statPeriod: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  notificationSettings: {
    gap: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  menuContainer: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  menuArrow: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});