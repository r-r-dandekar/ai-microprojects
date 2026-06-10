#include "Model/AudioGraph.h"
#include "DSP/SourceBlock.h"
#include "DSP/OutputBlock.h"
#include "DSP/MergeBlock.h"
#include <algorithm>

AudioGraph::AudioGraph()
{
    auto src = std::make_unique<SourceBlock>();
    auto out = std::make_unique<OutputBlock>();
    sourceId = src->getUuid();
    outputId = out->getUuid();
    blocks.push_back (std::move (src));
    blocks.push_back (std::move (out));
    addConnection (sourceId, outputId);
}

AudioGraph::~AudioGraph() {}

// ---------------------------------------------------------------------------
void AudioGraph::addBlock (std::unique_ptr<AudioBlock> block)
{
    if (block == nullptr) return;
    if (currentSampleRate > 0)
        block->prepareToPlay (currentSampleRate, currentSamplesPerBlock);

    auto& buf = nodeOutputBuffers[block->getUuid()];
    buf.setSize (2, std::max (currentSamplesPerBlock, 512));

    blocks.push_back (std::move (block));
}

bool AudioGraph::removeBlock (juce::Uuid uuid)
{
    if (uuid == sourceId || uuid == outputId) return false;

    connections.erase (std::remove_if (connections.begin(), connections.end(),
        [uuid] (const Connection& c)
        { return c.sourceId == uuid || c.destinationId == uuid; }),
        connections.end());

    nodeOutputBuffers.erase (uuid);

    blocks.erase (std::remove_if (blocks.begin(), blocks.end(),
        [uuid] (const std::unique_ptr<AudioBlock>& b) { return b->getUuid() == uuid; }),
        blocks.end());

    return true;
}

AudioBlock* AudioGraph::getBlock (juce::Uuid uuid) const
{
    for (const auto& b : blocks)
        if (b->getUuid() == uuid) return b.get();
    return nullptr;
}

// ---------------------------------------------------------------------------
bool AudioGraph::addConnection (juce::Uuid srcId, juce::Uuid destId)
{
    if (srcId == destId) return false;
    if (!getBlock (srcId) || !getBlock (destId)) return false;

    Connection newConn { srcId, destId };
    for (const auto& c : connections)
        if (c == newConn) return true;

    connections.push_back (newConn);
    if (hasCycle())
    {
        connections.pop_back();
        return false;
    }
    return true;
}

void AudioGraph::removeConnection (juce::Uuid srcId, juce::Uuid destId)
{
    Connection toRemove { srcId, destId };
    connections.erase (std::remove (connections.begin(), connections.end(), toRemove),
                       connections.end());
}

// ---------------------------------------------------------------------------
bool AudioGraph::hasCycle() const
{
    std::vector<juce::Uuid> visited, stack;
    for (const auto& b : blocks)
        if (dfsHasCycle (b->getUuid(), visited, stack)) return true;
    return false;
}

bool AudioGraph::dfsHasCycle (juce::Uuid current,
                               std::vector<juce::Uuid>& visited,
                               std::vector<juce::Uuid>& stack) const
{
    if (std::find (stack.begin(),   stack.end(),   current) != stack.end())   return true;
    if (std::find (visited.begin(), visited.end(), current) != visited.end()) return false;

    visited.push_back (current);
    stack.push_back   (current);

    for (const auto& c : connections)
        if (c.sourceId == current)
            if (dfsHasCycle (c.destinationId, visited, stack)) return true;

    stack.pop_back();
    return false;
}

std::vector<AudioBlock*> AudioGraph::getTopologicalSort() const
{
    std::vector<AudioBlock*> sorted;
    std::vector<juce::Uuid>  visited;

    // Start traversal from the source so the source appears first
    if (auto* src = getBlock (sourceId))
        dfsSort (src, visited, sorted);

    // Handle any blocks not reachable from source (disconnected nodes)
    for (const auto& b : blocks)
        if (std::find (visited.begin(), visited.end(), b->getUuid()) == visited.end())
            dfsSort (b.get(), visited, sorted);

    std::reverse (sorted.begin(), sorted.end());
    return sorted;
}

void AudioGraph::dfsSort (AudioBlock* current,
                           std::vector<juce::Uuid>& visited,
                           std::vector<AudioBlock*>& sorted) const
{
    visited.push_back (current->getUuid());
    for (const auto& c : connections)
    {
        if (c.sourceId == current->getUuid())
        {
            if (std::find (visited.begin(), visited.end(), c.destinationId) == visited.end())
                if (auto* next = getBlock (c.destinationId))
                    dfsSort (next, visited, sorted);
        }
    }
    sorted.push_back (current);
}

std::vector<AudioBlock*> AudioGraph::getUpstreamBlocks (juce::Uuid nodeId) const
{
    std::vector<AudioBlock*> result;
    for (const auto& c : connections)
        if (c.destinationId == nodeId)
            if (auto* b = getBlock (c.sourceId))
                result.push_back (b);
    return result;
}

std::vector<AudioBlock*> AudioGraph::getDownstreamBlocks (juce::Uuid nodeId) const
{
    std::vector<AudioBlock*> result;
    for (const auto& c : connections)
        if (c.sourceId == nodeId)
            if (auto* b = getBlock (c.destinationId))
                result.push_back (b);
    return result;
}

// ---------------------------------------------------------------------------
void AudioGraph::prepareToPlay (double sampleRate, int samplesPerBlock)
{
    currentSampleRate      = sampleRate;
    currentSamplesPerBlock = samplesPerBlock;

    for (auto& b : blocks)
    {
        b->prepareToPlay (sampleRate, samplesPerBlock);
        auto& buf = nodeOutputBuffers[b->getUuid()];
        buf.setSize (2, samplesPerBlock, false, false, true);
    }
}

void AudioGraph::releaseResources()
{
    for (auto& b : blocks)
        b->releaseResources();
}

void AudioGraph::process (juce::AudioBuffer<float>& buffer)
{
    int numChannels = buffer.getNumChannels();
    int numSamples  = buffer.getNumSamples();

    // Ensure all node buffers match current block size
    for (const auto& b : blocks)
    {
        auto& buf = nodeOutputBuffers[b->getUuid()];
        buf.setSize (numChannels, numSamples, false, false, true);
    }

    for (auto* node : getTopologicalSort())
    {
        auto& outBuf  = nodeOutputBuffers[node->getUuid()];
        auto  upstream = getUpstreamBlocks (node->getUuid());

        if (upstream.empty())
        {
            // Source node: reads the host audio input
            node->processBlock (buffer, outBuf);
        }
        else if (auto* merge = dynamic_cast<MergeBlock*> (node))
        {
            // Merge node: combine all upstream buffers
            std::vector<juce::AudioBuffer<float>*> inputBuffers;
            for (auto* up : upstream)
                inputBuffers.push_back (&nodeOutputBuffers[up->getUuid()]);
            merge->processInputs (inputBuffers, outBuf);
        }
        else
        {
            // Regular node: exactly one upstream input
            node->processBlock (nodeOutputBuffers[upstream[0]->getUuid()], outBuf);
        }
    }

    // Write the Output node's buffer back to the host
    auto& outBuf = nodeOutputBuffers[outputId];
    for (int ch = 0; ch < numChannels; ++ch)
    {
        int srcCh = std::min (ch, outBuf.getNumChannels() - 1);
        buffer.copyFrom (ch, 0, outBuf, srcCh, 0, numSamples);
    }
}

// ---------------------------------------------------------------------------
void AudioGraph::insertBlockBeforeOutput (std::unique_ptr<AudioBlock> block)
{
    // Find whichever node currently connects into the Output
    juce::Uuid prevId = sourceId;
    for (const auto& c : connections)
        if (c.destinationId == outputId) { prevId = c.sourceId; break; }

    auto newId = block->getUuid();
    addBlock (std::move (block));
    removeConnection (prevId, outputId);
    addConnection (prevId,  newId);
    addConnection (newId,   outputId);
}
