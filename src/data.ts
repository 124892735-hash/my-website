import { Work } from './types';

// 这里就是你的“数据库”！
// 以后你想添加新视频，只需要在这里按照格式复制粘贴一段就行了。
export const worksData: Work[] = [
  {
    id: '1',
    title: '共和国没有开闸',
    category: '故事片',
    // 如果你不想自己找封面，直接把 coverUrl 删掉或者留空，网页会自动显示B站的播放器！
    coverUrl: '', 
    videoUrl: 'https://www.xinpianchang.com/a12569641?searchKw=%E5%85%B1%E5%92%8C%E5%9B%BD%E6%B2%A1%E6%9C%89%E5%BC%80%E9%97%B8&from=search_post', // 支持B站、YouTube或MP4直链
    description: '这是我的第一个示例作品，因为没有填封面，所以直接显示了B站播放器。',
    resolution: '4K',
    duration: '11:30',
    ownerId: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '星星酒店形象片',
    category: 'TVC广告',
    coverUrl: '',
    videoUrl: 'https://www.bilibili.com/video/BV1WdqFBvE7g/?spm_id_from=333.1387.homepage.video_card.click',
    description: '主要负责项目的剪辑和声音设计',
    resolution: '3840P',
    duration: '03:45',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString() // 昨天的日期
  }
];
