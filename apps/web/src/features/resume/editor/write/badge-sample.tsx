import type { BadgeDesign } from "@reactive-resume/schema/resume/data";
import type { ReactNode } from "react";
import { badgeRadius, badgeSize, getBadgeColors } from "@reactive-resume/resume/badge";

/** Font size of a medium preview badge, in pixels; other sizes scale from it like the PDF does. */
const BASE_FONT_SIZE = 11;

type BadgeSampleProps = {
	design: BadgeDesign;
	/** The badge color: the design's custom color, else the resume's primary color. */
	color: string;
	/** A keyword badge, lighter than the main one. */
	secondary?: boolean;
	children: ReactNode;
};

/** A badge drawn with the same colors, shape and size rules as the PDF, for previews in the editor. */
export function BadgeSample({ design, color, secondary = false, children }: BadgeSampleProps) {
	const colors = getBadgeColors(design.style, color);
	const { background, border, text } = secondary ? colors.secondary : colors.main;
	const size = badgeSize[design.size];

	return (
		<span
			aria-hidden
			className="inline-flex shrink-0 items-center leading-tight whitespace-nowrap"
			style={{
				backgroundColor: background,
				borderColor: border,
				borderStyle: "solid",
				borderWidth: 1,
				borderRadius: badgeRadius[design.shape],
				color: text,
				fontSize: BASE_FONT_SIZE * size.scale * (secondary ? 0.875 : 1),
				fontWeight: secondary ? undefined : 600,
				padding: `${size.paddingVertical}px ${size.paddingHorizontal}px`,
			}}
		>
			{children}
		</span>
	);
}
