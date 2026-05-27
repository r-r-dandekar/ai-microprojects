#pragma once

#include "../Model/AudioBlock.h"
#include <juce_dsp/juce_dsp.h>

class DistortionBlock : public AudioBlock
{
public:
    DistortionBlock();
    ~DistortionBlock() override = default;

    void prepareToPlay(double sampleRate, int samplesPerBlock) override {}
    void releaseResources() override {}
    void processBlock(juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output) override;

    juce::String getName() const override { return "Distortion"; }

private:
    float drive = 2.0f;
};
