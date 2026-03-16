export type ResumeLocale = 'zh' | 'en'

type SectionTitles = {
  research: string
  publications: string
  work: string
  projects: string
  awards: string
  skills: string
  education: string
}

type StatItem = {
  label: string
  value: string
}

type ResumeProfile = {
  localeLabel: string
  langSwitchLabel: string
  currentLangLabel: string
  name: string
  nativeName?: string
  title: string
  location: string
  email: string
  intro: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  heroImage: string
  sectionTitles: SectionTitles
  stats: StatItem[]
  expertise: string[]
  alumni: string[]
  sameAs: string[]
}

export const resumeProfiles: Record<ResumeLocale, ResumeProfile> = {
  zh: {
    localeLabel: 'English',
    langSwitchLabel: '/en',
    currentLangLabel: '中文',
    name: 'JiaXuan Yu',
    nativeName: '余嘉軒',
    title: 'Applied AI Researcher｜Diffusion Models · LLM · Multimodal Systems',
    location: 'Taiwan',
    email: 'cplyuef357[at]gmail.com',
    intro:
      '以生成式 AI 與應用研究為核心，具備模型研發、實驗設計、系統部署與產品落地的完整經驗。',
    seoTitle: '余嘉軒 JiaXuan Yu｜Applied AI Researcher',
    seoDescription:
      '余嘉軒（JiaXuan Yu）履歷：Applied AI Research、Diffusion Models、LLM Agent、Multimodal Generation、MLOps 與系統落地經驗。',
    seoKeywords: [
      '余嘉軒',
      'JiaXuan Yu',
      'Applied AI Researcher',
      'Diffusion Models',
      'LLM Agent',
      'Multimodal Generation',
      'AI Engineer Taiwan',
      'MLOps'
    ],
    heroImage: '/images/headshot.jpg',
    sectionTitles: {
      research: '研究興趣',
      publications: '研究成果與論文',
      work: '研究與工作經歷',
      projects: '專案成就',
      awards: '競賽與獎項',
      skills: '專長技能',
      education: '學歷'
    },
    stats: [
      { label: '競賽排名', value: 'KDD Cup #13/#20' },
      { label: '研究效能提升', value: 'FID/FVD +30%' },
      { label: '流程效率提升', value: 'Automation +50%' }
    ],
    expertise: [
      'Diffusion Models',
      'LLM & Agent Systems',
      'RAG',
      'Multimodal Generation',
      'Model Optimization',
      'Applied AI Engineering'
    ],
    alumni: ['國立中興大學'],
    sameAs: ['https://github.com/cvecve147']
  },
  en: {
    localeLabel: '中文',
    langSwitchLabel: '/',
    currentLangLabel: 'English',
    name: 'JiaXuan Yu',
    title: 'Applied AI Researcher | Diffusion Models · LLM · Multimodal Systems',
    location: 'Taiwan',
    email: 'cplyuef357[at]gmail.com',
    intro:
      'Focused on applied generative AI research across model design, experimentation, and production deployment.',
    seoTitle: 'JiaXuan Yu | Applied AI Researcher Resume',
    seoDescription:
      'Resume of JiaXuan Yu: applied AI research, diffusion models, LLM agents, multimodal generation, MLOps, and product-oriented implementation.',
    seoKeywords: [
      'JiaXuan Yu',
      'Applied AI Researcher',
      'Diffusion Models',
      'LLM Agent',
      'Multimodal AI',
      'AI Engineer',
      'MLOps',
      'Taiwan'
    ],
    heroImage: '/images/headshot.jpg',
    sectionTitles: {
      research: 'Research Interests',
      publications: 'Publications',
      work: 'Research & Work',
      projects: 'Projects',
      awards: 'Competitions & Awards',
      skills: 'Skills',
      education: 'Education'
    },
    stats: [
      { label: 'Competition Results', value: 'KDD Cup #13/#20' },
      { label: 'Research Improvement', value: 'FID/FVD +30%' },
      { label: 'Automation Gain', value: 'Workflow +50%' }
    ],
    expertise: [
      'Diffusion Models',
      'LLM & Agent Systems',
      'RAG',
      'Multimodal Generation',
      'Model Optimization',
      'Applied AI Engineering'
    ],
    alumni: ['National Chung Hsing University'],
    sameAs: ['https://github.com/cvecve147']
  }
}
