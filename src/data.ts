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
  description: "创意视觉叙事。主题故事片、TVC、企业宣传片等多元领域，用镜头捕捉真实，用光影传递情感，精准传递核心价值观",
  phone: "185-0301-5519",
  email: "124892735@qq.com"
};

// ==========================================
// 2. 作品列表设置
// 以后你想添加新视频，只需要在这里按照格式复制粘贴一段就行了。
// 
// 【关于项目类型 (category)】
// 请务必从以下类型中复制一个填入，否则网页分类可能无法识别：
// '故事片' | '企业宣传片' | 'TVC广告' | '地产广告' | '电商广告' | 'MG动画' | 'Ai视频'
// ==========================================
export const worksData: Work[] = [
  {
    id: '1',
    title: '共和国没有开闸',
    category: '故事片',
    // 新片场不支持纯净嵌入，所以我帮你配了一张默认封面。点击会直接在新标签页打开高清原片。
    coverUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2659&auto=format&fit=crop', 
    videoUrl: 'https://www.xinpianchang.com/a12569641?searchKw=%E5%85%B1%E5%92%8C%E5%9B%BD%E6%B2%A1%E6%9C%89%E5%BC%80%E9%97%B8&from=search_post',
    description: '主要负责剪辑和声音设计,参与前期脚本创意和部分镜头创意',
    resolution: '4K',
    duration: '11:22',
    ownerId: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '广西桂物宣传片',
    category: '企业宣传片',
    coverUrl: '',
    videoUrl: 'https://www.bilibili.com/video/BV17vnhzpEEi/',
    description: '主要负责剪辑和声音设计',
    resolution: '4k',
    duration: '06:02',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    title: '平潭大练岛宣传片',
    category: '企业宣传片',
    coverUrl: '',
    videoUrl: 'https://www.bilibili.com/video/BV18onGzsEiU/',
    description: '负责整体项目进度和项目质量,对接客户需求与制作团队,并且负责影片剪辑和声音设计',
    resolution: '4k',
    duration: '03:38',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '4',
    title: '天津比亚迪tvc',
    category: 'TVC广告',
    coverUrl: '',
    videoUrl: 'https://www.bilibili.com/video/BV1ovnhzHE2E/',
    description: '主要负责剪辑和声音设计',
    resolution: '4k',
    duration: '02:10',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '5',
    title: '沙漠星星酒店',
    category: 'TVC广告',
    coverUrl: '',
    videoUrl: 'https://www.bilibili.com/video/BV1WdqFBvE7g/',
    description: '主要负责剪辑和声音设计',
    resolution: '4k',
    duration: '03:26',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '6',
    title: '深理工校招片',
    category: 'TVC广告',
    coverUrl: '',
    videoUrl: 'https://www.bilibili.com/video/BV1ovnhzHEkf/',
    description: '主要负责剪辑和声音设计',
    resolution: '4k',
    duration: '03:05',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '7',
    title: '深圳公共建筑预热片',
    category: '地产广告',
    coverUrl: '',
    videoUrl: 'https://www.bilibili.com/video/BV18onGzsEEH/',
    description: '此影片项目时间特别紧急,在强压力下和团队一起保证影片按时上线,主要负责剪辑和声音设计',
    resolution: '4k',
    duration: '02:22',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '8',
    title: '越秀和樾府',
    category: '地产广告',
    coverUrl: '',
    videoUrl: 'https://www.bilibili.com/video/BV1BYnhz9E8C/',
    description: '主要负责剪辑和声音设计',
    resolution: '4k',
    duration: '01:49',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '9',
    title: '湾流大厦',
    category: '地产广告',
    coverUrl: '',
    videoUrl: 'https://www.bilibili.com/video/BV18onGzsEpS/',
    description: '主要负责剪辑和声音设计,参与脚本创意设计',
    resolution: '4k',
    duration: '03:42',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];
