import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Package, Truck, Clock, CircleCheck as CheckCircle, Circle as XCircle, Phone, User, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Package, Truck, Clock, CircleCheck as CheckCircle, Circle as XCircle, Phone, User, MapPin } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && screenWidth >= 768;

interface Order {
  id: string;
  number: string;
  customer: string;
  company: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  deliveryDate: string;
  distributor: string;
  distributorPhone: string;
  distributorStatus: 'available' | 'contacted' | 'unavailable';
  items: number;
  address: string;
}

export default function OrdersScreen() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered'>('all');

  const orders: Order[] = [
    {
      id: '1',
      number: 'ORD-2024-001',
      customer: 'John Anderson',
      company: 'ABC Electronics',
      amount: 15750.00,
      status: 'confirmed',
      date: '2024-01-15',
      deliveryDate: '2024-01-18',
      distributor: 'Metro Distribution',
      distributorPhone: '+1 555-0101',
      distributorStatus: 'contacted',
      items: 5,
      address: '123 Business Ave, New York',
    },
    {
      id: '2',
      number: 'ORD-2024-002',
      customer: 'Sarah Wilson',
      company: 'Tech Solutions Ltd',
      amount: 22350.00,
      status: 'pending',
      date: '2024-01-14',
      deliveryDate: '2024-01-17',
      distributor: 'Fast Logistics',
      distributorPhone: '+1 555-0102',
      distributorStatus: 'available',
      items: 8,
      address: '456 Tech Street, Los Angeles',
    },
    {
      id: '3',
      number: 'ORD-2024-003',
      customer: 'Mike Brown',
      company: 'Metro Supplies',
      amount: 8900.00,
      status: 'shipped',
      date: '2024-01-12',
      deliveryDate: '2024-01-16',
      distributor: 'Quick Delivery',
      distributorPhone: '+1 555-0103',
      distributorStatus: 'contacted',
      items: 3,
      address: '789 Supply Road, Chicago',
    },
    {
      id: '4',
      number: 'ORD-2024-004',
      customer: 'Lisa Davis',
      company: 'XYZ Hardware',
      amount: 12500.00,
      status: 'delivered',
      date: '2024-01-10',
      deliveryDate: '2024-01-13',
      distributor: 'Express Transport',
      distributorPhone: '+1 555-0104',
      distributorStatus: 'available',
      items: 6,
      address: '321 Hardware Blvd, Houston',
    },
  ];

  const filteredOrders = orders.filter(order => {
    return selectedTab === 'all' || order.status === selectedTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#3B82F6';
      case 'shipped': return '#8B5CF6';
      case 'delivered': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FEF3C7';
      case 'confirmed': return '#DBEAFE';
      case 'shipped': return '#EDE9FE';
      case 'delivered': return '#D1FAE5';
      case 'cancelled': return '#FEE2E2';
      default: return '#F3F4F6';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} color="#F59E0B" />;
      case 'confirmed': return <CheckCircle size={16} color="#3B82F6" />;
      case 'shipped': return <Truck size={16} color="#8B5CF6" />;
      case 'delivered': return <Package size={16} color="#10B981" />;
      case 'cancelled': return <XCircle size={16} color="#EF4444" />;
      default: return <Package size={16} color="#6B7280" />;
    }
  };

  const getDistributorStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10B981';
      case 'contacted': return '#3B82F6';
      case 'unavailable': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleDistributorContact = (order: Order) => {
    Alert.alert(
      'Contact Distributor',
      `Do you want to call ${order.distributor}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            console.log('Calling:', order.distributorPhone);
            // Here you would implement the actual call functionality
          }
        },
        {
          text: 'Mark Unavailable',
          style: 'destructive',
          onPress: () => handleMarkUnavailable(order)
        }
      ]
    );
  };

  const handleMarkUnavailable = (order: Order) => {
    Alert.alert(
      'Mark Distributor Unavailable',
      'Please provide a reason and suggested retry time:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Unavailable', 
          onPress: () => {
            console.log('Marking distributor unavailable for order:', order.number);
            // Here you would implement the unavailable marking logic
          }
        }
      ]
    );
  };

  const tabs = [
    { key: 'all', label: 'All', count: orders.length },
    { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { key: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length },
    { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Status Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              selectedTab === tab.key && styles.tabActive
            ]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.key && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
            <View style={[
              styles.countBadge,
              selectedTab === tab.key && styles.countBadgeActive
            ]}>
              <Text style={[
                styles.countText,
                selectedTab === tab.key && styles.countTextActive
              ]}>
                {tab.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      <ScrollView style={styles.ordersList}>
        {filteredOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderNumber}>{order.number}</Text>
                <Text style={styles.customerName}>{order.customer}</Text>
                <Text style={styles.companyName}>{order.company}</Text>
              </View>
              <View style={styles.orderMeta}>
                <Text style={styles.amount}>${order.amount.toLocaleString()}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusBgColor(order.status) }
                ]}>
                  {getStatusIcon(order.status)}
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(order.status) }
                  ]}>
                    {order.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order Date:</Text>
                <Text style={styles.detailValue}>
                  {new Date(order.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Delivery Date:</Text>
                <Text style={styles.detailValue}>
                  {new Date(order.deliveryDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Items:</Text>
                <Text style={styles.detailValue}>{order.items} items</Text>
              </View>
            </View>

            {/* Delivery Address */}
            <View style={styles.addressContainer}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.addressText}>{order.address}</Text>
            </View>

            {/* Distributor Info */}
            <View style={styles.distributorContainer}>
              <View style={styles.distributorHeader}>
                <View style={styles.distributorInfo}>
                  <User size={16} color="#374151" />
                  <Text style={styles.distributorName}>{order.distributor}</Text>
                </View>
                <View style={[
                  styles.distributorStatusBadge,
                  { backgroundColor: getDistributorStatusColor(order.distributorStatus) + '20' }
                ]}>
                  <Text style={[
                    styles.distributorStatusText,
                    { color: getDistributorStatusColor(order.distributorStatus) }
                  ]}>
                    {order.distributorStatus.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => handleDistributorContact(order)}
              >
                <Phone size={16} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>
                  {order.distributorPhone}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isWeb ? 12 : 16,
    paddingVertical: isWeb ? 6 : 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  tabText: {
    fontSize: isWeb ? 12 : 14,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 8,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  countBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: isWeb ? 6 : 8,
    paddingVertical: isWeb ? 1 : 2,
    minWidth: isWeb ? 20 : 24,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  countText: {
    fontSize: isWeb ? 10 : 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  ordersList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderMeta: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  orderDetails: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  distributorContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  distributorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  distributorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distributorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  distributorStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distributorStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});