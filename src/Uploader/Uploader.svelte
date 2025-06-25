<script lang="ts">
  import { get } from "svelte/store";
  import authenticate, { token, verifyCode } from "./authentication";
  import { runQueue, uploadQueue } from "./uploadDecal";
  import OpenInNewIcon from "svelte-material-icons/OpenInNew.svelte";
  import DownloadIcon from "svelte-material-icons/Download.svelte";
  import Spinner from "../assets/Spinner.svelte";
  import TimerSandIcon from "svelte-material-icons/TimerSand.svelte";

  let authenticating = false;
  if (location.search.includes("code=")) {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    if (code && state) {
      authenticating = true;
      verifyCode(code, state).then(() => {
        authenticating = false;
        history.replaceState(null, "", location.pathname);
      });
    }
  }

  let fileElem;
  let file: File | null = null;
  let filename: string = "";

  function addFile(e) {
    file = e.target.files?.[0] ?? null;
    if (file) {
      filename = file.name.split(".")[0] ?? "";
    }
  }

  function downloadFile(file: File) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function upload() {
    if (!file || !filename || !$token) return;
    uploadQueue.update((q) => {
      q.push({
        file,
        name: filename,
        status: "Waiting",
        assetId: null,
      });
      return q;
    });
    file = null;
    filename = "";
    fileElem.value = "";
    runQueue();
  }

  function clearQueue() {
    uploadQueue.update((q) =>
      q.filter((u) => !["Completed", "Rejected", "Error"].includes(u.status))
    );
  }

  function copy(assetId: number, e) {
    navigator.clipboard.writeText(assetId.toString());
    e.target.classList.add("copied");
    e.target.classList.add("copiedAlready");
    setTimeout(() => e.target.classList.remove("copied"), 1000);
  }
</script>

{#if !$token && !authenticating}
  <div class="overlay">
    <div class="overlayInner">
      <p>Authenticate with Roblox to use decal uploading features.</p>
      <button on:click={authenticate}>Authenticate</button>
    </div>
  </div>
{:else if !$token}
  <div class="overlay">
    <div class="overlayInner">
      <p>Authenticating...</p>
    </div>
  </div>
{/if}

<div class="uploaderSmall">
  <button
    class="fileBtn"
    on:click={() => fileElem.click()}
    style={file ? `background-image: url(${URL.createObjectURL(file)})` : ""}
  >
    Add file
  </button>
  <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 10px">
    <input type="text" placeholder="Filename" bind:value={filename} />
    <button class="uploadBtn" on:click={upload} disabled={!filename || !file}>
      Upload
    </button>
  </div>
  <input
    type="file"
    accept="image/*"
    bind:this={fileElem}
    on:change={addFile}
    hidden
  />
</div>
<div class="uploadQueue">
  <div style="display: flex; justify-content: flex-end; padding-bottom: 10px;">
    <button on:click={clearQueue}>Clear finished</button>
  </div>
  {#each $uploadQueue as upload (upload.assetId ?? upload.name)}
    <div class="asset">
      <div class="image">
        {#if upload.status === "Uploading" || upload.status === "Waiting"}
          <TimerSandIcon />
        {:else if upload.status === "Processing"}
          <Spinner />
        {:else}
          <img
            width="128"
            height="128"
            alt="decal preview"
            src={URL.createObjectURL(upload.file)}
          />
        {/if}
      </div>
      <div class="assetText">
        <h2 style="margin: 0">{upload.name}</h2>
        <span>{upload.status}</span>
        {#if upload.error}
          <p class="error">{upload.error}</p>
        {/if}
      </div>
      {#if upload.assetId}
        <button class="copyBtn" on:click={copy.bind(null, upload.assetId)}>
          {upload.assetId}
        </button>
      {/if}
      {#if upload.file}
        <button on:click={() => downloadFile(upload.file)}>
          <DownloadIcon size="1.5em" />
        </button>
      {/if}
      {#if upload.assetId}
        <a
          class="btn"
          href={`https://create.roblox.com/store/asset/${upload.assetId}`}
          target="_blank"
        >
          <OpenInNewIcon size="1.5em" />
        </a>
      {/if}
    </div>
  {/each}
</div>

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
    text-align: center;
    padding: 20px;
  }
  .overlayInner {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
  .overlayInner button {
    width: 100%;
  }
  .fileBtn {
    width: 100px;
    height: 100px;
    background-size: cover !important;
    background-position: center !important;
  }
  .uploadBtn {
    width: 100px;
  }
  .uploaderSmall {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin: 10px;
    background-color: #ccc;
    padding: 10px;
    border-radius: 10px;
    width: calc(min(1280px, 100vw) - 120px);
    max-width: 700px;
  }
  .uploaderSmall input[type="text"] {
    flex-grow: 1;
    height: 40px;
    font-size: 1.2em;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
  }
  .uploadQueue {
    width: 100%;
    height: calc(100vh - 270px);
    display: flex;
    flex-direction: column;
  }
  :global(.asset) {
    width: calc(100% - 14px);
    background-color: #fff;
    border: 2px solid #aaa;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    padding-right: 10px;
    margin-bottom: 10px;
  }
  :global(.asset .assetText) {
    flex-grow: 1;
    text-align: left;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  :global(.asset .image) {
    width: 128px;
    height: 128px;
  }
  :global(.asset .copyBtn) {
    font-family: monospace;
    font-size: 2em;
    border: 2px solid #aaa;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
  }
  :global(.asset .copyBtn.copied) {
    border-color: var(--primary);
  }
  :global(.asset .copyBtn.copiedAlready) {
    color: #999;
  }
</style>
