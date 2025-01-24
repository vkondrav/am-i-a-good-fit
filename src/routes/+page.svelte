<reference types="chrome"></reference>

<script lang="ts">

    import {onMount} from "svelte";
    import {getDocument} from "pdfjs-dist"
    import type {TextItem} from "pdfjs-dist/types/src/display/api";
    import Icon from "@iconify/svelte";
    import ApiKeyInput from "@/components/ApiKeyInput.svelte";
    import type {ApiKey} from "@/types/ApiKey";
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
        'claude-3-5-haiku-latest',
        'deepseek-chat',
    ];

    let modelInput: HTMLSelectElement;
    let chosenModel = $state("");

    async function modelChange() {

        let value = modelInput.value;

        chosenModel = value;

        await chrome.storage.local.set({'model': value});
    }

    let modelsShown: boolean = $derived(fileStatus != undefined);

    let apiKeyOpenAI: ApiKey = $state({key: ""});
    let isApiKeyOpenAIShown: boolean = $derived(chosenModel.startsWith('gpt-') ?? false);

    async function onApiKeyOpenAIChange() {
        await chrome.storage.local.set({'api-key-openai': apiKeyOpenAI.key});
    }

    let apiKeyGoogle: ApiKey = $state({key: ""});
    let isApiKeyGoogleShown: boolean = $derived(chosenModel.startsWith('gemini-') ?? false);

    async function onApiKeyGoogleChange() {
        await chrome.storage.local.set({'api-key-google': apiKeyGoogle.key});
    }

    let apiKeyAnt: ApiKey = $state({key: ""});
    let isApiKeyAntShown: boolean = $derived(chosenModel.startsWith('claude-') ?? false);

    async function onApiKeyAntChange() {
        await chrome.storage.local.set({'api-key-ant': apiKeyAnt.key});
    }

    let apiKeyDeepSeek: ApiKey = $state({key: ""});
    let isApiKeyDeepSeekShown: boolean = $derived(chosenModel.startsWith('deepseek-') ?? false);

    async function onApiKeyDeepSeekChange() {
        await chrome.storage.local.set({'api-key-deepseek': apiKeyDeepSeek.key});
    }

    let areJobBoardButtonsShown: boolean = $derived(
        (isApiKeyAntShown && apiKeyAnt.key != '') ||
        (isApiKeyGoogleShown && apiKeyGoogle.key != '') ||
        (isApiKeyOpenAIShown && apiKeyOpenAI.key != '') ||
        (isApiKeyDeepSeekShown && apiKeyDeepSeek.key != '')
    );

    onMount(async () => {
        chrome.storage.local.get('resume-file-name', (result) => {
            fileStatus = result['resume-file-name'];
        });

        chrome.storage.local.get('api-key-openai', (result) => {
            apiKeyOpenAI.key = result['api-key-openai'] ?? '';
        });

        chrome.storage.local.get('api-key-google', (result) => {
            apiKeyGoogle.key = result['api-key-google'] ?? '';
        });

        chrome.storage.local.get('api-key-ant', (result) => {
            apiKeyAnt.key = result['api-key-ant'] ?? '';
        });

        chrome.storage.local.get('api-key-deepseek', (result) => {
            apiKeyDeepSeek.key = result['api-key-deepseek'] ?? '';
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

        <h1 class="text-3xl font-bold text-center">Am I a Good Fit?</h1>

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

            <ApiKeyInput
                    apiKey={apiKeyOpenAI}
                    placeholder="OpenAI API Key"
                    infoUrl="https://beta.openai.com/docs/developer-quickstart"
                    onApiKeyChange={onApiKeyOpenAIChange}
            />

        {/if}

        {#if isApiKeyGoogleShown}

            <ApiKeyInput
                    apiKey={apiKeyGoogle}
                    placeholder="Google API Key"
                    infoUrl="https://cloud.google.com/docs/authentication/api-keys"
                    onApiKeyChange={onApiKeyGoogleChange}
            />

        {/if}

        {#if isApiKeyAntShown}

            <ApiKeyInput
                    apiKey={apiKeyAnt}
                    placeholder="Ant API Key"
                    infoUrl="https://claude.ai/docs"
                    onApiKeyChange={onApiKeyAntChange}
            />

        {/if}

        {#if isApiKeyDeepSeekShown}

            <ApiKeyInput
                    apiKey={apiKeyDeepSeek}
                    placeholder="DeepSeek API Key"
                    infoUrl="https://deepseek.ai/docs"
                    onApiKeyChange={onApiKeyDeepSeekChange}
            />
        {/if}

        {#if areJobBoardButtonsShown}
            <div class="flex justify-between mt-2">
                <button
                        onclick="{() => window.open('https://www.linkedin.com/jobs')}"
                        class="
                    btn
                    btn-outline
                    btn-accent"
                >
                    <Icon icon="simple-icons:linkedin" height="1.5rem"/>
                </button>
                <button
                        onclick="{() => window.open('https://www.indeed.com')}"
                        class="
                    btn
                    btn-outline
                    btn-accent
                    ml-2"
                >
                    <Icon icon="simple-icons:indeed" height="1.5rem"/>
                </button>
                <button
                        onclick="{() => window.open('https://www.monster.com')}"
                        class="
                    btn
                    btn-outline
                    btn-accent
                    ml-2"
                >
                    <Icon icon="simple-icons:monster" height="1.5rem"/>
                </button>
            </div>
        {/if}

    </div>
</div>