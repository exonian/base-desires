import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import styles from '../styles/Home.module.css'
import { toStandard } from '../utils/text'
import { Warscrolls } from '../warscrolls/data'
import { TWarscroll, TWarscrolls } from '../warscrolls/types'
import { Card } from '../components/card'
import { SearchBox } from '../components/search';


const Search: NextPage = () => {

  const router = useRouter()
  const slug = router.query.s as string || ""
  const standardisedSlug = slug ? toStandard(slug) : ""
  const matches = Object.entries(Warscrolls).reduce((accum, [name, warscroll]) => {
    const otherFields = `${warscroll.faction} || ${warscroll.baseSize} || ${warscroll.notes}`
    if (toStandard(name).includes(standardisedSlug)) accum['name'][name] = warscroll
    else if (toStandard(otherFields).includes(standardisedSlug)) accum['other'][name] = warscroll
    return accum
  }, {'name': {}, 'other': {}} as {'name': TWarscrolls, 'other': TWarscrolls})
  const warscrolls = { ...matches['name'], ...matches['other']}
  const cardColumnStyle = (Object.keys(warscrolls).length > 1) ? "col-md-6" : "col-12"

  const showSearch = true
  const showFaction = (name: string, warscroll: TWarscroll): boolean => {
    return (slug.length > 0 && toStandard(warscroll.faction).includes(slug) && !toStandard(name).includes(slug))
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Base Desires</title>
        <meta name="description" content="What every AoS player really desires: to know what bases everything goes on" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1><Link href={"/"}>Base Desires</Link></h1>
        <div className="sticky-top bg-body">
          { showSearch && <SearchBox /> }
        </div>

        <div className={styles.grid}>
          <div className="row">
            {Object.entries(warscrolls).map(([name, warscroll]) =>
              <div className={cardColumnStyle} key={name}>
                <Card name={name} warscroll={warscroll} link={false} showFaction={showFaction(name, warscroll)} />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>By Michael Blatherwick
          <a className="social-link" href="https://twitter.com/rogue_michael"><FaTwitter /> @rogue_michael</a>
          <a className="social-link" href="https://github.com/exonian"><FaGithub /> exonian</a>
        </p>
        <blockquote className="blockquote pr-3">
          <p className="mb-0">"basedesires.com. Haha can you imagine if that was a website about Warhammer bases…"</p>
          <footer className="blockquote-footer">Me a few days ago...</footer>
        </blockquote>
      </footer>
    </div>
  )
}

export default Search
