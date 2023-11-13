import minimist from 'minimist'
import fetch from 'node-fetch'
import open from 'open'
import log from './utils/log'
import { type } from 'os'

const isAvailablePackage = async (name: string): Promise<false | string> => {
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
  // const url = `https://npmmirror.com/sync/${pkgName}`

  // open(url)

  const response = await fetch(`https://registry-direct.npmmirror.com/-/package/${pkgName}/syncs`, {
    method: 'PUT',
  })
  const data = await response.json() as { id: string, ok: boolean, state: string, type: string }
  if (data?.ok) {
    log.success(`sync ${pkgName} complete! see detail: https://npmmirror.com/package/${pkgName}/versions`)
  }
}

const init = async () => {
  const argv = minimist(process.argv.slice(2), {})

  const args = argv._

  if (args.length === 0)
    throw new Error('should provide a package name')

  const pkgName = args[0]

  const latestVersion = await isAvailablePackage(pkgName)
  if (!latestVersion)
    throw new Error(`${pkgName} is invalid package name`)

  visitCnpmSyncWebsite(pkgName, latestVersion)
}

init().catch((e) => {
  log.error(e)
})
