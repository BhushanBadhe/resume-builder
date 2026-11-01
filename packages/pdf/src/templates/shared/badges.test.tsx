import type { ResumeData } from "@reactive-resume/schema/resume/data";
import { describe, expect, it } from "vite-plus/test";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { act } from "react";
import { resumeDataSchema } from "@reactive-resume/schema/resume/data";
import { defaultResumeData } from "@reactive-resume/schema/resume/default";
import { ResumeDocument } from "../../document";
import { renderToBuffer } from "../../forme/testing";

const badgesFixture = (): ResumeData => {
	const data = structuredClone(defaultResumeData);
	data.sections.skills = {
		...data.sections.skills,
		title: "Skills",
		hidden: false,
		layout: "badges",
		columns: 1,
		items: [
			{
				id: "skill-0",
				hidden: false,
				icon: "",
				iconColor: "",
				name: "MS Excel",
				proficiency: "",
				level: 0,
				keywords: ["Pivot tables", "Charts"],
			},
			{
				id: "skill-1",
				hidden: false,
				icon: "",
				iconColor: "",
				name: "Communication",
				proficiency: "",
				level: 0,
				keywords: [],
			},
		],
	};
	data.metadata.template = "onyx";
	data.metadata.typography.body.fontFamily = "Helvetica";
	data.metadata.typography.heading.fontFamily = "Helvetica";
	data.metadata.layout.pages = [{ fullWidth: true, main: ["skills"], sidebar: [] }];
	return data;
};

const renderText = async (data: ResumeData) => {
	const bytes = new Uint8Array(await act(() => renderToBuffer(<ResumeDocument data={data} template="onyx" />)));
	const loading = getDocument({ data: bytes, useSystemFonts: true });
	try {
		const pdf = await loading.promise;
		const page = await pdf.getPage(1);
		return (await page.getTextContent()).items.flatMap((item) => ("str" in item && item.str.trim() ? [item.str] : []));
	} finally {
		await loading.destroy();
	}
};

describe("skills badges layout", () => {
	it("forces a single column when parsed", () => {
		const data = structuredClone(defaultResumeData);
		Object.assign(data.sections.skills, { layout: "badges", columns: 4 });
		const parsed = resumeDataSchema.parse(data);
		expect(parsed.sections.skills).toMatchObject({ layout: "badges", columns: 1 });
	});

	it("prints each skill name and keyword as its own badge", async () => {
		const text = await renderText(badgesFixture());
		expect(text).toEqual(expect.arrayContaining(["MS Excel", "Pivot tables", "Charts", "Communication"]));
		expect(text.join(" ")).not.toContain("Pivot tables, Charts");
	});
});

const languagesFixture = (): ResumeData => {
	const data = badgesFixture();
	data.sections.languages = {
		...data.sections.languages,
		title: "Languages",
		hidden: false,
		layout: "badges",
		columns: 1,
		items: [
			{ id: "lang-0", hidden: false, language: "Marathi", fluency: "Native", level: 0 },
			{ id: "lang-1", hidden: false, language: "English", fluency: "", level: 0 },
		],
	};
	data.metadata.layout.pages = [{ fullWidth: true, main: ["languages"], sidebar: [] }];
	return data;
};

describe("languages badges layout", () => {
	it("keeps the badges layout when parsed", () => {
		const data = structuredClone(defaultResumeData);
		Object.assign(data.sections.languages, { layout: "badges" });
		expect(resumeDataSchema.parse(data).sections.languages.layout).toBe("badges");
	});

	it("falls back to the default layout for unknown values", () => {
		const data = structuredClone(defaultResumeData);
		Object.assign(data.sections.languages, { layout: "inline" });
		expect(resumeDataSchema.parse(data).sections.languages.layout).toBe("default");
	});

	it("prints each language with its fluency", async () => {
		const text = await renderText(languagesFixture());
		expect(text).toEqual(expect.arrayContaining(["Marathi", "Native", "English"]));
	});
});
