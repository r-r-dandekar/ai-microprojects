#pragma once
#include "Model/AudioBlock.h"
#include <juce_dsp/juce_dsp.h>

class IRBlock : public AudioBlock
{
public:
    IRBlock();

    void prepareToPlay (double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;
    void processBlock (juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output) override;

    juce::String getName() const override { return "IR"; }
    BlockType    getType() const override { return BlockType::IR; }

    void         loadFile    (const juce::File& file);
    juce::String getFilePath()  const { return filePath; }
    bool         isFileMissing() const { return fileMissing; }

private:
    juce::dsp::Convolution convolution;
    juce::String           filePath;
    bool                   fileMissing = false;
    bool                   prepared    = false;
};
