import Image from "next/image";

import { cn } from "@/lib/utils";
import { branding } from "@/constants/branding";

type AppBrandProps = {
  className?: string;
  logoClassName?: string;
  textClassName?: string;
  showText?: boolean;
  priority?: boolean;
};

export function AppBrand({
  className,
  logoClassName,
  textClassName,
  showText = true,
  priority = false,
}: AppBrandProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src={branding.APP_LOGO_SRC}
        alt={`${branding.APP_NAME} logo`}
        width={40}
        height={40}
        priority={priority}
        className={cn("size-8 shrink-0", logoClassName)}
      />
      {showText ? (
        <span className={cn("truncate font-semibold", textClassName)}>{branding.APP_NAME}</span>
      ) : null}
    </div>
  );
}
