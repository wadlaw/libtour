import { minidenticon } from "minidenticons";
import React, { type ImgHTMLAttributes, useMemo } from "react";

interface IdentityIconProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  username: string;
  saturation?: string | number;
  lightness?: string | number;
}

const IdentityIcon: React.FC<IdentityIconProps> = ({
  username,
  saturation = 70,
  lightness = 45,
  ...props
}) => {
  const svgText = useMemo(
    () => minidenticon(username, saturation, lightness),
    [username, saturation, lightness],
  );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`}
      alt={username}
      {...props}
    />
  );
};

export default IdentityIcon;
