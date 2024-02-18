import Link from 'next/link';
import React from 'react';
import { toStandard } from '../utils/text';

interface ILinksProps {
  parts: TPart[]
}

export type TPart = {
  text: string
  element: 'link' | 'text' | 'small'
}

export const Links: React.FC<ILinksProps> = props => {
  const { parts } = props

  return (
    <>
      {parts.map((part, index) =>
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
    </>
  )
}
