const BACKEND_BASE = 'http://localhost:8080';

export const CATEGORY_PLACEHOLDERS = {
  ELECTRONICS: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
  WALLETS_CARDS: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
  KEYS: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
  BAGS_BACKPACKS: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
  CLOTHING_ACCESSORIES: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
  BOOKS_STATIONERY: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  OTHER: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
};

/**
 * Resolves an item image URL supporting both `item.imageUrl` and `item.image`,
 * relative `/uploads/` paths, absolute CDN URLs, or category fallback.
 */
export const getItemImageUrl = (item, fallbackToCategory = false) => {
  if (!item) return fallbackToCategory ? CATEGORY_PLACEHOLDERS.OTHER : null;
  const rawUrl = item.imageUrl || item.image;
  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim() !== '') {
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('data:')) {
      return rawUrl;
    }
    if (rawUrl.startsWith('/uploads/')) {
      return `${BACKEND_BASE}${rawUrl}`;
    }
    if (rawUrl.startsWith('uploads/')) {
      return `${BACKEND_BASE}/${rawUrl}`;
    }
    return rawUrl;
  }
  if (fallbackToCategory) {
    return (item.category && CATEGORY_PLACEHOLDERS[item.category]) ? CATEGORY_PLACEHOLDERS[item.category] : CATEGORY_PLACEHOLDERS.OTHER;
  }
  return null;
};

export default getItemImageUrl;

