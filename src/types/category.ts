export type Category = {
  name: string
  savePath: string
  downloadPath?: string | null
}

export type Categories = Record<string, Category>
