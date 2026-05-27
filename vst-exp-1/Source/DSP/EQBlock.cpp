#include "EQBlock.h"

EQBlock::EQBlock() {}

void EQBlock::prepareToPlay(double sr, int samplesPerBlock)
{
    juce::dsp::ProcessSpec spec { sr, (juce::uint32)samplesPerBlock, 2 };
    filterChain.prepare(spec);
    *filterChain.get<0>().coefficients = *juce::dsp::IIR::Coefficients<float>::makeHighPass(sr, 100.0f);
}

void EQBlock::releaseResources() {}

void EQBlock::processBlock(juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output)
{
    output.makeCopyOf(input);
    juce::dsp::AudioBlock<float> block(output);
    filterChain.process(juce::dsp::ProcessContextReplacing<float>(block));
}
