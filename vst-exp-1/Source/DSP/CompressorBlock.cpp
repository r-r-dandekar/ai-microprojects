#include "DSP/CompressorBlock.h"

CompressorBlock::CompressorBlock()
{
    updateTimeConstants();
}

void CompressorBlock::prepareToPlay (double sr, int)
{
    sampleRate    = sr;
    envelopeState = 0.0f;
    updateTimeConstants();
}

void CompressorBlock::releaseResources()
{
    envelopeState = 0.0f;
}

void CompressorBlock::updateTimeConstants()
{
    attackCoeff  = std::exp (-1.0f / static_cast<float> (sampleRate * attackMs  / 1000.0));
    releaseCoeff = std::exp (-1.0f / static_cast<float> (sampleRate * releaseMs / 1000.0));
}

float CompressorBlock::computeBlockLevel (const juce::AudioBuffer<float>& buffer) const
{
    if (detectionMode == DetectionMode::Peak)
    {
        float peak = 0.0f;
        for (int ch = 0; ch < buffer.getNumChannels(); ++ch)
        {
            const float* data = buffer.getReadPointer (ch);
            for (int s = 0; s < buffer.getNumSamples(); ++s)
                peak = std::max (peak, std::abs (data[s]));
        }
        return peak;
    }
    else // RMS
    {
        float sumSq = 0.0f;
        int   total = 0;
        for (int ch = 0; ch < buffer.getNumChannels(); ++ch)
        {
            const float* data = buffer.getReadPointer (ch);
            for (int s = 0; s < buffer.getNumSamples(); ++s)
            {
                sumSq += data[s] * data[s];
                ++total;
            }
        }
        return total > 0 ? std::sqrt (sumSq / static_cast<float> (total)) : 0.0f;
    }
}

void CompressorBlock::processBlock (juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output)
{
    output.makeCopyOf (input);

    float levelLinear = computeBlockLevel (input);

    // Smooth envelope with attack/release
    float coeff   = levelLinear > envelopeState ? attackCoeff : releaseCoeff;
    envelopeState = coeff * envelopeState + (1.0f - coeff) * levelLinear;
    envelopeLevel.store (envelopeState, std::memory_order_relaxed);

    float levelDb          = juce::Decibels::gainToDecibels (envelopeState, -200.0f);
    float gainReductionDb  = 0.0f;
    if (levelDb > thresholdDb)
        gainReductionDb = (levelDb - thresholdDb) * (1.0f - 1.0f / ratio);

    float totalGain = juce::Decibels::decibelsToGain (-gainReductionDb + makeupGainDb);
    output.applyGain (totalGain);
}
