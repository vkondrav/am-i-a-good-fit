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

    async function onFileSave() {
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

    let chosenModel: string = $state("");

    async function onModelChange() {

        console.log('Model changed to ', chosenModel);

        await chrome.storage.local.set({'model': chosenModel});
    }

    let modelsShown: boolean = $derived(fileStatus != undefined);

    async function onApiKeyChange(apiKey: ApiKey) {

        console.log('API Key changed ', apiKey.name);

        await chrome.storage.local.set({[apiKey.name]: apiKey.key});
    }

    let apiKeyOpenAI: ApiKey = $state({
        name: "api-key-openai",
        description: "OpenAI API Key",
        url: "https://platform.openai.com/docs/quickstart",
        key: "",
        supported_models: new Set(['gpt-4o', 'gpt-4o-mini'])
    });
    let isApiKeyOpenAIShown: boolean = $derived(apiKeyOpenAI.supported_models.has(chosenModel));

    let apiKeyGoogle: ApiKey = $state({
        name: "api-key-google",
        description: "Google API Key",
        url: "https://ai.google.dev/gemini-api/docs/quickstart",
        key: "",
        supported_models: new Set(['gemini-1.5-flash', 'gemini-2.0-flash-exp'])
    });
    let isApiKeyGoogleShown: boolean = $derived(apiKeyGoogle.supported_models.has(chosenModel));

    let apiKeyAnt: ApiKey = $state({
        name: "api-key-ant",
        description: "Anthropic API Key",
        url: "https://docs.anthropic.com/en/docs/initial-setup",
        key: "",
        supported_models: new Set(['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'])
    });
    let isApiKeyAntShown: boolean = $derived(apiKeyAnt.supported_models.has(chosenModel));

    let apiKeyDeepSeek: ApiKey = $state({
        name: "api-key-deepseek",
        description: "DeepSeek API Key",
        url: "https://api-docs.deepseek.com",
        key: "",
        supported_models: new Set(['deepseek-chat'])
    });
    let isApiKeyDeepSeekShown: boolean = $derived(apiKeyDeepSeek.supported_models.has(chosenModel));

    let models = Array.from(new Set([
        ...apiKeyOpenAI.supported_models,
        ...apiKeyGoogle.supported_models,
        ...apiKeyAnt.supported_models,
        ...apiKeyDeepSeek.supported_models
    ]));

    let areJobBoardButtonsShown: boolean = $derived(
        (isApiKeyAntShown && apiKeyAnt.key != '') ||
        (isApiKeyGoogleShown && apiKeyGoogle.key != '') ||
        (isApiKeyOpenAIShown && apiKeyOpenAI.key != '') ||
        (isApiKeyDeepSeekShown && apiKeyDeepSeek.key != '')
    );

    function retrieveResumeFileStatus() {
        chrome.storage.local.get('resume-file-name', (result) => {
            fileStatus = result['resume-file-name'];
        });
    }

    function retrieveApiKeys() {
        let apiKeys: ApiKey[] = [
            apiKeyOpenAI,
            apiKeyGoogle,
            apiKeyAnt,
            apiKeyDeepSeek
        ];

        apiKeys.forEach(apiKey => {
            chrome.storage.local.get(apiKey.name, (result) => {
                apiKey.key = result[apiKey.name] ?? '';
            });
        });
    }

    function retrieveModel() {
        chrome.storage.local.get('model', (result) => {
            chosenModel = result['model'] ?? '';
        });
    }

    onMount(async () => {
        retrieveResumeFileStatus();
        retrieveApiKeys();
        retrieveModel();
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
                onchange="{() => onFileSave()}"
                class="hidden"/>

        <button
                class="btn btn-primary w-full mt-2"
                onclick="{() => fileInput.click()}">
            {fileStatus ?? 'Select Resume [pdf]'}
        </button>

        {#if modelsShown}
            <select
                    bind:value={chosenModel}
                    onchange="{() => onModelChange()}"
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
                    onApiKeyChange={() => onApiKeyChange(apiKeyOpenAI)}
            />

        {/if}

        {#if isApiKeyGoogleShown}

            <ApiKeyInput
                    apiKey={apiKeyGoogle}
                    onApiKeyChange={() => onApiKeyChange(apiKeyGoogle)}
            />

        {/if}

        {#if isApiKeyAntShown}

            <ApiKeyInput
                    apiKey={apiKeyAnt}
                    onApiKeyChange={() => onApiKeyChange(apiKeyAnt)}
            />

        {/if}

        {#if isApiKeyDeepSeekShown}

            <ApiKeyInput
                    apiKey={apiKeyDeepSeek}
                    onApiKeyChange={() => onApiKeyChange(apiKeyDeepSeek)}
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