// Images drawn at build time with Satori (layout → SVG) and resvg (SVG → PNG), from the boards
// "Image d'aperçu" and "Icône d'onglet" of the mockups canvas:
//   - siteImage: home, about, 404 (the cover, without the N°9 stamp, with the tagline of option 2)
//   - blogImage: the blog and topic pages (option 5, the table of contents)
//   - articleImage: one per article (option 9: issue number, topics, title off register, date)
//   - favicon: option 5, "J9" in white on a green square
// Fonts are TTF files in src/assets/fonts (Satori can't read WOFF2), under the SIL Open Font License.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

const INK = '#1F2D28';
const GREEN = '#2F6152';
const ORANGE = '#FF6C2F';
const ORANGE_TEXT = '#C94A16';
const PAPER = '#FFFFFF';

export const SHARE_WIDTH = 1200;
export const SHARE_HEIGHT = 630;

// A minimal element factory, the shape Satori reads (no JSX in a .ts file)
type Style = Record<string, string | number>;
type Node = string | SatoriElement;
interface SatoriElement {
	type: string;
	props: { style?: Style; children?: Node | Node[] };
}
const box = (style: Style, ...children: Node[]): SatoriElement => ({
	type: 'div',
	props: { style: { display: 'flex', ...style }, children },
});

let fonts: Promise<Parameters<typeof satori>[1]['fonts']> | undefined;
function loadFonts() {
	const font = (file: string) => readFile(join(process.cwd(), 'src/assets/fonts', file));
	fonts ??= Promise.all([
		font('RubikMonoOne-Regular.ttf'),
		font('CourierPrime-Regular.ttf'),
		font('CourierPrime-Bold.ttf'),
		font('ReenieBeanie.ttf'),
	]).then(([rubik, courier, courierBold, reenie]) => [
		{ name: 'Rubik Mono One', data: rubik, weight: 400, style: 'normal' },
		{ name: 'Courier Prime', data: courier, weight: 400, style: 'normal' },
		{ name: 'Courier Prime', data: courierBold, weight: 700, style: 'normal' },
		{ name: 'Reenie Beanie', data: reenie, weight: 400, style: 'normal' },
	]);
	return fonts;
}

/** The layout as SVG: every letter becomes a path, so the file needs no font */
export async function renderSvg(element: SatoriElement, width: number, height: number): Promise<string> {
	return satori(element as Parameters<typeof satori>[0], { width, height, fonts: await loadFonts() });
}

export async function renderPng(element: SatoriElement, width: number, height: number, outputWidth = width) {
	const svg = await renderSvg(element, width, height);
	return new Resvg(svg, { fitTo: { mode: 'width', value: outputWidth } }).render().asPng();
}

/** A title printed twice, the orange layer shifted under the green one, both multiplied */
function overprint(text: string, style: Style, offset: number): SatoriElement {
	const layer = (color: string, shift: number): SatoriElement =>
		box(
			{
				position: 'absolute',
				top: shift,
				left: shift,
				width: '100%',
				color,
				mixBlendMode: 'multiply',
			},
			text,
		);
	return box(
		{ position: 'relative', fontFamily: 'Rubik Mono One', ...style },
		layer(ORANGE, offset),
		layer(GREEN, 0),
		// Invisible copy in the flow, so the box takes the height of the wrapped title
		box({ color: 'transparent' }, text),
	);
}

/** The two logo dots: orange printed off register under the green one */
function logoDots(size: number): SatoriElement {
	const dot = (color: string, x: number, y: number): SatoriElement =>
		box({
			position: 'absolute',
			top: y,
			left: x,
			width: size,
			height: size,
			borderRadius: size,
			background: color,
			mixBlendMode: 'multiply',
		});
	return box(
		{ position: 'relative', width: size + size * 0.14, height: size + size * 0.07 },
		dot(ORANGE, size * 0.14, size * 0.07),
		dot(GREEN, 0, 0),
	);
}

const kicker = (text: string, style: Style = {}): SatoriElement =>
	box(
		{
			fontFamily: 'Rubik Mono One',
			fontSize: 26,
			letterSpacing: 3.6,
			color: ORANGE_TEXT,
			textTransform: 'uppercase',
			...style,
		},
		text,
	);

const page = (...children: Node[]): SatoriElement =>
	box(
		{
			position: 'relative',
			width: SHARE_WIDTH,
			height: SHARE_HEIGHT,
			flexDirection: 'column',
			background: PAPER,
			color: INK,
			fontFamily: 'Courier Prime',
		},
		...children,
	);

/** Home, about, 404: the zine cover */
export function siteImage(): SatoriElement {
	return page(
		kicker('Web scraping in production', { position: 'absolute', left: 72, top: 60 }),
		overprint('JKS9', { position: 'absolute', left: 72, top: 112, fontSize: 250, lineHeight: 1 }, 12),
		box(
			{ position: 'absolute', left: 72, top: 404, width: 1060, flexDirection: 'column', fontSize: 40, lineHeight: 1.35 },
			box({}, 'Articles and open-source tools on'),
			box(
				{ alignSelf: 'flex-start' },
				box(
					{
						backgroundImage: `linear-gradient(to bottom, transparent 58%, ${ORANGE} 58%, ${ORANGE} 92%, transparent 92%)`,
					},
					'web scraping in production.',
				),
			),
		),
		box(
			{
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: 0,
				height: 64,
				alignItems: 'center',
				paddingLeft: 72,
				background: GREEN,
				color: PAPER,
				fontFamily: 'Rubik Mono One',
				fontSize: 24,
				letterSpacing: 2,
			},
			'JKS9.DEV',
		),
	);
}

/** The blog and topic pages: a table of contents. Generic lines, so the image never goes stale. */
export function blogImage(): SatoriElement {
	const row = (number: string, text: string, latest = false): SatoriElement =>
		box(
			{ alignItems: 'baseline', padding: '20px 0', borderBottom: `4px dashed ${GREEN}`, fontSize: 36 },
			box({ width: 176, fontFamily: 'Rubik Mono One', color: latest ? ORANGE_TEXT : GREEN }, number),
			box({ fontWeight: 700 }, text),
		);
	return page(
		box(
			{ position: 'absolute', left: 72, right: 72, top: 56, justifyContent: 'space-between', alignItems: 'center' },
			box({ fontFamily: 'Rubik Mono One', fontSize: 52, color: GREEN }, 'CONTENTS'),
			box(
				{ fontFamily: 'Reenie Beanie', fontSize: 50, color: ORANGE_TEXT, transform: 'rotate(-3deg)' },
				'web scraping in production',
			),
		),
		box(
			{ position: 'absolute', left: 72, right: 72, top: 150, flexDirection: 'column', borderTop: `6px solid ${INK}` },
			row('N°01', 'Scrapers that survive', true),
			row('N°02', "Pipelines that don't lose items"),
			row('N°03', 'Alerts that tell you once'),
		),
		box(
			{ position: 'absolute', left: 72, bottom: 44, alignItems: 'center', fontFamily: 'Rubik Mono One', fontSize: 26 },
			box({ color: GREEN }, 'JKS9'),
			box({ color: ORANGE_TEXT, marginLeft: 14 }, '· jks9.dev'),
		),
	);
}

export interface ArticleImage {
	issue: number;
	tags: string[];
	title: string;
	date: Date;
}

/** One per article: issue number, topics, the title off register, the date */
export function articleImage({ issue, tags, title, date }: ArticleImage): SatoriElement {
	const number = String(issue).padStart(2, '0');
	// Long titles get smaller so they never run into the footer (4 lines at most)
	const fontSize = title.length <= 36 ? 72 : title.length <= 64 ? 62 : title.length <= 90 ? 52 : 44;
	const day = date.toLocaleDateString('en-us', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
	return page(
		kicker([`Issue ${number}`, ...tags].join(' · '), { position: 'absolute', left: 72, top: 64, fontSize: 24 }),
		box(
			{
				position: 'absolute',
				right: 64,
				top: 52,
				padding: '4px 16px',
				border: `5px solid ${ORANGE_TEXT}`,
				fontFamily: 'Rubik Mono One',
				fontSize: 30,
				color: ORANGE_TEXT,
				transform: 'rotate(-6deg)',
			},
			`N°${number}`,
		),
		overprint(title, { position: 'absolute', left: 72, top: 124, width: 960, fontSize, lineHeight: 1.14 }, 6),
		box(
			{
				position: 'absolute',
				left: 72,
				right: 72,
				bottom: 56,
				justifyContent: 'space-between',
				alignItems: 'center',
				paddingTop: 24,
				borderTop: `6px solid ${INK}`,
			},
			box(
				{ alignItems: 'center' },
				logoDots(44),
				box({ marginLeft: 16, fontFamily: 'Rubik Mono One', fontSize: 30, color: GREEN }, 'JKS9'),
			),
			box({ fontSize: 28, color: GREEN }, `jks9.dev · ${day}`),
		),
	);
}

/** Option 5: "J9" in white on a green square, rounded unless iOS rounds it itself */
export function favicon(rounded = true): SatoriElement {
	return box(
		{
			width: 64,
			height: 64,
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: rounded ? 10 : 0,
			background: GREEN,
			color: PAPER,
			fontFamily: 'Rubik Mono One',
			fontSize: 26,
		},
		'J9',
	);
}

/** An .ico file holding PNG images (every browser since IE Vista reads PNG inside ICO) */
export function icoFromPngs(pngs: { size: number; data: Buffer }[]): Buffer {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(pngs.length, 4);
	let offset = 6 + 16 * pngs.length;
	const entries = pngs.map(({ size, data }) => {
		const entry = Buffer.alloc(16);
		entry.writeUInt8(size >= 256 ? 0 : size, 0);
		entry.writeUInt8(size >= 256 ? 0 : size, 1);
		entry.writeUInt8(0, 2);
		entry.writeUInt8(0, 3);
		entry.writeUInt16LE(1, 4);
		entry.writeUInt16LE(32, 6);
		entry.writeUInt32LE(data.length, 8);
		entry.writeUInt32LE(offset, 12);
		offset += data.length;
		return entry;
	});
	return Buffer.concat([header, ...entries, ...pngs.map((png) => png.data)]);
}
