import fs from 'fs'
import path from 'path'
import { marked } from 'marked'

marked.setOptions({ breaks: true })

// .env 또는 .env.local 파일에서 VITE_FIREBASE_PROJECT_ID 읽기
function getProjectId() {
  const envPaths = ['.env.local', '.env', '.env.production']
  for (const envFile of envPaths) {
    const fullPath = path.resolve(process.cwd(), envFile)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      const match = content.match(/VITE_FIREBASE_PROJECT_ID\s*=\s*(.*)/)
      if (match && match[1]) {
        return match[1].trim().replace(/['"]/g, '')
      }
    }
  }
  return process.env.VITE_FIREBASE_PROJECT_ID || null
}

function parseFirestoreValue(value) {
  if (!value) return null
  if ('stringValue' in value) return value.stringValue
  if ('doubleValue' in value) return Number(value.doubleValue)
  if ('integerValue' in value) return Number(value.integerValue)
  if ('booleanValue' in value) return value.booleanValue
  if ('arrayValue' in value) {
    const values = value.arrayValue.values || []
    return values.map(parseFirestoreValue)
  }
  if ('mapValue' in value) {
    const fields = value.mapValue.fields || {}
    const obj = {}
    for (const [key, val] of Object.entries(fields)) {
      obj[key] = parseFirestoreValue(val)
    }
    return obj
  }
  return null
}

// 정확한 OSM 기반 숭실대 건물 핀 좌표 매핑 테이블 (오버라이드용)
const CORRECT_COORDS = {
  'baird-hall': { lat: 37.49645, lng: 126.95632 },       // 베어드홀
  'venture-center': { lat: 37.49756, lng: 126.95742 },   // 벤처중소기업센터
  'jeonsan': { lat: 37.49547, lng: 126.95934 },          // 전산관
  'central-library': { lat: 37.49626, lng: 126.95857 },  // 중앙도서관
  'student-union': { lat: 37.49699, lng: 126.95640 },    // 학생회관
  'hyungnam': { lat: 37.49586, lng: 126.95594 }          // 형남공학관
}

const projectId = getProjectId()
const outputDir = path.resolve('public')
const outputPath = path.join(outputDir, 'spaces.json')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

if (!projectId) {
  console.warn('VITE_FIREBASE_PROJECT_ID 가 설정되지 않았습니다. 빈 spaces.json 파일을 생성합니다.')
  fs.writeFileSync(outputPath, JSON.stringify([], null, 2), 'utf-8')
  process.exit(0)
}

console.log(`Fetching spaces from Firestore project: ${projectId}...`)

const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/spaces`

try {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch from Firestore API: ${response.statusText}`)
  }
  const result = await response.json()
  const documents = result.documents || []
  const spaces = []

  for (const doc of documents) {
    const fields = doc.fields || {}
    const id = doc.name.split('/').pop()
    const data = {}
    for (const [key, val] of Object.entries(fields)) {
      data[key] = parseFirestoreValue(val)
    }

    // 데이터베이스의 잘못 정렬된 좌표를 정확한 건물 중심 좌표로 오버라이드
    const isOverride = id in CORRECT_COORDS
    const lat = isOverride ? CORRECT_COORDS[id].lat : Number(data.lat ?? 0)
    const lng = isOverride ? CORRECT_COORDS[id].lng : Number(data.lng ?? 0)

    if (isOverride) {
      console.log(`📍 좌표 오버라이드 적용: ${id} -> lat: ${lat}, lng: ${lng}`)
    }

    spaces.push({
      id: id,
      name: String(data.name ?? '이름 없음'),
      category: String(data.category ?? '기타'),
      building: String(data.building ?? '미지정'),
      lat: lat,
      lng: lng,
      seats: Number(data.seats ?? 0),
      hours: String(data.hours ?? '정보 없음'),
      outlets: data.outlets === true,
      groupStudy: data.groupStudy === true,
      status: data.status || 'open',
      statusNote: data.statusNote ? String(data.statusNote) : '',
      bodyHtml: String(data.bodyHtml ?? (data.description ? marked.parseSync(data.description) : ''))
    })
  }

  // 가나다순 정렬
  spaces.sort((a, b) => a.name.localeCompare(b.name, 'ko'))

  fs.writeFileSync(outputPath, JSON.stringify(spaces, null, 2), 'utf-8')
  console.log(`Successfully compiled ${spaces.length} spaces from Firestore to public/spaces.json`)
} catch (error) {
  console.error('Error fetching/compiling spaces from Firestore:', error)
  if (!fs.existsSync(outputPath)) {
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2), 'utf-8')
  }
  process.exit(0)
}
