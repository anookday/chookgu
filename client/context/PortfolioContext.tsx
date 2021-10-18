import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import { Portfolio, defaultPortfolio } from '@util/Portfolio'

type ContextParams = [Portfolio, Dispatch<SetStateAction<Portfolio>>]

export const PortfolioContext = createContext<ContextParams>([
  defaultPortfolio,
  (value: SetStateAction<Portfolio>) => {},
])

export const usePortfolio = () => useContext(PortfolioContext)

interface ProviderProps {
  value: Portfolio
  children: ReactNode
}

export const PortfolioContextProvider = ({
  value,
  children,
}: ProviderProps) => {
  const state = useState<Portfolio>(value)

  return (
    <PortfolioContext.Provider value={state}>
      {children}
    </PortfolioContext.Provider>
  )
}
