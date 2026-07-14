import fs from 'fs'
import path from 'path'
import { marked } from 'marked'

marked.setOptions({ breaks: true })

const inputPath = path.resolve('src/content/spaces.json')
const outputDir = path.resolve('public')
const outputPath = path.join(outputDir, 'spaces.json')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

async function main() {
  console.log('Compiling spaces from src/content/spaces.json...')
  if (!fs.existsSync(inputPath)) {
    console.error('Error: src/content/spaces.json not found.')
    process.exit(1)
  }

  try {
    const rawData = fs.readFileSync(inputPath, 'utf8')
    const spaces = JSON.parse(rawData)

    const compiledSpaces = spaces.map(space => {
      return {
        id: space.id,
        name: String(space.name ?? '이름 없음'),
        category: String(space.category ?? '기타'),
        building: String(space.building ?? '미지정'),
        lat: Number(space.lat ?? 0),
        lng: Number(space.lng ?? 0),
        seats: Number(space.seats ?? 0),
        hours: String(space.hours ?? '정보 없음'),
        outlets: space.outlets === true,
        groupStudy: space.groupStudy === true,
        status: space.status || 'open',
        statusNote: space.statusNote ? String(space.statusNote) : '',
        bodyHtml: space.description ? marked.parse(space.description) : ''
      }
    })

    // 가나다순 정렬
    compiledSpaces.sort((a, b) => a.name.localeCompare(b.name, 'ko'))

    fs.writeFileSync(outputPath, JSON.stringify(compiledSpaces, null, 2), 'utf-8')
    console.log(`Successfully compiled ${compiledSpaces.length} spaces to public/spaces.json`)
  } catch (error) {
    console.error('Compilation failed:', error)
    process.exit(1)
  }
}

main()
