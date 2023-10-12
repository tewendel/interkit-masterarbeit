# Creating a project template

Templates are projects that you use as starting points for creating apps.

Some important templates are included in the interkit codebase and need to be initialized once on your server before you can use them. Click on `Build Project Templates` in the Admin Tools section of the user menu on the top right to start this process (it will take a few minutes).

If you want to contribute a new template to the interkit codebase, add a folder starting with `template-` to the `repositories/starters` directory. 

It should contain only the files that are different from the starter project that is used to initialize new projects.

For example
- `project.md` - long description
- `description.md` - short description
- `src/blocklyState.json` - the blockly config
- `src/App.svelte` - the generated Svelte file
- `src/styleTokens.json` - style configuration
- `src/actions.js` - actions for your project
- `static/theme` - a custom theme
- `seed.zip` - exported database and media

Have a look at the existing templates here:
https://gitlab.interkit.app/interkit/interkit-experiments/-/tree/v04/repositories/starters

Note: You can also publish to and import projects from a separate git repository and mark them as templates. This is useful for templates that are unique to your organisation and should not become part of the interkit code base.