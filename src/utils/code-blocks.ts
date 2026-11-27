// Code blocks of the articles, in the three variants of the style sheet (design/jks9.dev/PLANCHE_STYLE.md):
//
//   ```ts                                   code (variant 1): pale green, the language in a green tab
//   ```output title="Webhook · #alerts"     output (variant 5): solid green, white text, a header. Never code to copy.
//   ```diff title="product.ts"              changes (variant 6): ink frame, file name and +n −n in the header,
//                                           added lines on pale orange, removed ones struck through on pale green
//
// Each block becomes <figure class="code code-…"><figcaption>…</figcaption><pre>…</pre></figure>.
// The styles live in src/layouts/BlogPost.astro.
import type { Element, ElementContent } from 'hast';
import type { ShikiTransformer, ThemeRegistration } from 'shiki';

// Only three token styles, like the mockups: bold keywords, green italic comments, rust strings
export const risoTheme: ThemeRegistration = {
	name: 'riso',
	type: 'light',
	colors: {
		'editor.background': '#EEF3F1',
		'editor.foreground': '#1F2D28',
	},
	tokenColors: [
		{
			scope: ['comment', 'punctuation.definition.comment'],
			settings: { foreground: '#2F6152', fontStyle: 'italic' },
		},
		{
			scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string', 'string.regexp'],
			settings: { foreground: '#B84213' },
		},
		{
			// Words only: operators like "=" or "=>" stay in the regular weight
			scope: [
				'keyword.control',
				'keyword.other',
				'keyword.operator.new',
				'keyword.operator.expression',
				'keyword.operator.word',
				'storage',
				'storage.type',
				'storage.modifier',
				'variable.language',
				'constant.language',
			],
			settings: { fontStyle: 'bold' },
		},
	],
};

// Language names shown in the tab: short and lower case, like the mockups ("ts", "bash")
const TAB_LABELS: Record<string, string> = {
	typescript: 'ts',
	javascript: 'js',
	shellscript: 'bash',
	sh: 'bash',
	shell: 'bash',
};

const text = (value: string): ElementContent => ({ type: 'text', value });
const span = (className: string, value: string): Element => ({
	type: 'element',
	tagName: 'span',
	properties: { className: [className] },
	children: [text(value)],
});

export const risoCodeBlocks: ShikiTransformer = {
	name: 'riso-code-blocks',
	line(node, line) {
		const lang = this.options.lang;
		const source = this.source.split('\n')[line - 1] ?? '';
		if (lang === 'diff') {
			if (source.startsWith('+')) this.addClassToHast(node, 'added');
			else if (source.startsWith('-')) this.addClassToHast(node, 'removed');
			return;
		}
		// Output lines starting with "•": the bullet gets its own span, printed in pale orange
		if (lang === 'output' && source.startsWith('•')) {
			const token = node.children[0];
			const first = token?.type === 'element' ? token.children[0] : undefined;
			if (token?.type === 'element' && first?.type === 'text' && first.value.startsWith('•')) {
				first.value = first.value.slice(1);
				token.children.unshift(span('bullet', '•'));
			}
		}
	},
	root(root) {
		const pre = root.children[0];
		// Inline code (`<Code inline />`) comes as <code>: leave it alone
		if (!pre || pre.type !== 'element' || pre.tagName !== 'pre') return;

		const lang = this.options.lang;
		const meta = (this.options.meta as { __raw?: string } | undefined)?.__raw ?? '';
		const title = /title="([^"]*)"/.exec(meta)?.[1];
		const lines = this.source.split('\n');

		let variant: string;
		let caption: ElementContent[] | null;
		if (lang === 'output') {
			variant = 'output';
			caption = [text(title ?? 'Output')];
		} else if (lang === 'diff') {
			variant = 'diff';
			const added = lines.filter((line) => line.startsWith('+')).length;
			const removed = lines.filter((line) => line.startsWith('-')).length;
			caption = [
				span('file', title ?? 'Changes'),
				{
					type: 'element',
					tagName: 'span',
					properties: { className: ['count'] },
					children: [
						span('count-added', `+${added}`),
						text(' '),
						span('count-removed', `−${removed}`),
					],
				},
			];
		} else {
			variant = 'source';
			const label = title ?? (lang === 'plaintext' || lang === 'text' ? null : (TAB_LABELS[lang] ?? lang));
			caption = label ? [text(label)] : null;
		}

		root.children = [
			{
				type: 'element',
				tagName: 'figure',
				properties: { className: ['code', `code-${variant}`] },
				children: [
					...(caption ? [{ type: 'element', tagName: 'figcaption', properties: {}, children: caption } as Element] : []),
					pre,
				],
			},
		];
	},
};
