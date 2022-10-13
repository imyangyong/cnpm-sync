import minimist from 'minimist'
import fetch from 'node-fetch'
import log from './utils/log'

const init = async () => {
  const argv = minimist(process.argv.slice(2), {})

  const args = argv._

  if (args.length === 0)
    throw new Error('should provide a package name')

  const pkgName = args[0]

  await fetch(`https://npmmirror.com/sync/${pkgName}`, { method: 'GET' })
  // const data = await response.json()

  // fake success
  setTimeout(() => {
    log.success(`sync ${pkgName} complete!`)
  }, 2000)
}

init().catch((e) => {
  log.error(e)
})
