<script lang="ts">
    import Download from "svelte-material-icons/Download.svelte";
    import DecalSizer from "../Decals/DecalSizer/DecalSizer.svelte";
    import UploadHandler from "../Decals/UploadHandler.svelte";
    import processVideo from "./processVideo";

    let aspectRatio = 1;
    let file = null;
    let frames = [];
    let step = 0.25;
    let fps = 4;

    let processing = false;

    async function convert() {
        processing = true;
        frames = (await processVideo(file, aspectRatio, step)).map(f => { return {url: f, downloaded: false} });
        processing = false;
    }

    function download(index: number) {
        const a = document.createElement("a");
        a.href = frames[index].url;
        a.download = `${file.name.slice(0, 40)}_${index + 1}.png`;
        a.click();
        frames[index].downloaded = true;
        window.open("https://create.roblox.com/dashboard/creations/upload?assetType=Decal", "_blank")
    }
</script>
<p class="intro" style="max-width: 700px">
    <b>Play videos in TPT2 using a sequencer!</b> Simply create an image panel and attach it to a sequencer. Then, use the decals generated here to create your video! (you must upload each one manually first.)
    <br />
</p>
<DecalSizer bind:aspectRatio={aspectRatio} />
<UploadHandler accept="video/mp4" bind:file={file} />
<div>
    FPS: <input value={fps} on:change={(e) => { fps = e.target.value; step = 1 / fps }} type="number" max="60" min="0" style="width: 50px" />
    or
    SPF: <input value={step} on:change={(e) => { step = e.target.value; fps = 1 / step }} type="number" max="60" min="0" style="width: 50px" />
    <br />
    <i>The fastest framerate sequencers can support is 1 image per 0.25s per image panel (4 fps).</i>
</div>
<button class="startBtn" disabled={!file || processing || aspectRatio === 0 || aspectRatio === Infinity} on:click={convert}>
    {#if processing}
        Processing...
    {:else}
        Convert!
    {/if}
</button>
<span style="color: #777">Video processing takes a while, so be patient!</span>
{#if frames.length}
<div class="frames">
    <h2 style="margin-bottom: 5px">{frames.length} frames</h2>
    {#each frames as frame, i}
    <div class="frame" class:downloaded={frame.downloaded}>
        <p style="width: 50px">{i+1} ({(i * step).toFixed(2)}s)</p>
        <img src={frame.url} size="1.5em" />
        <div style="flex-grow: 1" />
        <button on:click={() => download(i)}>
            <Download />
        </button>
    </div>
    {/each}
</div>
{/if}

<style>
    .frames {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .frame {
        display: flex;
        flex-direction: row;
        gap: 10px;
        padding: 0 10px;
        align-items: center;
        border: 2px solid #aaa;
        border-radius: 5px;
    }
    .frame.downloaded {
        background-color: #aaa;
    }
    .frame img {
        max-width: 50%;
        background-size: 20px 20px;
        background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%);
        max-height: 300px;
    }
    .frame button {
        font-size: 1.5em;
    }
    :global(.tpt2tools .frame) {
        border-color: #444 !important;
    }
    :global(.tpt2tools .frame img) {
        background-image: linear-gradient(45deg, #444 25%, transparent 25%), linear-gradient(-45deg, #444 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #444 75%), linear-gradient(-45deg, transparent 75%, #444 75%) !important;
    }
</style>