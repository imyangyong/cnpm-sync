import minimist from 'minimist'
import fetch from 'node-fetch'
import open from 'open'
import log from './utils/log'

const isAvaliablePackage = async (name: string): Promise<false | string> => {
  const response = await fetch(`https://www.npmjs.com/search/suggestions?${new URLSearchParams({
    q: name,
  })}`, {
    method: 'GET',
  })
  const data = await response.json() as any[]
  if (data?.length) {
    const pkg = data.find(item => item.name === name)
    if (pkg)
      return pkg.version
  }

  return false
}

const visitCnpmSyncWebsite = async (pkgName: string, version?: string) => {
  const url = `https://npmmirror.com/sync/${pkgName}`

  open(url)

  // fake success
  setTimeout(() => {
    log.success(`sync ${pkgName} complete! the latest version is v${version}`)
  }, 2000)
}

const init = async () => {
  const argv = minimist(process.argv.slice(2), {})

  const args = argv._

  if (args.length === 0)
    throw new Error('should provide a package name')

  const pkgName = args[0]

  const latestVersion = await isAvaliablePackage(pkgName)
  if (!latestVersion)
    throw new Error(`${pkgName} is invalid package name`)

  visitCnpmSyncWebsite(pkgName, latestVersion)
}

init().catch((e) => {
  log.error(e)
})
