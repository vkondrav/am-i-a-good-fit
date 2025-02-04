<reference types="chrome"></reference>

<script lang="ts">

	import { onMount } from 'svelte';
	import { getDocument } from 'pdfjs-dist';
	import type { TextItem } from 'pdfjs-dist/types/src/display/api';
	import Icon from '@iconify/svelte';
	import * as pdfjsLib from 'pdfjs-dist/build/pdf.worker.min.mjs';

	async function fileToText(file: File): Promise<string> {
		const arrayBuffer = await file.arrayBuffer();

		const pdf = await getDocument({ data: arrayBuffer }).promise;
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

				await chrome.storage.local.set({ 'resume-file': text });
				await chrome.storage.local.set({ 'resume-file-name': file.name });

				console.log('File saved to Chrome local storage');
				fileStatus = file.name;
			} catch (error) {
				console.error('Error saving file:', error);
			}
		} else {
			fileStatus = 'no file selected';
		}
	}

	let areJobBoardButtonsShown: boolean = $derived(fileStatus != undefined);

	function retrieveResumeFileStatus() {
		chrome.storage.local.get('resume-file-name', (result) => {
			fileStatus = result['resume-file-name'];
		});
	}

	onMount(async () => {
		retrieveResumeFileStatus();
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
			class="hidden" />

		<button
			class="btn btn-primary w-full mt-2"
			onclick="{() => fileInput.click()}">
			{fileStatus ?? 'Select Resume [pdf]'}
		</button>

		{#if areJobBoardButtonsShown}
			<div class="flex justify-between mt-2">
				<button
					onclick="{() => window.open('https://www.linkedin.com/jobs')}"
					class="
                    btn
                    btn-outline
                    btn-accent"
				>
					<Icon icon="simple-icons:linkedin" height="1.5rem" />
				</button>
				<button
					onclick="{() => window.open('https://www.indeed.com')}"
					class="
                    btn
                    btn-outline
                    btn-accent
                    ml-2"
				>
					<Icon icon="simple-icons:indeed" height="1.5rem" />
				</button>
				<button
					onclick="{() => window.open('https://www.monster.com')}"
					class="
                    btn
                    btn-outline
                    btn-accent
                    ml-2"
				>
					<Icon icon="simple-icons:monster" height="1.5rem" />
				</button>
			</div>
		{/if}

	</div>
</div>