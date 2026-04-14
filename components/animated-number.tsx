"use client";

import { useMemo } from "react";

import { easings, useCountUp, type EasingFn } from "@/lib/use-count-up";

type AnimatedNumberProps = {
  value: number;
  /** Fixed decimal places (kept stable during animation). Default 0. */
  decimals?: number;
  /** ms, default 1000 */
  duration?: number;
  /** Starting value on first mount; default 0 */
  from?: number;
  /** Override easing curve; default easings.outExpo */
  easing?: EasingFn;
  /** Locale for thousand separators etc. Default "en-US". */
  locale?: string;
  /** Rendered before the number. */
  prefix?: string;
  /** Rendered after the number (e.g. "%"). */
  suffix?: string;
  /** Render as a specific element (default <span>) — useful inside headings. */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
};

/**
 * Count-up primitive that animates to `value` on mount and on every change.
 * Uses `Intl.NumberFormat` for locale-aware thousand separators and fixed
 * decimal places; tabular-nums styling is applied so digit widths don't jump.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  duration,
  from,
  easing,
  locale = "en-US",
  prefix,
  suffix,
  as: Tag = "span",
  className,
}: AnimatedNumberProps) {
  const animated = useCountUp(value, { duration, from, easing });

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [locale, decimals]
  );

  const rendered = formatter.format(animated);

  return (
    <Tag className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {rendered}
      {suffix}
    </Tag>
  );
}

export { easings };
