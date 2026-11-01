import type { BadgeDesign } from "@reactive-resume/schema/resume/data";
import { Trans } from "@lingui/react/macro";
import {
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

type BadgeDesignMenuProps = {
	design: BadgeDesign;
	onChange: (patch: Partial<BadgeDesign>) => void;
	/** Opens the color picker for a custom badge color. */
	onPickColor: () => void;
};

/** The "Badge design" submenu of a section whose layout is Badges: style, shape, size and color. */
export function BadgeDesignMenu({ design, onChange, onPickColor }: BadgeDesignMenuProps) {
	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<Icon name="palette" />
				<Trans>Badge design</Trans>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent>
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
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="soft">
							<Trans context="Badge style: light tinted background">Soft</Trans>
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="outline">
							<Trans context="Badge style: border only">Outline</Trans>
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
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="rounded">
							<Trans context="Badge shape: slightly rounded corners">Rounded</Trans>
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="square">
							<Trans context="Badge shape: sharp corners">Square</Trans>
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
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="medium">
							<Trans context="Badge size">Medium</Trans>
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="large">
							<Trans context="Badge size">Large</Trans>
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
