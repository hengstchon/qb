import { useRef } from 'react'

export const useRenderCounter = (name = '') => {
  const countRef = useRef(0)
  countRef.current += 1
  console.log(`${name} counter: `, countRef.current)
}
