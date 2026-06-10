#include "DSP/DecompressorBlock.h"
#include "DSP/CompressorBlock.h"

void DecompressorBlock::processBlock (juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output)
{
    output.makeCopyOf (input);
    if (linkedCompressor == nullptr) return; // no-op / warning state

    float envLinear = linkedCompressor->getEnvelopeLevel();
    float envDb     = juce::Decibels::gainToDecibels (envLinear, -200.0f);

    float gainDb = 0.0f;
    if (envDb > thresholdDb)
        gainDb = (envDb - thresholdDb) * (1.0f - 1.0f / ratio);

    float totalGain = juce::Decibels::decibelsToGain (gainDb + makeupGainDb);
    output.applyGain (totalGain);
}
