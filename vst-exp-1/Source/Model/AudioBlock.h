#pragma once
#include <juce_audio_basics/juce_audio_basics.h>
#include <juce_core/juce_core.h>

enum class BlockType { Source, Output, Distortion, EQ, Compressor, Decompressor, IR, Split, Merge };

class AudioBlock
{
public:
    AudioBlock() : uuid (juce::Uuid()) {}
    virtual ~AudioBlock() = default;

    virtual void prepareToPlay (double sampleRate, int samplesPerBlock) = 0;
    virtual void releaseResources() = 0;
    virtual void processBlock (juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output) = 0;

    virtual juce::String getName() const = 0;
    virtual BlockType    getType() const = 0;

    juce::Uuid getUuid() const { return uuid; }

private:
    juce::Uuid uuid;
};
