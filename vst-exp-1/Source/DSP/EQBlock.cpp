#include "DSP/EQBlock.h"

EQBlock::EQBlock()
{
    updateCoefficients();
}

void EQBlock::prepareToPlay (double sr, int)
{
    sampleRate = sr;
    for (auto& f : filters) f.reset();
    updateCoefficients();
}

void EQBlock::releaseResources()
{
    for (auto& f : filters) f.reset();
}

void EQBlock::setFrequency  (float hz) { frequency  = hz; updateCoefficients(); }
void EQBlock::setGainDb     (float db) { gainDb     = db; updateCoefficients(); }
void EQBlock::setQ          (float q)  { qValue     = q;  updateCoefficients(); }
void EQBlock::setFilterType (EQFilterType t) { filterType = t; updateCoefficients(); }

void EQBlock::updateCoefficients()
{
    float linearGain = juce::Decibels::decibelsToGain (gainDb);
    FilterCoeffs::Ptr coeffs;

    switch (filterType)
    {
        case EQFilterType::LowShelf:
            coeffs = FilterCoeffs::makeLowShelf  (sampleRate, frequency, qValue, linearGain); break;
        case EQFilterType::HighShelf:
            coeffs = FilterCoeffs::makeHighShelf (sampleRate, frequency, qValue, linearGain); break;
        case EQFilterType::BandShelf:
            coeffs = FilterCoeffs::makePeakFilter(sampleRate, frequency, qValue, linearGain); break;
    }

    for (auto& f : filters)
        f.coefficients = coeffs;
}

void EQBlock::processBlock (juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output)
{
    output.makeCopyOf (input);
    for (int ch = 0; ch < output.getNumChannels(); ++ch)
    {
        auto& f    = filters[ch < 2 ? ch : 1];
        float* data = output.getWritePointer (ch);
        for (int s = 0; s < output.getNumSamples(); ++s)
            data[s] = f.processSample (data[s]);
    }
}
