export type Category = '故事片' | '企业宣传片' | 'TVC广告' | '地产广告' | '电商广告' | 'MG动画' | 'Ai视频';

export interface Work {
  id: string;
  title: string;
  category: Category;
  coverUrl: string;
  videoUrl?: string;
  description?: string;
  resolution?: string;
  duration?: string;
  createdAt: any; // Firestore Timestamp
  ownerId: string;
}
