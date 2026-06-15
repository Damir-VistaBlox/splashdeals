import { ReactNode } from "react"

interface FacilityLayoutProps {
  children: ReactNode
}

export default function FacilityLayout({ children }: FacilityLayoutProps) {
  return <>{children}</>;
}
