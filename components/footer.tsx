import { FaGithub, FaTwitter } from 'react-icons/fa'

export const Footer: React.FC = () => {
  return (
    <footer className="footer text-center">
      <p>By Michael Blatherwick
        <a className="social-link" href="https://twitter.com/rogue_michael"><FaTwitter /> @rogue_michael</a>
        <a className="social-link" href="https://github.com/exonian"><FaGithub /> exonian</a>
      </p>
      <blockquote className="blockquote pr-3">
        <p className="mb-0">&quot;basedesires.com. Haha can you imagine if that was a website about Warhammer bases…&quot;</p>
        <footer className="blockquote-footer">Me a few days ago...</footer>
      </blockquote>
    </footer>
  )
}
