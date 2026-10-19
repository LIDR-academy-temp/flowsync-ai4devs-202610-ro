// Project-local PostToolUse handler. stdout is reserved for the hook JSON protocol.
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const crypto = require('node:crypto')
const { spawnSync } = require('node:child_process')

const allowedRoot = 'C:/Users/NEUROMARKETING/flowsync-ai4devs-202610-ro'
const root = path.resolve(__dirname, '../..')
const frontend = path.join(root, 'frontend')
const excluded = new Set(['node_modules', 'dist', '.git', '.vite', '.cache', 'coverage', 'tmp', 'temp'])

function fingerprint(directory = frontend) {
  const hash = crypto.createHash('sha256')
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (excluded.has(entry.name) || /(?:\.tmp|\.temp|\.swp|\.swo|\.bak|\.log|\.tsbuildinfo|~)$/.test(entry.name) || entry.name.startsWith('.#')) continue
      const file = path.join(current, entry.name)
      // Never follow symlinks into another checkout or the backend.
      if (entry.isSymbolicLink()) throw new Error(`Enlace simbólico no permitido: ${path.relative(frontend, file)}`)
      if (entry.isDirectory()) visit(file)
      else if (entry.isFile()) {
        const data = fs.readFileSync(file)
        hash.update(JSON.stringify([path.relative(directory, file), data.length]))
        hash.update(data)
      }
    }
  }
  visit(directory)
  return hash.digest('hex')
}

function output(message) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: message },
  }) + '\n')
}

function runCheck(name) {
  const result = spawnSync(process.platform === 'win32' ? (process.env.ComSpec || 'C:\\Windows\\System32\\cmd.exe') : 'npm',
    process.platform === 'win32' ? ['/d', '/s', '/c', `npm.cmd run ${name}`] : ['run', name], {
      cwd: frontend,
      encoding: 'utf8',
      windowsHide: true,
      timeout: 120000,
      maxBuffer: 8 * 1024 * 1024,
      env: { ...process.env, NO_COLOR: '1' },
    })
  return {
    command: `npm.cmd run ${name}`,
    exitCode: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    error: result.error?.message || null,
    signal: result.signal,
  }
}

function main() {
  const input = JSON.parse(fs.readFileSync(0, 'utf8'))
  if (input.hook_event_name !== 'PostToolUse') return
  if (fs.realpathSync(root).toLowerCase() !== fs.realpathSync(allowedRoot).toLowerCase()) throw new Error('Copia no autorizada')
  const cwd = fs.realpathSync(input.cwd)
  const relative = path.relative(root, cwd)
  if (relative.startsWith('..') || path.isAbsolute(relative)) return
  if (fs.lstatSync(frontend).isSymbolicLink()) throw new Error('Frontend no puede ser un enlace simbólico')

  // State stays outside the repository. Scope it to this checkout and session.
  const key = crypto.createHash('sha256').update(root + '\0' + String(input.session_id || 'direct')).digest('hex')
  const stateDir = path.join(os.tmpdir(), 'flowsync-frontend-quality', key)
  fs.mkdirSync(stateDir, { recursive: true })
  const lock = path.join(stateDir, 'lock')
  try { fs.mkdirSync(lock) } catch (error) {
    if (error.code !== 'EEXIST') throw error
    // Bound recovery after a terminated process; normal checks take at most 240s.
    if (Date.now() - fs.statSync(lock).mtimeMs < 300000) {
      output('FlowSync: verificación ya en curso; no se inicia otra ejecución concurrente.')
      return
    }
    fs.rmdirSync(lock)
    fs.mkdirSync(lock)
  }
  try {
    const stateFile = path.join(stateDir, 'state.json')
    const before = fingerprint()
    let previous
    try { previous = JSON.parse(fs.readFileSync(stateFile, 'utf8')) } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    if (!previous) {
      // First event establishes a baseline, but an editing tool must be checked.
      const tool = String(input.tool_name || '')
      const editing = /apply_patch|Edit|Write|Bash|exec_command|write_stdin/.test(tool)
      if (!editing) {
        fs.writeFileSync(stateFile, JSON.stringify({ fingerprint: before, baseline: true }))
        return
      }
    }
    if (previous?.fingerprint === before) return
    const results = [runCheck('lint'), runCheck('build')]
    const after = fingerprint()
    // Do not cache checks for a tree that changed while they were running.
    if (before === after) fs.writeFileSync(stateFile, JSON.stringify({ fingerprint: before, results }))
    const logFile = path.join(stateDir, 'latest-results.json')
    fs.writeFileSync(logFile, JSON.stringify({ fingerprint: before, results }, null, 2))
    const summary = results.map((result) => {
      const text = [result.stdout, result.stderr, result.error].filter(Boolean).join('\n')
      return `${result.command}: exit=${result.exitCode}${result.signal ? ` signal=${result.signal}` : ''}\n${text.slice(-12000)}`
    }).join('\n\n')
    output(`FlowSync frontend — comprobación automática\n${summary}\nLog completo: ${logFile}${before !== after ? '\nATENCIÓN: los archivos cambiaron durante la verificación; se comprobarán de nuevo.' : ''}`)
  } finally {
    fs.rmdirSync(lock)
  }
}

try { main() } catch (error) {
  output(`ERROR del hook FlowSync: ${error.message}. La calidad del frontend NO quedó verificada.`)
}
