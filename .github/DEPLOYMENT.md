# Deployment Setup

This project uses GitHub Actions for automatic deployment when pushing to the `main` branch.

## How It Works

1. **Build & Push**: When you push to `main`, GitHub Actions builds a multi-architecture Docker image (amd64/arm64) and pushes it to GitHub Container Registry (ghcr.io)

2. **Deploy**: After the image is pushed, the workflow SSH's into your deployment server and:
   - Pulls the latest image
   - Restarts the Docker containers using docker-compose
   - Cleans up old images

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

### Required Secrets

- **`DEPLOY_HOST`**: The hostname or IP address of your deployment server (e.g., `192.168.1.100` or `example.com`)
- **`DEPLOY_USER`**: SSH username for the deployment server (e.g., `pi` or `deploy`)
- **`DEPLOY_SSH_KEY`**: Private SSH key for authentication (see below for setup)

### Optional Secrets

- **`DEPLOY_PORT`**: SSH port (defaults to `22` if not set)
- **`DEPLOY_PATH`**: Path to the project on the server (defaults to `/opt/all-the-much-bakeshop`)

## SSH Key Setup

To generate an SSH key for deployment:

```bash
# On your local machine, generate a new SSH key
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/bakeshop_deploy

# Copy the public key to your deployment server
ssh-copy-id -i ~/.ssh/bakeshop_deploy.pub user@your-server

# Copy the PRIVATE key content
cat ~/.ssh/bakeshop_deploy
```

Then add the private key content as the `DEPLOY_SSH_KEY` secret in GitHub.

## Server Prerequisites

Your deployment server must have:

1. Docker and Docker Compose installed
2. SSH access configured
3. The project directory (e.g., `/opt/all-the-much-bakeshop`) with:
   - `docker-compose.yml` file
   - `.env` file with `CLOUDFLARE_TUNNEL_TOKEN`
   - Proper permissions for the deploy user

## Manual Deployment

You can also trigger deployment manually:

1. Go to Actions tab in GitHub
2. Select "Deploy to Production" workflow
3. Click "Run workflow"

## Container Registry Access

The Docker images are stored in GitHub Container Registry. To pull images locally:

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull the image
docker pull ghcr.io/your-username/all-the-much-bakeshop:latest
```

## Troubleshooting

### Deployment fails with SSH error

- Verify `DEPLOY_HOST`, `DEPLOY_USER`, and `DEPLOY_SSH_KEY` are set correctly
- Ensure the SSH key has proper permissions on the server
- Check that the deploy user can run docker commands (add to docker group)

### Image pull fails on server

- Ensure the server has internet access
- Check that docker login succeeded (GitHub Container Registry is public by default for public repos)
- For private repos, you may need to set up authentication on the server

### Docker compose fails

- Verify `CLOUDFLARE_TUNNEL_TOKEN` is set in the server's `.env` file
- Check logs: `docker compose logs -f`
- Ensure volumes and networks are properly configured
