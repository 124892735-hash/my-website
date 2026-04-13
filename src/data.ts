import { Work } from './types';

// ==========================================
// 1. 个人简介设置
// 在这里修改你的网站标题、名字和简介文字
// ==========================================
export const profileData = {
  name: "梁静 (Silva)",
  title: "专业剪辑师",
  heroTitleLine1: "Visual",
  heroTitleLine2: "Narrative.",
  description: "创意视觉叙事。涵盖故事片、TVC、企业宣传片等多元领域，用镜头捕捉真实，用光影传递情感，精准传达核心价值观。",
  phone: "185-0301-5519",
  email: "124892735@qq.com"
};

// ==========================================
// 2. 作品列表设置
// 以后你想添加新视频，只需要在这里按照格式复制粘贴一段就行了。
// ==========================================
export const worksData: Work[] = [
  {
    id: '1',
    title: '我的第一支TVC广告',
    category: 'TVC广告',
    // 如果你不想自己找封面，直接把 coverUrl 删掉或者留空，网页会自动显示B站的播放器！
    coverUrl: '', 
    videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h7', // 支持B站、YouTube或MP4直链
    description: '这是我的第一个示例作品，因为没有填封面，所以直接显示了B站播放器。',
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
