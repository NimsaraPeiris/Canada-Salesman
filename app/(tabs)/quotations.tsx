import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, FileText, Send, Clock, CircleCheck as CheckCircle, Circle as XCircle, Eye, CreditCard as Edit, Share } from 'lucide-react-native';

interface Quotation {
  id: string;
  number: string;
  customer: string;
  company: string;
  amount: number;
  status: 'pending' | 'sent' | 'accepted' | 'rejected';
  date: string;
  validUntil: string;
  items: number;
}

export default function QuotationsScreen() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'sent' | 'accepted' | 'rejected'>('all');

  const quotations: Quotation[] = [
    {
      id: '1',
      number: 'QT-2024-001',
      customer: 'John Anderson',
      company: 'ABC Electronics',
      amount: 15750.00,
      status: 'pending',
      date: '2024-01-15',
      validUntil: '2024-01-30',
      items: 5,
    },
    {
      id: '2',
      number: 'QT-2024-002',
      customer: 'Sarah Wilson',
      company: 'Tech Solutions Ltd',
      amount: 22350.00,
      status: 'sent',
      date: '2024-01-14',
      validUntil: '2024-01-29',
      items: 8,
    },
    {
      id: '3',
      number: 'QT-2024-003',
      customer: 'Mike Brown',
      company: 'Metro Supplies',
      amount: 8900.00,
      status: 'accepted',
      date: '2024-01-12',
      validUntil: '2024-01-27',
      items: 3,
    },
    {
      id: '4',
      number: 'QT-2024-004',
      customer: 'Lisa Davis',
      company: 'XYZ Hardware',
      amount: 12500.00,
      status: 'rejected',
      date: '2024-01-10',
      validUntil: '2024-01-25',
      items: 6,
    },
  ];

  const filteredQuotations = quotations.filter(quote => {
    return selectedTab === 'all' || quote.status === selectedTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'sent': return '#3B82F6';
      case 'accepted': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FEF3C7';
      case 'sent': return '#DBEAFE';
      case 'accepted': return '#D1FAE5';
      case 'rejected': return '#FEE2E2';
      default: return '#F3F4F6';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} color="#F59E0B" />;
      case 'sent': return <Send size={16} color="#3B82F6" />;
      case 'accepted': return <CheckCircle size={16} color="#10B981" />;
      case 'rejected': return <XCircle size={16} color="#EF4444" />;
      default: return <FileText size={16} color="#6B7280" />;
    }
  };

  const handleQuotationAction = (action: string, quotation: Quotation) => {
    switch (action) {
      case 'view':
        Alert.alert('View Quotation', `Opening quotation ${quotation.number}`);
        break;
      case 'edit':
        Alert.alert('Edit Quotation', `Editing quotation ${quotation.number}`);
        break;
      case 'send':
        Alert.alert('Send Quotation', `Sending quotation ${quotation.number} to ${quotation.customer}`);
        break;
      case 'share':
        Alert.alert('Share Quotation', `Sharing quotation ${quotation.number}`);
        break;
      case 'convert':
        Alert.alert('Convert to Order', `Converting quotation ${quotation.number} to order`);
        break;
    }
  };

  const tabs = [
    { key: 'all', label: 'All', count: quotations.length },
    { key: 'pending', label: 'Pending', count: quotations.filter(q => q.status === 'pending').length },
    { key: 'sent', label: 'Sent', count: quotations.filter(q => q.status === 'sent').length },
    { key: 'accepted', label: 'Accepted', count: quotations.filter(q => q.status === 'accepted').length },
    { key: 'rejected', label: 'Rejected', count: quotations.filter(q => q.status === 'rejected').length },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quotations</Text>
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

      {/* Quotations List */}
      <ScrollView style={styles.quotationsList}>
        {filteredQuotations.map((quotation) => (
          <View key={quotation.id} style={styles.quotationCard}>
            <View style={styles.quotationHeader}>
              <View style={styles.quotationInfo}>
                <Text style={styles.quotationNumber}>{quotation.number}</Text>
                <Text style={styles.customerName}>{quotation.customer}</Text>
                <Text style={styles.companyName}>{quotation.company}</Text>
              </View>
              <View style={styles.quotationMeta}>
                <Text style={styles.amount}>${quotation.amount.toLocaleString()}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusBgColor(quotation.status) }
                ]}>
                  {getStatusIcon(quotation.status)}
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(quotation.status) }
                  ]}>
                    {quotation.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.quotationDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>
                  {new Date(quotation.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Valid Until:</Text>
                <Text style={styles.detailValue}>
                  {new Date(quotation.validUntil).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Items:</Text>
                <Text style={styles.detailValue}>{quotation.items} items</Text>
              </View>
            </View>

            <View style={styles.quotationActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleQuotationAction('view', quotation)}
              >
                <Eye size={16} color="#6B7280" />
                <Text style={styles.actionText}>View</Text>
              </TouchableOpacity>

              {quotation.status === 'pending' && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleQuotationAction('edit', quotation)}
                >
                  <Edit size={16} color="#2563EB" />
                  <Text style={[styles.actionText, { color: '#2563EB' }]}>Edit</Text>
                </TouchableOpacity>
              )}

              {(quotation.status === 'pending' || quotation.status === 'rejected') && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleQuotationAction('send', quotation)}
                >
                  <Send size={16} color="#10B981" />
                  <Text style={[styles.actionText, { color: '#10B981' }]}>Send</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleQuotationAction('share', quotation)}
              >
                <Share size={16} color="#F97316" />
                <Text style={[styles.actionText, { color: '#F97316' }]}>Share</Text>
              </TouchableOpacity>

              {quotation.status === 'accepted' && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.primaryActionButton]}
                  onPress={() => handleQuotationAction('convert', quotation)}
                >
                  <CheckCircle size={16} color="#FFFFFF" />
                  <Text style={[styles.actionText, { color: '#FFFFFF' }]}>Convert</Text>
                </TouchableOpacity>
              )}
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
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    fontSize: 14,
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  quotationsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  quotationCard: {
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
  quotationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  quotationInfo: {
    flex: 1,
  },
  quotationNumber: {
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
  quotationMeta: {
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
  quotationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  quotationActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryActionButton: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: '#6B7280',
  },
});