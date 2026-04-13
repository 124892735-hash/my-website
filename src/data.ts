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
  description: "
经验丰富：涉及多种影片类型：企宣片、广告片、采访片、地产片、各类展厅影片等。
抗压力强：一直在乙方摩擦历练，练就了一身抗压力。
认真负责：一直以来同事及领导乃至客户对我的一致评价，也是我觉得在工作中应该有的态度。
包容性强：非常愿意接受新鲜事物，愿意听取有建设性的意见。
服务客户：各政府部门、顺丰、腾讯、中兴、深大、招商银行、华侨城集团、华润、中交、中建等。",
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
