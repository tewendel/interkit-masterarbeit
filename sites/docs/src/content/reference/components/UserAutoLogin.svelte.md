<script>
  import ComponentInfoYaml from "../../../components/ComponentInfoYaml.svelte";
  import InterkitComponent from "../../../components/InterkitComponent.svelte";
</script>

# UserAutoLogin

Automatically log in a predefined user.

## How to use it

1. Create a new user (Project &gt; Users)
2. Enter username and passwort into this component
3. Whenever UserLogin is loaded, it automatically logs the user in

## What to use it for

You may want to have an "admin" user who received special messages and has its own chat in a separate board. You may then create a hidden route that uses <InterkitComponent name="UserAutoLogin" /> to log that user in.

Note that user names are global to the interkit system. There normally already is an "admin" user. Try to prefix it with your project name, for example: "myprojectadmin".

<ComponentInfoYaml component="UserAutoLogin" />

<br>
<details>
<summary>Developer docs</summary>

```docs
../../../../../../packages/interkit/components/UserLogin.svelte
```

</details>