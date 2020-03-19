import resolveDeps, { Dep } from 'snyk-resolve-deps'
import { Matcher, DepNameAtVersions } from './types'

export const warn = (...args: any[]) => console.warn('[dedupe-assert]', ...args)
export const log = (...args: any[]) => console.log('[dedupe-assert]', ...args)

export const assess = async ({ dirname }: { dirname: string }) => {
  const rootDep = await resolveDeps(dirname)
  return analyze({ rootDep })
}

async function analyze ({ rootDep }: { rootDep: Dep }) {
  const conflictedDepsByName: DepNameAtVersions = {}
  const flattenedDepsByName: DepNameAtVersions = {}
  walk({
    dep: rootDep,
    onVisit: (dep: Dep) => {
      const existingVersions = flattenedDepsByName[dep.name]
      if (!existingVersions) {
        flattenedDepsByName[dep.name] = new Set([dep.version])
      } else if (!existingVersions.has(dep.version)) {
        conflictedDepsByName[dep.name] =
          conflictedDepsByName[dep.name] ||
          new Set(Array.from(flattenedDepsByName[dep.name]))
        conflictedDepsByName[dep.name].add(dep.version)
      } else {
        // no op!
      }
    }
  })
  return {
    conflictedDepsByName,
    flattenedDepsByName
  }
}

export function report ({
  alertOnMatches,
  conflictedDepsByName
}: {
  alertOnMatches: Matcher[]
  conflictedDepsByName: DepNameAtVersions
}) {
  const alertingConflicts: DepNameAtVersions = {}
  // reduce all conflicts down to just the alerting conflicts
  for (const name in conflictedDepsByName) {
    if (alertOnMatches.some(matcher => name.match(matcher))) {
      alertingConflicts[name] = conflictedDepsByName[name]
    }
  }
  if (!Object.keys(alertingConflicts).length) return null
  return Object.keys(alertingConflicts).reduce(
    (acc, name, i) => [
      ...acc,
      { name, versions: Array.from(alertingConflicts[name]).join(', ') }
    ],
    [] as { name: string; versions: string; }[]
  )
}

function walk ({ dep, onVisit }: { dep: Dep; onVisit: (dep: Dep) => void }) {
  onVisit(dep)
  for (const name in dep.dependencies) {
    walk({ dep: dep.dependencies[name], onVisit })
  }
}
