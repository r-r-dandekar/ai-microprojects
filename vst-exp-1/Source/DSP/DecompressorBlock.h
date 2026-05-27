#pragma once
#include "../Model/AudioBlock.h"

class DecompressorBlock : public AudioBlock
{
public:
    void prepareToPlay(double, int) override {}
    void releaseResources() override {}
    void processBlock(juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output) override;
    juce::String getName() const override { return "Decompressor"; }
};
