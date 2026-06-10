#include "DSP/DistortionBlock.h"
#include <cmath>

float DistortionBlock::applyTransfer (float sample, float gainAmount, DistortionCurve c) noexcept
{
    float driven = sample * gainAmount;
    switch (c)
    {
        case DistortionCurve::SoftClip:   return std::tanh (driven);
        case DistortionCurve::HardClip:   return juce::jlimit (-1.0f, 1.0f, driven);
        case DistortionCurve::Asymmetric:
            return driven >= 0.0f ? std::tanh (driven)
                                  : juce::jlimit (-1.0f, 0.0f, driven * 1.5f);
    }
    return sample;
}

void DistortionBlock::processBlock (juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output)
{
    output.makeCopyOf (input);

    float gainAmount = 1.0f + drive * 3.0f;          // 1x – 31x pre-gain
    float outGain    = outputLevel / 10.0f * 2.0f;   // 0 – 2 output scale
    // tone 0 = heavy low-pass (alpha 0.9), tone 10 = flat (alpha 0.0)
    float alpha      = 0.9f * (1.0f - tone / 10.0f);

    for (int ch = 0; ch < output.getNumChannels(); ++ch)
    {
        float* data = output.getWritePointer (ch);
        int    idx  = ch < 2 ? ch : 1;
        for (int s = 0; s < output.getNumSamples(); ++s)
        {
            float distorted  = applyTransfer (data[s], gainAmount, curve) * outGain;
            toneState[idx]   = alpha * toneState[idx] + (1.0f - alpha) * distorted;
            data[s]          = toneState[idx];
        }
    }
}
