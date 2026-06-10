# Setup & Build Instructions

## Prerequisites

Install these manually before building.

### 1. Visual Studio 2022
Download from https://visualstudio.microsoft.com/

During installation, select the **Desktop development with C++** workload. This includes MSVC, the Windows SDK, and CMake integration.

Minimum version: Visual Studio 2022 (17.x). Earlier versions do not fully support C++20.

### 2. CMake 3.22+
Download from https://cmake.org/download/

Choose the Windows installer and ensure you select **"Add CMake to the system PATH"** during installation.

Verify after install:
```
cmake --version
```

### 3. Git
Download from https://git-scm.com/

Required so that CMake's `FetchContent` can clone JUCE during the first build.

Verify after install:
```
git --version
```

---

## Dependencies fetched automatically

**JUCE 8.0.0** is downloaded automatically by CMake the first time you configure the project. You need an internet connection for the first build. Subsequent builds use the cached download.

JUCE bundles the VST3 SDK — no separate SDK download is needed.

---

## Build

### Step 1 — Configure

Open a terminal (PowerShell or Command Prompt) in the project root and run:

```powershell
cmake -B build -S . -G "Visual Studio 17 2022" -A x64
```

For Visual Studio 2026,
```powershell
cmake -B build -S . -G "Visual Studio 18 2026" -A x64
```

This downloads JUCE and generates the Visual Studio solution. It takes a few minutes on the first run.

### Step 2 — Build

```powershell
cmake --build build --config Release
```

For a debug build (slower audio, but easier to diagnose crashes):

```powershell
cmake --build build --config Debug
```

---

## Build output

After a successful build, artefacts are in:

```
build\RD-Processor-Mk-01_artefacts\Release\
    VST3\RD-Processor-Mk-01.vst3\   ← VST3 plugin bundle
    Standalone\RD-Processor-Mk-01.exe  ← standalone application
```

---

## Installing the VST3

Copy the `.vst3` folder to the standard Windows VST3 location so your DAW discovers it:

```powershell
xcopy /E /I "build\RD-Processor-Mk-01_artefacts\Release\VST3\RD-Processor-Mk-01.vst3" "C:\Program Files\Common Files\VST3\RD-Processor-Mk-01.vst3"
```

After copying, rescan plugins in your DAW.

---

## Running standalone

The standalone app can be launched directly without a DAW:

```powershell
.\build\RD-Processor-Mk-01_artefacts\Release\Standalone\RD-Processor-Mk-01.exe
```

On first launch, click the settings icon (bottom of the standalone window) to select your audio input and output devices.

---

## Opening in Visual Studio

If you prefer to work inside Visual Studio rather than the terminal:

1. Run the CMake configure step (Step 1 above).
2. Open `build\RD-Processor-Mk-01.sln` in Visual Studio.
3. Set the build target to **RD-Processor-Mk-01** and the configuration to **Release**.
4. Press **Ctrl+Shift+B** to build.

---

## Troubleshooting

**CMake can't find a compiler**
Make sure the "Desktop development with C++" workload is installed in Visual Studio. Re-run the CMake configure step after installing it.

**FetchContent fails to download JUCE**
Check your internet connection and that Git is on your PATH. If behind a proxy, set `https_proxy` in your environment before running CMake.

**"Cannot open source file" errors in Visual Studio**
Rebuild the CMake configuration (`cmake -B build -S .`) after adding or removing source files, then reload the solution.

**Plugin not appearing in DAW**
Confirm the `.vst3` folder (not just the contents) was copied to `C:\Program Files\Common Files\VST3\` and that your DAW performed a plugin rescan.
