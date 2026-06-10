#include "PluginEditor.h"
#include "DSP/DistortionBlock.h"
#include "DSP/EQBlock.h"
#include "DSP/CompressorBlock.h"
#include "DSP/DecompressorBlock.h"
#include "DSP/IRBlock.h"
#include "DSP/SplitBlock.h"
#include "DSP/MergeBlock.h"
#include <map>

// ============================================================
// Colour palette
// ============================================================
namespace Colours
{
    static const juce::Colour bg       { 0xff1a1a2e };
    static const juce::Colour nodeBg   { 0xff2a2a4a };
    static const juce::Colour nodeIO   { 0xff1e3a1e };
    static const juce::Colour nodeSel  { 0xff4a3a6a };
    static const juce::Colour nodeWarn { 0xff5a1e1e };
    static const juce::Colour accent   { 0xff9980fa };
    static const juce::Colour text     { 0xfff0f0f0 };
    static const juce::Colour edge     { 0xff6060a0 };
    static const juce::Colour sidebarBg{ 0xff161626 };
}

// ============================================================
// InspectorSidebar
// ============================================================
InspectorSidebar::InspectorSidebar (RDProcessorMk01AudioProcessor& p) : processor (p) {}

void InspectorSidebar::paint (juce::Graphics& g)
{
    g.fillAll (Colours::sidebarBg);
    g.setColour (Colours::accent);
    g.drawLine (getWidth() - 1.0f, 0.0f, getWidth() - 1.0f, (float)getHeight(), 1.0f);

    if (rows.empty())
    {
        g.setColour (Colours::text.withAlpha (0.4f));
        g.setFont (13.0f);
        g.drawText ("Select a block\nto edit parameters",
                    getLocalBounds(), juce::Justification::centred);
    }
}

void InspectorSidebar::resized()
{
    int y = 12;
    int w = getWidth() - 16;

    for (auto& row : rows)
    {
        row.label->setBounds (8, y, w, 16);
        y += 18;
        row.control->setBounds (8, y, w, 26);
        y += 32;
    }
}

void InspectorSidebar::clearRows()
{
    for (auto& row : rows)
    {
        removeChildComponent (row.label.get());
        removeChildComponent (row.control.get());
    }
    rows.clear();
}

void InspectorSidebar::addSliderRow (const juce::String& name,
                                      double min, double max, double value,
                                      std::function<void (double)> onChange,
                                      double interval)
{
    auto lbl  = std::make_unique<juce::Label> ("", name);
    auto sldr = std::make_unique<juce::Slider> (juce::Slider::LinearHorizontal,
                                                juce::Slider::TextBoxRight);
    lbl->setFont  (juce::Font (11.0f));
    lbl->setColour (juce::Label::textColourId, Colours::text.withAlpha (0.7f));

    sldr->setRange (min, max, interval);
    sldr->setValue (value, juce::dontSendNotification);
    sldr->setTextBoxStyle (juce::Slider::TextBoxRight, false, 48, 20);
    sldr->setColour (juce::Slider::thumbColourId,        Colours::accent);
    sldr->setColour (juce::Slider::trackColourId,        Colours::accent.withAlpha (0.4f));
    sldr->setColour (juce::Slider::backgroundColourId,   Colours::nodeBg);
    sldr->setColour (juce::Slider::textBoxTextColourId,  Colours::text);
    sldr->setColour (juce::Slider::textBoxBackgroundColourId, Colours::nodeBg);
    sldr->setColour (juce::Slider::textBoxOutlineColourId, juce::Colours::transparentBlack);

    sldr->onValueChange = [onChange, s = sldr.get()] { onChange (s->getValue()); };

    addAndMakeVisible (*lbl);
    addAndMakeVisible (*sldr);
    rows.push_back ({ std::move (lbl), std::move (sldr) });
}

void InspectorSidebar::addComboRow (const juce::String& name,
                                     const juce::StringArray& items,
                                     int selected,
                                     std::function<void (int)> onChange)
{
    auto lbl   = std::make_unique<juce::Label> ("", name);
    auto combo = std::make_unique<juce::ComboBox>();

    lbl->setFont  (juce::Font (11.0f));
    lbl->setColour (juce::Label::textColourId, Colours::text.withAlpha (0.7f));

    for (int i = 0; i < items.size(); ++i)
        combo->addItem (items[i], i + 1);
    combo->setSelectedId (selected + 1, juce::dontSendNotification);
    combo->setColour (juce::ComboBox::backgroundColourId, Colours::nodeBg);
    combo->setColour (juce::ComboBox::textColourId,       Colours::text);
    combo->setColour (juce::ComboBox::arrowColourId,      Colours::accent);

    combo->onChange = [onChange, c = combo.get()] { onChange (c->getSelectedId() - 1); };

    addAndMakeVisible (*lbl);
    addAndMakeVisible (*combo);
    rows.push_back ({ std::move (lbl), std::move (combo) });
}

void InspectorSidebar::addButtonRow (const juce::String& name,
                                      const juce::String& buttonText,
                                      std::function<void()> onClick)
{
    auto lbl = std::make_unique<juce::Label> ("", name);
    auto btn = std::make_unique<juce::TextButton> (buttonText);

    lbl->setFont  (juce::Font (11.0f));
    lbl->setColour (juce::Label::textColourId, Colours::text.withAlpha (0.7f));
    btn->setColour (juce::TextButton::buttonColourId,   Colours::nodeBg);
    btn->setColour (juce::TextButton::textColourOffId,  Colours::text);

    btn->onClick = onClick;

    addAndMakeVisible (*lbl);
    addAndMakeVisible (*btn);
    rows.push_back ({ std::move (lbl), std::move (btn) });
}

void InspectorSidebar::addReadonlyRow (const juce::String& name, const juce::String& value)
{
    auto lbl  = std::make_unique<juce::Label> ("", name);
    auto val  = std::make_unique<juce::Label> ("", value);

    lbl->setFont  (juce::Font (11.0f));
    lbl->setColour (juce::Label::textColourId, Colours::text.withAlpha (0.7f));
    val->setFont  (juce::Font (11.0f));
    val->setColour (juce::Label::textColourId, Colours::text);
    val->setColour (juce::Label::backgroundColourId, Colours::nodeBg);

    addAndMakeVisible (*lbl);
    addAndMakeVisible (*val);
    rows.push_back ({ std::move (lbl), std::move (val) });
}

void InspectorSidebar::showBlock (juce::Uuid blockId)
{
    clearRows();
    currentBlockId = blockId;

    auto* block = processor.getAudioGraph().getBlock (blockId);
    if (block == nullptr) { repaint(); return; }

    if (auto* dist = dynamic_cast<DistortionBlock*> (block))
    {
        addSliderRow ("Drive",        0.0, 10.0, dist->getDrive(),
                      [dist] (double v) { dist->setDrive ((float)v); });
        addSliderRow ("Tone",         0.0, 10.0, dist->getTone(),
                      [dist] (double v) { dist->setTone ((float)v); });
        addSliderRow ("Output Level", 0.0, 10.0, dist->getOutputLevel(),
                      [dist] (double v) { dist->setOutputLevel ((float)v); });
        addComboRow  ("Curve", { "Soft Clip (tanh)", "Hard Clip", "Asymmetric" },
                      (int)dist->getCurve(),
                      [dist] (int idx) { dist->setCurve ((DistortionCurve)idx); });
    }
    else if (auto* eq = dynamic_cast<EQBlock*> (block))
    {
        addSliderRow ("Frequency (Hz)", 20.0, 20000.0, eq->getFrequency(),
                      [eq] (double v) { eq->setFrequency ((float)v); });
        addSliderRow ("Gain (dB)",     -24.0, 24.0, eq->getGainDb(),
                      [eq] (double v) { eq->setGainDb ((float)v); });
        addSliderRow ("Q",              0.1,   10.0, eq->getQ(),
                      [eq] (double v) { eq->setQ ((float)v); });
        addComboRow  ("Filter Type", { "Low Shelf", "High Shelf", "Band Shelf" },
                      (int)eq->getFilterType(),
                      [eq] (int idx) { eq->setFilterType ((EQFilterType)idx); });
    }
    else if (auto* comp = dynamic_cast<CompressorBlock*> (block))
    {
        addSliderRow ("Threshold (dB)", -60.0, 0.0,  comp->getThresholdDb(),
                      [comp] (double v) { comp->setThresholdDb ((float)v); });
        addSliderRow ("Ratio",           1.0, 20.0,  comp->getRatio(),
                      [comp] (double v) { comp->setRatio ((float)v); });
        addSliderRow ("Attack (ms)",     1.0, 500.0, comp->getAttackMs(),
                      [comp] (double v) { comp->setAttackMs ((float)v); });
        addSliderRow ("Release (ms)",    5.0, 2000.0, comp->getReleaseMs(),
                      [comp] (double v) { comp->setReleaseMs ((float)v); });
        addSliderRow ("Makeup Gain (dB)", 0.0, 24.0, comp->getMakeupGainDb(),
                      [comp] (double v) { comp->setMakeupGainDb ((float)v); });
        addComboRow  ("Detection", { "Peak", "RMS" },
                      (int)comp->getDetectionMode(),
                      [comp] (int idx) { comp->setDetectionMode ((DetectionMode)idx); });
    }
    else if (auto* decomp = dynamic_cast<DecompressorBlock*> (block))
    {
        addSliderRow ("Threshold (dB)", -60.0, 0.0,   decomp->getThresholdDb(),
                      [decomp] (double v) { decomp->setThresholdDb ((float)v); });
        addSliderRow ("Ratio",           1.0, 20.0,   decomp->getRatio(),
                      [decomp] (double v) { decomp->setRatio ((float)v); });
        addSliderRow ("Attack (ms)",     1.0, 500.0,  decomp->getAttackMs(),
                      [decomp] (double v) { decomp->setAttackMs ((float)v); });
        addSliderRow ("Release (ms)",    5.0, 2000.0, decomp->getReleaseMs(),
                      [decomp] (double v) { decomp->setReleaseMs ((float)v); });
        addSliderRow ("Makeup Gain (dB)", 0.0, 24.0,  decomp->getMakeupGainDb(),
                      [decomp] (double v) { decomp->setMakeupGainDb ((float)v); });

        // Linked compressor dropdown — list all compressor blocks in graph
        juce::StringArray compNames { "(None)" };
        std::vector<juce::Uuid> compIds;
        for (const auto& b : processor.getAudioGraph().getBlocks())
        {
            if (dynamic_cast<CompressorBlock*> (b.get()))
            {
                compNames.add (b->getName() + " [" + b->getUuid().toDashedString().substring (0, 8) + "]");
                compIds.push_back (b->getUuid());
            }
        }
        int currentSel = 0;
        for (int i = 0; i < (int)compIds.size(); ++i)
            if (compIds[i] == decomp->getLinkedCompressorId()) { currentSel = i + 1; break; }

        addComboRow ("Linked Compressor", compNames, currentSel,
                     [this, decomp, compIds] (int idx)
                     {
                         if (idx == 0)
                         {
                             decomp->setLinkedCompressorId (juce::Uuid::null());
                             decomp->setLinkedCompressor (nullptr);
                         }
                         else
                         {
                             auto uid = compIds[idx - 1];
                             decomp->setLinkedCompressorId (uid);
                             auto* compBlock = dynamic_cast<CompressorBlock*> (
                                 processor.getAudioGraph().getBlock (uid));
                             decomp->setLinkedCompressor (compBlock);
                         }
                     });
    }
    else if (auto* ir = dynamic_cast<IRBlock*> (block))
    {
        juce::String pathText = ir->getFilePath().isEmpty()
                                ? "(no file loaded)"
                                : juce::File (ir->getFilePath()).getFileName();
        if (ir->isFileMissing()) pathText += " [MISSING]";
        addReadonlyRow ("IR File", pathText);
        addButtonRow ("", "Browse...",
                      [this, ir]
                      {
                          fileChooserOwner = std::make_unique<juce::FileChooser> (
                              "Select IR file",
                              juce::File::getSpecialLocation (juce::File::userDocumentsDirectory),
                              "*.wav");
                          fileChooserOwner->launchAsync (
                              juce::FileBrowserComponent::openMode |
                              juce::FileBrowserComponent::canSelectFiles,
                              [this, ir] (const juce::FileChooser& fc)
                              {
                                  auto f = fc.getResult();
                                  if (f.existsAsFile())
                                  {
                                      ir->loadFile (f);
                                      showBlock (currentBlockId); // refresh path display
                                  }
                              });
                      });
    }
    else if (auto* merge = dynamic_cast<MergeBlock*> (block))
    {
        addComboRow ("Mode", { "Sum", "Average", "Weighted Mix" },
                     (int)merge->getMode(),
                     [merge] (int idx) { merge->setMode ((MergeMode)idx); });
        for (int i = 0; i < 4; ++i)
        {
            addSliderRow ("Input " + juce::String (i + 1) + " Gain",
                          0.0, 2.0, merge->getInputGain (i),
                          [merge, i] (double v) { merge->setInputGain (i, (float)v); });
        }
    }

    resized();
    repaint();
}


// ============================================================
// SignalPathCanvas
// ============================================================
SignalPathCanvas::SignalPathCanvas (RDProcessorMk01AudioProcessor& p,
                                     std::function<void (juce::Uuid)> onSelect,
                                     std::function<void (juce::Uuid)> onRemove)
    : processor (p), onBlockSelected (onSelect), onBlockRemoved (onRemove)
{
    addAndMakeVisible (addBlockButton);
    addBlockButton.setColour (juce::TextButton::buttonColourId,  juce::Colour (0xff3a3a5a));
    addBlockButton.setColour (juce::TextButton::textColourOffId, Colours::accent);
    addBlockButton.onClick = [this] { showAddBlockMenu(); };
}

void SignalPathCanvas::paint (juce::Graphics& g)
{
    g.fillAll (Colours::bg);

    auto& graph = processor.getAudioGraph();

    // ---- Draw edges ----
    for (const auto& c : graph.getConnections())
    {
        auto srcB = findNodeBounds (c.sourceId);
        auto dstB = findNodeBounds (c.destinationId);
        if (srcB.isEmpty() || dstB.isEmpty()) continue;

        auto p1 = juce::Point<float> ((float)srcB.getRight(), (float)srcB.getCentreY());
        auto p2 = juce::Point<float> ((float)dstB.getX(),     (float)dstB.getCentreY());

        juce::Path path;
        path.startNewSubPath (p1);
        float cpX = p1.x + (p2.x - p1.x) * 0.5f;
        path.cubicTo (cpX, p1.y, cpX, p2.y, p2.x, p2.y);

        g.setColour (Colours::edge);
        g.strokePath (path, juce::PathStrokeType (2.0f));

        // Arrowhead
        juce::Path arrow;
        arrow.addTriangle (p2.x, p2.y, p2.x - 9.0f, p2.y - 4.5f, p2.x - 9.0f, p2.y + 4.5f);
        g.setColour (Colours::edge.brighter (0.3f));
        g.fillPath (arrow);
    }

    // ---- Draw nodes ----
    for (const auto& layout : layouts)
    {
        auto* block = graph.getBlock (layout.id);
        if (!block) continue;

        bool isIO     = layout.id == graph.getSourceId() || layout.id == graph.getOutputId();
        bool selected = layout.id == selectedId;
        bool warning  = false;
        if (auto* decomp = dynamic_cast<DecompressorBlock*> (block))
            warning = decomp->isWarning();
        if (auto* ir = dynamic_cast<IRBlock*> (block))
            warning = ir->isFileMissing();

        juce::Colour bg = isIO ? Colours::nodeIO
                        : warning ? Colours::nodeWarn
                        : selected ? Colours::nodeSel
                        : Colours::nodeBg;

        auto r = layout.bounds.toFloat();
        g.setColour (bg);
        g.fillRoundedRectangle (r, 8.0f);

        // Border
        juce::Colour borderCol = warning  ? juce::Colour (0xffff4444)
                               : selected ? Colours::accent
                               : juce::Colours::white.withAlpha (0.15f);
        float borderW = selected ? 2.0f : 1.0f;
        g.setColour (borderCol);
        g.drawRoundedRectangle (r, 8.0f, borderW);

        // Label
        g.setColour (Colours::text);
        g.setFont (juce::Font (12.0f, juce::Font::bold));
        g.drawText (block->getName(), layout.bounds, juce::Justification::centred);

        // Warning indicator
        if (warning)
        {
            g.setColour (juce::Colour (0xffff4444));
            g.setFont (juce::Font (10.0f));
            g.drawText ("!", layout.bounds.withTop (layout.bounds.getBottom() - 14),
                        juce::Justification::centredRight);
        }
    }
}

void SignalPathCanvas::resized()
{
    addBlockButton.setBounds (getWidth() - 120, getHeight() - 40, 110, 30);
    computeLayout();
}

void SignalPathCanvas::computeLayout()
{
    layouts.clear();
    auto& graph = processor.getAudioGraph();
    if (graph.getBlocks().empty()) return;

    // BFS from Source to assign levels (column index)
    std::map<juce::Uuid, int> levels;
    std::vector<juce::Uuid>   bfsQueue;

    levels[graph.getSourceId()] = 0;
    bfsQueue.push_back (graph.getSourceId());

    for (size_t i = 0; i < bfsQueue.size(); ++i)
    {
        auto cur      = bfsQueue[i];
        int  curLevel = levels[cur];
        for (const auto& c : graph.getConnections())
        {
            if (c.sourceId == cur)
            {
                auto it = levels.find (c.destinationId);
                if (it == levels.end() || it->second <= curLevel)
                {
                    levels[c.destinationId] = curLevel + 1;
                    bfsQueue.push_back (c.destinationId);
                }
            }
        }
    }

    // Ensure all blocks have a level (disconnected nodes go to level 0)
    for (const auto& b : graph.getBlocks())
        if (levels.find (b->getUuid()) == levels.end())
            levels[b->getUuid()] = 0;

    // Group by level
    std::map<int, std::vector<juce::Uuid>> byLevel;
    for (auto& [id, lvl] : levels)
        byLevel[lvl].push_back (id);

    int maxLevel = byLevel.rbegin()->first;
    int canvasW  = getWidth();
    int canvasH  = getHeight() - 50; // leave room for button

    const int vGap   = 20;
    const int hGap   = 30;
    float     colW   = maxLevel > 0 ? (float)(canvasW - nodeW - 40) / maxLevel : (float)(canvasW - nodeW - 40);

    for (auto& [level, ids] : byLevel)
    {
        int n        = (int)ids.size();
        int totalH   = n * nodeH + (n - 1) * vGap;
        int startY   = (canvasH - totalH) / 2 + 10;
        int x        = 20 + (int)((float)level * colW);

        for (int i = 0; i < n; ++i)
        {
            int y = startY + i * (nodeH + vGap);
            layouts.push_back ({ ids[i], juce::Rectangle<int> (x, y, nodeW, nodeH) });
        }
    }
}

juce::Rectangle<int> SignalPathCanvas::findNodeBounds (juce::Uuid id) const
{
    for (const auto& l : layouts)
        if (l.id == id) return l.bounds;
    return {};
}

juce::Uuid SignalPathCanvas::hitTest (juce::Point<int> pos) const
{
    for (const auto& l : layouts)
        if (l.bounds.contains (pos)) return l.id;
    return juce::Uuid::null();
}

void SignalPathCanvas::mouseDown (const juce::MouseEvent& e)
{
    auto hit = hitTest (e.getPosition());

    if (!hit.isNull())
    {
        if (e.mods.isRightButtonDown())
            showNodeContextMenu (hit);
        else
        {
            selectedId = hit;
            repaint();
            onBlockSelected (hit);
        }
    }
    else
    {
        selectedId = juce::Uuid::null();
        repaint();
        onBlockSelected (juce::Uuid::null());
    }
}

void SignalPathCanvas::showAddBlockMenu()
{
    juce::PopupMenu menu;
    menu.addItem (1, "Distortion");
    menu.addItem (2, "EQ");
    menu.addItem (3, "Compressor");
    menu.addItem (4, "Decompressor");
    menu.addItem (5, "IR (Convolution)");
    menu.addSeparator();
    menu.addItem (6, "Split");
    menu.addItem (7, "Merge");

    menu.showMenuAsync (juce::PopupMenu::Options().withTargetComponent (&addBlockButton),
        [this] (int result)
        {
            if (result == 0) return;
            std::unique_ptr<AudioBlock> newBlock;
            switch (result)
            {
                case 1: newBlock = std::make_unique<DistortionBlock>();   break;
                case 2: newBlock = std::make_unique<EQBlock>();           break;
                case 3: newBlock = std::make_unique<CompressorBlock>();   break;
                case 4: newBlock = std::make_unique<DecompressorBlock>(); break;
                case 5: newBlock = std::make_unique<IRBlock>();           break;
                case 6: newBlock = std::make_unique<SplitBlock>();        break;
                case 7: newBlock = std::make_unique<MergeBlock>();        break;
                default: return;
            }
            processor.getAudioGraph().insertBlockBeforeOutput (std::move (newBlock));
            computeLayout();
            repaint();
        });
}

void SignalPathCanvas::showNodeContextMenu (juce::Uuid id)
{
    auto& graph = processor.getAudioGraph();
    if (id == graph.getSourceId() || id == graph.getOutputId()) return;

    juce::PopupMenu menu;
    menu.addItem (1, "Remove block");

    menu.showMenuAsync (juce::PopupMenu::Options(),
        [this, id] (int result)
        {
            if (result == 1)
            {
                processor.getAudioGraph().removeBlock (id);
                if (selectedId == id) { selectedId = {}; onBlockSelected ({}); }
                computeLayout();
                repaint();
                onBlockRemoved (id);
            }
        });
}

// ============================================================
// Main editor
// ============================================================
RDProcessorMk01AudioProcessorEditor::RDProcessorMk01AudioProcessorEditor (
    RDProcessorMk01AudioProcessor& p)
    : AudioProcessorEditor (&p),
      audioProcessor (p),
      sidebar (p),
      canvas  (p,
               [this] (juce::Uuid id) { onBlockSelected (id); },
               [this] (juce::Uuid id) { onBlockRemoved  (id); })
{
    titleLabel.setText ("RD-Processor-Mk-01", juce::dontSendNotification);
    titleLabel.setFont (juce::Font (14.0f, juce::Font::bold));
    titleLabel.setColour (juce::Label::textColourId, Colours::accent);
    titleLabel.setJustificationType (juce::Justification::centred);

    saveButton.setColour (juce::TextButton::buttonColourId,  juce::Colour (0xff2a2a4a));
    saveButton.setColour (juce::TextButton::textColourOffId, Colours::text);
    loadButton.setColour (juce::TextButton::buttonColourId,  juce::Colour (0xff2a2a4a));
    loadButton.setColour (juce::TextButton::textColourOffId, Colours::text);

    saveButton.onClick = [this]
    {
        fileChooser = std::make_unique<juce::FileChooser> (
            "Save Preset",
            juce::File::getSpecialLocation (juce::File::userDocumentsDirectory)
                .getChildFile ("RD-Processor-Mk-01").getChildFile ("Presets"),
            "*.json");
        fileChooser->launchAsync (
            juce::FileBrowserComponent::saveMode |
            juce::FileBrowserComponent::canSelectFiles |
            juce::FileBrowserComponent::warnAboutOverwriting,
            [] (const juce::FileChooser&) { /* TODO: JSON serialisation */ });
    };

    loadButton.onClick = [this]
    {
        fileChooser = std::make_unique<juce::FileChooser> (
            "Load Preset",
            juce::File::getSpecialLocation (juce::File::userDocumentsDirectory)
                .getChildFile ("RD-Processor-Mk-01").getChildFile ("Presets"),
            "*.json");
        fileChooser->launchAsync (
            juce::FileBrowserComponent::openMode |
            juce::FileBrowserComponent::canSelectFiles,
            [] (const juce::FileChooser&) { /* TODO: JSON deserialisation */ });
    };

    addAndMakeVisible (titleLabel);
    addAndMakeVisible (saveButton);
    addAndMakeVisible (loadButton);
    addAndMakeVisible (sidebar);
    addAndMakeVisible (canvas);

    setSize (1100, 700);
    startTimerHz (10); // refresh at 10 Hz for visual updates
}

RDProcessorMk01AudioProcessorEditor::~RDProcessorMk01AudioProcessorEditor()
{
    stopTimer();
}

void RDProcessorMk01AudioProcessorEditor::paint (juce::Graphics& g)
{
    g.fillAll (Colours::bg);

    // Top-bar separator
    g.setColour (Colours::accent.withAlpha (0.3f));
    g.drawHorizontalLine (44, 0.0f, (float)getWidth());
}

void RDProcessorMk01AudioProcessorEditor::resized()
{
    auto area = getLocalBounds();

    // Top bar (44 px)
    auto topBar = area.removeFromTop (44);
    saveButton.setBounds  (topBar.removeFromLeft (110).reduced (6, 8));
    loadButton.setBounds  (topBar.removeFromLeft (110).reduced (6, 8));
    titleLabel.setBounds  (topBar);

    // Left sidebar (220 px)
    sidebar.setBounds (area.removeFromLeft (220));

    // Remaining area → canvas
    canvas.setBounds (area);
}

void RDProcessorMk01AudioProcessorEditor::timerCallback()
{
    canvas.repaint(); // refresh warning states, etc.
}

void RDProcessorMk01AudioProcessorEditor::onBlockSelected (juce::Uuid id)
{
    canvas.setSelectedBlock (id);
    sidebar.showBlock (id);
}

void RDProcessorMk01AudioProcessorEditor::onBlockRemoved (juce::Uuid /*id*/)
{
    sidebar.showBlock (juce::Uuid::null());
}
