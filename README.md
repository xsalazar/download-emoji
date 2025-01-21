# 💾 Download Emoji

This repository holds the source code for the website [https://downloademoji.dev](https://downloademoji.dev).

This website allows for quick browsing and downloading of large, high-quality versions of emoji, leveraging the [image-converter](https://github.com/xsalazar/image-converter) backend application running in AWS.

## Getting Started

This repository leverages [VSCode's devcontainer](https://code.visualstudio.com/docs/remote/containers) feature to ensure all necessary dependencies are available inside the container for development.

### Application

To get started:

```bash
npm install && npm start
```

This will start the application on your local machine, running on [http://127.0.0.1:5173/](http://127.0.0.1:5173).

⚠️ Note that image downloads will not work locally as the backend only allows CORS requests from [https://downloademoji.dev](https://downloademoji.dev).

### Deployments

All application deployments are managed via GitHub Actions and the [`./.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) workflow.

Additionally, application dependencies are automatically managed and updated via Dependabot and the [`./.github/workflows/automerge-dependabot.yml`](./.github/workflows/automerge-dependabot.yml) workflow.
