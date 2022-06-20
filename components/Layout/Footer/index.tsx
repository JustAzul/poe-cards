import Link from 'next/link';
import { useMemo } from 'react';

interface Props {
    parent: string
}

const DevURL: string = 'https://github.com/JustAzul/poe-cards';

function getFullYear() {
  return new Date().getFullYear();
}

export default function Footer({ parent }: Props) {
  return useMemo(() => (
        <div className="text-center mt-2 pb-3">
            <footer className="blockquote-footer">
                Copyright © <cite title={parent}><Link href="/"><a className="text-decoration-none">{parent}</a></Link></cite> 2019 - {getFullYear()}. Powered by <cite title="poe.ninja"><Link href="https://poe.ninja/"><a className="text-decoration-none" target="poe.ninja">poe.ninja</a></Link></cite>, Developed by <cite
                title="Azul"><Link href={DevURL}><a className="text-decoration-none" target={DevURL}>Azul</a></Link></cite>.
            </footer>
        </div>
  ), [DevURL, parent, getFullYear()]);
}
