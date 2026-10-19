// Hook PostToolUse: formatea con Prettier el archivo que el agente acaba de editar.
// Usa el Prettier y la config de la app (backend/ o frontend/) a la que pertenece el archivo.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'

const input = JSON.parse(await new Promise((resolve) => {
  let data = ''
  process.stdin.on('data', (chunk) => (data += chunk))
  process.stdin.on('end', () => resolve(data))
}))

const filePath = input.tool_input?.file_path
const root = process.env.CLAUDE_PROJECT_DIR ?? input.cwd
if (!filePath || !root) process.exit(0)

const relative = path.relative(root, path.resolve(filePath))
const app = relative.split(path.sep)[0]
if (!['backend', 'frontend'].includes(app)) process.exit(0)

const appDir = path.join(root, app)
const prettier = path.join(appDir, 'node_modules', 'prettier', 'bin', 'prettier.cjs')
if (!existsSync(prettier)) process.exit(0)

try {
  // --ignore-unknown: no falla con extensiones que Prettier no soporta
  execFileSync(process.execPath, [prettier, '--write', '--ignore-unknown', path.resolve(filePath)], {
    cwd: appDir,
    stdio: ['ignore', 'ignore', 'pipe'],
  })
} catch (error) {
  // Exit 2 no bloquea (la edición ya está hecha) pero le pasa el error al agente
  process.stderr.write(`Prettier no pudo formatear ${relative}:\n${error.stderr ?? error.message}`)
  process.exit(2)
}
