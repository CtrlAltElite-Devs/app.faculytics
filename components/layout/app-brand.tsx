import Image from "next/image";

import { cn } from "@/lib/utils";
import { APP_LOGO_SRC, APP_NAME } from "@/constants/branding";

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
        src={APP_LOGO_SRC}
        alt={`${APP_NAME} logo`}
        width={40}
        height={40}
        priority={priority}
        className={cn("size-8 shrink-0", logoClassName)}
      />
      {showText ? (
        <span className={cn("truncate font-semibold", textClassName)}>{APP_NAME}</span>
      ) : null}
    </div>
  );
}
