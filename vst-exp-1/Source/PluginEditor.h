#pragma once
#include <juce_gui_basics/juce_gui_basics.h>
#include "PluginProcessor.h"
#include "DSP/DistortionBlock.h"

class BlockComponent;

class InspectorSidebar : public juce::Component
{
public:
    InspectorSidebar() {
        addAndMakeVisible(driveSlider);
        driveSlider.setRange(0.0, 10.0);
        driveSlider.setVisible(false);
    }
    void paint(juce::Graphics& g) override { g.fillAll(juce::Colours::grey); }
    void resized() override { driveSlider.setBounds(10, 50, 180, 30); }
    void setBlock(BlockComponent* block) { driveSlider.setVisible(block != nullptr); }
private:
    juce::Slider driveSlider;
};

class BlockComponent : public juce::Component
{
public:
    BlockComponent(juce::String name, std::function<void(BlockComponent*)> onSelect) : blockName(name), onSelected(onSelect) { setSize(80, 40); }
    void paint(juce::Graphics& g) override {
        g.fillAll(isSelected ? juce::Colours::red : juce::Colours::blue);
        g.setColour(juce::Colours::white);
        g.drawText(blockName, getLocalBounds(), juce::Justification::centred);
    }
    void mouseDown(const juce::MouseEvent& e) override {
        isSelected = true;
        onSelected(this);
        repaint();
        dragStartPosition = getPosition();
        toFront(true);
    }
    void deselect() { isSelected = false; repaint(); }
    void mouseDrag(const juce::MouseEvent& e) override {
        auto delta = e.getOffsetFromDragStart();
        setTopLeftPosition(dragStartPosition + delta);
        if (auto* canvas = getParentComponent()) canvas->repaint();
    }
private:
    juce::String blockName;
    juce::Point<int> dragStartPosition;
    bool isSelected = false;
    std::function<void(BlockComponent*)> onSelected;
};

class MainCanvasComponent : public juce::Component, public juce::DragAndDropTarget
{
public:
    MainCanvasComponent(RDProcessorMk01AudioProcessor& p, std::function<void(BlockComponent*)> onBlockSelect) 
        : processor(p), onSelect(onBlockSelect) { setOpaque(true); }
    void paint(juce::Graphics& g) override {
        g.fillAll(juce::Colours::darkgrey);
        g.setColour(juce::Colours::white);
        for(size_t i = 1; i < blocks.size(); ++i) {
            auto b1 = blocks[i-1]->getBounds();
            auto b2 = blocks[i]->getBounds();
            auto p1 = juce::Point<float>(b1.getRight(), b1.getCentreY());
            auto p2 = juce::Point<float>(b2.getX(), b2.getCentreY());
            juce::Path path;
            path.startNewSubPath(p1);
            path.lineTo(p2);
            g.strokePath(path, juce::PathStrokeType(3.0f));
            juce::Path head;
            head.addTriangle(p2.x, p2.y, p2.x - 10.0f, p2.y - 5.0f, p2.x - 10.0f, p2.y + 5.0f);
            g.fillPath(head);
        }
    }
    bool isInterestedInDragSource(const SourceDetails&) override { return true; }
    void itemDropped(const SourceDetails& details) override {
        if (details.description == "Distortion") {
            processor.getAudioGraph().addBlock(std::make_unique<DistortionBlock>());
            auto newBlock = std::make_unique<BlockComponent>("Distortion", [this](BlockComponent* b) {
                for(auto& blk : blocks) if(blk.get() != b) blk->deselect();
                onSelect(b);
            });
            newBlock->setTopLeftPosition(details.localPosition.toInt());
            addAndMakeVisible(newBlock.get());
            blocks.push_back(std::move(newBlock));
            resized();
        }
    }
private:
    RDProcessorMk01AudioProcessor& processor;
    std::vector<std::unique_ptr<BlockComponent>> blocks;
    std::function<void(BlockComponent*)> onSelect;
};

class DraggableButton : public juce::TextButton
{
public:
    DraggableButton(const juce::String& name) : juce::TextButton(name) {}
    void mouseDown(const juce::MouseEvent& e) override {
        auto* container = juce::DragAndDropContainer::findParentDragContainerFor(this);
        container->startDragging(getButtonText(), this, juce::Image(juce::Image::PixelFormat::ARGB, 80, 30, true));
    }
};

class BlockPalette : public juce::Component
{
public:
    BlockPalette() : addButton("Distortion") { addAndMakeVisible(addButton); }
    void paint(juce::Graphics& g) override { g.fillAll(juce::Colours::lightgrey); }
    void resized() override { addButton.setBounds(10, 10, 80, 30); }
private:
    DraggableButton addButton;
};

class RDProcessorMk01AudioProcessorEditor : public juce::AudioProcessorEditor, public juce::DragAndDropContainer
{
public:
    RDProcessorMk01AudioProcessorEditor (RDProcessorMk01AudioProcessor& p)
        : AudioProcessorEditor (&p), audioProcessor (p), 
          mainCanvas(p, [this](BlockComponent* b) { sidebar.setBlock(b); })
    {
        addAndMakeVisible(mainCanvas);
        addAndMakeVisible(sidebar);
        addAndMakeVisible(palette);
        setSize(1000, 700);
    }
    void resized() override {
        auto area = getLocalBounds();
        palette.setBounds(area.removeFromTop(50));
        sidebar.setBounds(area.removeFromLeft(200));
        mainCanvas.setBounds(area);
    }
    void paint (juce::Graphics& g) override { g.fillAll(getLookAndFeel().findColour(juce::ResizableWindow::backgroundColourId)); }
private:
    RDProcessorMk01AudioProcessor& audioProcessor;
    MainCanvasComponent mainCanvas;
    InspectorSidebar sidebar;
    BlockPalette palette;
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (RDProcessorMk01AudioProcessorEditor)
};
