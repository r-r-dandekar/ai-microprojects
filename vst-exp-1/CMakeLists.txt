cmake_minimum_required(VERSION 3.22)

project(RD-Processor-Mk-01 VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 1. Fetch JUCE
include(FetchContent)
FetchContent_Declare(
    juce
    GIT_REPOSITORY https://github.com/juce-framework/JUCE.git
    GIT_TAG        8.0.0
)
FetchContent_MakeAvailable(juce)

# 2. Add the JUCE Plugin
juce_add_plugin(RD-Processor-Mk-01
    PRODUCT_NAME "RD-Processor-Mk-01"
    COMPANY_NAME "RD-Audio"
    BUNDLE_ID com.rd-audio.rdprocessor
    PLUGIN_MANUFACTURER_CODE RdAu
    PLUGIN_CODE RdP1
    FORMATS VST3 Standalone
    IS_SYNTH FALSE
    NEEDS_MIDI_INPUT FALSE
    NEEDS_MIDI_OUTPUT FALSE
    IS_MIDI_EFFECT FALSE
    EDITOR_WANTS_KEYBOARD_FOCUS TRUE
    COPY_PLUGIN_AFTER_BUILD FALSE
    VST3_CATEGORIES "Fx" "Distortion" "Dynamics"
)

# 3. Source Files
target_sources(RD-Processor-Mk-01 PRIVATE
    Source/PluginProcessor.cpp
    Source/PluginProcessor.h
    Source/PluginEditor.cpp
    Source/PluginEditor.h

    Source/Model/AudioBlock.h
    Source/Model/AudioBlock.cpp
    Source/Model/AudioGraph.h
    Source/Model/AudioGraph.cpp
    Source/Model/Connection.h

    Source/DSP/SourceBlock.h
    Source/DSP/OutputBlock.h
    Source/DSP/SplitBlock.h
    Source/DSP/MergeBlock.h
    Source/DSP/MergeBlock.cpp
    Source/DSP/DistortionBlock.h
    Source/DSP/DistortionBlock.cpp
    Source/DSP/EQBlock.h
    Source/DSP/EQBlock.cpp
    Source/DSP/CompressorBlock.h
    Source/DSP/CompressorBlock.cpp
    Source/DSP/DecompressorBlock.h
    Source/DSP/DecompressorBlock.cpp
    Source/DSP/IRBlock.h
    Source/DSP/IRBlock.cpp
)

# 4. Include Directories
target_include_directories(RD-Processor-Mk-01 PRIVATE Source)

# 5. Link JUCE Modules
target_link_libraries(RD-Processor-Mk-01 PRIVATE
    juce::juce_audio_utils
    juce::juce_audio_processors
    juce::juce_audio_formats
    juce::juce_audio_devices
    juce::juce_audio_basics
    juce::juce_graphics
    juce::juce_gui_basics
    juce::juce_gui_extra
    juce::juce_dsp
)

target_compile_definitions(RD-Processor-Mk-01 PRIVATE
    JUCE_VST3_CAN_REPLACE_VST2=0
)
