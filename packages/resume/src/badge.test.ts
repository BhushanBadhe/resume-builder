import { describe, expect, it } from "vite-plus/test";
import { getBadgeColors, tintColor } from "./badge";

const red = "rgba(220, 38, 38, 1)";

describe("tintColor", () => {
	it("scales the color's own alpha", () => {
		expect(tintColor(red, 0.15)).toBe("rgba(220, 38, 38, 0.15)");
		expect(tintColor("rgba(220, 38, 38, 0.5)", 0.5)).toBe("rgba(220, 38, 38, 0.25)");
	});
});

describe("getBadgeColors", () => {
	it("fills the main badge and picks readable text", () => {
		expect(getBadgeColors("filled", red).main).toEqual({ background: red, border: red, text: "#ffffff" });
		expect(getBadgeColors("filled", "rgba(250, 204, 21, 1)").main.text).toBe("#000000");
	});

	it("tints soft badges and colors their text", () => {
		expect(getBadgeColors("soft", red).main).toEqual({
			background: "rgba(220, 38, 38, 0.15)",
			border: "rgba(220, 38, 38, 0.15)",
			text: red,
		});
	});

	it("draws only a border for outline badges", () => {
		const { main, secondary } = getBadgeColors("outline", red);
		expect(main).toEqual({ background: "transparent", border: red, text: red });
		expect(secondary).toEqual({ background: "transparent", border: "rgba(220, 38, 38, 0.4)", text: undefined });
	});
});
