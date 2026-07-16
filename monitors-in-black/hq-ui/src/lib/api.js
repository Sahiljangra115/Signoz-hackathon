export async function getJSON(path) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), 8000)
  try {
    const resp = await fetch(path, { signal: controller.signal })
    clearTimeout(id)
    if (!resp.ok) {
      throw new Error(`HTTP error ${resp.status}`)
    }
    return await resp.json()
  } catch (err) {
    clearTimeout(id)
    throw err
  }
}
