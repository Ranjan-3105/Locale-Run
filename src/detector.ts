import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface ProjectDetails {
    framework: string;
    packageManager: string;
    hasDevScript: boolean;
    hasStartScript: boolean;
    projectRoot: string;
}

export async function detectProjectDetails(activeFilePath: string | undefined, workspaceRoot: string): Promise<ProjectDetails> {
    let projectRoot = workspaceRoot;
    
    // Find closest package.json or index.html to the active file
    if (activeFilePath) {
        let currentDir = path.dirname(activeFilePath);
        while (currentDir.length >= workspaceRoot.length && currentDir.startsWith(workspaceRoot)) {
            if (fs.existsSync(path.join(currentDir, 'package.json')) || fs.existsSync(path.join(currentDir, 'index.html'))) {
                projectRoot = currentDir;
                break;
            }
            const nextDir = path.dirname(currentDir);
            if (nextDir === currentDir) break;
            currentDir = nextDir;
        }
    } else {
        // If no active file, check if root is empty of project markers, then check immediate subdirs
        if (!fs.existsSync(path.join(workspaceRoot, 'package.json')) && !fs.existsSync(path.join(workspaceRoot, 'index.html'))) {
            const dirs = fs.readdirSync(workspaceRoot, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'node_modules');
            
            for (const dir of dirs) {
                const subDir = path.join(workspaceRoot, dir.name);
                if (fs.existsSync(path.join(subDir, 'package.json')) || fs.existsSync(path.join(subDir, 'index.html'))) {
                    projectRoot = subDir;
                    break;
                }
            }
        }
    }

    let packageManager = 'npm'; // default
    if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
        packageManager = 'yarn';
    } else if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) {
        packageManager = 'pnpm';
    } else if (fs.existsSync(path.join(projectRoot, 'bun.lockb'))) {
        packageManager = 'bun';
    }

    let framework = 'vanilla';
    let hasDevScript = false;
    let hasStartScript = false;

    const packageJsonPath = path.join(projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const deps = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };
            const scripts = packageJson.scripts || {};

            hasDevScript = !!scripts['dev'];
            hasStartScript = !!scripts['start'];

            if (deps['next']) {
                framework = 'next';
            } else if (deps['react-scripts']) {
                framework = 'create-react-app';
            } else if (deps['vite']) {
                framework = 'vite';
            } else if (deps['@angular/core']) {
                framework = 'angular';
            } else if (deps['vue']) {
                framework = 'vue';
            } else if (deps['nuxt']) {
                framework = 'nuxt';
            } else if (deps['svelte']) {
                framework = 'svelte';
            }
        } catch (e) {
            vscode.window.showErrorMessage('Failed to parse package.json');
        }
    }

    return {
        framework,
        packageManager,
        hasDevScript,
        hasStartScript,
        projectRoot
    };
}
