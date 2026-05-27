# Installation and Build Commands

Follow these steps to build **RD-Processor-Mk-01** using CMake and the **Visual Studio (MSVC)** toolchain.

## 1. Prerequisites
Ensure you have the following installed:
- **Visual Studio 2022** (with "Desktop development with C++" workload)
- **CMake** (3.22 or higher)

## 2. Build Instructions

Run these commands from a **Developer PowerShell for VS 2022**:

```powershell
# 1. Create and enter the build directory
if (Test-Path build) { Remove-Item -Recurse -Force build }
mkdir build
cd build

# 2. Configure the project
# This uses the default Visual Studio generator. 
cmake ..

# 3. Build the project
# This will build the Release configuration.
cmake --build . --config Release -j8
```

## 3. Output Locations

Once the build completes, you can find the outputs in the `build` folder:

- **Standalone Executable:**
  `build/RD-Processor-Mk-01_artefacts/Release/Standalone/RD-Processor-Mk-01.exe`
- **VST3 Plugin:**
  `build/RD-Processor-Mk-01_artefacts/Release/VST3/RD-Processor-Mk-01.vst3`

## 4. Troubleshooting
- **Internet Connection**: The first configuration step requires an internet connection to download the JUCE framework.
- **Compiler Errors**: Ensure your Visual Studio installation includes the C++20 standard.
