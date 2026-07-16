# SigNoz Self-Host Installation

Follow these instructions to spin up the local SigNoz instance for the Monitors in Black project.

## Prerequisites
- Docker & Docker Compose (v2+)
- At least 4GB of RAM allocated to Docker

## Setup
1. Clone WeMakeDevs official SigNoz repo deployment layout:
   ```bash
   git clone -b main https://github.com/SigNoz/signoz.git ~/signoz
   ```
2. Navigate to the compose directory and spin it up:
   ```bash
   cd ~/signoz/deploy/docker && docker compose up -d
   ```
3. Once running, open the SigNoz dashboard at:
   `http://localhost:8080`
4. Register the admin account.
5. Create a Service Account API Key under **Settings -> Service Accounts -> Keys** and copy the generated key into your `.env` file as `SIGNOZ_API_KEY`.
