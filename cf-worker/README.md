## Overview

Cloudflare worker to serve the Chrome Extension.
Exposes and endpoint for the extension to use to evaluate resumes.

## Usage

1. Create a `.dev.vars` file with the following content:
	`OPENAI_API_KEY=your_openai_api_key`

2. Run:
   ```bash
   npm install
   wrangler dev
   ```

3. Deploy:
   ```bash
   wrangler deploy
   ```
