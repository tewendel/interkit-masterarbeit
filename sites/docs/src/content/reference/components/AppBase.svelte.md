<script>
  import ComponentInfoYaml from "../../../components/ComponentInfoYaml.svelte";
</script>

# AppBase

The AppBase component ist the starting point for all interkit apps and needs to be the outermost component you add to any project.

If you are creating a multilanguage project, see [the internationalisation guide](/guides/i18n) for setting the `languages` parameter.

<ComponentInfoYaml component="AppBase" />

## AppBaseAdvanced

AppBaseAdvanced provides additional options to AppBase.

<ComponentInfoYaml component="AppBaseAdvanced" />

### `desktopFallback` slot

If you intend your Interkit app to be used exclusively on mobile devices,
you can force desktop devices to show this fallback view.

Desktop devices means "large viewports" here.
We use a media query to identify them *on page load*;
you can override the default `min-width: 600px` using the `desktopFallbackMinWidth` prop.

The slot takes anything, but we have a special component called `DesktopFallback`

![A DesktopFallback example](/images/component_previews/DesktopFallback.png)

### `DesktopFallback` component

A splash page with rich content, arranged in a grid intended for wider viewports. 

- Title + intro text
- QR code with a link to the web app —
  not auto-generated, you have to provide it yourself
- A "go fullscreen" button —
  basically deactivates/circumvents the large viewport detection
  and takes you to the web app's default view/slot
- Multi purpose buttons —
  e.g. links to contact, legal info, privacy policy
- A preview of the web app, fully functional —
  an iframe styled with a "device bezel" border

<ComponentInfoYaml component="DesktopFallback" />

<details>
<summary>Developer docs</summary>

## AppBase

```docs
../../../../../../packages/interkit/components/AppBase.svelte
```

## AppBaseAdvanced

```docs
../../../../../../packages/interkit/components/AppBaseAdvanced.svelte
```

## DesktopFallback

```docs
../../../../../../packages/interkit/components/DesktopFallback.svelte
```

</details>

