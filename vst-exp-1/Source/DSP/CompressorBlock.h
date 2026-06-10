#pragma once
#include "Model/AudioBlock.h"
#include <atomic>
#include <cmath>

enum class DetectionMode { Peak, RMS };

class CompressorBlock : public AudioBlock
{
public:
    CompressorBlock();

    void prepareToPlay (double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;
    void processBlock (juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output) override;

    juce::String getName() const override { return "Compressor"; }
    BlockType    getType() const override { return BlockType::Compressor; }

    void setThresholdDb  (float db)  { thresholdDb  = db; }
    void setRatio        (float r)   { ratio        = juce::jmax (1.0f, r); }
    void setAttackMs     (float ms)  { attackMs     = ms;  updateTimeConstants(); }
    void setReleaseMs    (float ms)  { releaseMs    = ms;  updateTimeConstants(); }
    void setMakeupGainDb (float db)  { makeupGainDb = db; }
    void setDetectionMode(DetectionMode m) { detectionMode = m; }

    float         getThresholdDb()   const { return thresholdDb; }
    float         getRatio()         const { return ratio; }
    float         getAttackMs()      const { return attackMs; }
    float         getReleaseMs()     const { return releaseMs; }
    float         getMakeupGainDb()  const { return makeupGainDb; }
    DetectionMode getDetectionMode() const { return detectionMode; }

    // Read by DecompressorBlock on the audio thread
    float getEnvelopeLevel() const { return envelopeLevel.load (std::memory_order_relaxed); }

private:
    float         thresholdDb  = -20.0f;
    float         ratio        = 4.0f;
    float         attackMs     = 10.0f;
    float         releaseMs    = 100.0f;
    float         makeupGainDb = 0.0f;
    DetectionMode detectionMode = DetectionMode::RMS;

    double sampleRate    = 44100.0;
    float  attackCoeff   = 0.0f;
    float  releaseCoeff  = 0.0f;
    float  envelopeState = 0.0f;

    std::atomic<float> envelopeLevel { 0.0f };

    void  updateTimeConstants();
    float computeBlockLevel (const juce::AudioBuffer<float>& buffer) const;
};
