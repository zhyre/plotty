import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';

import { Colors } from '../constants/theme';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AuthorDashboard from '../screens/AuthorDashboard';
import CreateBook from '../screens/CreateBook';
import ChapterManagement from '../screens/ChapterManagement';
import EditChapter from '../screens/EditChapter';

// Placeholder screens for reader tabs
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
    <Text>Home - Coming Soon</Text>
  </View>
);

const SearchScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
    <Text>Search - Coming Soon</Text>
  </View>
);

const LibraryScreen = ({ navigation }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: Colors.text }}>Library</Text>
    <Text style={{ fontSize: 16, color: Colors.textLight, marginBottom: 20 }}>Your purchased books</Text>
    <TouchableOpacity 
      onPress={() => navigation.navigate('AuthorDashboard')}
      style={{ backgroundColor: Colors.primary, padding: 15, borderRadius: 8 }}
    >
      <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>Author Dashboard</Text>
    </TouchableOpacity>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: Colors.text }}>Profile</Text>
    <Text style={{ fontSize: 16, color: Colors.textLight }}>User profile coming soon</Text>
  </View>
);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ReaderTabs({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen 
        name="Create" 
        component={() => <View />}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: Colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -25,
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text style={{ fontSize: 32, color: '#ffffff', fontWeight: 'bold', lineHeight: 32 }}>+</Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('AuthorDashboard');
          },
        })}
      />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ReaderTabs" component={ReaderTabs} />
        <Stack.Screen name="AuthorDashboard" component={AuthorDashboard} />
        <Stack.Screen name="CreateBook" component={CreateBook} />
        <Stack.Screen name="ChapterManagement" component={ChapterManagement} />
        <Stack.Screen name="EditChapter" component={EditChapter} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
