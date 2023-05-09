import { getHighlighter } from 'shiki';

const THEME = 'nord';

/**
  * Returns code with curly braces and backticks replaced by HTML entity equivalents
  * @param {string} html - highlighted HTML
  * @returns {string} - escaped HTML
  */
  function escapeHtml(code) {
    return code.replace(
      /[{}`]/g,
      (character) => ({ '{': '&lbrace;', '}': '&rbrace;', '`': '&grave;' }[character]),
    );
  }

/**
 * @param code {string} - code to highlight
 * @param lang {string} - code language
 * @param meta {string} - code meta
 * @returns {Promise<string>} - highlighted html
 */
async function highlighter(code, lang, meta) {
  if (lang === 'docs') return code;
	const shikiHighlighter = await getHighlighter({
		theme: THEME
	});
	const html = shikiHighlighter.codeToHtml(code, {
		lang
	});
	return escapeHtml(html);
}

export default highlighter;
