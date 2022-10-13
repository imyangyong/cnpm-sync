import { bold, cyan, green, red, yellow } from 'kolorist'

const PKG_NAME = '[cnpm-sync]'

type LogType = 'log' | 'success' | 'warn' | 'error'

const _log = (type: LogType, msg: string) => {
  const t = { log: cyan, success: green, warn: yellow, error: red }
  // eslint-disable-next-line no-console
  console.log(bold(t[type](`${PKG_NAME} ${msg}`)))
}

const types: LogType[] = ['log', 'success', 'error', 'warn']

const log = types.reduce((cur, t) => {
  cur[t] = _log.bind(null, t)
  return cur
}, {} as Record<LogType, (msg: string) => void>)

export default log
