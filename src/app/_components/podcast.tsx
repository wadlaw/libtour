"use client";

import { type ReactNode } from "react";
import { useTheme } from "next-themes";
import { PodcastLinkProvider, usePodcastLink } from "~/context/podcast-context";
import { Play, Square } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

// Wrap the Provider around the children
export default function PodcastWrapper({ children }: { children: ReactNode }) {
  return <PodcastLinkProvider>{children}</PodcastLinkProvider>;
}

export function Podcast() {
  const { resolvedTheme } = useTheme();
  const { podcastLink } = usePodcastLink();
  const src = `${podcastLink}/${resolvedTheme}`;
  console.log(src);
  if (!podcastLink) return null;
  return (
    <div className="h-112 sticky top-0 z-[2] w-full bg-background">
      <iframe
        className=""
        width="100%"
        height="112"
        frameBorder="0"
        scrolling="no"
        style={{
          width: "100%",
          height: "112px",
          overflow: "hidden",
          backgroundColor: "transparent",
        }}
        src={`${src}`}
      ></iframe>
      {/* Dark-mode dimmer overlay; clicks pass through because of pointer-events-none */}
      <div className="pointer-events-none absolute inset-y-0 left-28 right-0 bg-transparent dark:bg-black/40" />
      <Separator />
    </div>
  );
}

type PlayPodcastProps = {
  podcastLink: string;
  eventName: string;
  stopOnly?: boolean;
};
export function PlayPodcast({
  podcastLink,
  stopOnly = false,
}: PlayPodcastProps) {
  const pod = usePodcastLink();
  const isPlaying = pod.podcastLink === podcastLink;

  if (stopOnly) {
    if (pod.podcastLink !== "") {
      return (
        <Button onClick={() => pod.updatePodcastLink("")} variant="default">
          <Square />
          Stop Podcast
        </Button>
      );
    } else {
      return;
    }
  }

  const togglePlayback = () => {
    pod.updatePodcastLink(isPlaying ? "" : podcastLink);
  };

  return (
    <Button onClick={togglePlayback} variant="default">
      {isPlaying ? <Square /> : <Play />}
      {isPlaying ? "Stop Podcast" : "Load Podcast"}
    </Button>
  );
}
