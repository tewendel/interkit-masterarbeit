<script>
  import ComponentInfoYaml from "../../components/ComponentInfoYaml.svelte";
</script>

# If…

Conditionals provide each

* a way to check a variable if it equals a given value
* two slots of which only one is displayed, depending on the equality above

They differ on which kind of variable they check for a value.

# IfDataAnnotation

Checks whether a Data element (a sheet row) has a certain annotation (set from e.g. Buttons or code; annotations are run-time and don't persist over reloads).

<ComponentInfoYaml component="IfDataAnnotation" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../packages/interkit/components/IfDataAnnotation.svelte
```

</details>

# IfUIKey

Checks a `UIKey` or `globalStore` (which can be set from Buttons or actions.js code).

<ComponentInfoYaml component="IfUIKey" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../packages/interkit/components/IfUIKey.svelte
```

</details>

# IfUserVar

Checks a `UserVar` (which can be set e.g. from Story/chat code or other code).

<ComponentInfoYaml component="IfUserVar" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../packages/interkit/components/IfUserVar.svelte
```

</details>

