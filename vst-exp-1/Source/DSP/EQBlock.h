#pragma once

#include "../Model/AudioBlock.h"
#include <juce_dsp/juce_dsp.h>

class EQBlock : public AudioBlock
{
public:
    EQBlock();
    ~EQBlock() override = default;

    void prepareToPlay(double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;
    void processBlock(juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output) override;

    juce::String getName() const override { return "EQ"; }

private:
    juce::dsp::ProcessorChain<juce::dsp::IIR::Filter<float>> filterChain;
};
