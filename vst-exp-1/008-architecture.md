# RD-Processor-Mk-01 Architectural Blueprint

## 1. Core Model (Data & Logic)
- **`AudioGraph` (Model):** Manages `AudioBlock` nodes and `Connection` edges.
    - *Responsibilities:* DAG validation (cycle detection), node management.
- **`AudioBlock` (Base Class):** Abstract interface.
    - *Member Functions:* `processBlock(AudioBuffer<float>& buffer)`, `prepareToPlay()`, `releaseResources()`.
- **Effect Blocks (Inherit `AudioBlock`):**
    - **`DistortionBlock`:** Implements soft clipping. Params: Drive, Tone, Output Level, Curve (Selectable type).
    - **`EQBlock`:** Implements single-band filtering. Params: Frequency, Gain, Quality (Q), Type (Low/High/Band Shelf).
    - **`CompressorBlock`:** Implements dynamic range compression. Params: Threshold, Ratio, Attack Time, Release Time, Makeup Gain.
    - **`DecompressorBlock`:** Implements expansion. Params: Threshold, Ratio, Attack Time, Release Time, Makeup Gain.
    - **`IRBlock`:** Applies impulse response. Params: IR File Path, Wet/Dry Mix.
- **`Connection` / `Wire`:** Manages signal and sidechain routing.

## 2. Controller & Orchestration
- **`GraphController`:** Bridges user actions (UI) to `AudioGraph` (Model).
- **`PluginProcessor`:** Root JUCE processor. Handles audio thread, latency updates, and IR resource loading.

## 3. UI (MVC View)
- **`MainCanvasComponent`:** Retained-mode graph rendering.
- **`BlockComponent`:** Visual representation of any `AudioBlock`.
- **`InspectorSidebar`:** Context-sensitive inspector rendering parameters for the selected `AudioBlock`.
- **`BlockPalette`:** Source for adding new effect blocks.

## 4. Key Implementation Strategies
- **Concurrency:** UI thread updates `GraphModel`; `AudioGraph` uses "working" vs "render" instances.
- **Memory:** Lock-free buffers for data flow between `PluginProcessor` and `GraphController`.
- **Latency:** `PluginProcessor` sums block latencies for `setLatencySamples`.

## 5. Potential Pitfalls
- **Thread Safety:** No allocations in `processBlock`.
- **Cycle Detection:** DFS-based validation for every new connection.
- **IR Loading:** Async loading with non-blocking buffer swap.
