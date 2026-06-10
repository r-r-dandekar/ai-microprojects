#include "DSP/IRBlock.h"

IRBlock::IRBlock() = default;

void IRBlock::prepareToPlay (double sampleRate, int samplesPerBlock)
{
    juce::dsp::ProcessSpec spec { sampleRate,
                                  static_cast<juce::uint32> (samplesPerBlock),
                                  2u };
    convolution.prepare (spec);
    prepared = true;

    // Re-load file if path was set before prepareToPlay was called
    if (filePath.isNotEmpty() && !fileMissing)
    {
        juce::File f (filePath);
        if (f.existsAsFile())
            convolution.loadImpulseResponse (f,
                juce::dsp::Convolution::Stereo::yes,
                juce::dsp::Convolution::Trim::yes,
                0);
    }
}

void IRBlock::releaseResources()
{
    convolution.reset();
    prepared = false;
}

void IRBlock::loadFile (const juce::File& file)
{
    filePath = file.getFullPathName();

    if (!file.existsAsFile())
    {
        fileMissing = true;
        return;
    }

    fileMissing = false;
    convolution.loadImpulseResponse (file,
        juce::dsp::Convolution::Stereo::yes,
        juce::dsp::Convolution::Trim::yes,
        0);
}

void IRBlock::processBlock (juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output)
{
    output.makeCopyOf (input);
    if (!prepared) return;

    juce::dsp::AudioBlock<float>            block (output);
    juce::dsp::ProcessContextReplacing<float> ctx (block);
    convolution.process (ctx);
}
