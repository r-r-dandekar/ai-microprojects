#pragma once

#include "AudioBlock.h"
#include "Connection.h"
#include <vector>
#include <memory>
#include <juce_core/juce_core.h>

/**
 * Manages a collection of AudioBlocks and their Connections.
 * Responsible for graph topology and validation.
 */
class AudioGraph
{
public:
    AudioGraph();
    ~AudioGraph();

    // Block management
    void addBlock(std::unique_ptr<AudioBlock> block);
    void removeBlock(juce::Uuid uuid);
    AudioBlock* getBlock(juce::Uuid uuid) const;

    // Connection management
    bool addConnection(juce::Uuid sourceId, juce::Uuid destinationId);
    void removeConnection(juce::Uuid sourceId, juce::Uuid destinationId);

    // Graph logic
    bool hasCycle() const;
    std::vector<AudioBlock*> getTopologicalSort() const;

    // Lifecycle
    void prepareToPlay(double sampleRate, int samplesPerBlock);
    void releaseResources();
    void process(juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output);

private:
    std::vector<std::unique_ptr<AudioBlock>> blocks;
    std::vector<Connection> connections;

    double currentSampleRate = 0.0;
    int currentSamplesPerBlock = 0;

    // Helper for topological sort (DFS)
    bool dfsHasCycle(juce::Uuid current, std::vector<juce::Uuid>& visited, std::vector<juce::Uuid>& stack) const;
    void dfsSort(AudioBlock* current, std::vector<juce::Uuid>& visited, std::vector<AudioBlock*>& sorted) const;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(AudioGraph)
};
