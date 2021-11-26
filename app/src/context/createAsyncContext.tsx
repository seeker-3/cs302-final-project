import { createContext, FC, useContext, useEffect, useState } from 'react'

export default function createAsyncContext<V>(callback: () => Promise<V>) {
  const Context = createContext<V | null>(null)

  const ContextProvider: FC = ({ children }) => {
    const [state, setState] = useState<V | null>(null)

    useEffect(
      () =>
        void (async () => setState(await callback()))().catch(console.error),
      []
    )

    if (!state) return null

    return <Context.Provider value={state}>{children}</Context.Provider>
  }

  const useContextValue = () => {
    const value = useContext(Context)
    if (!value) throw Error('context did not load properly')
    return value
  }

  return [ContextProvider, useContextValue] as const
}
