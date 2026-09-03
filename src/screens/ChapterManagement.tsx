import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase/client';
import { Colors, Spacing, Typography, BorderRadius, FontWeights } from '../constants/theme';

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  word_count: number;
  status: 'draft' | 'published';
  created_at: string;
}

export default function ChapterManagement({ route, navigation }: any) {
  const { bookId } = route.params;
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChapters();
  }, [bookId]);

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('book_id', bookId)
        .order('chapter_number', { ascending: true });

      if (error) throw error;
      setChapters(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async () => {
    try {
      const nextChapterNumber = chapters.length + 1;
      
      const { data, error } = await supabase
        .from('chapters')
        .insert({
          book_id: bookId,
          chapter_number: nextChapterNumber,
          title: `Chapter ${nextChapterNumber}`,
          content: '',
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      navigation.navigate('EditChapter', { chapterId: data.id, bookId });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return Colors.success;
      case 'draft': return Colors.warning;
      default: return Colors.textTertiary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chapters</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddChapter}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : chapters.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No chapters yet</Text>
            <Text style={styles.emptySubtitle}>Start by writing your first chapter</Text>
          </View>
        ) : (
          <View style={styles.chaptersList}>
            {chapters.map((chapter) => (
              <TouchableOpacity
                key={chapter.id}
                style={styles.chapterItem}
                onPress={() => navigation.navigate('EditChapter', { chapterId: chapter.id, bookId })}
                activeOpacity={0.7}
              >
                <View style={styles.chapterHeader}>
                  <View style={styles.chapterNumber}>
                    <Text style={styles.chapterNumberText}>{chapter.chapter_number}</Text>
                  </View>
                  <View style={styles.chapterInfo}>
                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                    <Text style={styles.chapterMeta}>
                      {chapter.word_count} words
                    </Text>
                  </View>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(chapter.status) }]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.xl,
    paddingTop: Spacing.xl * 4,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
  },
  backButtonText: {
    fontSize: 28,
    color: Colors.text,
    fontWeight: FontWeights.semibold,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: FontWeights.bold,
    lineHeight: 28,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.xl,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: Spacing.xxxl,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.xxl,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.relaxed,
  },
  chaptersList: {
    gap: Spacing.md,
  },
  chapterItem: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  chapterNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterNumberText: {
    fontSize: Typography.sm,
    color: '#ffffff',
    fontWeight: FontWeights.semibold,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: Typography.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  chapterMeta: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
