import type { BadgeDesign } from "@reactive-resume/schema/resume/data";
import { isDarkColor, parseColorString, rgbaStringToHex } from "@reactive-resume/utils/color";

/** Corner radius per badge shape, in points (PDF) or pixels (previews). */
export const badgeRadius = { pill: 999, rounded: 3, square: 0 } as const satisfies Record<BadgeDesign["shape"], number>;

/** Text scale and padding per badge size, in points (PDF) or pixels (previews). */
export const badgeSize = {
	small: { scale: 0.85, paddingHorizontal: 4, paddingVertical: 1 },
	medium: { scale: 1, paddingHorizontal: 6, paddingVertical: 2 },
	large: { scale: 1.15, paddingHorizontal: 8, paddingVertical: 3 },
} as const satisfies Record<BadgeDesign["size"], { scale: number; paddingHorizontal: number; paddingVertical: number }>;

/** Colors for one badge: `transparent` background for outlines, `undefined` text to inherit the surrounding text. */
export type BadgeColors = { background: string; border: string; text: string | undefined };

/** `color` at `opacity` times its own alpha, as `rgba()`; unparsable colors fall back to their hex form. */
export const tintColor = (color: string, opacity: number): string => {
	const parsed = parseColorString(color);
	if (!parsed) return rgbaStringToHex(color);
	const alpha = Math.max(0, Math.min(1, parsed.a * opacity));
	return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${alpha})`;
};

/**
 * The main badge (an item's name) and the lighter secondary badge (its keywords) for a badge style in `color`,
 * so the PDF and the editor previews draw the same badge.
 */
export const getBadgeColors = (
	style: BadgeDesign["style"],
	color: string,
): { main: BadgeColors; secondary: BadgeColors } => {
	switch (style) {
		case "soft":
			return {
				main: { background: tintColor(color, 0.15), border: tintColor(color, 0.15), text: color },
				secondary: { background: tintColor(color, 0.07), border: tintColor(color, 0.07), text: undefined },
			};
		case "outline":
			return {
				main: { background: "transparent", border: color, text: color },
				secondary: { background: "transparent", border: tintColor(color, 0.4), text: undefined },
			};
		default:
			return {
				main: { background: color, border: color, text: isDarkColor(color) ? "#ffffff" : "#000000" },
				secondary: { background: tintColor(color, 0.15), border: tintColor(color, 0.15), text: undefined },
			};
	}
};
