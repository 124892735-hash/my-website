import { Work } from './types';

// 这里就是你的“数据库”！
// 以后你想添加新视频，只需要在这里按照格式复制粘贴一段就行了。
export const worksData: Work[] = [
  {
    id: '1',
    title: '我的第一支TVC广告',
    category: 'TVC广告',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h7', // 支持B站、YouTube或MP4直链
    description: '这是我的第一个示例作品，展示了出色的视觉效果。',
    resolution: '4K',
    duration: '01:30',
    ownerId: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '企业宣传片示例',
    category: '企业宣传片',
    coverUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2600&auto=format&fit=crop',
    videoUrl: 'https://www.bilibili.com/video/BV1xx411c7mD',
    description: '为某科技公司制作的年度宣传片。',
    resolution: '1080P',
    duration: '03:45',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString() // 昨天的日期
  }
];
