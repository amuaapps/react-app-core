/**
 * Bicep Parameters File
 * 
 * This file provides default parameter values for local development.
 * In CI/CD, these values are overridden by GitHub Actions environment variables.
 */

using './main.bicep'

// These will be overridden by GitHub Actions environment variables
param environmentName = 'core-env-dev'
param containerAppName = 'core-app-dev'
param imageReference = 'ghcr.io/amuaapps/react-app-core:dev-latest'
param revisionSuffix = 'green-initial'
param candidateLabel = 'green'
param candidateWeight = 100
param existingTraffic = []
param environment = 'dev'
param projectName = 'react-app-core'
param registryServer = 'ghcr.io'
param registryUsername = 'github-user'
param registryPassword = 'github-token'
