import Link from "next/link"
import { siteName } from "../utils/env"

export const SiteH1: React.FC = () => {
  return <h1><Link href={"/"}>{ siteName }</Link></h1>
}
