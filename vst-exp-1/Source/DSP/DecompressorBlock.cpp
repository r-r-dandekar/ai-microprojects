#include "DecompressorBlock.h"

void DecompressorBlock::processBlock(juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output)
{
    output.makeCopyOf(input);
}
