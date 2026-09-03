export type UserRole = 'reader' | 'author' | 'admin';

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type BookStatus = 'draft' | 'published' | 'unpublished';

export interface Book {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  genre: string;
  status: BookStatus;
  price: number;
  currency: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  book_id: string;
  title: string;
  chapter_number: number;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type PurchaseStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Purchase {
  id: string;
  reader_id: string;
  book_id: string;
  payment_provider: string;
  payment_transaction_id: string;
  amount: number;
  currency: string;
  platform_fee: number;
  processing_fee: number;
  author_royalty: number;
  status: PurchaseStatus;
  purchased_at: string;
}

export type EarningStatus = 'pending' | 'available' | 'paid' | 'reversed';

export interface AuthorEarning {
  id: string;
  author_id: string;
  purchase_id: string;
  gross_amount: number;
  platform_fee: number;
  processing_fee: number;
  royalty_amount: number;
  status: EarningStatus;
  created_at: string;
}

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'reversed';

export interface Payout {
  id: string;
  author_id: string;
  amount: number;
  currency: string;
  payment_provider: string;
  provider_payout_id: string | null;
  status: PayoutStatus;
  created_at: string;
  completed_at: string | null;
}

export interface ReadingProgress {
  id: string;
  reader_id: string;
  book_id: string;
  chapter_id: string;
  progress: number;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  reader_id: string;
  book_id: string;
  chapter_id: string;
  position: number;
  created_at: string;
}
