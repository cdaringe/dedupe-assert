declare module 'snyk-resolve-deps' {
  namespace resolveDeps {
    type Options = {
      /**
       * report only development options
       * [default, false]
       */
      dev?: boolean,
      /**
       * extract extra fields from dependencies' package.json files. example: ['files']
       * [default, undefined]
       */
      extraFields?: string[],
      /**
       * don't include from arrays with list of deps from root on every node
       * [default, false]
       */
      noFromArrays?: boolean
      /**
       * location of the package file
       * [default, 'package.json']
       */
      file?: string
    }

    export type Dep = {
      __filename: string
      dev?: boolean
      dependencies: Record<string, Dep>
      depType: "extraneous" | "hmmmmm"
      extraneous?: boolean
      /**
       * Format: name@version
       */
      from: string[]
      /**
       * Format: name@version
       */
      full: string
      hasDevDependencies: boolean
      license?: string
      name: string
      numDependencies: number
      numFileDependencies: number
      pluck: () => unknown
      problems: string[]
      unique: () => unknown
      version: string
    }
  }

  function resolveDeps (dirname: string, options?: resolveDeps.Options): Promise<resolveDeps.Dep>
  export = resolveDeps
}
