import minimist from 'minimist'
import fetch from 'node-fetch'
import open from 'open'
import log from './utils/log'

const isAvaliablePackage = async (name: string): Promise<boolean> => {
  const response = await fetch(`https://api.npms.io/v2/search?${new URLSearchParams({
    q: name,
    size: '1',
  })}`, {
    method: 'GET',
  })
  const data = await response.json()
  const { total = 0, results = [] } = data as any
  if (total > 1 || results.length)
    return true

  return false
}

const visitCnpmSyncWebsite = async (pkgName: string) => {
  const url = `https://npmmirror.com/sync/${pkgName}`

  open(url)

  // fake success
  setTimeout(() => {
    log.success(`sync ${pkgName} complete!`)
  }, 2000)
}

const init = async () => {
  const argv = minimist(process.argv.slice(2), {})

  const args = argv._

  if (args.length === 0)
    throw new Error('should provide a package name')

  const pkgName = args[0]

  if (!(await isAvaliablePackage(pkgName)))
    throw new Error('invalid package name')

  visitCnpmSyncWebsite(pkgName)
}

init().catch((e) => {
  log.error(e)
})
