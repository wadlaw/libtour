"use client";

import Image from "next/image";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

type LinkCopyButtonProps = {
  buttonText: string;
  url: string;
  height: number;
  width: number;
  imgLink: string;
};

export default function LinkCopyButton({
  buttonText,
  url,
  height,
  width,
  imgLink,
}: LinkCopyButtonProps) {
  const { toast } = useToast();

  return (
    <Button
      className={`px-0`}
      variant="outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          toast({
            title: "Link copied",
            description: `${url} copied to clipboard`,
          });
        } catch (err: unknown) {
          if (err instanceof Error) {
            toast({
              variant: "destructive",
              title: "Link not copied",
              description: `Unable to copy the link :(`,
            });
          }
        }
      }}
    >
      <div className={`flex h-[${height}px] w-[${width}px]`}>
        <Image src={imgLink} alt="Copy Link" height={height} width={height} />
        <div className="h-full w-full flex-grow">
          <div className="flex h-full w-full flex-col place-items-center justify-center text-lg font-bold">
            {buttonText}
          </div>
        </div>
      </div>
    </Button>
  );
}
