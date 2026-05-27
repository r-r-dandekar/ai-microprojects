#pragma once

#include <juce_audio_basics/juce_audio_basics.h>
#include <juce_core/juce_core.h>

/**
 * Abstract base class for all audio processing blocks in the graph.
 */
class AudioBlock
{
public:
    AudioBlock() : uuid(juce::Uuid()) {}
    virtual ~AudioBlock() = default;

    virtual void prepareToPlay(double sampleRate, int samplesPerBlock) = 0;
    virtual void releaseResources() = 0;
    virtual void processBlock(juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output) = 0;

    virtual juce::String getName() const = 0;
    
    // Identifier for the block instance
    juce::Uuid getUuid() const { return uuid; }

private:
    juce::Uuid uuid;
};
