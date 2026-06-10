#pragma once
#include "AudioBlock.h"
#include "Connection.h"
#include <vector>
#include <memory>
#include <map>
#include <juce_core/juce_core.h>
#include <juce_audio_basics/juce_audio_basics.h>

class MergeBlock;

class AudioGraph
{
public:
    AudioGraph();
    ~AudioGraph();

    // Block management
    void addBlock    (std::unique_ptr<AudioBlock> block);
    bool removeBlock (juce::Uuid uuid);           // returns false for Source/Output
    AudioBlock* getBlock (juce::Uuid uuid) const;
    const std::vector<std::unique_ptr<AudioBlock>>& getBlocks() const { return blocks; }

    // Connection management
    bool addConnection    (juce::Uuid srcId, juce::Uuid destId);
    void removeConnection (juce::Uuid srcId, juce::Uuid destId);
    const std::vector<Connection>& getConnections() const { return connections; }

    // Graph queries
    bool                    hasCycle()            const;
    std::vector<AudioBlock*> getTopologicalSort() const;
    std::vector<AudioBlock*> getUpstreamBlocks   (juce::Uuid nodeId) const;
    std::vector<AudioBlock*> getDownstreamBlocks (juce::Uuid nodeId) const;

    // Lifecycle
    void prepareToPlay  (double sampleRate, int samplesPerBlock);
    void releaseResources();
    void process        (juce::AudioBuffer<float>& buffer);

    juce::Uuid getSourceId() const { return sourceId; }
    juce::Uuid getOutputId() const { return outputId; }

    // Convenience: insert a new block just before the Output node
    void insertBlockBeforeOutput (std::unique_ptr<AudioBlock> block);

private:
    std::vector<std::unique_ptr<AudioBlock>> blocks;
    std::vector<Connection>                  connections;

    juce::Uuid sourceId;
    juce::Uuid outputId;

    // Per-node working buffers (audio thread only)
    std::map<juce::Uuid, juce::AudioBuffer<float>> nodeOutputBuffers;

    double currentSampleRate     = 0.0;
    int    currentSamplesPerBlock = 0;

    bool dfsHasCycle (juce::Uuid current,
                      std::vector<juce::Uuid>& visited,
                      std::vector<juce::Uuid>& stack) const;
    void dfsSort     (AudioBlock* current,
                      std::vector<juce::Uuid>& visited,
                      std::vector<AudioBlock*>& sorted) const;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (AudioGraph)
};
