<script>
  import {
    ExpandableTile,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from "carbon-components-svelte";
  import VolumeFileStorage from "carbon-icons-svelte/lib/VolumeFileStorage.svelte";
  import { push, pop, replace } from "svelte-spa-router";
  import {
    currentProjectReadOnly,
    currentProject,
    projectId,
  } from "../admin.js";

  export let text;
  export let files; // [{path, info}]

  const navigate = (path) => {
    if (path != undefined) {
      console.log("navigate", path);
      if ($currentProjectReadOnly) {
        push(`/template/${$currentProject.slug}/${path}`);
      } else {
        push(`/project/${$projectId}/${path}`);
      }
    }
  };
</script>

<ExpandableTile>
   <div slot="above">
    <h4>
      <VolumeFileStorage />
      {text || ""}
      <slot />
    </h4>
  </div>

  <div slot="below">
  <StructuredList condensed>
    <StructuredListHead>
      <StructuredListRow head>
        <StructuredListCell head>File Name</StructuredListCell>
        <StructuredListCell head>Comment</StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      {#each files as { path, info }}
        <StructuredListRow>
          <StructuredListCell noWrap>
            <span style="text-decoration: underline" on:click={() => navigate("repository")}>
            {path}
            </span>
          </StructuredListCell>
          <StructuredListCell>{info}</StructuredListCell>
        </StructuredListRow>
      {/each}
    </StructuredListBody>
  </StructuredList>
  </div>
</ExpandableTile>


<style lang="scss">
  @use '@carbon/type';

  h4 {
    @include type.type-style('heading-compact-02');
    margin-bottom: 1em;
  }
</style>
