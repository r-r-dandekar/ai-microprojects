#pragma once

#include "../Model/AudioBlock.h"
#include <juce_dsp/juce_dsp.h>

class CompressorBlock : public AudioBlock
{
public:
    CompressorBlock();
    ~CompressorBlock() override = default;

    void prepareToPlay(double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;
    void processBlock(juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output) override;

    juce::String getName() const override { return "Compressor"; }

private:
    juce::dsp::Compressor<float> compressor;
};
