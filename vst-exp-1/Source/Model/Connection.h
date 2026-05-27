#pragma once

#include <juce_core/juce_core.h>

/**
 * Represents a connection between two AudioBlocks.
 */
struct Connection
{
    juce::Uuid sourceId;
    juce::Uuid destinationId;

    bool operator==(const Connection& other) const
    {
        return sourceId == other.sourceId && destinationId == other.destinationId;
    }
};
