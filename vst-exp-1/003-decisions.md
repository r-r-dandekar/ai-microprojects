# RD-Processor-Mk-01 Design Specification

## Overview
A real-time guitar processing VST 3 utilizing a graph-based signal chain with MVC UI architecture.

## 1. Signal Processing Architecture
- **Graph Model:** Nodes (blocks) and Edges (connections).
- **Traversal:** Push/Pull graph traversal during `processBlock`.
- **Latency:** Dynamic reporting via `setLatencySamples` in the audio thread when graph topology changes.
- **Resource Management:** Asynchronous loading of IR files using a background thread and lock-free pointer exchange.

## 2. Dependencies & State Synchronization
- **Sidechaining:** Explicit "Wire" objects in the data model for linking dependencies (e.g., Compressor envelope -> Decompressor).

## 3. UI Architecture (MVC)
- **Model:** Holds graph topology and parameter states.
- **View:** 
    - Retained-mode components rendering based on model state.
    - Drag-and-drop palette for adding blocks.
- **Controller:** Orchestrates user interactions (moving blocks, adding/removing, linking) and updates the Model.

## 6. Effect Block Parameter Definitions
- **Distortion (Soft Clipping):** Drive, Tone, Output Level, Curve (Selectable transfer characteristics).
- **EQ (Single-Band):** Frequency, Gain, Quality (Q), Type (Low/High/Band Shelf).
- **Compressor:** Threshold, Ratio, Attack Time, Release Time, Makeup Gain.
- **Decompressor:** Threshold, Ratio, Attack Time, Release Time, Makeup Gain.
