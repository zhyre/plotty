import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../services/supabase/client';
import { Colors, Spacing, Typography, BorderRadius, FontWeights } from '../constants/theme';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Required', 'Please enter your email and password');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigation.navigate('ReaderTabs');
    } catch (error: any) {
      Alert.alert('Unable to sign in', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>Plotty</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Your stories are waiting</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Text>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>
              New to Plotty?{' '}
              <Text
                style={styles.linkHighlight}
                onPress={() => navigation.navigate('Register')}
              >
                Create an account
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: Spacing.xxxl,
  },
  brand: {
    fontSize: Typography.base,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.display,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    lineHeight: Typography.relaxed,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 52,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 0,
    fontSize: Typography.base,
    color: Colors.text,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: Typography.base,
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.5,
  },
  linkContainer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    textAlign: 'center',
  },
  linkHighlight: {
    color: Colors.primary,
    fontSize: Typography.base,
    fontWeight: FontWeights.semibold,
  },
});
