import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Modal, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Phone, Mail, MapPin, Filter, MoveVertical as MoreVertical, X, Calendar, Clock, User, Building, Tag, CircleCheck as CheckCircle, Circle as XCircle, CreditCard as Edit3, Save, TriangleAlert as AlertTriangle, ChevronRight } from 'lucide-react-native';

interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  category: 'distributor' | 'retailer' | 'corporate';
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
  totalOrders: number;
  tasks: Task[];
  reminders: Reminder[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  dueDate: string;
  createdAt: string;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  reminderDate: string;
  type: 'call' | 'email' | 'visit' | 'follow-up';
  isActive: boolean;
  createdAt: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && screenWidth >= 768;

export default function CustomersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCustomer, setExpandedCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'tasks' | 'reminders'>('info');
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as const, dueDate: '' });
  const [newReminder, setNewReminder] = useState({ title: '', description: '', reminderDate: '', type: 'call' as const });
  const [editingStatus, setEditingStatus] = useState(false);

  const customers: Customer[] = [
    {
      id: '1',
      name: 'John Anderson',
      company: 'ABC Electronics',
      phone: '+1 234-567-8901',
      email: 'john@abcelectronics.com',
      address: '123 Business Ave',
      city: 'New York',
      category: 'distributor',
      status: 'active',
      lastContact: '2024-01-15',
      totalOrders: 45,
      tasks: [
        {
          id: 't1',
          title: 'Follow up on Quote #QT-001',
          description: 'Customer requested modifications to pricing',
          priority: 'high',
          status: 'pending',
          dueDate: '2024-01-20',
          createdAt: '2024-01-15',
        },
        {
          id: 't2',
          title: 'Prepare product catalog',
          description: 'Send updated catalog for Q2 products',
          priority: 'medium',
          status: 'completed',
          dueDate: '2024-01-18',
          createdAt: '2024-01-14',
        },
      ],
      reminders: [
        {
          id: 'r1',
          title: 'Monthly check-in call',
          description: 'Regular monthly business review call',
          reminderDate: '2024-01-25',
          type: 'call',
          isActive: true,
          createdAt: '2024-01-15',
        },
      ],
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      company: 'Tech Solutions Ltd',
      phone: '+1 234-567-8902',
      email: 'sarah@techsolutions.com',
      address: '456 Tech Street',
      city: 'Los Angeles',
      category: 'corporate',
      status: 'active',
      lastContact: '2024-01-10',
      totalOrders: 28,
      tasks: [],
      reminders: [],
    },
    {
      id: '3',
      name: 'Mike Brown',
      company: 'Metro Supplies',
      phone: '+1 234-567-8903',
      email: 'mike@metrosupplies.com',
      address: '789 Supply Road',
      city: 'Chicago',
      category: 'retailer',
      status: 'pending',
      lastContact: '2024-01-12',
      totalOrders: 67,
      tasks: [],
      reminders: [],
    },
    {
      id: '4',
      name: 'Lisa Davis',
      company: 'XYZ Hardware',
      phone: '+1 234-567-8904',
      email: 'lisa@xyzhardware.com',
      address: '321 Hardware Blvd',
      city: 'Houston',
      category: 'distributor',
      status: 'inactive',
      lastContact: '2023-12-20',
      totalOrders: 15,
      tasks: [],
      reminders: [],
    },
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery);
    
    const matchesCategory = selectedCategory === 'all' || customer.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'distributor': return '#2563EB';
      case 'corporate': return '#059669';
      case 'retailer': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'distributor': return '#DBEAFE';
      case 'corporate': return '#D1FAE5';
      case 'retailer': return '#FEE2E2';
      default: return '#F3F4F6';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#059669';
      case 'inactive': return '#DC2626';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'active': return '#D1FAE5';
      case 'inactive': return '#FEE2E2';
      case 'pending': return '#FEF3C7';
      default: return '#F3F4F6';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F97316';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const handleCall = (phone: string) => {
    Alert.alert(
      'Make Call',
      `Do you want to call ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling:', phone) }
      ]
    );
  };

  const handleEmail = (email: string) => {
    Alert.alert(
      'Send Email',
      `Do you want to send an email to ${email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email', onPress: () => console.log('Emailing:', email) }
      ]
    );
  };

  const handleExpandCustomer = (customer: Customer) => {
    setExpandedCustomer(customer);
    setActiveTab('info');
    setEditingStatus(false);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const task: Task = {
      id: `t${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: 'pending',
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString(),
    };

    // In a real app, you would update the customer data here
    console.log('Adding task:', task);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    Alert.alert('Success', 'Task added successfully');
  };

  const handleAddReminder = () => {
    if (!newReminder.title.trim()) {
      Alert.alert('Error', 'Please enter a reminder title');
      return;
    }

    const reminder: Reminder = {
      id: `r${Date.now()}`,
      title: newReminder.title,
      description: newReminder.description,
      reminderDate: newReminder.reminderDate,
      type: newReminder.type,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    // In a real app, you would update the customer data here
    console.log('Adding reminder:', reminder);
    setNewReminder({ title: '', description: '', reminderDate: '', type: 'call' });
    Alert.alert('Success', 'Reminder added successfully');
  };

  const handleStatusChange = (newStatus: 'active' | 'inactive' | 'pending') => {
    if (expandedCustomer) {
      // In a real app, you would update the customer status here
      console.log('Changing status to:', newStatus);
      setExpandedCustomer({ ...expandedCustomer, status: newStatus });
      setEditingStatus(false);
      Alert.alert('Success', `Customer status changed to ${newStatus}`);
    }
  };

  const renderExpandedView = () => {
    if (!expandedCustomer) return null;

    return (
      <Modal
        visible={!!expandedCustomer}
        animationType="slide"
        presentationStyle={isDesktop ? "pageSheet" : "fullScreen"}
      >
        <SafeAreaView style={[styles.expandedContainer, isDesktop && styles.expandedContainerDesktop]}>
          {/* Header */}
          <View style={styles.expandedHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setExpandedCustomer(null)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.expandedTitle}>{expandedCustomer.name}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Customer Info - Simplified */}
          <View style={styles.customerInfoCard}>
            <View style={styles.customerHeader}>
              <View style={styles.customerAvatar}>
                <User size={32} color="#FFFFFF" />
              </View>
              <View style={styles.customerDetails}>
                <Text style={styles.customerNameLarge}>{expandedCustomer.name}</Text>
                <Text style={styles.companyNameLarge}>{expandedCustomer.company}</Text>
                <View style={styles.simpleBadgeContainer}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryBgColor(expandedCustomer.category) }]}>
                    <Text style={[styles.categoryText, { color: getCategoryColor(expandedCustomer.category) }]}>
                      {expandedCustomer.category.toUpperCase()}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(expandedCustomer.status) }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(expandedCustomer.status) }]}>
                      {expandedCustomer.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Quick Contact Actions */}
            <View style={styles.quickContactActions}>
              <TouchableOpacity style={styles.quickContactButton} onPress={() => handleCall(expandedCustomer.phone)}>
                <Phone size={16} color="#2563EB" />
                <Text style={styles.quickContactText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickContactButton} onPress={() => handleEmail(expandedCustomer.email)}>
                <Mail size={16} color="#059669" />
                <Text style={styles.quickContactText}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Content Area */}
          <View style={[styles.mainContent, isDesktop && styles.mainContentDesktop]}>
            {/* Left Side - Tasks and Reminders */}
            <View style={[styles.leftPanel, isDesktop && styles.leftPanelDesktop]}>
              {/* Add Task Section */}
              <View style={styles.simpleSection}>
                <Text style={styles.simpleSectionTitle}>Add Task</Text>
                <TextInput
                  style={styles.simpleInput}
                  placeholder="Task title"
                  value={newTask.title}
                  onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                />
                <TextInput
                  style={[styles.simpleInput, styles.simpleTextArea]}
                  placeholder="Description (optional)"
                  value={newTask.description}
                  onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                  multiline
                  numberOfLines={2}
                />
                <View style={styles.simpleRow}>
                  <View style={styles.priorityContainer}>
                    {['low', 'medium', 'high'].map((priority) => (
                      <TouchableOpacity
                        key={priority}
                        style={[
                          styles.simplePriorityButton,
                          newTask.priority === priority && styles.simplePriorityButtonActive,
                          { borderColor: getPriorityColor(priority) }
                        ]}
                        onPress={() => setNewTask({ ...newTask, priority: priority as any })}
                      >
                        <Text style={[
                          styles.simplePriorityText,
                          newTask.priority === priority && { color: getPriorityColor(priority) }
                        ]}>
                          {priority}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity style={styles.simpleAddButton} onPress={handleAddTask}>
                    <Plus size={16} color="#FFFFFF" />
                    <Text style={styles.simpleAddButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>

              {/* Add Reminder Section */}
              <View style={styles.simpleSection}>
                <Text style={styles.simpleSectionTitle}>Add Reminder</Text>
                <TextInput
                  style={styles.simpleInput}
                  placeholder="Reminder title"
                  value={newReminder.title}
                  onChangeText={(text) => setNewReminder({ ...newReminder, title: text })}
                />
                <TextInput
                  style={[styles.simpleInput, styles.simpleTextArea]}
                  placeholder="Description (optional)"
                  value={newReminder.description}
                  onChangeText={(text) => setNewReminder({ ...newReminder, description: text })}
                  multiline
                  numberOfLines={2}
                />
                <View style={styles.simpleRow}>
                  <View style={styles.typeContainer}>
                    {['call', 'email', 'visit'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.simpleTypeButton,
                          newReminder.type === type && styles.simpleTypeButtonActive
                        ]}
                        onPress={() => setNewReminder({ ...newReminder, type: type as any })}
                      >
                        <Text style={[
                          styles.simpleTypeText,
                          newReminder.type === type && styles.simpleTypeTextActive
                        ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity style={styles.simpleAddButton} onPress={handleAddReminder}>
                    <Plus size={16} color="#FFFFFF" />
                    <Text style={styles.simpleAddButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Right Side - Existing Items and Info */}
            <View style={[styles.rightPanel, isDesktop && styles.rightPanelDesktop]}>
              {/* Contact Info */}
              <View style={styles.simpleSection}>
                <Text style={styles.simpleSectionTitle}>Contact Information</Text>
                <View style={styles.contactInfoGrid}>
                  <View style={styles.contactInfoItem}>
                    <Phone size={16} color="#6B7280" />
                    <Text style={styles.contactInfoText}>{expandedCustomer.phone}</Text>
                  </View>
                  <View style={styles.contactInfoItem}>
                    <Mail size={16} color="#6B7280" />
                    <Text style={styles.contactInfoText}>{expandedCustomer.email}</Text>
                  </View>
                  <View style={styles.contactInfoItem}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.contactInfoText}>{expandedCustomer.address}, {expandedCustomer.city}</Text>
                  </View>
                </View>
              </View>

              {/* Existing Tasks */}
              <View style={styles.simpleSection}>
                <Text style={styles.simpleSectionTitle}>Tasks ({expandedCustomer.tasks.length})</Text>
                <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
                  {expandedCustomer.tasks.map((task) => (
                    <View key={task.id} style={styles.simpleTaskCard}>
                      <View style={styles.simpleTaskHeader}>
                        <Text style={styles.simpleTaskTitle}>{task.title}</Text>
                        <View style={[styles.simplePriorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
                          <Text style={[styles.simplePriorityBadgeText, { color: getPriorityColor(task.priority) }]}>
                            {task.priority}
                          </Text>
                        </View>
                      </View>
                      {task.description ? <Text style={styles.simpleTaskDescription}>{task.description}</Text> : null}
                      <View style={styles.simpleTaskFooter}>
                        <Text style={styles.simpleTaskDate}>
                          {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}
                        </Text>
                        <View style={styles.simpleTaskStatus}>
                          {task.status === 'completed' ? (
                            <CheckCircle size={14} color="#10B981" />
                          ) : (
                            <Clock size={14} color="#F59E0B" />
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* Existing Reminders */}
              <View style={styles.simpleSection}>
                <Text style={styles.simpleSectionTitle}>Reminders ({expandedCustomer.reminders.length})</Text>
                <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
                  {expandedCustomer.reminders.map((reminder) => (
                    <View key={reminder.id} style={styles.simpleReminderCard}>
                      <View style={styles.simpleReminderHeader}>
                        <Text style={styles.simpleReminderTitle}>{reminder.title}</Text>
                        <View style={styles.simpleReminderType}>
                          <Text style={styles.simpleReminderTypeText}>{reminder.type}</Text>
                        </View>
                      </View>
                      {reminder.description ? <Text style={styles.simpleReminderDescription}>{reminder.description}</Text> : null}
                      <Text style={styles.simpleReminderDate}>
                        {new Date(reminder.reminderDate).toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
                  </View>

          {/* Bottom Status Change Section */}
          <View style={[styles.statusChangeSection, isDesktop && styles.statusChangeSectionDesktop]}>
            <View style={styles.statusChangeHeader}>
              <Text style={styles.statusChangeTitle}>Customer Status</Text>
              <TouchableOpacity
                style={styles.editStatusButton}
                onPress={() => setEditingStatus(!editingStatus)}
              >
                {editingStatus ? (
                  <Save size={20} color="#2563EB" />
                ) : (
                  <Edit3 size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
            
            {editingStatus ? (
              <View style={styles.statusButtons}>
                {['active', 'pending', 'inactive'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      { backgroundColor: getStatusBgColor(status) },
                      expandedCustomer.status === status && styles.statusButtonActive
                    ]}
                    onPress={() => handleStatusChange(status as any)}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      { color: getStatusColor(status) }
                    ]}>
                      {status.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.simpleCurrentStatus}>
                <Text style={styles.currentStatusLabel}>Current Status:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(expandedCustomer.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(expandedCustomer.status) }]}>
                    {expandedCustomer.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customers</Text>
        <TouchableOpacity style={styles.addCustomerButton}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, filterVisible && styles.filterButtonActive]}
          onPress={() => setFilterVisible(!filterVisible)}
        >
          <Filter size={20} color={filterVisible ? "#FFFFFF" : "#6B7280"} />
        </TouchableOpacity>
      </View>

      {/* Filter Options */}
      {filterVisible && (
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'distributor', 'corporate', 'retailer'].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterOption,
                  selectedCategory === category && styles.filterOptionActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedCategory === category && styles.filterOptionTextActive
                ]}>
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Customer List */}
      <ScrollView style={styles.customerList}>
        <View style={isDesktop ? styles.desktopGrid : undefined}>
          {filteredCustomers.map((customer) => (
            <View key={customer.id} style={[styles.customerCard, isDesktop && styles.desktopCard]}>
              <View style={styles.customerCardHeader}>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  <Text style={styles.companyName}>{customer.company}</Text>
                  <View style={styles.categoryContainer}>
                    <View style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryBgColor(customer.category) }
                    ]}>
                      <Text style={[
                        styles.categoryText,
                        { color: getCategoryColor(customer.category) }
                      ]}>
                        {customer.category.toUpperCase()}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusBgColor(customer.status) }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(customer.status) }
                      ]}>
                        {customer.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.expandButton}
                  onPress={() => handleExpandCustomer(customer)}
                >
                  <ChevronRight size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.contactInfo}>
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => handleCall(customer.phone)}
                >
                  <Phone size={16} color="#2563EB" />
                  <Text style={styles.contactText}>{customer.phone}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => handleEmail(customer.email)}
                >
                  <Mail size={16} color="#059669" />
                  <Text style={styles.contactText}>{customer.email}</Text>
                </TouchableOpacity>
                
                <View style={styles.contactItem}>
                  <MapPin size={16} color="#F97316" />
                  <Text style={styles.contactText}>{customer.address}, {customer.city}</Text>
                </View>
              </View>

              <View style={styles.customerFooter}>
                <Text style={styles.footerText}>
                  Last Contact: {new Date(customer.lastContact).toLocaleDateString()}
                </Text>
                <Text style={styles.footerText}>
                  Total Orders: {customer.totalOrders}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {renderExpandedView()}
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
  addCustomerButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterOptionActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
  },
  customerList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mobileList: {
    // Default mobile layout
  },
  desktopGrid: {
    ...(isDesktop && {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }),
  },
  customerCard: {
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
  desktopCard: {
    ...(isDesktop && {
      width: '48%',
      marginBottom: 16,
    }),
  },
  customerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  expandButton: {
    padding: 4,
  },
  contactInfo: {
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  customerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  // Expanded View Styles
  expandedContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  expandedContainerDesktop: {
    maxWidth: isDesktop ? 1200 : undefined,
    alignSelf: 'center',
    width: '100%',
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  expandedTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  customerInfoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  customerDetails: {
    flex: 1,
  },
  customerNameLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  companyNameLarge: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  simpleBadgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  quickContactActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickContactText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
  mainContentDesktop: {
    flexDirection: 'row',
    gap: 16,
  },
  leftPanel: {
    flex: 1,
  },
  leftPanelDesktop: {
    flex: 0.4,
  },
  rightPanel: {
    flex: 1,
  },
  rightPanelDesktop: {
    flex: 0.6,
  },
  simpleSection: {
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
  simpleSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  simpleInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  simpleTextArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  simpleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  simplePriorityButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  simplePriorityButtonActive: {
    backgroundColor: '#F3F4F6',
  },
  simplePriorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  simpleTypeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  simpleTypeButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  simpleTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  simpleTypeTextActive: {
    color: '#FFFFFF',
  },
  simpleAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  simpleAddButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  contactInfoGrid: {
    gap: 8,
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactInfoText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  itemsList: {
    maxHeight: 200,
  },
  simpleTaskCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  simpleTaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  simpleTaskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  simplePriorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  simplePriorityBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  simpleTaskDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  simpleTaskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  simpleTaskDate: {
    fontSize: 11,
    color: '#6B7280',
  },
  simpleTaskStatus: {
    // Just the icon
  },
  simpleReminderCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  simpleReminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  simpleReminderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  simpleReminderType: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
  },
  simpleReminderTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  simpleReminderDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  simpleReminderDate: {
    fontSize: 11,
    color: '#6B7280',
  },
  statusChangeSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusChangeSectionDesktop: {
    marginHorizontal: 16,
  },
  statusChangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusChangeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  editStatusButton: {
    padding: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statusButtonActive: {
    borderColor: '#2563EB',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  simpleCurrentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentStatusLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
});
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  existingTasksSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDueDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskStatusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Reminders Tab Styles
  remindersContent: {
    gap: 20,
  },
  addReminderSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  typeButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  existingRemindersSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  reminderType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTypeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginLeft: 4,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  reminderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  reminderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderStatusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Status Change Section
  statusChangeSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusChangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusChangeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  editStatusButton: {
    padding: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statusButtonActive: {
    borderColor: '#2563EB',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  currentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentStatusLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
});