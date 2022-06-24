import React from 'react';

interface ICardProps {
  name: string
  warscroll: TWarscroll
  link: boolean
  showFaction: boolean
}

const Card: React.FC<ICardProps> = props => {
  const { name, warscroll, link, showFaction } = props

  return (
    <div className="card warscroll-card mb-3">
      <div className="card-body">
        <h2>{ link ? <Link to={`/${toStandard(name)}/`}>{name}</Link> : <>{name}</>}</h2>
        <p className="card-text">{ warscroll.baseSize }</p>
        { warscroll.notes && <p className="card-text card-notes">{ warscroll.notes }</p>}
      </div>
      { showFaction &&
        <div className="card-footer">
          <p className="card-text text-center card-faction">{ toDisplay(warscroll.faction) }</p>
        </div>
      }
    </div>
  )
}