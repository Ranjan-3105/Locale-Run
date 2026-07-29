import * as vscode from 'vscode';
import * as cp from 'child_process';
import { ProjectDetails } from './detector';

let currentTerminal: vscode.Terminal | null = null;
let currentProcess: cp.ChildProcess | null = null;
let ptyWriteEmitter: vscode.EventEmitter<string> | null = null;

export function stopDevServer() {
    if (currentProcess) {
        currentProcess.kill();
        currentProcess = null;
    }
}

export function writeToTerminal(text: string) {
    if (ptyWriteEmitter) {
        ptyWriteEmitter.fire(text.replace(/\r?\n/g, '\r\n') + '\r\n');
    }
}

export function runDevServerAndDetectPort(workspaceRoot: string, details: ProjectDetails): Promise<{ port: number, url: string }> {
    return new Promise((resolve, reject) => {
        stopDevServer(); // Stop any existing server process first
        
        if (currentTerminal) {
            currentTerminal.dispose();
            currentTerminal = null;
        }

        let command = details.packageManager;
        if (process.platform === 'win32' && (command === 'npm' || command === 'yarn' || command === 'pnpm')) {
            command += '.cmd';
        }

        let args: string[] = [];

        if (details.hasDevScript) {
            args = ['run', 'dev'];
            if (details.framework === 'vite' || details.framework === 'angular') {
                if (details.packageManager === 'npm') {
                    args.push('--', '--host', '0.0.0.0');
                } else {
                    args.push('--host', '0.0.0.0');
                }
            }
        } else if (details.hasStartScript) {
            if (details.packageManager === 'npm' || details.packageManager === 'yarn' || details.packageManager === 'bun') {
                args = ['start'];
            } else {
                args = ['run', 'start'];
            }
        } else {
             command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
             args = ['http-server', '-p', '8080'];
        }

        ptyWriteEmitter = new vscode.EventEmitter<string>();
        
        const pty: vscode.Pseudoterminal = {
            onDidWrite: ptyWriteEmitter.event,
            open: () => {
                ptyWriteEmitter!.fire(`\x1b[32mLocale-Run: Starting ${command} ${args.join(' ')}\x1b[0m\r\n\r\n`);
                
                currentProcess = cp.spawn(command, args, {
                    cwd: workspaceRoot,
                    shell: true
                });

                let portDetected = false;

                const outputHandler = (data: Buffer) => {
                    const output = data.toString();
                    ptyWriteEmitter!.fire(output.replace(/\r?\n/g, '\r\n'));

                    if (!portDetected) {
                        const urlMatch = output.match(/http:\/\/(?:localhost|127\.0\.0\.1):(\d+)/i);
                        const portMatch = output.match(/(?:port|listening on)[^\d]*(\d{4,5})/i);

                        if (urlMatch) {
                            portDetected = true;
                            resolve({ port: parseInt(urlMatch[1], 10), url: urlMatch[0] });
                        } else if (portMatch) {
                            portDetected = true;
                            resolve({ port: parseInt(portMatch[1], 10), url: `http://localhost:${portMatch[1]}` });
                        }
                    }
                };

                currentProcess.stdout?.on('data', outputHandler);
                currentProcess.stderr?.on('data', outputHandler);

                currentProcess.on('error', (err) => {
                    ptyWriteEmitter!.fire(`\r\n\x1b[31mError: ${err.message}\x1b[0m\r\n`);
                    reject(err);
                });

                currentProcess.on('exit', (code) => {
                    ptyWriteEmitter!.fire(`\r\n\x1b[33mProcess exited with code ${code}\x1b[0m\r\n`);
                    if (!portDetected) {
                        reject(new Error(`Process exited with code ${code} before port was detected.`));
                    }
                    currentProcess = null;
                });
                
                setTimeout(() => {
                     if (!portDetected) {
                          reject(new Error("Timeout waiting for port to be detected (15s)."));
                     }
                }, 15000);
            },
            close: () => {
                stopDevServer();
            }
        };

        currentTerminal = vscode.window.createTerminal({ name: 'Locale-Run', pty });
        currentTerminal.show();
    });
}
