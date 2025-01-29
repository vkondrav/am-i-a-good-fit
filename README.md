# Am I a Good Fit?

https://github.com/user-attachments/assets/f99bfdcf-217f-4fe1-89e5-d7a8137778c6

Available on [Chrome Web Store](https://chromewebstore.google.com/detail/am-i-a-good-fit/geabllccglfnbbhgbnlacpnniaiafnno)

## Overview

Use this Chrome Extension to easily evaluate your resume against job descriptions to identify strengths and areas for improvement.
This extension supports multiple AI models for accurate and diverse evaluations. Use your own API keys. All APIs are used directly from the providers, 
nothing to sign up, for nothing to pay for, and no middleware that snoops on your data.

## Supported AI Models

- OpenAI (gp-4o, gpt-4o-mini)
- Google (gemini-1.5-flash, gemini-2.0-flash)
- Anthropic (claude-3-5-sonnet, claude-3-5-haiku)
- DeepSeek (deepseek-chat)

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
