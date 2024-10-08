import Link from 'next/link';
import React from 'react';
import { SearchContextType, useSearchContext } from '../context/search';
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
  const { setSearchBoxHasPriority } = useSearchContext() as SearchContextType
  
  const handleClick = () => {
    setSearchBoxHasPriority(false)
  }

  const partial = (part: TPart) => {
    switch (part.element) {
      case 'link':
        return <Link href={`/?s=${toStandard(part.text)}`} onClick={handleClick}>{part.text}</Link>;
      case 'text':
        return <span>{part.text}</span>
      case 'small':
        return <small>{part.text}</small>
    }
  }

  return (
    <>
      {parts.map((part, index) =>
        <React.Fragment key={index}>
          { partial(part) }
        </React.Fragment>
      )}
    </>
  )
}
