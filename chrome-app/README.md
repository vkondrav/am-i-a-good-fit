## Overview

Chrome Web Extension to evaluate your resume against job descriptions to 
identify strengths and areas for improvement.

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
