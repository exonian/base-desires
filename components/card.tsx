import React from 'react';
import Link from 'next/link';

import { TWarscroll } from '../data/types';
import { toDisplay, toStandard } from '../utils/text';
import { BaseSize } from './base_size';
import { Links, TPart } from './links';

interface ICardProps {
  name: string
  warscroll: TWarscroll
  link: boolean
}

export const Card: React.FC<ICardProps> = props => {
  const { name, warscroll, link } = props
  const factions = warscroll.factions.map((faction) => toDisplay(faction))

  const factionParts: TPart[] = factions.reduce((accum, text, index) => {
    if (index > 0) accum.push({ text: ', ', element: 'text' })
    accum.push({ text: text, element: 'link' })

    return accum
  }, [] as TPart[])

  return (
    <div className="card warscroll-card mb-3">
      <div className="card-body">
        <h2>{ link ? <Link href={`/${toStandard(name)}/`}>{name}</Link> : <>{name}</>}</h2>
        <BaseSize baseSize={ warscroll.baseSize } />
        { warscroll.notes && <p className="card-text card-notes">{ warscroll.notes }</p>}
      </div>
      <div className="card-footer">
        <p className="card-text text-center card-faction"><Links parts={ factionParts } /></p>
      </div>
    </div>
  )
}
