#pragma once
#include "Model/AudioBlock.h"

class CompressorBlock;

class DecompressorBlock : public AudioBlock
{
public:
    DecompressorBlock() = default;

    void prepareToPlay (double, int) override {}
    void releaseResources()          override {}
    void processBlock (juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output) override;

    juce::String getName() const override { return "Decompressor"; }
    BlockType    getType() const override { return BlockType::Decompressor; }

    void             setLinkedCompressor   (CompressorBlock* comp) { linkedCompressor   = comp; }
    CompressorBlock* getLinkedCompressor()  const                  { return linkedCompressor; }
    void             setLinkedCompressorId (juce::Uuid id)        { linkedCompressorId = id; }
    juce::Uuid       getLinkedCompressorId() const                 { return linkedCompressorId; }

    bool isLinked()  const { return linkedCompressor != nullptr; }
    // True when a compressor ID was set but the compressor can't be found (warning state)
    bool isWarning() const { return !linkedCompressorId.isNull() && linkedCompressor == nullptr; }

    void setThresholdDb  (float db) { thresholdDb  = db; }
    void setRatio        (float r)  { ratio        = juce::jmax (1.0f, r); }
    void setAttackMs     (float ms) { attackMs     = ms; }
    void setReleaseMs    (float ms) { releaseMs    = ms; }
    void setMakeupGainDb (float db) { makeupGainDb = db; }

    float getThresholdDb()  const { return thresholdDb; }
    float getRatio()        const { return ratio; }
    float getAttackMs()     const { return attackMs; }
    float getReleaseMs()    const { return releaseMs; }
    float getMakeupGainDb() const { return makeupGainDb; }

private:
    CompressorBlock* linkedCompressor   = nullptr;
    juce::Uuid       linkedCompressorId = juce::Uuid::null();

    float thresholdDb  = -20.0f;
    float ratio        = 4.0f;
    float attackMs     = 10.0f;
    float releaseMs    = 100.0f;
    float makeupGainDb = 0.0f;
};
