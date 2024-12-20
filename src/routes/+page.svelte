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

    let fileInput: HTMLInputElement

    let file_status: string | undefined = $state(undefined)

    async function saveFile() {
        console.log('Saving file...');

        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            try {

                const text = await fileToText(file);

                await chrome.storage.local.set({'resume-file': text});
                await chrome.storage.local.set({'resume-file-name': file.name});

                console.log('File saved to Chrome local storage');
                file_status = file.name;
            } catch (error) {
                console.error('Error saving file:', error);
            }
        } else {
            file_status = 'no file selected';
        }
    }

    let apiKeyInputOpenAI: HTMLInputElement

    async function apiKeyChangeOpenAI() {
        await chrome.storage.local.set({'api-key-openai': apiKeyInputOpenAI.value});
    }

    let apiKeyInputGoogle: HTMLInputElement

    async function apiKeyChangeGoogle() {
        await chrome.storage.local.set({'api-key-google': apiKeyInputGoogle.value});
    }

    let models = [
        'gpt-4o',
        'gpt-4o-mini',
        'gemini-1.5-flash',
        'gemini-2.0-flash-exp'
    ]

    let modelInput: HTMLSelectElement

    async function modelChange() {
        await chrome.storage.local.set({'model': modelInput.value});
    }

    onMount(async () => {
        chrome.storage.local.get('resume-file-name', (result) => {
            file_status = result['resume-file-name'];
        });

        chrome.storage.local.get('api-key-openai', (result) => {
            apiKeyInputOpenAI.value = result['api-key-openai'] ?? '';
        });

        chrome.storage.local.get('api-key-google', (result) => {
            apiKeyInputGoogle.value = result['api-key-google'] ?? '';
        });

        chrome.storage.local.get('model', (result) => {

            let model = result['model']

            if (model) {
                modelInput.value = model;
            }
        });
    });
</script>

<div class="container w-auto h-auto" style="min-width: 26rem">
    <div class="p-4 pb-8">

        <h1 class="text-3xl font-bold">Am I a Good Fit?</h1>

        <div class="label mt-2">
            <span class="label-text">Upload Resume</span>
            <span class="label-text-alt">[pdf]</span>
        </div>

        <input
                bind:this={fileInput}
                id="file-upload"
                type="file"
                accept="application/pdf"
                onchange="{() => saveFile()}"
                class="
                [&::file-selector-button]:hidden
                pl-2
                file-input
                file-input-sm
                file-input-bordered
                file-input-warning
                w-full
                max-w-xs"/>

        {#if file_status}
            <div class="badge badge-success mt-2">
                {file_status}
            </div>
        {/if}

        <select
                bind:this={modelInput}
                onchange="{() => modelChange()}"
                class="
                    select
                    select-bordered
                    select-sm
                    w-full
                    max-w-xs
                    mt-2"
        >
            <option disabled selected>Select Model</option>

            {#each models as model}
                <option>{model}</option>
            {/each}

        </select>

        <div class="flex items-center mt-2">
            <input
                    bind:this={apiKeyInputOpenAI}
                    type="text"
                    placeholder="OpenAI API Key"
                    onchange="{() => apiKeyChangeOpenAI()}"
                    class="
            input
            input-bordered
            input-sm
            w-full
            max-w-xs"
            />
            <button
                    onclick="{() => window.open('https://platform.openai.com/docs/quickstart')}"
                    class="
                    btn-sm
                    btn-outline
                    btn-info"
            >
                <Icon icon="ic:outline-info" height="1.1rem"/>
            </button>
        </div>

        <div class="flex items-center mt-2">
            <input
                    bind:this={apiKeyInputGoogle}
                    type="text"
                    placeholder="Google API Key"
                    onchange="{() => apiKeyChangeGoogle()}"
                    class="
            input
            input-bordered
            input-sm
            w-full
            max-w-xs"
            />
            <button
                    onclick="{() => window.open('https://ai.google.dev/gemini-api/docs/quickstart')}"
                    class="
                    btn-sm
                    btn-outline
                    btn-info"
            >
                <Icon icon="ic:outline-info" height="1.1rem"/>
            </button>
        </div>

    </div>

</div>