import Image from 'next/image';
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';

export default function Header() {
  return (
    <div className="w-full absolute bg-transparent">
      <div className="flex items-center justify-between px-6 py-2">
        <a href="https://axilla.io" target="_blank">
          <Image src="/axilla-logo-text-white.png" height={30} width={90} alt="Axilla logo" />
        </a>

        <div className="flex items-center">
          <p className="text-xs font-mono px-2">made with ax</p>
          <a href="https://github.com/axilla-io/ax" target="_blank">
            <p className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0">
              <GitHubLogoIcon />
            </p>
          </a>
          <a href="https://twitter.com/axilla_io" target="_blank">
            <p className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0">
              <TwitterLogoIcon />
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
