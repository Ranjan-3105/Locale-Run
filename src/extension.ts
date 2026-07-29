import * as vscode from 'vscode';
import { detectProjectDetails } from './detector';
import { runDevServerAndDetectPort, stopDevServer, writeToTerminal } from './runner';
import * as os from 'os';
import * as qrcode from 'qrcode-terminal';

function getLocalIp(): string {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]!) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

export function activate(context: vscode.ExtensionContext) {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'localerunner.start';
    statusBarItem.text = '$(play-circle) Locale-Run';
    statusBarItem.tooltip = 'Start Project and generate QR Code';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    let startCommand = vscode.commands.registerCommand('localerunner.start', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open.');
            return;
        }

        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        
        try {
            vscode.window.showInformationMessage('Locale-Run: Detecting project details...');
            const activeEditor = vscode.window.activeTextEditor;
            const activeFilePath = activeEditor ? activeEditor.document.fileName : undefined;
            const details = await detectProjectDetails(activeFilePath, workspaceRoot);
            
            const result = await runDevServerAndDetectPort(details.projectRoot, details);
            
            const localIp = getLocalIp();
            let networkUrl = `http://${localIp}:${result.port}`;
            
            // If it's a vanilla project, we want to show the live page instead of a directory listing.
            if (details.framework === 'vanilla') {
                if (activeEditor && activeEditor.document.fileName.endsWith('.html')) {
                    if (activeEditor.document.fileName.startsWith(details.projectRoot)) {
                        const relativePath = activeEditor.document.fileName.substring(details.projectRoot.length).replace(/^[\\\/]/, '');
                        const urlPath = relativePath.split(require('path').sep).join('/');
                        if (urlPath && urlPath !== 'index.html') {
                            networkUrl += `/${urlPath}`;
                        }
                    }
                } else if (!require('fs').existsSync(require('path').join(details.projectRoot, 'index.html'))) {
                    const files = require('fs').readdirSync(details.projectRoot);
                    const htmlFile = files.find((f: string) => f.endsWith('.html'));
                    if (htmlFile) {
                        networkUrl += `/${htmlFile}`;
                    }
                }
            }
            
            // Display QR Code
            qrcode.generate(networkUrl, { small: true }, (qr: string) => {
                writeToTerminal(`\r\n\x1b[36mYour project is running at: ${networkUrl}\x1b[0m`);
                writeToTerminal('\x1b[36mScan the QR code below to access it from another device:\x1b[0m\r\n');
                writeToTerminal(qr);
            });
            
            vscode.window.showInformationMessage(`Project running at ${networkUrl}`);
            
        } catch (error: any) {
            vscode.window.showErrorMessage(`Locale-Run Error: ${error.message}`);
        }
    });

    let stopCommand = vscode.commands.registerCommand('localerunner.stop', () => {
        stopDevServer();
        vscode.window.showInformationMessage('Locale-Run: Dev server stopped.');
    });

    context.subscriptions.push(startCommand, stopCommand);
}

export function deactivate() {
    stopDevServer();
}
