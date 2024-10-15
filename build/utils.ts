// build/utils.ts
// 处理字符串，数字，布尔值
/* eslint-disable */
// Read all environment variable configuration files to process.env
export function wrapperEnv(envconf: any) {
  const ret: any = {}

  for (const envName of Object.keys(envconf)) {
    let realName = envconf[envName].replace(/\\n/g, '\n')
    realName = realName === 'true' ? true : realName === 'false' ? false : realName
    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }
    if (envName === 'VITE_PROXY' && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'))
      } catch (error) {
        realName = ''
      }
    }
    ret[envName] = realName
    // 把环境变量 注入到node环境对象里面
    if (typeof realName === 'string') {
      process.env[envName] = realName
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName)
    }
  }
  return ret
}
