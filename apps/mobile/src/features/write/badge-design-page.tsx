import type { BadgeDesign } from "@reactive-resume/schema/resume/data";
import { useLingui } from "@lingui/react/macro";
import { View } from "react-native";
import { BadgeSample } from "./badge-sample";
import { ColorRow } from "./pickers";
import { Segmented, Text, useTheme } from "@/ui";

type BadgeDesignPageProps = {
	design: BadgeDesign;
	/** The section the badges belong to, for the preview's sample text. */
	sectionType: "skills" | "languages";
	/** The resume's primary, page background and text colors: the preview sits on the page like the badges. */
	resumeColors: { primary: string; background: string; text: string };
	onChange: (patch: Partial<BadgeDesign>) => void;
	/** Opens the color sheet; a blank color means the primary color. */
	onPickColor: () => void;
};

/** The Badge design page of a section whose layout is Badges: style, shape, size and color. */
export function BadgeDesignPage({ design, sectionType, resumeColors, onChange, onPickColor }: BadgeDesignPageProps) {
	const { t } = useLingui();
	const { radius, space } = useTheme();
	const color = design.color || resumeColors.primary;
	const sample = { design, color, textColor: resumeColors.text };

	return (
		<View style={{ gap: space.s4, paddingHorizontal: space.s4 }}>
			<View style={{ gap: space.s2 }}>
				<Text variant="label">{t`Preview`}</Text>
				<View
					style={{
						flexDirection: "row",
						flexWrap: "wrap",
						alignItems: "center",
						gap: space.s1,
						padding: space.s3,
						borderRadius: radius.rMd,
						backgroundColor: resumeColors.background,
					}}
				>
					{sectionType === "skills" ? (
						<>
							<BadgeSample {...sample}>{t`Skill`}</BadgeSample>
							<BadgeSample {...sample} secondary>
								{t`Keyword`}
							</BadgeSample>
						</>
					) : (
						<BadgeSample {...sample}>
							{`${t`Language`} · ${t({ message: "Fluent", context: "Sample language fluency in a badge preview" })}`}
						</BadgeSample>
					)}
				</View>
			</View>
			<View style={{ gap: space.s2 }}>
				<Text variant="label">{t`Style`}</Text>
				<Segmented<BadgeDesign["style"]>
					label={t`Style`}
					value={design.style}
					options={[
						{ value: "filled", label: t({ message: "Filled", context: "Badge style: solid background" }) },
						{ value: "soft", label: t({ message: "Soft", context: "Badge style: light tinted background" }) },
						{ value: "outline", label: t({ message: "Outline", context: "Badge style: border only" }) },
					]}
					onChange={(style) => onChange({ style })}
				/>
			</View>
			<View style={{ gap: space.s2 }}>
				<Text variant="label">{t`Shape`}</Text>
				<Segmented<BadgeDesign["shape"]>
					label={t`Shape`}
					value={design.shape}
					options={[
						{ value: "pill", label: t({ message: "Pill", context: "Badge shape: fully rounded ends" }) },
						{ value: "rounded", label: t({ message: "Rounded", context: "Badge shape: slightly rounded corners" }) },
						{ value: "square", label: t({ message: "Square", context: "Badge shape: sharp corners" }) },
					]}
					onChange={(shape) => onChange({ shape })}
				/>
			</View>
			<View style={{ gap: space.s2 }}>
				<Text variant="label">{t`Size`}</Text>
				<Segmented<BadgeDesign["size"]>
					label={t`Size`}
					value={design.size}
					options={[
						{ value: "small", label: t({ message: "Small", context: "Badge size" }) },
						{ value: "medium", label: t({ message: "Medium", context: "Badge size" }) },
						{ value: "large", label: t({ message: "Large", context: "Badge size" }) },
					]}
					onChange={(size) => onChange({ size })}
				/>
			</View>
			<ColorRow label={design.color ? t`Custom color` : t`Primary color`} value={color} onPress={onPickColor} />
		</View>
	);
}
