export const LOCAL_CATEGORY_IMAGES = {
  ELECTRONICS: '/uploads/demo-macbook.jpg',
  WALLETS_CARDS: '/uploads/demo-wallet.jpg',
  KEYS: '/uploads/demo-keys.jpg',
  BAGS_BACKPACKS: '/uploads/demo-macbook.jpg',
  CLOTHING_ACCESSORIES: '/uploads/demo-wallet.jpg',
  BOOKS_STATIONERY: '/uploads/demo-bottle.jpg',
  OTHER: '/uploads/demo-bottle.jpg',
};

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
 * Resolves an item image URL supporting relative `/uploads/` paths,
 * absolute CDN URLs, and fallback to local asset or category image.
 */
export const getItemImageUrl = (item, fallbackToCategory = true) => {
  if (!item) {
    return fallbackToCategory ? (LOCAL_CATEGORY_IMAGES.OTHER || '/uploads/demo-bottle.jpg') : null;
  }

  const rawUrl = item.imageUrl || item.image;
  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim() !== '') {
    const trimmed = rawUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
      return trimmed;
    }
    if (trimmed.startsWith('/uploads/')) {
      return trimmed;
    }
    if (trimmed.startsWith('uploads/')) {
      return `/${trimmed}`;
    }
    return trimmed;
  }

  if (fallbackToCategory) {
    const cat = item.category?.toUpperCase() || 'OTHER';
    return LOCAL_CATEGORY_IMAGES[cat] || CATEGORY_PLACEHOLDERS[cat] || '/uploads/demo-bottle.jpg';
  }

  return null;
};

export default getItemImageUrl;
