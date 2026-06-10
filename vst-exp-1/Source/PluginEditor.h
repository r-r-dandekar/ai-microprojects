#pragma once
#include <juce_gui_basics/juce_gui_basics.h>
#include <juce_gui_extra/juce_gui_extra.h>
#include "PluginProcessor.h"

// ============================================================
// InspectorSidebar
// Displays parameter controls for the currently selected block.
// ============================================================
class InspectorSidebar : public juce::Component
{
public:
    explicit InspectorSidebar (RDProcessorMk01AudioProcessor& p);
    void paint   (juce::Graphics& g) override;
    void resized ()                  override;

    void showBlock (juce::Uuid blockId);

private:
    RDProcessorMk01AudioProcessor& processor;
    juce::Uuid currentBlockId;
    std::unique_ptr<juce::FileChooser> fileChooserOwner;

    struct ParamRow
    {
        std::unique_ptr<juce::Label>     label;
        std::unique_ptr<juce::Component> control;  // Slider or ComboBox or TextButton
    };
    std::vector<ParamRow> rows;

    void clearRows();
    void addSliderRow (const juce::String& name, double min, double max, double value,
                       std::function<void (double)> onChange, double interval = 0.0);
    void addComboRow  (const juce::String& name, const juce::StringArray& items, int selected,
                       std::function<void (int)> onChange);
    void addButtonRow (const juce::String& label, const juce::String& buttonText,
                       std::function<void()> onClick);
    void addReadonlyRow (const juce::String& name, const juce::String& value);
};

// ============================================================
// SignalPathCanvas
// Custom-drawn graph view with auto-layout.
// ============================================================
class SignalPathCanvas : public juce::Component
{
public:
    SignalPathCanvas (RDProcessorMk01AudioProcessor& p,
                      std::function<void (juce::Uuid)> onSelect,
                      std::function<void (juce::Uuid)> onRemove);

    void paint   (juce::Graphics& g) override;
    void resized ()                  override;
    void mouseDown (const juce::MouseEvent& e) override;

    void setSelectedBlock (juce::Uuid id) { selectedId = id; repaint(); }
    void refresh          ()              { computeLayout(); repaint(); }

private:
    RDProcessorMk01AudioProcessor&     processor;
    std::function<void (juce::Uuid)>   onBlockSelected;
    std::function<void (juce::Uuid)>   onBlockRemoved;

    juce::TextButton addBlockButton { "+ Add Block" };

    struct NodeLayout { juce::Uuid id; juce::Rectangle<int> bounds; };
    std::vector<NodeLayout> layouts;
    juce::Uuid selectedId = juce::Uuid::null();

    void computeLayout();
    juce::Rectangle<int> findNodeBounds (juce::Uuid id) const;
    juce::Uuid           hitTest        (juce::Point<int> pos) const;
    void showAddBlockMenu();
    void showNodeContextMenu (juce::Uuid id);

    static constexpr int nodeW = 90;
    static constexpr int nodeH = 44;
};

// ============================================================
// Main editor
// ============================================================
class RDProcessorMk01AudioProcessorEditor : public juce::AudioProcessorEditor,
                                             public juce::Timer
{
public:
    explicit RDProcessorMk01AudioProcessorEditor (RDProcessorMk01AudioProcessor& p);
    ~RDProcessorMk01AudioProcessorEditor() override;

    void paint   (juce::Graphics& g) override;
    void resized ()                  override;
    void timerCallback()             override;

private:
    RDProcessorMk01AudioProcessor& audioProcessor;

    juce::TextButton saveButton { "Save Preset" };
    juce::TextButton loadButton { "Load Preset" };
    juce::Label      titleLabel;

    InspectorSidebar  sidebar;
    SignalPathCanvas  canvas;

    std::unique_ptr<juce::FileChooser> fileChooser;

    void onBlockSelected (juce::Uuid id);
    void onBlockRemoved  (juce::Uuid id);

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (RDProcessorMk01AudioProcessorEditor)
};
