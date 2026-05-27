#include "CompressorBlock.h"

CompressorBlock::CompressorBlock()
{
    compressor.setThreshold(-20.0f);
    compressor.setRatio(4.0f);
}

void CompressorBlock::prepareToPlay(double sampleRate, int samplesPerBlock)
{
    compressor.prepare({ sampleRate, (juce::uint32)samplesPerBlock, 2 });
}

void CompressorBlock::releaseResources() {}

void CompressorBlock::processBlock(juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output)
{
    output.makeCopyOf(input);
    juce::dsp::AudioBlock<float> block(output);
    compressor.process(juce::dsp::ProcessContextReplacing<float>(block));
}
