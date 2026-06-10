#pragma once
#include "Model/AudioBlock.h"
#include <juce_dsp/juce_dsp.h>
#include <array>

enum class EQFilterType { LowShelf, HighShelf, BandShelf };

class EQBlock : public AudioBlock
{
public:
    EQBlock();

    void prepareToPlay (double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;
    void processBlock (juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output) override;

    juce::String getName() const override { return "EQ"; }
    BlockType    getType() const override { return BlockType::EQ; }

    void setFrequency  (float hz);
    void setGainDb     (float db);
    void setQ          (float q);
    void setFilterType (EQFilterType t);

    float        getFrequency()  const { return frequency; }
    float        getGainDb()     const { return gainDb; }
    float        getQ()          const { return qValue; }
    EQFilterType getFilterType() const { return filterType; }

private:
    float        frequency  = 1000.0f;
    float        gainDb     = 0.0f;
    float        qValue     = 0.707f;
    EQFilterType filterType = EQFilterType::LowShelf;
    double       sampleRate = 44100.0;

    using FilterCoeffs = juce::dsp::IIR::Coefficients<float>;
    std::array<juce::dsp::IIR::Filter<float>, 2> filters;

    void updateCoefficients();
};
