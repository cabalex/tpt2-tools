<script lang="ts">
    import Delete from "svelte-material-icons/Delete.svelte";
    export let file = null;
    export let accept = "image/*";

    let files = null;
    let inputElem;
    let dispElem;

    let dims = null;

    $: {
        file = files && files.length ? files[0] : null;
        if (dispElem) {
            // videos
            dispElem.onloadedmetadata = () => {
                dims = {width: dispElem.videoWidth, height: dispElem.videoHeight};
            }
            // images
            dispElem.onload = () => {
                console.log(dispElem)
                dims = {width: dispElem.naturalWidth, height: dispElem.naturalHeight};
            }
        } else {
            dims = null;
        }
    }
</script>

<input type="file" accept={accept} bind:this={inputElem} bind:files={files} />
<div
    class="uploadHandler"
    class:active={files && files.length}
    on:keypress={() => { if (!(files && files.length)) inputElem.click() }}
    on:click={() => { if (!(files && files.length)) inputElem.click()} }
>
    {#if files && files.length}
        <p class="filename">{files[0].name} ({dims?.width}x{dims?.height})</p>
        <button class="deleteBtn" on:click={(e) => { files = null; e.stopPropagation()}}>
            <Delete />
        </button>
        {#if accept.includes("image")}
            <img bind:this={dispElem} src={URL.createObjectURL(files[0])} />
        {:else}
            <video bind:this={dispElem} controls autoplay muted loop src={URL.createObjectURL(files[0])} />
        {/if}
    {:else}
        {#if accept.includes("image")}
            <p>Click to upload an image</p>
        {:else}
            <p>Click to upload a video</p>
        {/if}
    {/if}
</div>

<style>
    input {
        display: none;
    }
    .uploadHandler {
        position: relative;
        width: min(100%, 580px);
        background-color: #ddd;
        border-radius: 10px;
        border: 2px solid #aaa;
        padding: 10px;
        user-select: none;
        transition: background-color 0.2s ease-in-out;
    }
    .uploadHandler img, .uploadHandler video {
        max-width: 100%;
        max-height: 300px;
        margin: 10px 0;
    }
    .uploadHandler:not(.active):hover {
        background-color: #eee;
        cursor: pointer;
    }
    :global(.tpt2tools .uploadHandler) {
        background-color: #111 !important;
        border-color: #222 !important;
    }
    :global(.tpt2tools .uploadHandler:not(.active):hover) {
        background-color: #444 !important;
        cursor: pointer;
    }
    .filename {
        margin: 0;
        font-size: 1.2em;
        line-height: 2em;
    }
    .deleteBtn {
        color: white;
        background: #ED4245;
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 1.5em;
        cursor: pointer;
    }
    .deleteBtn:hover {
        background: #D01D1F;
    }
</style>