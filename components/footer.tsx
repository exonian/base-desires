import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { game } from '../utils/env'

export const Footer: React.FC = () => {
  return (
    <footer className="footer text-center">
      <p>By Michael Blatherwick
        <a className="social-link" href="https://github.com/exonian"><FaGithub /> exonian</a>
        { game !== 'aos' && <Link className="social-link" href="https://basedesires.com">Base Desires</Link> }
        { game !== 'tow' && <Link className="social-link"  href="https://tow.basedesires.com">Base Desires²</Link> }
        { game !== '40k' && <Link className="social-link" href="https://40k.basedesires.com">Space Desires</Link> }
      </p>
      <blockquote className="blockquote pr-3">
        <p className="mb-0">&quot;basedesires.com. Haha can you imagine if that was a website about Warhammer bases…&quot;</p>
        <footer className="blockquote-footer">Me a few days ago...</footer>
      </blockquote>
    </footer>
  )
}
