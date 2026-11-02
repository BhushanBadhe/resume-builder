import type { BadgeDesign } from "@reactive-resume/schema/resume/data";
import { Trans } from "@lingui/react/macro";
import {
	DropdownMenuCheckboxItem,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@reactive-resume/ui/components/dropdown-menu";
import { Icon } from "@reactive-resume/ui/components/icon";
import { BadgeSample } from "./badge-sample";

type BadgeDesignMenuProps = {
	design: BadgeDesign;
	/** Whether the section currently prints as badges. */
	enabled: boolean;
	/** Turns the Badges layout on or off. */
	onEnabledChange: (enabled: boolean) => void;
	/** The section the badges belong to, for the preview's sample text. */
	sectionType: "skills" | "languages";
	/** The resume's primary, page background and text colors: the samples sit on the page like the badges. */
	resumeColors: { primary: string; background: string; text: string };
	onChange: (patch: Partial<BadgeDesign>) => void;
	/** Opens the color picker for a custom badge color. */
	onPickColor: () => void;
};

/**
 * The "Badge design" submenu of a Skills or Languages section: a switch for the Badges layout, then style, shape,
 * size and color. Always shown so badges are easy to find; choosing a design also turns badges on.
 */
export function BadgeDesignMenu({
	design,
	enabled,
	onEnabledChange,
	sectionType,
	resumeColors,
	onChange,
	onPickColor,
}: BadgeDesignMenuProps) {
	const color = design.color || resumeColors.primary;
	const paper = { backgroundColor: resumeColors.background, color: resumeColors.text };
	// Each choice shows a sample badge with that one setting changed, so the effect is visible before picking.
	const sample = (patch: Partial<BadgeDesign>) => (
		<span className="ms-auto rounded-sm p-0.5" style={paper}>
			<BadgeSample design={{ ...design, ...patch }} color={color}>
				Aa
			</BadgeSample>
		</span>
	);

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<Icon name="palette" />
				<Trans>Badge design</Trans>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent>
				<DropdownMenuCheckboxItem checked={enabled} onCheckedChange={onEnabledChange}>
					<Trans>Show as badges</Trans>
				</DropdownMenuCheckboxItem>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel>
						<Trans>Preview</Trans>
					</DropdownMenuLabel>
					<div className="mx-2 mb-1.5 flex flex-wrap items-center gap-1 rounded-sm p-1.5" style={paper}>
						{sectionType === "skills" ? (
							<>
								<BadgeSample design={design} color={color}>
									<Trans>Skill</Trans>
								</BadgeSample>
								<BadgeSample design={design} color={color} secondary>
									<Trans>Keyword</Trans>
								</BadgeSample>
							</>
						) : (
							<BadgeSample design={design} color={color}>
								<Trans>Language</Trans>
								<span className="ms-1 font-normal opacity-85">
									<Trans context="Sample language fluency in a badge preview">Fluent</Trans>
								</span>
							</BadgeSample>
						)}
					</div>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel>
						<Trans>Style</Trans>
					</DropdownMenuLabel>
					<DropdownMenuRadioGroup
						value={design.style}
						onValueChange={(value) => onChange({ style: value as BadgeDesign["style"] })}
					>
						<DropdownMenuRadioItem value="filled">
							<Trans context="Badge style: solid background">Filled</Trans>
							{sample({ style: "filled" })}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="soft">
							<Trans context="Badge style: light tinted background">Soft</Trans>
							{sample({ style: "soft" })}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="outline">
							<Trans context="Badge style: border only">Outline</Trans>
							{sample({ style: "outline" })}
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel>
						<Trans>Shape</Trans>
					</DropdownMenuLabel>
					<DropdownMenuRadioGroup
						value={design.shape}
						onValueChange={(value) => onChange({ shape: value as BadgeDesign["shape"] })}
					>
						<DropdownMenuRadioItem value="pill">
							<Trans context="Badge shape: fully rounded ends">Pill</Trans>
							{sample({ shape: "pill" })}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="rounded">
							<Trans context="Badge shape: slightly rounded corners">Rounded</Trans>
							{sample({ shape: "rounded" })}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="square">
							<Trans context="Badge shape: sharp corners">Square</Trans>
							{sample({ shape: "square" })}
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel>
						<Trans>Size</Trans>
					</DropdownMenuLabel>
					<DropdownMenuRadioGroup
						value={design.size}
						onValueChange={(value) => onChange({ size: value as BadgeDesign["size"] })}
					>
						<DropdownMenuRadioItem value="small">
							<Trans context="Badge size">Small</Trans>
							{sample({ size: "small" })}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="medium">
							<Trans context="Badge size">Medium</Trans>
							{sample({ size: "medium" })}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="large">
							<Trans context="Badge size">Large</Trans>
							{sample({ size: "large" })}
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel>
						<Trans>Color</Trans>
					</DropdownMenuLabel>
					<DropdownMenuRadioGroup
						value={design.color ? "custom" : "primary"}
						onValueChange={(value) => value === "primary" && onChange({ color: "" })}
					>
						<DropdownMenuRadioItem value="primary">
							<Trans>Primary color</Trans>
						</DropdownMenuRadioItem>
						{/* A click, not a value change, so choosing it again re-opens the picker to change the color. */}
						<DropdownMenuRadioItem value="custom" onClick={onPickColor}>
							{design.color && (
								<span
									className="size-3 shrink-0 rounded-sm border border-ink/60"
									style={{ backgroundColor: design.color }}
								/>
							)}
							<Trans>Custom color…</Trans>
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
