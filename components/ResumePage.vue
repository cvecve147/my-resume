<script setup lang="ts">
import { computed } from 'vue'
import { resumeProfiles, type ResumeLocale } from '~/data/resume'
import { useReadmeContent } from '~/composables/useReadmeContent'

const props = defineProps<{
  locale: ResumeLocale
}>()

const profile = computed(() => resumeProfiles[props.locale])
const readmeContent = useReadmeContent(props.locale)

const introParagraphs = computed(() => {
  return readmeContent.value.intro.length > 0 ? readmeContent.value.intro : [profile.value.intro]
})

const uiText = computed(() =>
  props.locale === 'en'
    ? {
        coreExpertise: 'Core Expertise',
        profileLinks: 'Profiles',
        langAria: `Switch language to ${profile.value.localeLabel}`
      }
    : {
        coreExpertise: '核心專長',
        profileLinks: '專業連結',
        langAria: `切換至 ${profile.value.localeLabel}`
      }
)

const profileLinks = computed(() =>
  profile.value.sameAs.map((href) => ({
    href,
    label: href.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }))
)

const publicationSegments = (title: string) => {
  const authorPattern = /Yu,\s*J\.\s*X\./

  return title
    .split(/(Yu,\s*J\.\s*X\.)/)
    .filter(Boolean)
    .map((text) => ({
      text,
      isAuthor: authorPattern.test(text)
    }))
}

const sectionImages = {
  awards: '/images/ai-cup.webp',
  publications: '/images/paper.webp',
  projects: '/images/work.webp'
}
</script>

<template>
  <main class="page-shell">
    <div class="ambient ambient-left" aria-hidden="true" />
    <div class="ambient ambient-right" aria-hidden="true" />

    <div class="resume-container">
      <header class="topbar">
        <div class="lang-group">
          <span class="lang-current">{{ profile.currentLangLabel }}</span>
          <NuxtLink :to="profile.langSwitchLabel" class="lang-switch" :aria-label="uiText.langAria">
            {{ profile.localeLabel }}
          </NuxtLink>
        </div>
        <span class="contact-link">{{ profile.email }}</span>
      </header>

      <section class="hero-card">
        <div class="hero-identity">
          <img
            :src="profile.heroImage"
            :alt="`${profile.name} profile photo`"
            class="hero-photo"
            width="240"
            height="240"
            fetchpriority="high"
          >

          <div>
            <p class="hero-kicker">Applied AI Research Resume</p>
            <h1>{{ profile.name }}</h1>
            <p v-if="profile.nativeName" class="native-name">{{ profile.nativeName }}</p>
            <p class="hero-title">{{ profile.title }}</p>
            <p v-for="(paragraph, index) in introParagraphs" :key="`${index}-${paragraph}`" class="hero-intro">{{ paragraph }}</p>
            <div class="hero-meta">
              <span>{{ profile.location }}</span>
            </div>
          </div>
        </div>

        <div class="stats-grid">
          <article v-for="stat in profile.stats" :key="stat.label" class="stat-card">
            <p class="stat-label">{{ stat.label }}</p>
            <p class="stat-value">{{ stat.value }}</p>
          </article>
        </div>
      </section>

      <div class="content-layout">
        <aside class="sidebar">
          <section class="section-block side-panel">
            <h2>{{ uiText.coreExpertise }}</h2>
            <ul class="chip-list">
              <li v-for="expertise in profile.expertise" :key="expertise">{{ expertise }}</li>
            </ul>
          </section>

          <section class="section-block side-panel">
            <h2>{{ uiText.profileLinks }}</h2>
            <ul class="link-list">
              <li v-for="item in profileLinks" :key="item.href">
                <a :href="item.href" target="_blank" rel="noreferrer">{{ item.label }}</a>
              </li>
            </ul>
          </section>

          <section class="section-block side-panel">
            <h2>{{ profile.sectionTitles.education }}</h2>
            <ul class="compact-list">
              <li v-for="item in readmeContent.education" :key="item">{{ item }}</li>
            </ul>
          </section>
        </aside>

        <div class="content-column">
          <section class="section-block">
            <h2>{{ profile.sectionTitles.research }}</h2>
            <ul class="chip-list">
              <li v-for="interest in readmeContent.researchInterests" :key="interest">{{ interest }}</li>
            </ul>
          </section>

          <section class="section-block">
            <h2>{{ profile.sectionTitles.work }}</h2>
            <div class="timeline">
              <article v-for="block in readmeContent.workBlocks" :key="block.title" class="timeline-item">
                <h3>{{ block.title }}</h3>
                <ul>
                  <li v-for="point in block.points" :key="point">{{ point }}</li>
                </ul>
              </article>
            </div>
          </section>

          <section class="section-block">
            <h2>{{ profile.sectionTitles.projects }}</h2>
            <div class="feature-layout">
              <img
                :src="sectionImages.projects"
                :alt="`${profile.sectionTitles.projects} cover image`"
                class="feature-image"
                loading="lazy"
                width="480"
                height="300"
              >
              <div class="feature-content">
                <article v-for="project in readmeContent.projects" :key="project.title" class="card text-card">
                  <h3>{{ project.title }}</h3>
                  <ul class="compact-list">
                    <li v-for="point in project.points" :key="point">{{ point }}</li>
                  </ul>
                </article>
              </div>
            </div>
          </section>

          <section class="section-block">
            <h2>{{ profile.sectionTitles.publications }}</h2>
            <div class="feature-layout">
              <img
                :src="sectionImages.publications"
                :alt="`${profile.sectionTitles.publications} cover image`"
                class="feature-image"
                loading="lazy"
                width="480"
                height="300"
              >
              <div class="feature-content">
                <ul class="publication-list">
                  <li v-for="paper in readmeContent.publications" :key="paper.title" class="card text-card">
                    <h3 class="publication-title">
                      <template
                        v-for="(segment, segmentIndex) in publicationSegments(paper.title)"
                        :key="`${paper.title}-${segmentIndex}`"
                      >
                        <span :class="{ 'author-highlight': segment.isAuthor }">{{ segment.text }}</span>
                      </template>
                    </h3>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section class="section-block">
            <h2>{{ profile.sectionTitles.awards }}</h2>
            <div class="feature-layout">
              <img
                :src="sectionImages.awards"
                :alt="`${profile.sectionTitles.awards} cover image`"
                class="feature-image"
                loading="lazy"
                width="480"
                height="300"
              >
              <div class="feature-content">
                <article v-for="award in readmeContent.awards" :key="award.title" class="card text-card">
                  <h3>{{ award.title }}</h3>
                  <p>{{ award.detail }}</p>
                </article>
              </div>
            </div>
          </section>

          <section class="section-block">
            <h2>{{ profile.sectionTitles.skills }}</h2>
            <div class="skill-grid">
              <article v-for="group in readmeContent.skillGroups" :key="group.title" class="card">
                <h3>{{ group.title }}</h3>
                <ul class="compact-list">
                  <li v-for="item in group.items" :key="item">{{ item }}</li>
                </ul>
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>
