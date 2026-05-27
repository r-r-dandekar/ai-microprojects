#include "IRBlock.h"

void IRBlock::processBlock(juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output)
{
    output.makeCopyOf(input);
}
