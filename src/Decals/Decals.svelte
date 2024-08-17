<script lang="ts">
    import Download from "svelte-material-icons/Download.svelte";
    import DecalSizer from "./DecalSizer/DecalSizer.svelte";
    import UploadHandler from "./UploadHandler.svelte";
    import splitImage from "./splitImage";

    let aspectRatio = 1;
    let w = 1;
    let h = 1;
    let file = null;
    let parts = null;
    let processing = false;

    let maxWidth = window.innerWidth - 20
    let scale = 1

    async function split() {
        processing = true;
        parts = await splitImage(file, w * 2, h, 8, 8);
        processing = false;
    }

    function download(index: number) {
        const a = document.createElement("a");
        a.href = parts.parts[index].url;
        a.download = `${file.name.slice(0, 40)}_${index + 1}.png`;
        a.click();
        parts.parts[index].downloaded = true;
        window.open("https://create.roblox.com/dashboard/creations/upload?assetType=Decal", "_blank")
    }
</script>
<p class="intro" style="max-width: 700px;">
    <b>Need a MASSIVE image, bigger than the biggest image panels?</b> Use this tool to split your image to make it even bigger!
    <br />
    You can also use this tool to prevent stretching in-game - the tool will add padding to the image to ensure it fits perfectly on your image panel.
    <br />
    <i>(Remember, you can stretch the newer image panels in precision build mode up to 4 blocks wide and 8 blocks tall.)</i>
</p>
<DecalSizer bind:aspectRatio={aspectRatio} bind:w={w} bind:h={h} unlimited={true} />
<UploadHandler bind:file={file} />
<button class="startBtn" disabled={!file || processing || w <= 0 || h <= 0} on:click={split}>
    {#if processing}
        Processing...
    {:else}
        Split!
    {/if}
</button>
{#if parts && parts.parts.length}
<div class="splitImage" style={`width: 100%; aspect-ratio: ${parts.width / parts.height}`}>
    {#each parts.parts as frame, i}
    <div on:click={() => download(i)} class="frame" style={`background-image: url(${frame.url}); left: ${frame.left / parts.width * 100}%; top: ${frame.top / parts.height * 100}%; width: ${frame.width / parts.width * 100}%; height: ${frame.height / parts.height * 100}%`} class:downloaded={frame.downloaded}>
        {frame.blockWidth / 2}x{frame.blockHeight}
    </div>
    {/each}
</div>
{/if}

<style>
    .splitImage {
        position: relative;
        border: 2px solid black;
    }
    .frame {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        outline: 0px solid black;
        transition: outline 0.1s;
        color: white;
        font-size: 1.5em;
        background-size: cover;
    }
    .frame:hover {
        outline-width: 2px;
        z-index: 1;
    }
    .frame:hover:after, .frame.downloaded:after {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: -1;
        left: 0;
        top: 0;
    }
    .frame.downloaded:after {
        z-index: 0;
        background-color: rgba(0, 191, 215, 0.5);
    }
    .frame:hover > * {
        opacity: 0;
    }
</style>