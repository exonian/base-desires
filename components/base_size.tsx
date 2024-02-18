import React from 'react';
import { Links, TPart } from './links';

interface IBaseSizeProps {
  baseSize: string
}

export const BaseSize: React.FC<IBaseSizeProps> = props => {
  const { baseSize } = props
  const baseSizeParts: TPart[] = baseSize.split(', ').reduce((accum, text, index) => {
    if (index > 0) accum.push({ text: ', ', element: 'text' })

    const square_brace_position = text.indexOf('[')
    if (square_brace_position > -1) {
        accum.push({ text: text.slice(0, square_brace_position).trim(), element: 'link' })
        accum.push({ text: ' ' + text.slice(square_brace_position).trim(), element: 'small' })
    }
    else accum.push({ text: text, element: 'link' })

    return accum
  }, [] as TPart[])

  return (
    <p className="card-text card-base-size">
      <Links parts={baseSizeParts} />
    </p>
  )
}
