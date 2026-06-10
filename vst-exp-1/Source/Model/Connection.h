#pragma once
#include <juce_core/juce_core.h>

struct Connection
{
    juce::Uuid sourceId;
    juce::Uuid destinationId;

    bool operator== (const Connection& o) const noexcept
    {
        return sourceId == o.sourceId && destinationId == o.destinationId;
    }
};
