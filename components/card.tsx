import React from 'react';
import Link from 'next/link';

import { TWarscroll } from '../warscrolls/types';
import { toDisplay, toStandard } from '../utils/text';

interface ICardProps {
  name: string
  warscroll: TWarscroll
  link: boolean
}

export const Card: React.FC<ICardProps> = props => {
  const { name, warscroll, link } = props
  const factions = warscroll.factions.map((faction) => toDisplay(faction)).join(', ')

  return (
    <div className="card warscroll-card mb-3">
      <div className="card-body">
        <h2>{ link ? <Link href={`/${toStandard(name)}/`}>{name}</Link> : <>{name}</>}</h2>
        <p className="card-text">{ warscroll.baseSize }</p>
        { warscroll.notes && <p className="card-text card-notes">{ warscroll.notes }</p>}
      </div>
      <div className="card-footer">
        <p className="card-text text-center card-faction">{ factions }</p>
      </div>
    </div>
  )
}
