#pragma once
#include "Model/AudioBlock.h"
#include <array>

enum class DistortionCurve { SoftClip, HardClip, Asymmetric };

class DistortionBlock : public AudioBlock
{
public:
    DistortionBlock() = default;

    void prepareToPlay (double, int) override {}
    void releaseResources()          override {}
    void processBlock (juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output) override;

    juce::String getName() const override { return "Distortion"; }
    BlockType    getType() const override { return BlockType::Distortion; }

    void setDrive       (float v) { drive       = juce::jlimit (0.0f, 10.0f, v); }
    void setTone        (float v) { tone        = juce::jlimit (0.0f, 10.0f, v); }
    void setOutputLevel (float v) { outputLevel = juce::jlimit (0.0f, 10.0f, v); }
    void setCurve       (DistortionCurve c) { curve = c; }

    float          getDrive()       const { return drive; }
    float          getTone()        const { return tone; }
    float          getOutputLevel() const { return outputLevel; }
    DistortionCurve getCurve()      const { return curve; }

private:
    float           drive       = 5.0f;
    float           tone        = 5.0f;   // 0 = dark (strong LP), 10 = bright (no LP)
    float           outputLevel = 7.0f;
    DistortionCurve curve       = DistortionCurve::SoftClip;

    // One-pole LP state per channel for tone control
    std::array<float, 2> toneState { 0.0f, 0.0f };

    static float applyTransfer (float sample, float gainAmount, DistortionCurve c) noexcept;
};
