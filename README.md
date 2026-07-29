<div align="center">
  <img src="https://i.pinimg.com/736x/c9/01/35/c90135042c8224260e963e36302a363b.jpg" alt="Snap Run Banner" width="400"/>
  <h1>> Snap Run_</h1>
  <p><b>Snap. Connect. Develop.</b></p>
  <img src="https://img.shields.io/badge/version-1.0.0-brightgreen.svg?style=for-the-badge&logo=visualstudiocode&color=000000&labelColor=2ea043" alt="Version"/>
  <img src="https://img.shields.io/badge/status-active-brightgreen.svg?style=for-the-badge&logo=terminal&color=000000&labelColor=2ea043" alt="Status"/>
</div>

<br/>

## > whoami

`Snap Run` is a minimal, zero-config VS Code extension designed to bridge the gap between your local development environment and your mobile testing devices. 

It automatically scans your repository, detects your framework and package manager, spins up the development server, and generates a terminal QR code. Snap the code with your phone, and instantly preview your live project on the same LAN.

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
  No more typing `192.168.x.x:3000`. Just snap and go.
```

<br/>

<div align="center">
  <img src="https://i.pinimg.com/736x/b3/88/d5/b388d5f270f6bc295772503d49cc5f06.jpg" alt="QR Code Interface" width="250"/>
</div>

<br/>

## > how_to_use

There are three intuitive ways to launch **Snap Run** once your project is open in VS Code:

### 1. The Status Bar (Bottom Bar)
Look at the bottom right corner of your VS Code window. You will see a button labeled **`▶ Locale-Run`**. Click it to instantly start your server and generate the QR code.

### 2. The Editor Navigation Tab
Look at the top right corner of your current editor tab group. Click the **Play Icon (`▶`)** to start the project.

### 3. The Command Palette
Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) to open the Command Palette, and type:
```bash
> Locale-Run: Start Project
```
*(To stop the server, use `> Locale-Run: Stop Dev Server`)*

---

### What's Next?
Once the server starts:
1. Check the integrated terminal to view your live server logs and the QR code.
2. Ensure you are connected to the same Wi-Fi/LAN as your testing device.
3. Snap the generated QR code with your mobile device!

<br/>

## > supported_frameworks

`Snap Run` supports the following stacks out of the box:

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
