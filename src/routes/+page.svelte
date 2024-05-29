<script lang="ts">
  import { todoManager } from "$lib/index.svelte";

  let current = $state("");
</script>

<h1>Todo Manager</h1>

<input bind:value={current} />
<button
  onclick={() => {
    todoManager.send({ type: "add", params: { todo: current } });
    current = "";
  }}>Add</button>

{#each todoManager.state?.context.todos ?? [] as todo, i}
  <div>{i + 1}. {todo}</div>
{/each}
