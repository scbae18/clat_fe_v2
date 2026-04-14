import { useState, type Dispatch, type SetStateAction } from 'react'

export default function useToggleArray<T>(initialValue: T[] = []) {
  const [items, setItems] = useState<T[]>(initialValue)

  const toggle = (item: T) => {
    setItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const reset = () => setItems(initialValue)

  return { items, toggle, set: setItems as Dispatch<SetStateAction<T[]>>, reset }
}
