# Intent

## What We're Building
To develop a VST 3 effect called RD-Processor-Mk-01 for guitar signal processing. This will be accessed either standalone, or through a DAW.

## Success Looks Like
A VST 3 application with a minimalistic UI, that can process an input signal in real time, and play the output.

## Project Details
 - RD-Processor-Mk-01 is a guitar processor VST
 - Should have a simple UI, so that it's easy to develop and maintain
 - Allows selecting input and output devices
 - Should allow the user to design a signal chain
    1. Should allow effects (blocks) in serial
    2. Should allow splitting the signal path for parallel effect chains
    3. Should allow merging two signal paths
    4. There should always be one input (source) block and one output block
 - Following effects should be supported for now
    1. Distortion (soft clipping)
    2. Applying an impulse response (IR) on a signal. IR will be available as a .wav file
    3. EQ (Low shelf, High shelf, Band shelf, all with adjustable bandwidth, frequency and gain)
    4. Compressor based on the envelop of the signal, with adjustable parameters like attack, ratio, gain, release
    5. A 'decompressor', which will be linked to the envelop at the input of a previously applied compressor, with relevant parameters.

## UI Details

### Top Menu
A menu with things like settings.

### Left Sidebar
Will show all the parameters of the currently selected block, or nothing if no block is selected.
The parameters should be adjustable with sliders, textboxes, or buttons as needed.

### Signal Path Area
This will be the main central area, showing all the effects in the chain, along with all the splits and merges. The UI should be interactive, allowing the user to split or merge paths at any point. It should also allow all the blocks to be dragged and dropped.
It should also have a button to add a block. When pressed, this button should generate a pop-up asking the user to select the block to add from a list of blocks (distortion, eq, etc.)