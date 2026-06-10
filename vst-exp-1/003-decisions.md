# RD-Processor-Mk-01 Design Decisions

## 1. Technology Stack
- **Language:** C++
- **Framework:** JUCE
- **Build System:** CMake with `juce_add_plugin`
- **Target Platform:** Windows only (macOS can be added later)

## 2. Plugin Format & I/O
- **Format:** VST3 + Standalone (JUCE provides both from one codebase)
- **Channel Configuration:** Stereo in, stereo out
- **Audio I/O Device Selection:** Standalone mode only, via JUCE's built-in standalone audio settings dialog. In DAW mode, the host owns the device.
- **Buffer Size:** Host buffer size — no internal re-blocking
- **Sample Rate:** Whatever the host provides — no restrictions

## 3. Signal Processing Architecture
- **Graph Model:** Nodes (blocks) and directed edges (connections). DAG only — feedback loops are blocked at the UI level.
- **Traversal:** Push/pull graph traversal during `processBlock`
- **Parallel Paths:** Unlimited parallel branches supported
- **Graph Update Safety:** Lock-free pointer swap — new graph built on UI thread, atomically swapped for the audio thread to pick up. No mutexes on the audio thread.
- **Latency Reporting:** Dynamic via `setLatencySamples` when graph topology changes
- **CPU Overload:** Rely on host/OS to handle xruns — no internal deadline detection

## 4. Effect Implementations

### Distortion (Soft Clipping)
- **Parameters:** Drive, Tone, Output Level, Curve
- **Curves:** Small fixed set — soft clip (`tanh`), hard clip, asymmetric clip
- **Extensibility:** Curves defined via an enum + factory/lookup pattern so adding a new curve is a one-line registration
- **Stereo:** Independent L/R channel processing with shared parameters

### EQ (Single-Band)
- **Implementation:** JUCE `dsp::IIR` (biquad filters)
- **Parameters:** Frequency, Gain, Q (Quality/Bandwidth), Type (Low Shelf / High Shelf / Band Shelf)
- **Multi-band:** Achieved by chaining multiple EQ blocks in the graph
- **Stereo:** Independent L/R channel processing with shared parameters

### Compressor
- **Parameters:** Threshold, Ratio, Attack Time, Release Time, Makeup Gain, Detection Mode
- **Detection Mode:** User-selectable — Peak or RMS
- **Stereo:** Independent L/R channel processing with shared parameters

### Decompressor
- **Parameters:** Threshold, Ratio, Attack Time, Release Time, Makeup Gain
- **Compressor Linking:** Dropdown in the sidebar selects which upstream compressor to read the envelope from
- **Unlinked State:** If the linked compressor is deleted, decompressor becomes a no-op and shows a visual warning (e.g. red border). The decompressor is NOT auto-deleted and deletion of the compressor is NOT blocked.
- **Stereo:** Independent L/R channel processing with shared parameters

### IR (Impulse Response)
- **Convolution Method:** Partitioned convolution (overlap-add) via JUCE `dsp::Convolution`
- **File Handling:** User browses for a `.wav` file; the file path is stored in the preset (no copying)
- **Mono/Stereo IR:** Both handled — mono IR is broadcast to both channels, stereo IR uses L/R channels independently
- **Missing File on Load:** IR block becomes a no-op with a visual warning state; preset load continues for all other blocks

## 5. Graph Node Types

### Source Node
- Always exactly one per graph
- Input/output level meter displayed

### Output Node
- Always exactly one per graph
- Input/output level meter displayed

### Effect Nodes
- Distortion, EQ, Compressor, Decompressor, IR

### Split Node
- Pure signal copy — duplicates signal identically to all output paths
- No per-output gain control (use a gain block on each branch instead)

### Merge Node
- Per-instance user-selectable merge mode: Sum, Average, or Weighted Mix
- Weighted Mix has an adjustable gain knob per input path

## 6. UI Architecture

### Rendering
- **Hybrid approach:** JUCE built-in components (sliders, buttons, dropdowns) for sidebar controls; custom-drawn (JUCE Graphics API) for the signal path canvas
- **Node Layout:** Auto-layout only — nodes arranged left-to-right based on signal flow

### Top Menu
- Settings and global actions

### Left Sidebar
- Shows parameters of the currently selected block as JUCE sliders, text boxes, or buttons as appropriate
- Empty when no block is selected

### Signal Path Canvas (Custom Drawn)
- Displays all nodes and edges
- "Add Block" button opens a popup to select block type from a list
- Nodes cannot be freely dragged (auto-layout only)
- Supports adding/removing splits and merges interactively

### Metering
- Level meters on the Source and Output nodes only (input/output of the full graph)
- No per-node metering

## 7. State & Preset Management
- **DAW State:** Plugin state saved/restored by host via `getStateInformation` / `setStateInformation`
- **User Presets:** JSON files stored in `Documents/RD-Processor-Mk-01/Presets/`
- **Preset Contents:** Full graph topology + all parameter values + IR file paths

## 8. Undo/Redo
- Full undo/redo for both graph topology changes (add/remove/rewire nodes) and parameter adjustments

## 9. Parameter Automation
- No DAW host automation — parameters are internal state only, managed via JUCE `AudioProcessorParameter` for thread-safe value passing between UI and audio threads

## 10. Dependencies & Sidechaining
- Compressor → Decompressor link uses explicit "Wire" objects in the data model
- Link is established via a dropdown on the Decompressor in the sidebar
