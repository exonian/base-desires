import type { NextPage } from 'next'
import Error from 'next/error'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Card } from '../../components/card'

import { toStandard } from '../../utils/text'
import { Warscrolls } from '../../warscrolls/data'
import Search from '../[[...slug]]'

const Warscroll: NextPage = () => {
  const router = useRouter()
  const slug = router.query.slug ? router.query.slug[0] : ""
  const standardisedSlug = slug ? toStandard(slug) : ""
  const name = Object.keys(Warscrolls).find(name => toStandard(name) === standardisedSlug)
  const warscroll = name && Warscrolls[name]
  const cardColumnStyle = "col-12"

  return (name && warscroll) ? (
    <div className="d-flex flex-column min-vh-100">
      <Head>
        <title key="title">{ name } – Base Desires</title>
        <meta
          name="description"
          content={`${ warscroll.baseSize } ${ warscroll.notes ? warscroll.notes : ''}`} key="description" />
      </Head>
      <main className="container pt-3 flex-fill">
        <h1><Link href={"/"}>Base Desires</Link></h1>
        <div className="sticky-top bg-body">
          <div className="row">
            <div className={cardColumnStyle} key={name}>
              <Card name={name} warscroll={warscroll} link={false} showFaction={false} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
  :
  <Search />
}

export default Warscroll