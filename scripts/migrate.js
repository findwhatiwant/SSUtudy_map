import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { marked } from 'marked'

// __dirname 구현 (ES Modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 1. .env.local 파일 읽기 및 환경변수 로드
const envPath = path.join(__dirname, '../.env.local')
if (!fs.existsSync(envPath)) {
  console.error('.env.local 파일이 존재하지 않습니다. 먼저 설정해 주세요.')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) return
  const equalIdx = trimmed.indexOf('=')
  if (equalIdx === -1) return
  const key = trimmed.slice(0, equalIdx).trim()
  const value = trimmed.slice(equalIdx + 1).trim()
  env[key] = value
})

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Firebase 설정 값이 누락되었습니다. .env.local을 확인하세요.')
  process.exit(1)
}

// Firebase 초기화
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// 2. 경량 frontmatter 파서
function parseMarkdown(input) {
  const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/
  const match = FRONTMATTER_RE.exec(input)
  if (!match) {
    return { data: {}, body: input.trim() }
  }

  const [, frontmatter, body] = match
  const data = {}

  for (const line of frontmatter.split(/\r?\n/)) {
    if (!line.trim()) continue
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    let value = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    
    if (value === 'true') value = true
    else if (value === 'false') value = false
    else if (value !== '' && !Number.isNaN(Number(value))) value = Number(value)
    
    data[key] = value
  }

  return { data, body: body.trim() }
}

// 3. md 파일들을 스캔하여 Firestore에 업로드
const spacesDir = path.join(__dirname, '../src/content/spaces')
const files = fs.readdirSync(spacesDir).filter(file => file.endsWith('.md'))

console.log(`총 ${files.length}개의 마크다운 파일을 파싱하여 Firestore에 업로드합니다...`)

marked.setOptions({ breaks: true })

for (const file of files) {
  const filePath = path.join(spacesDir, file)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, body } = parseMarkdown(raw)

  if (!data.id) {
    console.warn(`파일 ${file}에 id가 누락되어 건너뜁니다.`)
    continue
  }

  const spaceDoc = {
    name: String(data.name ?? '이름 없음'),
    category: String(data.category ?? '기타'),
    building: String(data.building ?? '미지정'),
    lat: Number(data.lat ?? 0),
    lng: Number(data.lng ?? 0),
    seats: Number(data.seats ?? 0),
    hours: String(data.hours ?? '정보 없음'),
    outlets: data.outlets === true,
    groupStudy: data.groupStudy === true,
    status: String(data.status ?? 'open'),
    statusNote: data.statusNote ? String(data.statusNote) : '',
    description: body,
    bodyHtml: marked.parse(body),
  }

  try {
    await setDoc(doc(db, 'spaces', String(data.id)), spaceDoc)
    console.log(`✅ 업로드 완료: ${data.id} (${data.name})`)
  } catch (error) {
    console.error(`❌ 업로드 실패: ${data.id}, 에러:`, error)
  }
}

console.log('🎉 마이그레이션이 성공적으로 종료되었습니다!')
process.exit(0)
