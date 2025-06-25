<script>
  import Image from "svelte-material-icons/Image.svelte";
  import VideoIcon from "svelte-material-icons/Video.svelte";
  import ChevronLeft from "svelte-material-icons/ChevronLeft.svelte";
  import CloudUploadIcon from "svelte-material-icons/CloudUpload.svelte";

  import Decals from "./Decals/Decals.svelte";
  import Video from "./Video/Video.svelte";
  import Uploader from "./Uploader/Uploader.svelte";

  let tab = "decals";

  if (document.location.search.startsWith("?tpt2tools")) {
    document.body.className = "tpt2tools";
    tab = document.location.search.includes("video") ? "video" : "decals";
  }
  if (document.location.search.includes("code")) {
    tab = "uploader";
  }
</script>

{#if document.location.search.startsWith("?tpt2tools")}
  <header class="tpt2toolsHeader">
    <a href="https://www.themeparktycoon2.com">
      <img
        alt="Theme Park Tycoon 2 Workshop "
        src="https://static.wixstatic.com/media/d83b8d_3983f382560143f0a904019dd0877255~mv2.png"
        height="80px"
      />
    </a>
    <button
      on:click={() => history.back()}
      class="backToWorkshop"
      style="padding: 0 10px"
    >
      <ChevronLeft size="2em" />
      <span>Back to Workshop</span>
    </button>
    <button class:active={tab === "decals"} on:click={() => (tab = "decals")}>
      Decals
    </button>
    <button class:active={tab === "video"} on:click={() => (tab = "video")}>
      Video
    </button>
    <button
      class:active={tab === "uploader"}
      on:click={() => (tab = "uploader")}
    >
      Uploader
    </button>
    <span style="flex-grow: 1" />
  </header>
{:else}
  <header>
    <h1>TPT2 Tools</h1>
    <button class:active={tab === "decals"} on:click={() => (tab = "decals")}>
      <Image size="1.5em" />
      Decals
    </button>
    <button class:active={tab === "video"} on:click={() => (tab = "video")}>
      <VideoIcon size="1.5em" />
      Video
    </button>
    <button
      class:active={tab === "uploader"}
      on:click={() => (tab = "uploader")}
    >
      <CloudUploadIcon size="1.5em" />
      Upload
    </button>
    <h2>cabalex.github.io</h2>
  </header>
{/if}
<main>
  {#if tab === "decals"}
    <Decals />
  {:else if tab === "video"}
    <Video />
  {:else if tab === "uploader"}
    <Uploader />
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
    background: linear-gradient(to bottom, #fff 0%, #f3f3f3 100%);
    border-bottom: 3px solid #00bdd5;

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
  :global(.tpt2tools > #app > main) {
    margin-top: 100px !important;
  }
  header.tpt2toolsHeader {
    height: 100px;
    background: url(https://static.wixstatic.com/media/d83b8d_b9db4570eeb145c48f2c0dec2b610e47~mv2.jpg);
    color: white;
    padding: 14px max(24px, calc(calc(100% - 1350px) / 2));
    width: calc(100% - 24px);
    max-width: 1350px;
    border-bottom: none;
    border-top: 4px solid white;
  }
  header.tpt2toolsHeader button {
    background-color: transparent;
    font-size: 21px;
  }
  header.tpt2toolsHeader button.active,
  header.tpt2toolsHeader button:hover,
  header.tpt2toolsHeader button:focus {
    background-color: transparent !important;
    color: #00bdd5;
  }
  @media screen and (max-width: 800px) {
    header h2 {
      display: none;
    }
    header.tpt2toolsHeader {
      height: 50px;
      padding: 10px 50px;
      width: calc(100% - 100px);
      justify-content: flex-start;
    }
    header.tpt2toolsHeader > a,
    header.tpt2toolsHeader > span {
      display: none;
    }
    .backToWorkshop span {
      display: none;
    }
  }
</style>
