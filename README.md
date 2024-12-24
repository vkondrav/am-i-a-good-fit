# Am I a Good Fit?

## Overview
Use this Chrome Extension easily evaluate your resume against job descriptions to identify strengths and areas for improvement.
This extension supports multiple AI models for accurate and diverse evaluations.
It uses the API directly from the models, nothing to sign up for nothing to pay for, 
and no middleware that snoops on your data.

## Supported AI Models

- OpenAI (gp-4o, gpt-4o-mini)
- Google (gemini-1.5-flash, gemini-2.0-flash)
- Anthropic (claude-3-5-sonnet, claude-3-5-haiku)

## Supported Job Boards

- LinkedIn
- Indeed
- Monster

## Usage

1. Build:
   ```bash
   npm install
   npm build
   ```
   
2. Install
    - Open Chrome
    - Go to `chrome://extensions/`
    - Enable `Developer mode`
    - Click `Load unpacked`
    - Select the `build` folder

3. Run
    - Click the extension icon
    - Select your resume file (saved locally only)
    - Select your model
    - Input the appropriate API key
    - Go to supported job board
    - Find and click the `Am I a Good Fit?` button

# Built With

- [Svelte](https://svelte.dev/)
- [DaisyUI](https://daisyui.com/)