// 마크다운 파일을 frontmatter(상단 메타데이터)와 본문으로 분리하는 경량 파서.
// gray-matter 같은 무거운 의존성 없이 우리 형식만 처리한다.

export interface ParsedMarkdown {
  data: Record<string, string | number | boolean>
  body: string
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

// 문자열 값을 boolean/number로 적절히 변환한다.
function coerce(raw: string): string | number | boolean {
  const value = raw.trim().replace(/^["']|["']$/g, '')
  if (value === 'true') return true
  if (value === 'false') return false
  if (value !== '' && !Number.isNaN(Number(value))) return Number(value)
  return value
}

export function parseMarkdown(input: string): ParsedMarkdown {
  const match = FRONTMATTER_RE.exec(input)
  if (!match) {
    return { data: {}, body: input.trim() }
  }

  const [, frontmatter, body] = match
  const data: Record<string, string | number | boolean> = {}

  for (const line of frontmatter.split(/\r?\n/)) {
    if (!line.trim()) continue
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const value = line.slice(colon + 1)
    data[key] = coerce(value)
  }

  return { data, body: body.trim() }
}
