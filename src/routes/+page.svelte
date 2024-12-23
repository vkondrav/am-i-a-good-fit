<reference types="chrome"></reference>

<script lang="ts">

    import {onMount} from "svelte";
    import {getDocument} from "pdfjs-dist"
    import type {TextItem} from "pdfjs-dist/types/src/display/api";
    import Icon from "@iconify/svelte";
    import * as pdfjsLib from 'pdfjs-dist/build/pdf.worker.min.mjs';

    async function fileToText(file: File): Promise<string> {
        const arrayBuffer = await file.arrayBuffer();

        const pdf = await getDocument({data: arrayBuffer}).promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            const pageText = content.items
                .filter((item): item is TextItem => 'str' in item)
                .map(item => (item as TextItem).str)
                .join(' ');

            text += pageText + '\n';
        }

        return text;
    }

    let fileInput: HTMLInputElement;

    let fileStatus: string | undefined = $state(undefined);

    async function saveFile() {
        console.log('Saving file...');

        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            try {

                const text = await fileToText(file);

                await chrome.storage.local.set({'resume-file': text});
                await chrome.storage.local.set({'resume-file-name': file.name});

                console.log('File saved to Chrome local storage');
                fileStatus = file.name;
            } catch (error) {
                console.error('Error saving file:', error);
            }
        } else {
            fileStatus = 'no file selected';
        }
    }

    let models = [
        'gpt-4o',
        'gpt-4o-mini',
        'gemini-1.5-flash',
        'gemini-2.0-flash-exp',
        'claude-3-5-sonnet-latest',
        'claude-3-5-haiku-latest'
    ];

    let modelInput: HTMLSelectElement;
    let chosenModel = $state("");

    async function modelChange() {

        let value = modelInput.value;

        chosenModel = value;

        await chrome.storage.local.set({'model': value});
    }

    let modelsShown: boolean = $derived(fileStatus != undefined);

    let apiKeyOpenAIInput: HTMLInputElement;
    let apiKeyOpenAI: string = $state('');
    let isApiKeyOpenAIShown: boolean = $derived(chosenModel.startsWith('gpt-') ?? false);

    async function onApiKeyOpenAIChange() {
        await chrome.storage.local.set({'api-key-openai': apiKeyOpenAI});
    }

    let apiKeyInputGoogle: HTMLInputElement;
    let apiKeyGoogle: string = $state('');
    let isApiKeyGoogleShown: boolean = $derived(chosenModel.startsWith('gemini-') ?? false);

    async function onApiKeyGoogleChange() {
        await chrome.storage.local.set({'api-key-google': apiKeyGoogle});
    }

    let apiKeyInputAnt: HTMLInputElement;
    let apiKeyAnt: string = $state('');
    let isApiKeyAntShown: boolean = $derived(chosenModel.startsWith('claude-') ?? false);

    async function onApiKeyAntChange() {
        await chrome.storage.local.set({'api-key-ant': apiKeyAnt});
    }

    onMount(async () => {
        chrome.storage.local.get('resume-file-name', (result) => {
            fileStatus = result['resume-file-name'];
        });

        chrome.storage.local.get('api-key-openai', (result) => {
            apiKeyOpenAI = result['api-key-openai'] ?? '';
        });

        chrome.storage.local.get('api-key-google', (result) => {
            apiKeyGoogle = result['api-key-google'] ?? '';
        });

        chrome.storage.local.get('api-key-ant', (result) => {
            apiKeyAnt = result['api-key-ant'] ?? '';
        });

        chrome.storage.local.get('model', (result) => {

            let savedModel = result['model'];

            if (savedModel) {
                chosenModel = savedModel;
                modelInput.value = savedModel;
            }
        });
    });
</script>

<div class="container w-auto h-auto" style="min-width: 26rem">
    <div class="p-4 pb-8">

        <h1 class="text-3xl font-bold">Am I a Good Fit?</h1>

        <input
                bind:this={fileInput}
                id="file-upload"
                type="file"
                accept="application/pdf"
                onchange="{() => saveFile()}"
                class="hidden"/>

        <button
                class="btn btn-primary w-full mt-2"
                onclick="{() => fileInput.click()}">
            {fileStatus ?? 'Select Resume [pdf]'}
        </button>

        {#if modelsShown}
            <select
                    bind:this={modelInput}
                    onchange="{() => modelChange()}"
                    class="
                    select
                    select-bordered
                    w-full
                    max-w-xs
                    mt-2"
            >
                <option disabled selected>Select Model</option>

                {#each models as model}
                    <option>{model}</option>
                {/each}

            </select>
        {/if}

        {#if isApiKeyOpenAIShown}
            <div class="flex items-center mt-2">
                <input
                        bind:this={apiKeyOpenAIInput}
                        bind:value={apiKeyOpenAI}
                        type="text"
                        placeholder="OpenAI API Key"
                        onchange="{() => onApiKeyOpenAIChange()}"
                        class="
            input
            input-bordered
            w-full
            max-w-xs"
                />
                <button
                        onclick="{() => window.open('https://platform.openai.com/docs/quickstart')}"
                        class="
                    btn
                    btn-outline
                    btn-info
                    ml-2"
                >
                    <Icon icon="ic:outline-info" height="1.5rem"/>
                </button>
            </div>
        {/if}

        {#if isApiKeyGoogleShown}

            <div class="flex items-center mt-2">
                <input
                        bind:this={apiKeyInputGoogle}
                        bind:value={apiKeyGoogle}
                        type="text"
                        placeholder="Google API Key"
                        onchange="{() => onApiKeyGoogleChange()}"
                        class="
            input
            input-bordered
            w-full
            max-w-xs"
                />
                <button
                        onclick="{() => window.open('https://ai.google.dev/gemini-api/docs/quickstart')}"
                        class="
                    btn
                    btn-outline
                    btn-info
                    ml-2"
                >
                    <Icon icon="ic:outline-info" height="1.5rem"/>
                </button>
            </div>
        {/if}

        {#if isApiKeyAntShown}

            <div class="flex items-center mt-2">
                <input
                        bind:this={apiKeyInputAnt}
                        bind:value={apiKeyAnt}
                        type="text"
                        placeholder="Anthropic API Key"
                        onchange="{() => onApiKeyAntChange()}"
                        class="
            input
            input-bordered
            w-full
            max-w-xs"
                />
                <button
                        onclick="{() => window.open('https://docs.anthropic.com/en/docs/initial-setup')}"
                        class="
                    btn
                    btn-outline
                    btn-info
                    ml-2"
                >
                    <Icon icon="ic:outline-info" height="1.5rem"/>
                </button>
            </div>
        {/if}

    </div>
</div>