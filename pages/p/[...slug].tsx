import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { Card } from '../../components/card'
import { Footer } from '../../components/footer'

import { toStandard } from '../../utils/text'
import { Warscrolls } from '../../warscrolls/data'
import { TWarscroll } from '../../warscrolls/types'
import Search from '../[[...slug]]'

interface IParams extends ParsedUrlQuery {
  slug: string[]
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as IParams
  const standardisedSlug = toStandard(slug[0])
  const name = Object.keys(Warscrolls).find(name => toStandard(name) === standardisedSlug)
  const warscroll = name && Warscrolls[name]

  return name && warscroll ? {
    props: {
      name,
      warscroll,
    }
  }
  :
  {
    notFound: true,
  }
}

export async function getStaticPaths() {
  return {
    paths: Object.keys(Warscrolls).map(name => `/p/${toStandard(name)}`),
    fallback: false,
  }
}

interface IWarscrollProps {
  name: string,
  warscroll: TWarscroll,
}

const Warscroll: NextPage<IWarscrollProps> = props => {
  const { name, warscroll } = props
  const cardColumnStyle = "col-12"

  return (name && warscroll) ? (
    <div className="d-flex flex-column min-vh-100">
      <Head>
        <title key="title">{`${name} – Base Desires`}</title>
        <meta
          name="description"
          content={`${ warscroll.baseSize } ${ warscroll.notes ? warscroll.notes : ''}`} key="description" />
      </Head>
      <main className="container pt-3 flex-fill">
        <h1><Link href={"/"}>Base Desires</Link></h1>
        <div className="sticky-top bg-body">
          <div className="row">
            <div className={cardColumnStyle} key={name}>
              <Card name={name} warscroll={warscroll} link={false} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
  :
  <Search />
}

export default Warscroll
