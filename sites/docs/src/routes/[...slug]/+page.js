// src/routes/blog/[slug]/+page.js
export async function load({ params }) {
	let post = null;
	const [section, part1, part2] = params.slug.split('/');

	console.log("page load", params)

	// try .svelte.md
	if (!post) {
		try {
			post = await import(`../../content/${section}/${part1}/${part2}.svelte.md`);
		} catch (error) {
			`error importing ${params.slug}`;
		}
	}

	// try .md
	if (!post) {
		try {
			post = await import(`../../content/${section}/${part1}/${part2}.md`);
		} catch (error) {
			`error importing ${params.slug}`;
		}
	}

	// try .svx
	if (!post) {
		try {
			post = await import(`../../content/${section}/${part1}/${part2}.svx`);
		} catch (error) {
			`error importing ${params.slug}`;
		}
	}

	// const { title, date } = post.metadata;

	let content = null;
	if (post) {
		content = post.default;
	}

	return {
		//post
		content
		//title,
		//date
	};
}
