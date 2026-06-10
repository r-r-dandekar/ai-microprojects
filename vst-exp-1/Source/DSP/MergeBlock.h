#pragma once
#include "Model/AudioBlock.h"
#include <vector>

enum class MergeMode { Sum, Average, WeightedMix };

class MergeBlock : public AudioBlock
{
public:
    MergeBlock();

    void prepareToPlay (double, int) override {}
    void releaseResources()          override {}

    // Called by the graph when multiple upstream buffers exist
    void processInputs (const std::vector<juce::AudioBuffer<float>*>& inputs,
                        juce::AudioBuffer<float>& output);

    // Fallback single-input path (pass-through)
    void processBlock (juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output) override
    {
        output.makeCopyOf (input);
    }

    juce::String getName() const override { return "Merge"; }
    BlockType    getType() const override { return BlockType::Merge; }

    void      setMode (MergeMode m) { mode = m; }
    MergeMode getMode()       const { return mode; }

    void  setInputGain (int index, float gain);
    float getInputGain (int index) const;

private:
    MergeMode          mode = MergeMode::Sum;
    std::vector<float> inputGains;
};
