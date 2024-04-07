import Link from "next/link"
import { game } from "../utils/env"

export const SiteH1: React.FC = () => {
  const site_name = game === 'tow' ? 'Base Desires²' : 'Base Desires'

  return <h1><Link href={"/"}>{ site_name }</Link></h1>
}
