#include "PluginProcessor.h"
#include "PluginEditor.h"
#include "DSP/DistortionBlock.h"
#include "DSP/EQBlock.h"
#include "DSP/CompressorBlock.h"

RDProcessorMk01AudioProcessor::RDProcessorMk01AudioProcessor()
#ifndef JucePlugin_PreferredChannelConfigurations
     : AudioProcessor (BusesProperties()
                     #if ! JucePlugin_IsMidiEffect
                      #if ! JucePlugin_IsSynth
                       .withInput  ("Input",  juce::AudioChannelSet::stereo(), true)
                      #endif
                       .withOutput ("Output", juce::AudioChannelSet::stereo(), true)
                     #endif
                       )
#endif
{
    auto dist = std::make_unique<DistortionBlock>();
    auto eq = std::make_unique<EQBlock>();
    auto comp = std::make_unique<CompressorBlock>();

    auto distId = dist->getUuid();
    auto eqId = eq->getUuid();
    auto compId = comp->getUuid();

    audioGraph.addBlock(std::move(dist));
    audioGraph.addBlock(std::move(eq));
    audioGraph.addBlock(std::move(comp));

    audioGraph.addConnection(distId, eqId);
    audioGraph.addConnection(eqId, compId);
}

RDProcessorMk01AudioProcessor::~RDProcessorMk01AudioProcessor() {}

const juce::String RDProcessorMk01AudioProcessor::getName() const { return JucePlugin_Name; }
bool RDProcessorMk01AudioProcessor::acceptsMidi() const { return false; }
bool RDProcessorMk01AudioProcessor::producesMidi() const { return false; }
bool RDProcessorMk01AudioProcessor::isMidiEffect() const { return false; }
double RDProcessorMk01AudioProcessor::getTailLengthSeconds() const { return 0.0; }
int RDProcessorMk01AudioProcessor::getNumPrograms() { return 1; }
int RDProcessorMk01AudioProcessor::getCurrentProgram() { return 0; }
void RDProcessorMk01AudioProcessor::setCurrentProgram (int index) {}
const juce::String RDProcessorMk01AudioProcessor::getProgramName (int index) { return {}; }
void RDProcessorMk01AudioProcessor::changeProgramName (int index, const juce::String& newName) {}

void RDProcessorMk01AudioProcessor::prepareToPlay (double sampleRate, int samplesPerBlock)
{
    audioGraph.prepareToPlay(sampleRate, samplesPerBlock);
}

void RDProcessorMk01AudioProcessor::releaseResources()
{
    audioGraph.releaseResources();
}

bool RDProcessorMk01AudioProcessor::isBusesLayoutSupported (const BusesLayout& layouts) const
{
    return (layouts.getMainOutputChannelSet() == juce::AudioChannelSet::stereo());
}

void RDProcessorMk01AudioProcessor::processBlock (juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midiMessages)
{
    juce::ScopedNoDenormals noDenormals;
    audioGraph.process(buffer, buffer);
}

bool RDProcessorMk01AudioProcessor::hasEditor() const { return true; }
juce::AudioProcessorEditor* RDProcessorMk01AudioProcessor::createEditor() { return new RDProcessorMk01AudioProcessorEditor (*this); }
void RDProcessorMk01AudioProcessor::getStateInformation (juce::MemoryBlock& destData) {}
void RDProcessorMk01AudioProcessor::setStateInformation (const void* data, int sizeInBytes) {}

juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter() { return new RDProcessorMk01AudioProcessor(); }
