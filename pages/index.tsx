import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router'
import { toStandard } from '../utils/text'
import { TWarscrolls } from '../warscrolls/types'
import { Card } from '../components/card'
import { SearchBox } from '../components/search';
import { Footer } from '../components/footer';
import { getWarscrolls } from '../warscrolls/data';
import { useSearchParams } from 'next/navigation';


export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      warscrolls: getWarscrolls(),
    },
  }
}

interface ISearchPageProps {
  warscrolls: TWarscrolls,
}

const Search: NextPage<ISearchPageProps> = props => {
  const { warscrolls } = props

  const slug = useSearchParams().get('s')
  const standardisedSlug = slug ? toStandard(slug) : ""
  const matches = Object.entries(warscrolls).reduce((accum, [name, warscroll]) => {
    const otherFields = `${warscroll.factions}||${warscroll.baseSize}||${warscroll.notes}`
    if (toStandard(name).includes(standardisedSlug)) accum['name'][name] = warscroll
    else if (toStandard(otherFields).includes(standardisedSlug)) accum['other'][name] = warscroll
    return accum
  }, {'name': {}, 'other': {}} as {'name': TWarscrolls, 'other': TWarscrolls})
  const matchedWarscrolls = { ...matches['name'], ...matches['other']}
  const sortedWarscrolls = Object.keys(matchedWarscrolls).sort().reduce((accum, name) => {
    accum[name] = matchedWarscrolls[name]
    return accum
  }, {} as TWarscrolls)
  const cardRowStyle = (Object.keys(sortedWarscrolls).length > 1) ? "row" : "row justify-content-center"

  const showSearch = true

  return (
    <div className="d-flex flex-column min-vh-100">
      <Head>
        <title key="title">Base Desires</title>
        <meta name="description" content="What every AoS player really desires: to know what bases everything goes on" key="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container pt-3 flex-fill">
        <h1><Link href={"/"}>Base Desires</Link></h1>
        <div className="sticky-top bg-body">
          { showSearch && <SearchBox /> }
        </div>

        <div className={cardRowStyle}>
          {Object.entries(sortedWarscrolls).map(([name, warscroll]) =>
            <div className="col-md-6" key={name}>
              <Card name={name} warscroll={warscroll} link={true} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Search
