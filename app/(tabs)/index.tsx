import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Calendar, Clock, Phone, CircleAlert as AlertCircle, TrendingUp, CircleCheck as CheckCircle, FileText, ShoppingCart, Users } from 'lucide-react-native';

interface TaskItem {
  id: string;
  type: 'quotation' | 'order' | 'distributor' | 'invoice';
  title: string;
  customer: string;
  priority: 'high' | 'medium' | 'low';
  dueTime?: string;
  status: string;
}

interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const todayStats: StatItem[] = [
    {
      label: 'Quotations',
      value: '8',
      change: '+2',
      icon: <FileText size={20} color="#2563EB" />,
      color: '#2563EB',
    },
    {
      label: 'Orders',
      value: '5',
      change: '+1',
      icon: <ShoppingCart size={20} color="#10B981" />,
      color: '#10B981',
    },
    {
      label: 'Follow-ups',
      value: '3',
      change: '0',
      icon: <Phone size={20} color="#F97316" />,
      color: '#F97316',
    },
    {
      label: 'Completed',
      value: '12',
      change: '+4',
      icon: <CheckCircle size={20} color="#059669" />,
      color: '#059669',
    },
  ];

  const tasks: TaskItem[] = [
    {
      id: '1',
      type: 'quotation',
      title: 'Follow-up Quote #QT-2024-001',
      customer: 'ABC Electronics',
      priority: 'high',
      dueTime: '10:30 AM',
      status: 'Pending Response',
    },
    {
      id: '2',
      type: 'distributor',
      title: 'Contact Distributor - Order #OR-001',
      customer: 'XYZ Hardware',
      priority: 'medium',
      dueTime: '11:15 AM',
      status: 'Retry Scheduled',
    },
    {
      id: '3',
      type: 'order',
      title: 'Process Order #OR-002',
      customer: 'Tech Solutions Ltd',
      priority: 'high',
      status: 'Awaiting Approval',
    },
    {
      id: '4',
      type: 'invoice',
      title: 'Payment Follow-up #INV-001',
      customer: 'Metro Supplies',
      priority: 'medium',
      dueTime: '2:00 PM',
      status: 'Payment Due',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F97316';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quotation': return <FileText size={16} color="#2563EB" />;
      case 'order': return <ShoppingCart size={16} color="#10B981" />;
      case 'distributor': return <Phone size={16} color="#F97316" />;
      case 'invoice': return <TrendingUp size={16} color="#8B5CF6" />;
      default: return <AlertCircle size={16} color="#6B7280" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.userName}>John Smith</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#6B7280" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Time */}
        <View style={styles.timeCard}>
          <Calendar size={20} color="#2563EB" />
          <Text style={styles.currentDate}>
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          <Text style={styles.currentTime}>
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            {todayStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  {stat.icon}
                  <Text style={[styles.statChange, { color: stat.color }]}>
                    {stat.change}
                  </Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pending Tasks */}
        <View style={styles.tasksContainer}>
          <View style={styles.tasksHeader}>
            <Text style={styles.sectionTitle}>Pending Tasks</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {tasks.map((task) => (
            <TouchableOpacity key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View style={styles.taskType}>
                  {getTypeIcon(task.type)}
                  <Text style={styles.taskTitle}>{task.title}</Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                    {task.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.customerName}>{task.customer}</Text>
              
              <View style={styles.taskFooter}>
                <Text style={styles.taskStatus}>{task.status}</Text>
                {task.dueTime && (
                  <View style={styles.timeContainer}>
                    <Clock size={12} color="#6B7280" />
                    <Text style={styles.dueTime}>{task.dueTime}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <Users size={24} color="#2563EB" />
              <Text style={styles.quickActionText}>Add Customer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <FileText size={24} color="#10B981" />
              <Text style={styles.quickActionText}>New Quote</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <Phone size={24} color="#F97316" />
              <Text style={styles.quickActionText}>Call Distributor</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <TrendingUp size={24} color="#8B5CF6" />
              <Text style={styles.quickActionText}>View Reports</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  timeCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentDate: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  currentTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tasksContainer: {
    marginBottom: 24,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskType: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  customerName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 24,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskStatus: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueTime: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
});