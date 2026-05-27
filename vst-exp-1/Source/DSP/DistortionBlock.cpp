#include "DistortionBlock.h"
#include <cmath>

DistortionBlock::DistortionBlock() {}

void DistortionBlock::processBlock(juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output)
{
    output.makeCopyOf(input);

    for (int ch = 0; ch < output.getNumChannels(); ++ch)
    {
        auto* data = output.getWritePointer(ch);
        for (int i = 0; i < output.getNumSamples(); ++i)
            data[i] = std::tanh(data[i] * drive);
    }
}
