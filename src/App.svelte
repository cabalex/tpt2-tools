<script>
  import Image from "svelte-material-icons/Image.svelte";
  import VideoIcon from "svelte-material-icons/Video.svelte";

  import Decals from "./Decals/Decals.svelte";
  import Video from "./Video/Video.svelte";

  let tab = "decals";
</script>
<header>
  <h1>TPT2 Tools</h1>
  <button class:active={tab === 'decals'} on:click={() => tab = 'decals'}>
    <Image size="1.5em" />
    Decals
  </button>
  <button class:active={tab === 'video'} on:click={() => tab = 'video'}>
    <VideoIcon size="1.5em" />
    Video
  </button>
  <h2>cabalex.github.io</h2>
</header>
<main>
{#if tab === 'decals'}
<Decals />
{:else if tab === 'video'}
<Video />
{/if}
</main>

<style>
  h1 {
    margin: 0;
    font-size: 1.5em;
    text-align: left;
    flex-grow: 1;
  }
  h2 {
    margin: 0;
    font-size: 1em;
    text-align: right;
    flex-grow: 1;
  }
  button {
    font-weight: bold;
    border-radius: 8px;
  }
  header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: calc(100% - 40px);
    padding: 0 20px;
    height: 50px;
    background: linear-gradient(to bottom, #FFF 0%, #F3F3F3 100%);
    border-bottom: 3px solid #00BDD5;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
    gap: 10px;
  }
</style>