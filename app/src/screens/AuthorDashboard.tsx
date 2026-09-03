import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, ActivityIndicator, Dimensions, TextInput } from 'react-native';
import { supabase } from '../services/supabase/client';
import { Colors, Spacing, Typography, BorderRadius, FontWeights } from '../constants/theme';

interface Book {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
}

export default function AuthorDashboard({ navigation }: any) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'published'>('all');
  
  const screenWidth = Dimensions.get('window').width;
  const numColumns = screenWidth < 400 ? 3 : screenWidth < 600 ? 4 : screenWidth < 800 ? 5 : 6;
  const itemWidth = (screenWidth - (Spacing.xl * 2) - (Spacing.md * (numColumns - 1))) / numColumns;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return Colors.success;
      case 'draft': return Colors.warning;
      case 'archived': return Colors.textTertiary;
      default: return Colors.textTertiary;
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || book.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>For the girlies ahhh</Text>
          <Text style={styles.subtitle}>{books.length} {books.length === 1 ? 'story' : 'stories'}</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateBook')}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>✎</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search stories..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'draft' && styles.tabActive]}
            onPress={() => setActiveTab('draft')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'draft' && styles.tabTextActive]}>Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'published' && styles.tabActive]}
            onPress={() => setActiveTab('published')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'published' && styles.tabTextActive]}>Published</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : filteredBooks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No stories found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try a different search term' : activeTab === 'all' ? 'Your first story awaits' : `No ${activeTab} stories yet`}
            </Text>
          </View>
        ) : (
          <View style={styles.booksGrid}>
            {filteredBooks.map((book) => (
              <TouchableOpacity
                key={book.id}
                style={[styles.bookItem, { width: itemWidth }]}
                onPress={() => navigation.navigate('ChapterManagement', { bookId: book.id })}
                activeOpacity={0.7}
              >
                <View style={styles.bookCover}>
                  {book.cover_url ? (
                    <Image source={{ uri: book.cover_url }} style={styles.coverImage} />
                  ) : (
                    <View style={styles.placeholderCover}>
                      <Text style={styles.placeholderText}>{book.title.charAt(0)}</Text>
                    </View>
                  )}
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(book.status) }]} />
                </View>
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: Spacing.xl * 4,
    backgroundColor: Colors.background,
  },
  greeting: {
    fontSize: Typography.display,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: FontWeights.semibold,
  },
  controls: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  searchContainer: {
    marginBottom: Spacing.md,
  },
  searchInput: {
    height: 44,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.base,
    color: Colors.text,
  },
  tabs: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
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
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: Spacing.md,
  },
  bookItem: {
    marginBottom: Spacing.lg,
  },
  bookCover: {
    aspectRatio: 2/3,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  placeholderText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: FontWeights.bold,
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bookTitle: {
    fontSize: Typography.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    lineHeight: Typography.normal,
  },
});
