#include "DSP/MergeBlock.h"
#include <algorithm>

MergeBlock::MergeBlock()
{
    inputGains.resize (8, 1.0f);
}

void MergeBlock::processInputs (const std::vector<juce::AudioBuffer<float>*>& inputs,
                                 juce::AudioBuffer<float>& output)
{
    output.clear();
    if (inputs.empty()) return;

    int numSamples  = output.getNumSamples();
    int numChannels = output.getNumChannels();

    if (mode == MergeMode::Sum || mode == MergeMode::Average)
    {
        for (size_t i = 0; i < inputs.size(); ++i)
        {
            auto* src = inputs[i];
            int   n   = std::min (numSamples, src->getNumSamples());
            for (int ch = 0; ch < numChannels; ++ch)
            {
                int srcCh = std::min (ch, src->getNumChannels() - 1);
                output.addFrom (ch, 0, *src, srcCh, 0, n);
            }
        }
        if (mode == MergeMode::Average && inputs.size() > 1)
            output.applyGain (1.0f / static_cast<float> (inputs.size()));
    }
    else // WeightedMix
    {
        for (size_t i = 0; i < inputs.size(); ++i)
        {
            float gain = i < inputGains.size() ? inputGains[i] : 1.0f;
            auto* src  = inputs[i];
            int   n    = std::min (numSamples, src->getNumSamples());
            for (int ch = 0; ch < numChannels; ++ch)
            {
                int srcCh = std::min (ch, src->getNumChannels() - 1);
                output.addFrom (ch, 0, *src, srcCh, 0, n, gain);
            }
        }
    }
}

void MergeBlock::setInputGain (int index, float gain)
{
    if (index >= 0 && index < static_cast<int> (inputGains.size()))
        inputGains[index] = gain;
}

float MergeBlock::getInputGain (int index) const
{
    if (index >= 0 && index < static_cast<int> (inputGains.size()))
        return inputGains[index];
    return 1.0f;
}
