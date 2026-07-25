const DATABASE_NAME = "wedding-editor-media"
const DATABASE_VERSION = 1
const MUSIC_STORE = "music"
const MUSIC_SOURCE_PREFIX = "wedding-music://"

function openMediaDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.addEventListener("upgradeneeded", () => {
      const database = request.result

      if (!database.objectStoreNames.contains(MUSIC_STORE)) {
        database.createObjectStore(MUSIC_STORE)
      }
    })
    request.addEventListener("success", () => resolve(request.result))
    request.addEventListener("error", () => reject(request.error))
  })
}

export function isStoredMusicSource(source: string): boolean {
  return source.startsWith(MUSIC_SOURCE_PREFIX)
}

export async function storeWeddingMusic(file: File): Promise<string> {
  const database = await openMediaDatabase()
  const key = crypto.randomUUID()

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(MUSIC_STORE, "readwrite")
    transaction.objectStore(MUSIC_STORE).put(file, key)
    transaction.addEventListener("complete", () => resolve())
    transaction.addEventListener("error", () => reject(transaction.error))
    transaction.addEventListener("abort", () => reject(transaction.error))
  })
  database.close()

  return `${MUSIC_SOURCE_PREFIX}${key}`
}

export async function loadWeddingMusic(source: string): Promise<Blob | null> {
  if (!isStoredMusicSource(source)) {
    return null
  }

  const database = await openMediaDatabase()
  const key = source.slice(MUSIC_SOURCE_PREFIX.length)
  const music = await new Promise<Blob | null>((resolve, reject) => {
    const transaction = database.transaction(MUSIC_STORE, "readonly")
    const request = transaction.objectStore(MUSIC_STORE).get(key)
    request.addEventListener("success", () => {
      resolve(request.result instanceof Blob ? request.result : null)
    })
    request.addEventListener("error", () => reject(request.error))
  })
  database.close()

  return music
}
