import type { BadgeDesign } from "@reactive-resume/schema/resume/data";
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { badgeRadius, badgeSize, getBadgeColors } from "@reactive-resume/resume/badge";

/** Font size of a medium preview badge; other sizes scale from it like the PDF does. */
const BASE_FONT_SIZE = 13;

type BadgeSampleProps = {
	design: BadgeDesign;
	/** The badge color: the design's custom color, else the resume's primary color. */
	color: string;
	/** The page's text color, for badges whose text inherits it. */
	textColor: string;
	/** A keyword badge, lighter than the main one. */
	secondary?: boolean;
	children: ReactNode;
};

/** A badge drawn with the same colors, shape and size rules as the PDF, for previews in the editor. */
export function BadgeSample({ design, color, textColor, secondary = false, children }: BadgeSampleProps) {
	const colors = getBadgeColors(design.style, color);
	const { background, border, text } = secondary ? colors.secondary : colors.main;
	const size = badgeSize[design.size];

	return (
		<View
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
			style={{
				backgroundColor: background,
				borderColor: border,
				borderWidth: 1,
				borderRadius: badgeRadius[design.shape],
				paddingHorizontal: size.paddingHorizontal,
				paddingVertical: size.paddingVertical,
			}}
		>
			<Text
				style={{
					color: text ?? textColor,
					fontSize: BASE_FONT_SIZE * size.scale * (secondary ? 0.875 : 1),
					fontWeight: secondary ? "400" : "600",
				}}
			>
				{children}
			</Text>
		</View>
	);
}
