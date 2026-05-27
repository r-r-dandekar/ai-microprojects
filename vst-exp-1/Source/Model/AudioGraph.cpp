#include "AudioGraph.h"
#include <algorithm>

AudioGraph::AudioGraph() {}
AudioGraph::~AudioGraph() {}

void AudioGraph::addBlock(std::unique_ptr<AudioBlock> block)
{
    if (block != nullptr)
    {
        if (currentSampleRate > 0)
            block->prepareToPlay(currentSampleRate, currentSamplesPerBlock);
            
        blocks.push_back(std::move(block));
    }
}

void AudioGraph::removeBlock(juce::Uuid uuid)
{
    // Remove connections associated with this block
    connections.erase(std::remove_if(connections.begin(), connections.end(),
        [uuid](const Connection& c) {
            return c.sourceId == uuid || c.destinationId == uuid;
        }), connections.end());

    // Remove the block
    blocks.erase(std::remove_if(blocks.begin(), blocks.end(),
        [uuid](const std::unique_ptr<AudioBlock>& b) {
            return b->getUuid() == uuid;
        }), blocks.end());
}

AudioBlock* AudioGraph::getBlock(juce::Uuid uuid) const
{
    for (const auto& b : blocks)
        if (b->getUuid() == uuid)
            return b.get();
    return nullptr;
}

bool AudioGraph::addConnection(juce::Uuid sourceId, juce::Uuid destinationId)
{
    if (sourceId == destinationId) return false;
    
    // Check if blocks exist
    if (getBlock(sourceId) == nullptr || getBlock(destinationId) == nullptr)
        return false;

    // Check if connection already exists
    Connection newConn { sourceId, destinationId };
    for (const auto& c : connections)
        if (c == newConn) return true;

    connections.push_back(newConn);

    // Check for cycles
    if (hasCycle())
    {
        connections.pop_back();
        return false;
    }

    return true;
}

void AudioGraph::removeConnection(juce::Uuid sourceId, juce::Uuid destinationId)
{
    Connection toRemove { sourceId, destinationId };
    connections.erase(std::remove(connections.begin(), connections.end(), toRemove), connections.end());
}

bool AudioGraph::hasCycle() const
{
    std::vector<juce::Uuid> visited;
    std::vector<juce::Uuid> stack;

    for (const auto& b : blocks)
    {
        if (dfsHasCycle(b->getUuid(), visited, stack))
            return true;
    }

    return false;
}

bool AudioGraph::dfsHasCycle(juce::Uuid current, std::vector<juce::Uuid>& visited, std::vector<juce::Uuid>& stack) const
{
    if (std::find(stack.begin(), stack.end(), current) != stack.end())
        return true;
    if (std::find(visited.begin(), visited.end(), current) != visited.end())
        return false;

    visited.push_back(current);
    stack.push_back(current);

    for (const auto& c : connections)
    {
        if (c.sourceId == current)
        {
            if (dfsHasCycle(c.destinationId, visited, stack))
                return true;
        }
    }

    stack.pop_back();
    return false;
}

std::vector<AudioBlock*> AudioGraph::getTopologicalSort() const
{
    std::vector<AudioBlock*> sorted;
    std::vector<juce::Uuid> visited;

    for (const auto& b : blocks)
    {
        if (std::find(visited.begin(), visited.end(), b->getUuid()) == visited.end())
            dfsSort(b.get(), visited, sorted);
    }

    std::reverse(sorted.begin(), sorted.end());
    return sorted;
}

void AudioGraph::dfsSort(AudioBlock* current, std::vector<juce::Uuid>& visited, std::vector<AudioBlock*>& sorted) const
{
    visited.push_back(current->getUuid());

    for (const auto& c : connections)
    {
        if (c.sourceId == current->getUuid())
        {
            if (std::find(visited.begin(), visited.end(), c.destinationId) == visited.end())
            {
                if (auto next = getBlock(c.destinationId))
                    dfsSort(next, visited, sorted);
            }
        }
    }

    sorted.push_back(current);
}

void AudioGraph::prepareToPlay(double sampleRate, int samplesPerBlock)
{
    currentSampleRate = sampleRate;
    currentSamplesPerBlock = samplesPerBlock;

    for (auto& b : blocks)
        b->prepareToPlay(sampleRate, samplesPerBlock);
}

void AudioGraph::releaseResources()
{
    for (auto& b : blocks)
        b->releaseResources();
}

void AudioGraph::process(juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output)
{
    auto sorted = getTopologicalSort();
    if (sorted.empty()) { output.makeCopyOf(input); return; }

    juce::AudioBuffer<float> tempBuffer(input.getNumChannels(), input.getNumSamples());
    juce::AudioBuffer<float>* currentInput = &input;
    juce::AudioBuffer<float>* currentOutput = &tempBuffer;

    for (size_t i = 0; i < sorted.size(); ++i)
    {
        if (i == sorted.size() - 1)
            currentOutput = &output;

        sorted[i]->processBlock(*currentInput, *currentOutput);
        
        currentInput = currentOutput;
        currentOutput = (i == sorted.size() - 2) ? &output : &tempBuffer;
    }
}
