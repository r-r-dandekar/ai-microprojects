#pragma once
#include <juce_audio_processors/juce_audio_processors.h>
#include "Model/AudioGraph.h"

class RDProcessorMk01AudioProcessor : public juce::AudioProcessor
{
public:
    RDProcessorMk01AudioProcessor();
    ~RDProcessorMk01AudioProcessor() override;

    void prepareToPlay  (double sampleRate, int samplesPerBlock) override;
    void releaseResources()                                       override;
    bool isBusesLayoutSupported (const BusesLayout&) const        override;
    void processBlock (juce::AudioBuffer<float>&, juce::MidiBuffer&) override;

    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override;

    const juce::String getName()      const override;
    bool acceptsMidi()                const override;
    bool producesMidi()               const override;
    bool isMidiEffect()               const override;
    double getTailLengthSeconds()     const override;

    int  getNumPrograms()                                      override;
    int  getCurrentProgram()                                   override;
    void setCurrentProgram (int index)                         override;
    const juce::String getProgramName (int index)              override;
    void changeProgramName (int index, const juce::String& newName) override;

    void getStateInformation (juce::MemoryBlock& destData)          override;
    void setStateInformation (const void* data, int sizeInBytes)    override;

    AudioGraph& getAudioGraph() { return audioGraph; }

private:
    AudioGraph audioGraph;
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (RDProcessorMk01AudioProcessor)
};
