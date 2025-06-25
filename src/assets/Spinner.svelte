<script lang="ts">
  import Loading from "svelte-material-icons/Loading.svelte";
</script>

<div class="spinner">
  <Loading size="3em" />
</div>

<style>
  .spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  :global(.spinner > svg) {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
