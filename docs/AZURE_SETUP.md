# Azure Deployment Setup

This document describes the required GitHub Secrets and Variables for Azure Container Apps deployment.

## Required GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions → Secrets**:

### Azure OIDC Authentication
- `AZURE_CLIENT_ID` - Azure AD App Registration Client ID
- `AZURE_TENANT_ID` - Azure AD Tenant ID  
- `AZURE_SUBSCRIPTION_ID` - Azure Subscription ID

### Azure Resources
- `AZURE_RESOURCE_GROUP_NAME` - Resource group name (e.g., `rg-react-app-core-dev`)
- `AZURE_CONTAINER_APPS_ENVIRONMENT_NAME` - Container Apps Environment name (e.g., `cae-react-app-core-dev`)
- `AZURE_CONTAINER_APP_NAME` - Container App name (e.g., `ca-react-app-core-dev`)

### Package Registry
- `NPM_PACKAGE_TOKEN` - GitHub Personal Access Token with `read:packages` scope
  - **CRITICAL**: Must be a long-lived PAT, NOT the ephemeral `GITHUB_TOKEN`
  - Container App stores these credentials for pulling images after deployment

## Required GitHub Variables

Configure these in **Settings → Secrets and variables → Actions → Variables**:

- `AZURE_REGION` - Azure region (e.g., `westeurope`, `eastus`)

## Environment-Specific Configuration

Secrets can be scoped to specific environments (dev, staging, prod):

1. Go to **Settings → Environments**
2. Create environments: `dev`, `staging`, `prod`
3. Add environment-specific secrets/variables as needed

## Azure OIDC Setup

To enable passwordless authentication from GitHub Actions:

1. Create Azure AD App Registration
2. Configure Federated Credentials for GitHub
3. Grant App Registration permissions to Azure resources
4. Store Client ID, Tenant ID, and Subscription ID as secrets

See: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure

## Verification

After configuring secrets, the deployment workflow will:

1. **Stage 1**: Run tests and quality checks
2. **Stage 2**: Build Docker image and push to GHCR
3. **Stage 3**: Deploy GREEN revision to Azure (0% traffic)
4. **Stage 4**: Verify GREEN and switch traffic (100%)

## Troubleshooting

### Error: "AZURE_CONTAINER_APPS_ENVIRONMENT_NAME is required"
- Ensure all required secrets are configured in repository settings
- Check that secrets are available to the environment (dev/staging/prod)
- Verify secret names match exactly (case-sensitive)

### Error: "Registry authentication failed"
- Ensure `NPM_PACKAGE_TOKEN` is a long-lived PAT with `read:packages` scope
- Do NOT use `GITHUB_TOKEN` - it expires after the workflow completes
- Verify the token has access to `@amuaapps` packages

### Error: "Azure login failed"
- Verify OIDC federated credentials are configured correctly
- Check that App Registration has permissions on the resource group
- Ensure Client ID, Tenant ID, and Subscription ID are correct
