<script lang="ts">
    export let aspectRatio = 1 / 1;
    export let w = 1;
    export let h = 1;
    export let unlimited = false;

    let gcd = 1;

    $: {
        aspectRatio = h / (w * 2);
        try {
            gcd = calculateGCD(w * 2, h);
        } catch(e) {
            gcd = 1;
        }
    }

    let mouseDown = false;

    function decalSize(e: any) {
        if (!mouseDown || unlimited) return;
        const { width, height, left, top } = e.target.getBoundingClientRect();
        const { clientX, clientY } = e;
        const x = clientX - left;
        const y = Math.abs(height - clientY + top);
        w = Math.max(1, Math.min(Math.floor(x / (width / 4)) + 1, 4));
        h = Math.max(1, Math.min(Math.floor(y / (height / 8)) + 1, 8));
    }

    function calculateGCD(a: number, b: number) {
        return (b == 0) ? a : calculateGCD(b, a % b);
    }
</script>
<div class="decalSizer">
    <main>
        <h2>
            {#if unlimited}
            How big do you want your image to be?
            {:else}
            How big is your image panel?
            {/if}
        </h2>
        <input
            bind:value={w}
            min="0.5"
            max={unlimited ? undefined : "4"}
            step="0.5"
            type="number"
        /> <b>wide</b> x <input
            bind:value={h}
            min="1"
            max={unlimited ? undefined : "8"}
            step="0.5"
            type="number"
        /> <b>tall</b>
        <p style="margin: 0">({w * 2 / gcd}:{h / gcd})</p>
        <p>Or:</p>
        <button on:click={() => { w = 1; h = 1}}>
            Image sign (1:2)
        </button>
        <button on:click={() => { w = 1.41; h = 1}}>
            Diagonal image panel (1 tall, 1.41 wide)
        </button>
        <button on:click={() => { w = 1.41; h = 2}}>
            Diagonal image panel (2 tall, 1.41 wide)
        </button>
    </main>
    <aside
        class:unlimited={unlimited}
        on:mousedown={(e) => { mouseDown = true; decalSize(e) }}
        on:mouseup={() => mouseDown = false}
        on:mouseout = {() => mouseDown = false}
        on:mousemove={decalSize}>
        {#if unlimited}
            <div class="imagePanel" style={`width: ${100 / aspectRatio}%; height: ${100 * aspectRatio}%`} />
        {:else}
            <div class="imagePanel" style={`width: ${100 / 4 * w}%; height: ${100 / 8 * h}%`} />
        {/if}
    </aside>
</div>
<h2 style="margin: 0">Recommended size: {w * 1000}x{h * 500}px</h2>


<style>
    .decalSizer {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
    input[type=number] {
        width: 50px;
    }
    .imagePanel {
        transition: width 0.2s, height 0.2s;
        background-color: var(--primary);
        pointer-events: none;
        z-index: -1;
        position: absolute;
        bottom: 0;
        left: 0;
        max-width: 100%;
        max-height: 100%;
    }
    aside {
        position: relative;
        width: 320px;
        aspect-ratio: 1 / 1;
        background-size: 25% 12.5%;
        border-bottom: 1px solid grey;
        border-right: 1px solid grey;
        background-image:
            linear-gradient(to right, grey 1px, transparent 1px),
            linear-gradient(to bottom, grey 1px, transparent 1px);
    }
    .unlimited {
        background-image: none;
        border: 1px solid grey;
    }
</style>