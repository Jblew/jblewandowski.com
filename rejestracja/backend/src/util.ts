export function mustGetEnv(name: string) {
    const v = process.env[name]
    if (!v) throw new Error('Missing env ' + name)
    return v
}
