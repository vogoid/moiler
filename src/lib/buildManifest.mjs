import glob from 'glob'

const baseManifest = {
  include: [
    '$(PWD)/manifest.json',
    '$(MODDABLE)/examples/manifest_base.json',
    '$(MODULES)/pins/digital/manifest.json',
  ],
}

export default function buildManifest(projectPath) {
  const projectFiles = glob.sync(`{,!(node_modules)/**/}*.js`)
  const projectFilesModules = projectFiles.reduce((acc, cur, i) => {
    const s = cur.replace('.js', '')
    acc['/' + s] = projectPath + '/' + s
    return acc
  }, {})

  const manifest = {
    ...baseManifest,
    modules: {
      '*': [projectPath + '/main'],
      ...projectFilesModules,
    },
  }

  return manifest
}
