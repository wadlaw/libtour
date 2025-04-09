import Link from "next/link";
import {
  LibH1,
  LibMainFixed,
  LibCardContainer,
  LibCardNarrow,
} from "../_components/lib-elements";
import LinkCopyButton from "../_components/link-copy-button";
import Image from "next/image";

const playerLinks = {
  overcast: "https://overcast.fm/+BOmwyFKcN8",
  apple: "https://podcasts.apple.com/gb/podcast/libpod/id1807327572",
  spotify: "https://open.spotify.com/show/6KvVVcTXd0lrHSu3Xx7Wng",
  pocketcasts: "https://pca.st/qx080zz0",
  homepage: "https://pod.libtour.net/@libpod",
  rss: "https://pod.libtour.net/@libpod/feed.xml",
  embedded:
    "https://embed.podcasts.apple.com/gb/podcast/libpod/id1807327572?itscg=30200&amp;itsct=podcast_box_player&amp;ls=1&amp;mttnsubad=1807327572&amp;theme=auto",
};

export default function Podcast() {
  return (
    <LibMainFixed>
      <div className="flex flex-col items-center gap-8">
        <LibH1>Podcast</LibH1>
        <LibCardContainer splitAtLargeSizes={true} forceWidth={true}>
          <LibCardNarrow title="Player">
            <iframe
              height="450"
              width="100%"
              title="Media player"
              src={playerLinks.embedded}
              id="embedPlayer"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
              allow="autoplay *; encrypted-media *; clipboard-write"
              style={{
                border: "0px",
                borderRadius: "12px",
                width: "100%",
                height: "450px",
                maxWidth: "660px",
              }}
            ></iframe>
          </LibCardNarrow>
          <LibCardNarrow title="Other Ways to Listen">
            <div className="flex w-full flex-col items-center gap-8">
              {/* Homepage Link */}
              <Link href={playerLinks.homepage} target="_blank">
                <div className="flex h-[40px] w-[165px] overflow-clip rounded-md ring-1 ring-[hsl(var(--muted))] hover:ring-2 hover:ring-[hsl(var(--muted-foreground))]">
                  <Image
                    className="rounded-md"
                    src="/libpod-logo.png"
                    alt="Libpod Homepage"
                    width={40}
                    height={40}
                  />
                  <div className="h-full w-full flex-grow">
                    <div className="flex h-full w-full flex-col place-items-center justify-center text-lg font-bold">
                      Homepage
                    </div>
                  </div>
                </div>
              </Link>
              {/* Light Mode Links */}

              <Link
                className="rounded-md hover:ring-2 hover:ring-[hsl(var(--muted-foreground))] dark:hidden"
                href={playerLinks.spotify}
                target="_blank"
              >
                <Image
                  src="/spotify-podcast-badge-blk-grn-330x80.svg"
                  alt="Listen on Spotify"
                  width={165}
                  height={40}
                />
              </Link>
              <Link
                className="rounded-md hover:ring-2 hover:ring-[hsl(var(--muted-foreground))] dark:hidden"
                href={playerLinks.apple}
                target="_blank"
              >
                <Image
                  src="/apple-podcast-standard-black.svg"
                  alt="Apple Podcasts"
                  width={165}
                  height={40}
                />
              </Link>
              <Link
                className="rounded-md hover:ring-2 hover:ring-[hsl(var(--muted-foreground))] dark:hidden"
                href={playerLinks.pocketcasts}
                target="_blank"
              >
                <Image
                  src="/pocketcasts-dark.svg"
                  alt="Pocket Casts"
                  width={165}
                  height={40}
                />
              </Link>
              {/* Dark Mode Links */}

              <Link
                className="hidden rounded-md hover:ring-2 hover:ring-[hsl(var(--muted-foreground))] dark:block"
                href={playerLinks.spotify}
                target="_blank"
              >
                <Image
                  src="/spotify-podcast-badge-wht-grn-330x80.svg"
                  alt="Listen on Spotify"
                  width={165}
                  height={40}
                />
              </Link>
              <Link
                className="hidden rounded-md hover:ring-2 hover:ring-[hsl(var(--muted-foreground))] dark:block"
                href={playerLinks.apple}
                target="_blank"
              >
                <Image
                  src="/apple-podcast-standard-white.svg"
                  alt="Apple Podcasts"
                  width={165}
                  height={40}
                />
              </Link>
              <Link
                href={playerLinks.pocketcasts}
                className="hidden rounded-md hover:ring-2 hover:ring-[hsl(var(--muted-foreground))] dark:block"
                target="_blank"
              >
                <Image
                  src="/pocketcasts-light.svg"
                  alt="Pocket Casts"
                  width={165}
                  height={40}
                />
              </Link>
              {/* Overcast Link */}
              <Link href={playerLinks.overcast} target="_blank">
                <div className="flex h-[40px] w-[165px] rounded-md ring-1 ring-[hsl(var(--muted))] hover:ring-2 hover:ring-[hsl(var(--muted-foreground))]">
                  <Image
                    src="/overcast-logo.svg"
                    alt="Overcast"
                    width={40}
                    height={40}
                  />
                  <div className="h-full w-full flex-grow">
                    <div className="flex h-full w-full flex-col place-items-center justify-center text-lg font-bold">
                      Overcast
                    </div>
                  </div>
                </div>
              </Link>
              <LinkCopyButton
                buttonText="RSS Feed"
                url={playerLinks.rss}
                height={40}
                width={165}
                imgLink="/rss-icon.svg"
              />
            </div>
          </LibCardNarrow>
        </LibCardContainer>
      </div>
    </LibMainFixed>
  );
}
