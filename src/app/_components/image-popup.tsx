"use client";

import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import Image from "next/image";

type ImagePopupProps = {
  imageUrl: string;
  size?: number;
};

export function ImagePopup({ imageUrl, size = 100 }: ImagePopupProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Image
          src={imageUrl}
          alt="Image"
          width={size}
          height={size}
          objectFit="contain"
        />
      </DialogTrigger>
      <DialogContent className="overflow-clip p-0">
        <Image
          src={imageUrl}
          alt="Image"
          objectFit="contain"
          width={600}
          height={600}
        />
      </DialogContent>
    </Dialog>
  );
}
