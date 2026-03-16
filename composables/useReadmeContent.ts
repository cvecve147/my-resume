import { computed } from 'vue'
import { marked } from 'marked'
import { type ResumeLocale } from '~/data/resume'
import readmeZhRaw from '~/docs/readme.md?raw'
import readmeEnRaw from '~/docs/readme_en.md?raw'

type SectionBucket = {
  paragraphs: string[]
  subSections: Record<string, string[]>
}

type PublicationItem = {
  title: string
}

type GroupBlock = {
  title: string
  points: string[]
}

type AwardItem = {
  title: string
  detail: string
}

type SkillGroup = {
  title: string
  items: string[]
}

type ReadmeContent = {
  intro: string[]
  researchInterests: string[]
  publications: PublicationItem[]
  workBlocks: GroupBlock[]
  projects: GroupBlock[]
  awards: AwardItem[]
  skillGroups: SkillGroup[]
  education: string[]
}

type SectionKeywords = {
  intro: string[]
  research: string[]
  publications: string[]
  work: string[]
  projects: string[]
  awards: string[]
  skills: string[]
  education: string[]
}

type MarkedToken = {
  type: string
  depth?: number
  text?: string
  items?: Array<{ text?: string }>
}

const normalize = (input: string) => input.replace(/\s+/g, ' ').trim()

const splitLines = (input: string) =>
  input
    .split('\n')
    .map((line) => normalize(line))
    .filter(Boolean)

const SECTION_KEYWORDS: Record<ResumeLocale, SectionKeywords> = {
  zh: {
    intro: ['個人簡介'],
    research: ['研究興趣'],
    publications: ['研究成果', '論文'],
    work: ['工作經歷', '研究與工作'],
    projects: ['專案成就', '專案'],
    awards: ['競賽', '獎項'],
    skills: ['專長', '技能'],
    education: ['學歷']
  },
  en: {
    intro: ['Professional Summary', 'Summary'],
    research: ['Research Interests'],
    publications: ['Publications', 'Research Output'],
    work: ['Work Experience', 'Research & Work'],
    projects: ['Projects'],
    awards: ['Competitions & Awards', 'Awards'],
    skills: ['Skills'],
    education: ['Education']
  }
}

const getSection = (sections: Record<string, SectionBucket>, keywords: string[]) => {
  const matchedKey = Object.keys(sections).find((key) => keywords.some((keyword) => key.includes(keyword)))
  return matchedKey ? sections[matchedKey] : { paragraphs: [], subSections: {} }
}

const groupByNumbering = (lines: string[], fallbackTitle: string): GroupBlock[] => {
  const groups: GroupBlock[] = []
  const titlePattern = /^(?:[（(]?\d+[)）.]\s*|\d+\.\s*)/
  let current: GroupBlock | null = null

  for (const line of lines) {
    if (titlePattern.test(line)) {
      if (current) {
        groups.push(current)
      }

      current = {
        title: normalize(line.replace(titlePattern, '')),
        points: []
      }
      continue
    }

    if (!current) {
      current = {
        title: fallbackTitle,
        points: []
      }
    }

    current.points.push(line)
  }

  if (current) {
    groups.push(current)
  }

  return groups
}

const groupFromSection = (section: SectionBucket, fallbackTitle: string): GroupBlock[] => {
  const fromSubSections = Object.entries(section.subSections).map(([title, paragraphs]) => ({
    title,
    points: paragraphs.flatMap(splitLines)
  }))

  if (fromSubSections.length > 0) {
    return fromSubSections
  }

  return groupByNumbering(section.paragraphs.flatMap(splitLines), fallbackTitle)
}

const pairAwards = (section: SectionBucket): AwardItem[] => {
  const lines = section.paragraphs.flatMap(splitLines)

  if (lines.length > 0) {
    const awards: AwardItem[] = []

    for (let index = 0; index < lines.length; index += 1) {
      const title = lines[index]
      if (!title) {
        continue
      }

      let detail = ''
      const next = lines[index + 1]
      if (next && !next.includes('｜') && !next.includes('|')) {
        detail = next
        index += 1
      }

      awards.push({ title, detail })
    }

    return awards
  }

  return Object.entries(section.subSections).map(([title, paragraphs]) => ({
    title,
    detail: paragraphs.flatMap(splitLines).join(' ')
  }))
}

const parseReadme = (raw: string, locale: ResumeLocale): ReadmeContent => {
  const sections: Record<string, SectionBucket> = {}
  const tokens = marked.lexer(raw) as MarkedToken[]
  const labels = SECTION_KEYWORDS[locale]

  let currentH1 = ''
  let currentH2 = ''

  const ensureSection = (name: string) => {
    if (!sections[name]) {
      sections[name] = {
        paragraphs: [],
        subSections: {}
      }
    }
  }

  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 1 && token.text) {
      currentH1 = normalize(token.text)
      currentH2 = ''
      ensureSection(currentH1)
      continue
    }

    if (token.type === 'heading' && token.depth === 2 && token.text && currentH1) {
      currentH2 = normalize(token.text)
      ensureSection(currentH1)
      if (!sections[currentH1].subSections[currentH2]) {
        sections[currentH1].subSections[currentH2] = []
      }
      continue
    }

    if ((token.type === 'paragraph' || token.type === 'text') && token.text && currentH1) {
      const text = token.text.trim()
      if (!text) {
        continue
      }

      ensureSection(currentH1)
      if (currentH2) {
        sections[currentH1].subSections[currentH2].push(text)
      } else {
        sections[currentH1].paragraphs.push(text)
      }
      continue
    }

    if (token.type === 'list' && token.items && currentH1) {
      const listLines = token.items.map((item) => normalize(item.text || '')).filter(Boolean)

      if (listLines.length === 0) {
        continue
      }

      ensureSection(currentH1)
      if (currentH2) {
        sections[currentH1].subSections[currentH2].push(...listLines)
      } else {
        sections[currentH1].paragraphs.push(...listLines)
      }
    }
  }

  const introSection = getSection(sections, labels.intro)
  const researchSection = getSection(sections, labels.research)
  const publicationSection = getSection(sections, labels.publications)
  const workSection = getSection(sections, labels.work)
  const projectSection = getSection(sections, labels.projects)
  const awardSection = getSection(sections, labels.awards)
  const skillsSection = getSection(sections, labels.skills)
  const educationSection = getSection(sections, labels.education)

  const fallbackWorkTitle = locale === 'en' ? 'Research & Work Highlights' : '研究與工作重點'
  const fallbackProjectTitle = locale === 'en' ? 'Project Highlights' : '專案重點'

  const projects = groupFromSection(projectSection, fallbackProjectTitle)

  const skillGroups: SkillGroup[] = Object.entries(skillsSection.subSections).map(([title, paragraphs]) => ({
    title,
    items: paragraphs.flatMap(splitLines)
  }))

  return {
    intro: introSection.paragraphs.map(normalize).filter(Boolean),
    researchInterests: researchSection.paragraphs.flatMap(splitLines),
    publications: publicationSection.paragraphs.flatMap(splitLines).map((line) => ({ title: line })),
    workBlocks: groupFromSection(workSection, fallbackWorkTitle),
    projects,
    awards: pairAwards(awardSection),
    skillGroups,
    education: educationSection.paragraphs.flatMap(splitLines)
  }
}

export const useReadmeContent = (locale: ResumeLocale) => {
  return computed(() => parseReadme(locale === 'en' ? readmeEnRaw : readmeZhRaw, locale))
}
