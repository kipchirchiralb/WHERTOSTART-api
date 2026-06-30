# WhereToStart Server

An Express server that takes an app idea and forwards it to Google's Gemini API,
returning a complete plan to build and deploy the application — recommended stack,
step-by-step development instructions, and hosting guidance.

## Requirements

- Node.js 18+ (uses the built-in `fetch` and ES modules)
- A Google Gemini API key — get one at https://aistudio.google.com/apikey

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from the example and add your API key:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env`:

   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   PORT=3000
   ```

3. Start the server:

   ```bash
   npm start
   ```

   You should see:

   ```
   Server listening on http://localhost:3000
   ```

## API

### `GET /`

Health check. Returns a plain-text message confirming the server is running.

### `POST /idea`

Generates a build-and-deploy plan for an app idea.

**Request body** (JSON):

| Field  | Type   | Required | Description                  |
| ------ | ------ | -------- | ---------------------------- |
| `name` | string | yes      | The user's name              |
| `idea` | string | yes      | A description of the app idea |

**Response** (JSON):

```json
{
  "name": "Jane",
  "idea": "A habit tracker that rewards streaks",
  "instructions": "..."
}
```

Returns `400` if `name` or `idea` is missing, and `500` if the Gemini request fails.

## Example

```bash
curl -X POST http://localhost:3000/idea \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane", "idea": "A habit tracker that rewards streaks"}'
```

Example response (truncated):

```json
{
  "name": "Jane",
  "idea": "A habit tracker that rewards streaks",
  "instructions": "1) Recommended platform and stack...\n2) Step-by-step development instructions...\n3) Deployment and hosting guidance..."
}
```
