# 🎧 Audio Routing Guide (System Audio Capture)

By default, the **Audio-Visualizer** natively requests "Microphone" access to capture sound from your environment. 

But what if you want the visualizer to react to the **music currently playing on your computer** (from Spotify, YouTube, your DAW, etc.) without having the music play out loud into a physical microphone?

Until the browser API allows direct system audio capture, the standard workaround is to use a **Virtual Audio Cable**. This software creates a fake "speaker" you send music to, which invisibly loops directly into a fake "microphone" that the Audio-Visualizer can listen to.

Here are the best free tools and steps for each operating system.

---

## 🪟 Windows Setup

### Option 1: VB-Cable (Recommended - Simplest)
1. **Download & Install**: Get [VB-Cable (Free)](https://vb-audio.com/Cable/) and install it as Admin. Restart your PC if required.
2. **Set Playback**: Click the Windows sound icon in the taskbar and change your output device to **CABLE Input (VB-Audio Virtual Cable)**.
    * *Note: You will not hear your music through your real speakers while this is selected.*
3. **Set the Visualizer**: Open the Audio-Visualizer web app. When it asks for Microphone permissions, select **CABLE Output (VB-Audio Virtual Cable)**.
4. **Play Music**: Start your music. The visualizer will now react purely to the internal system audio.

### Option 2: VoiceMeeter (Advanced - Hear while visualizing)
If you want to visualize the audio *and* still hear it from your speakers simultaneously, use [VoiceMeeter](https://vb-audio.com/Voicemeeter/). 
1. Set Windows default playback to "VoiceMeeter Input".
2. In the VoiceMeeter app, set "Hardware Out A1" to your real speakers.
3. In the Audio-Visualizer, select "VoiceMeeter Output" as your microphone.

---

## 🍎 macOS Setup

### BlackHole
macOS requires loopback software to capture system audio. BlackHole is the open-source industry standard.

1. **Download & Install**: Get [BlackHole (Free)](https://existential.audio/blackhole/). The 2-channel version is usually sufficient.
2. **Audio MIDI Setup**:
    * Open the built-in macOS `Audio MIDI Setup` app.
    * Create a **Multi-Output Device** (click the `+` at the bottom left).
    * Check both your real speakers (e.g., "MacBook Pro Speakers" or "Built-in Output") AND "BlackHole 2ch".
3. **Set Playback**: Set your Mac's system sound output to this new "Multi-Output Device". This sends audio to the visualizer AND your physical speakers.
4. **Set the Visualizer**: Open the Audio-Visualizer web app. When it asks for a microphone, select **BlackHole 2ch**.

---

## 🐧 Linux Setup (Ubuntu / Mint / Arch)

Linux audio servers inherently support audio routing, making this quite easy without third-party downloads.

### PulseAudio / PipeWire (Pavucontrol)
1. **Install Pavucontrol**: Run `sudo apt install pavucontrol` (or your distro's equivalent).
2. **Start Visualizer**: Open the Audio-Visualizer in your browser and allow microphone permissions.
3. **Route the Audio**:
    * Open `pavucontrol` (Volume Control application).
    * Go to the **Recording** tab.
    * Find the entry for your web browser (e.g., Firefox or Chrome).
    * Change its source dropdown to **"Monitor of [Your Output Device]"** (e.g., "Monitor of Built-in Audio Analog Stereo").

---

## 🚀 The Future: Native Browser Support

We are actively tracking browser API updates. Features like `getDisplayMedia({ audio: true })` currently allow sharing tab audio, and we plan to integrate native stream-sharing capabilities directly into the UI in future updates so you won't need these virtual cables! (See our [ROADMAP](../ROADMAP.md)).
