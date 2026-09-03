import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../services/supabase/client';
import { Colors, Spacing, Typography, BorderRadius, FontWeights } from '../constants/theme';

export default function EditChapter({ route, navigation }: any) {
  const { chapterId, bookId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const applyFormat = (format: string) => {
    const { start, end } = selection;
    if (start === end) {
      const newContent = content.slice(0, start) + format + format + content.slice(end);
      setContent(newContent);
      setSelection({ start: start + format.length, end: start + format.length });
    } else {
      const selectedText = content.slice(start, end);
      const newContent = content.slice(0, start) + format + selectedText + format + content.slice(end);
      setContent(newContent);
      setSelection({ start: start + format.length, end: end + format.length });
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please give your chapter a title');
      return;
    }

    setSaving(true);
    try {
      const wordCount = content.trim().split(/\s+/).filter((word: string) => word.length > 0).length;

      const { error } = await supabase
        .from('chapters')
        .update({
          title: title.trim(),
          content: content.trim(),
          word_count: wordCount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', chapterId);

      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Unable to save', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Required', 'Please add a title and content before publishing');
      return;
    }

    setSaving(true);
    try {
      const wordCount = content.trim().split(/\s+/).filter((word: string) => word.length > 0).length;

      const { error } = await supabase
        .from('chapters')
        .update({
          title: title.trim(),
          content: content.trim(),
          word_count: wordCount,
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', chapterId);

      if (error) throw error;
      Alert.alert('Published', 'Your chapter is now live');
    } catch (error: any) {
      Alert.alert('Unable to publish', error.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchChapter();
  }, [chapterId]);

  const fetchChapter = async () => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', chapterId)
        .single();

      if (error) throw error;
      setTitle(data.title);
      setContent(data.content);
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={handleSave} 
            disabled={saving}
            style={styles.headerAction}
          >
            <Text style={styles.headerActionText}>{saving ? '...' : 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handlePublish} 
            disabled={saving}
            style={styles.headerAction}
          >
            <Text style={styles.headerActionText}>Publish</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <View style={styles.editor}>
            <TextInput
              style={styles.titleInput}
              placeholder="Chapter title"
              placeholderTextColor={Colors.textTertiary}
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.formattingBar}>
              <TouchableOpacity
                style={styles.formatButton}
                onPress={() => applyFormat('**')}
                activeOpacity={0.7}
              >
                <Text style={styles.formatButtonText}>B</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.formatButton}
                onPress={() => applyFormat('*')}
                activeOpacity={0.7}
              >
                <Text style={[styles.formatButtonText, styles.italicText]}>I</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.formatButton}
                onPress={() => applyFormat('_')}
                activeOpacity={0.7}
              >
                <Text style={[styles.formatButtonText, styles.underlineText]}>U</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.formatButton}
                onPress={() => setShowFontMenu(!showFontMenu)}
                activeOpacity={0.7}
              >
                <Text style={styles.formatButtonText}>Aa</Text>
              </TouchableOpacity>
              
              {showFontMenu && (
                <View style={styles.fontMenu}>
                  {[14, 16, 18, 20, 22].map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[styles.fontOption, fontSize === size && styles.fontOptionActive]}
                      onPress={() => {
                        setFontSize(size);
                        setShowFontMenu(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.fontOptionText, { fontSize: size }]}>Aa</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <TextInput
              style={[styles.contentInput, { fontSize }]}
              placeholder="Begin your story..."
              placeholderTextColor={Colors.textTertiary}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
            />

            <Text style={styles.wordCount}>
              {content.trim().split(/\s+/).filter(word => word.length > 0).length} words
            </Text>
          </View>
        )}
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
  headerButton: {
    width: 40,
  },
  headerButtonText: {
    fontSize: 28,
    color: Colors.text,
    fontWeight: FontWeights.semibold,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  headerAction: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  headerActionText: {
    fontSize: Typography.base,
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: Spacing.xxxl,
  },
  editor: {
    padding: Spacing.xl,
  },
  titleInput: {
    fontSize: Typography.xxl,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  formattingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  formatButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formatButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: FontWeights.semibold,
  },
  italicText: {
    fontStyle: 'italic',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  fontMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  fontOption: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  fontOptionActive: {
    backgroundColor: Colors.primary,
  },
  fontOptionText: {
    color: Colors.text,
  },
  contentInput: {
    minHeight: 400,
    fontSize: Typography.base,
    color: Colors.text,
    lineHeight: Typography.relaxed,
    textAlignVertical: 'top',
  },
  wordCount: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    marginTop: Spacing.lg,
    textAlign: 'right',
  },
});
