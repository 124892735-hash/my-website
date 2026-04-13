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

// 统一的专业封面图（带有美感设计感的抽象暗调流体/光影背景）
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';

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
    coverUrl: DEFAULT_COVER, 
    videoUrl: 'https://www.bilibili.com/video/BV1F8nhzdEtL/',
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
    coverUrl: DEFAULT_COVER,
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
    coverUrl: DEFAULT_COVER,
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
    coverUrl: DEFAULT_COVER,
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
    coverUrl: DEFAULT_COVER,
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
    coverUrl: DEFAULT_COVER,
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
    coverUrl: DEFAULT_COVER,
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
    coverUrl: DEFAULT_COVER,
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
    coverUrl: DEFAULT_COVER,
    videoUrl: 'https://www.bilibili.com/video/BV18onGzsEpS/',
    description: '主要负责剪辑和声音设计,参与脚本创意设计',
    resolution: '4k',
    duration: '03:42',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '10',
    title: '万科红树湾招商片',
    category: '地产广告',
    coverUrl: DEFAULT_COVER,
    videoUrl: 'https://www.bilibili.com/video/BV1DonGzsEM2/',
    description: '主要负责剪辑和声音设计,参与脚本创意设计',
    resolution: '4k',
    duration: '04:53',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '11',
    title: '物联网',
    category: 'MG动画',
    coverUrl: DEFAULT_COVER,
    videoUrl: 'https://www.bilibili.com/video/BV1ZYnhzXEqe/',
    description: '负责项目的整体把控,分镜设计以及与包装同事对接,自己剪辑和音效设计',
    resolution: '4k',
    duration: '01:39',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '12',
    title: '顺风内部app',
    category: 'MG动画',
    coverUrl: DEFAULT_COVER,
    videoUrl: 'https://www.bilibili.com/video/BV1FPEjeiEff/',
    description: '负责项目的整体把控,分镜设计以及与平面同事对接,自己剪辑和音效设计',
    resolution: '4k',
    duration: '01:28',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '13',
    title: '华侨城新玺Demo',
    category: 'MG动画',
    coverUrl: DEFAULT_COVER,
    videoUrl: 'https://www.bilibili.com/video/BV1ovnhzHExC/',
    description: '配合投标团队剪辑投标样片,并顺利拿下项目',
    resolution: '4k',
    duration: '01:27',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '14',
    title: '吸沉地垫',
    category: '电商广告',
    coverUrl: DEFAULT_COVER,
    videoUrl: 'https://www.bilibili.com/video/BV1RfDJB3ETC/',
    description: '从分镜到拍摄,以及后期剪辑,独立完成全流程',
    resolution: '4k',
    duration: '00:23',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '15',
    title: '可口可乐',
    category: 'Ai视频',
    coverUrl: DEFAULT_COVER,
    videoUrl: 'https://www.bilibili.com/video/BV15fDJBGEde/',
    description: '完全独立完成所有画面以及剪辑等工作',
    resolution: '2k',
    duration: '00:21',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '16',
    title: '三合一充电器',
    category: '电商广告',
    coverUrl: DEFAULT_COVER,
    videoUrl: 'https://www.bilibili.com/video/BV1eozsBZEqT/',
    description: '完全自主搜集产品素材,配合ai写文案,完成剪辑和声音制作',
    resolution: '4k',
    duration: '00:26',
    ownerId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
];
