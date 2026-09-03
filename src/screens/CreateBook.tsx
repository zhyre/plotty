import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../services/supabase/client';
import { Colors, Spacing, Typography, BorderRadius, FontWeights } from '../constants/theme';

export default function CreateBook({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateBook = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please give your story a title');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('books')
        .insert({
          author_id: user.id,
          title: title.trim(),
          description: description.trim(),
          genre: genre.trim(),
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      Alert.alert('Story created', `"${title}" is ready for your first chapter`, [
        { text: 'Start writing', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Unable to create story', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New story</Text>
        <TouchableOpacity 
          onPress={handleCreateBook} 
          disabled={!title.trim() || loading}
          style={[styles.doneButton, (!title.trim() || loading) && styles.doneButtonDisabled]}
        >
          <Text style={styles.doneButtonText}>{loading ? '...' : 'Done'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Story details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Your story title"
              placeholderTextColor={Colors.textTertiary}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What's your story about?"
              placeholderTextColor={Colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Genre</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Romance, Fantasy, Mystery"
              placeholderTextColor={Colors.textTertiary}
              value={genre}
              onChangeText={setGenre}
            />
          </View>
        </View>

        <View style={styles.tip}>
          <Text style={styles.tipText}>💡 You can always edit these details later</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: Spacing.xl * 4,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 60,
  },
  backButtonText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  doneButton: {
    width: 60,
    alignItems: 'flex-end',
  },
  doneButtonDisabled: {
    opacity: 0.4,
  },
  doneButtonText: {
    fontSize: Typography.base,
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textTertiary,
    marginBottom: Spacing.xl,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  input: {
    fontSize: Typography.base,
    color: Colors.text,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  textArea: {
    minHeight: 100,
    paddingTop: Spacing.sm,
  },
  tip: {
    margin: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
  },
  tipText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
