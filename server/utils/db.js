import { readFile, writeFile } from 'fs/promises'

const DB_PATH = new URL('../db.json', import.meta.url)

export const readDb = async () => {
  try {
    const raw = await readFile(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Fallback if db.json is missing, try reading seed
      const seedRaw = await readFile(new URL('../db.seed.json', import.meta.url), 'utf-8')
      const initialData = JSON.parse(seedRaw)
      await writeDb(initialData)
      return initialData
    }
    throw err
  }
}

export const writeDb = async (data) => {
  await writeFile(DB_PATH, JSON.stringify(data, null, 2))
}
