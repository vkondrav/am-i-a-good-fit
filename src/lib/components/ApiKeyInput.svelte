<script lang="ts">
    import Icon from "@iconify/svelte";
    import type {ApiKey} from "@/types/ApiKey.ts";

    let {
        apiKey,
        placeholder,
        infoUrl,
        onApiKeyChange
    }: {
        apiKey: ApiKey,
        placeholder: string,
        infoUrl: string,
        onApiKeyChange: () => void
    } = $props();

</script>

<div class="flex items-center mt-2">
    <input
            bind:value={apiKey.key}
            type="text"
            placeholder={placeholder}
            onchange="{() => onApiKeyChange()}"
            class="
            input
            input-bordered
            w-full
            max-w-xs"
    />
    <button
            onclick="{() => window.open(infoUrl)}"
            class="
                    btn
                    btn-outline
                    btn-info
                    ml-2"
    >
        <Icon icon="ic:outline-info" height="1.5rem"/>
    </button>
</div>