#pragma once
#include "Model/AudioBlock.h"

class SourceBlock : public AudioBlock
{
public:
    void prepareToPlay (double, int) override {}
    void releaseResources()          override {}
    void processBlock (juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output) override
    {
        output.makeCopyOf (input);
    }
    juce::String getName() const override { return "Source"; }
    BlockType    getType() const override { return BlockType::Source; }
};
