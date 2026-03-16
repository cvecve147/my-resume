const major = Number(process.versions.node.split('.')[0])

if (!Number.isFinite(major) || major < 20 || major >= 26) {
  console.error('\n[Node version error]')
  console.error(`Current Node.js: ${process.version}`)
  console.error('This project requires Node.js 20.x, 22.x, or 25.x.')
  console.error('Run: nvm use 25')
  console.error('Then: pnpm install && pnpm dev\n')
  process.exit(1)
}

if (major === 25) {
  console.warn('\n[Node 25 notice]')
  console.warn('Node 25 is enabled by request, but Nuxt ecosystem compatibility may vary by environment.\n')
}
