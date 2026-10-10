import { profile } from './profile.js'
import { appsMeta } from './appsMeta.js'

const projFiles = profile.projects.map((p, i) => ({
  id: 'proj-' + p.id,
  name: p.title,
  type: 'project',
  project: p,
  tags: i % 3 === 0 ? ['Work', 'Important'] : i % 3 === 1 ? ['Personal'] : ['Work'],
}))

/**
 * A small virtual file system used by Finder, Get Info, desktop icons
 * and Spotlight. It is intentionally simple: folders contain arrays.
 */
export const fileSystem = {
  id: 'macintosh-hd',
  name: 'Macintosh HD',
  type: 'drive',
  children: [
    {
      id: 'applications',
      name: 'Applications',
      type: 'folder',
      children: Object.values(appsMeta)
        .filter((m) => m.id !== 'launchpad')
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((m) => ({ id: 'app-' + m.id, name: m.name, type: 'app', appId: m.id })),
    },
    {
      id: 'users',
      name: 'Users',
      type: 'folder',
      children: [
        {
          id: 'me',
          name: profile.firstName,
          type: 'folder',
          children: [
            {
              id: 'projects',
              name: 'Projects',
              type: 'folder',
              children: projFiles,
            },
            {
              id: 'skills',
              name: 'Skills',
              type: 'folder',
              children: Object.entries(profile.skills).map(([group, list]) => ({
                id: 'skill-' + group,
                name: group,
                type: 'file',
                detail: list.join(', '),
              })),
            },
            {
              id: 'certificates',
              name: 'Certificates',
              type: 'folder',
              children: [
{ id: 'cert-1', name: 'Accessibility Specialist.pdf', type: 'pdf', detail: '2023', tags: ['Important'] },
                  { id: 'cert-2', name: 'Cloud Practitioner.pdf', type: 'pdf', detail: '2022', tags: ['Important'] },
                  { id: 'cert-3', name: 'UI Design Fundamentals.pdf', type: 'pdf', detail: '2021', tags: ['Important'] },
              ],
            },
            {
                id: 'photos',
                name: 'Photos',
                type: 'folder',
                children: profile.projects.map((p, i) => ({
                  id: 'photo-' + p.id,
                  name: `${p.title}.png`,
                  type: 'image',
                  color: ['#5ac8fa', '#ff9f0a', '#af52de', '#34c759', '#ff2d55', '#ffcc00'][i % 6],
                  tags: ['Personal'],
                })),
              },
            { id: 'resume', name: 'Resume.pdf', type: 'pdf', detail: 'Portfolio résumé', tags: ['Important'] },
            {
              id: 'documents',
              name: 'Documents',
              type: 'folder',
              children: [
                { id: 'doc-about', name: 'About Me.txt', type: 'file', detail: profile.about.join('\n\n'), tags: ['Personal'] },
                {
                  id: 'doc-exp',
                  name: 'Experience.txt',
                  type: 'file',
                  detail: profile.experience
                    .map((e) => `${e.role} — ${e.company} (${e.period})`)
                    .join('\n'),
                  tags: ['Work'],
                },
              ],
            },
            {
              id: 'downloads',
              name: 'Downloads',
              type: 'folder',
              children: [
                { id: 'dl-resume', name: profile.resumeFileName, type: 'pdf', detail: 'Portfolio résumé' },
                { id: 'dl-shot', name: 'Desktop Screenshot 2026-10-10.png', type: 'image', color: '#5ac8fa' },
                { id: 'dl-zip', name: 'macos-portfolio.zip', type: 'file', detail: 'Archived source of this project' },
                { id: 'dl-spec', name: 'Portfolio Spec.pdf', type: 'pdf', detail: '2024–2026' },
              ],
            },
          ],
        },
      ],
    },
  ],
}

/* Helpers */
export function findNode(root, id) {
  if (root.id === id) return root
  for (const c of root.children || []) {
    const found = findNode(c, id)
    if (found) return found
  }
  return null
}

export function pathTo(root, id) {
  const path = []
  const walk = (node) => {
    path.push(node)
    if (node.id === id) return true
    for (const c of node.children || []) {
      if (walk(c)) return true
    }
    path.pop()
    return false
  }
  return walk(root) ? path : []
}

export function findNodesByTag(root, tag) {
  const out = []
  const walk = (node) => {
    if (node.tags?.includes(tag)) out.push(node)
    for (const c of node.children || []) walk(c)
  }
  walk(root)
  return out.sort((a, b) => a.name.localeCompare(b.name))
}

/* Desktop icon definitions (right side of the desktop) */
export const desktopIcons = [
  { id: 'hd', name: 'Macintosh HD', kind: 'hd', target: 'macintosh-hd' },
  { id: 'resume', name: profile.resumeFileName, kind: 'pdf', target: 'preview' },
  { id: 'projects', name: 'Projects', kind: 'folder', target: 'finder' },
  { id: 'trash', name: 'Trash', kind: 'trash', target: 'trash' },
]

export default fileSystem
