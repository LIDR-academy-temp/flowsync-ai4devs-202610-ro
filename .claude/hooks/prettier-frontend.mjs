// Hook PostToolUse (Edit|Write|MultiEdit): formatea con Prettier el archivo
// editado si está dentro de frontend/src. Nunca bloquea al agente.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { extname, join, relative, resolve, sep } from 'node:path'

const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.html'])

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
const filePath = input.tool_input?.file_path
if (!filePath) process.exit(0)

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd()
const frontendDir = join(projectDir, 'frontend')
const srcDir = join(frontendDir, 'src')
const target = resolve(filePath)

const rel = relative(srcDir, target)
const insideSrc = rel !== '' && !rel.startsWith('..') && !rel.startsWith(sep) && resolve(srcDir, rel) === target
if (!insideSrc || !EXTENSIONS.has(extname(target)) || !existsSync(target)) process.exit(0)

const prettierBin = join(frontendDir, 'node_modules', 'prettier', 'bin', 'prettier.cjs')
if (!existsSync(prettierBin)) {
  console.error('Prettier no está instalado: ejecuta `npm install` en frontend/.')
  process.exit(0)
}

try {
  execFileSync(process.execPath, [prettierBin, '--write', target], {
    cwd: frontendDir,
    stdio: ['ignore', 'ignore', 'pipe'],
  })
} catch (err) {
  console.error(`Prettier falló en ${target}:\n${err.stderr?.toString() ?? err.message}`)
}
process.exit(0)
