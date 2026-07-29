<div align="center">
  <img src="https://i.pinimg.com/736x/c9/01/35/c90135042c8224260e963e36302a363b.jpg" alt="Locale-Run Banner" width="400"/>
  <h1>> Locale-Run_</h1>
  <p><b>Scan. Connect. Develop.</b></p>
  <img src="https://img.shields.io/badge/version-0.0.1-brightgreen.svg?style=for-the-badge&logo=visualstudiocode&color=000000&labelColor=2ea043" alt="Version"/>
  <img src="https://img.shields.io/badge/status-active-brightgreen.svg?style=for-the-badge&logo=terminal&color=000000&labelColor=2ea043" alt="Status"/>
</div>

<br/>

## > whoami

`Locale-Run` is a minimal, zero-config VS Code extension designed to bridge the gap between your local development environment and your mobile testing devices. 

It automatically scans your repository, detects your framework and package manager, spins up the development server, and generates a terminal QR code. Scan the code with your phone, and instantly preview your live project on the same LAN.

<br/>

## > features

```diff
+ ZERO-CONFIG DETECTION
  Automatically detects Vite, Next.js, React, Angular, Vue, and Vanilla JS.
  
+ NATIVE PSEUDOTERMINAL
  Server logs and QR codes are rendered beautifully right inside a dedicated VS Code terminal.
  
+ SMART ROUTING
  Works effortlessly with deep directories and specific HTML files.
  
+ INSTANT QR GENERATION
  No more typing `192.168.x.x:3000`. Just scan and go.
```

<br/>

<div align="center">
  <img src="https://i.pinimg.com/736x/b3/88/d5/b388d5f270f6bc295772503d49cc5f06.jpg" alt="QR Code Interface" width="250"/>
</div>

<br/>

## > quick_start

1. Open your project in VS Code.
2. Ensure you are connected to the same Wi-Fi/LAN as your testing device.
3. Click the `▶ Locale-Run` button in the **Status Bar** (bottom right) or the **Tab Menu** (top right).
4. Open the integrated terminal to view your live server logs.
5. Scan the generated QR code with your mobile device.

## > manual_commands

Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

```bash
# Starts the development server and generates the QR code
> Locale-Run: Start Project

# Kills the running server process
> Locale-Run: Stop Dev Server
```

<br/>

## > supported_frameworks

`Locale-Run` supports the following stacks out of the box:

- **Next.js**
- **Vite** (automatically injects `--host 0.0.0.0`)
- **React (create-react-app)**
- **Angular**
- **Vue & Nuxt**
- **Svelte**
- **Vanilla HTML/JS** (automatically routes to active `.html` file)

<br/>

---

<div align="center">
  <p><i>Built for the modern developer. Keep it green.</i></p>
</div>
