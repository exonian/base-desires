import { zip } from 'lodash';
import Link from 'next/link';
import React from 'react';
import { toStandard } from '../utils/text';

interface IBaseSizeProps {
  baseSize: string
}

type TPart = {
  text: string
  element: 'link' | 'text' | 'small'
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
      {baseSizeParts.map((part, index) =>
        <React.Fragment key={index}>
          {part.element === 'link' ? (
            <Link href={`/?s=${toStandard(part.text)}`}>{part.text}</Link>
          ) : (
            <>
              {part.element === 'text' ? (
                <span>{part.text}</span>
              ) : (
                <small>{part.text}</small>
              )}
            </>
          )}
        </React.Fragment>
      )}
    </p>
  )
}
