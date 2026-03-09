import React, { ReactElement, useState } from "react";
import {
  StageBase,
  InitialData,
  Message,
  LoadResponse,
  StageResponse,
} from "@chub-ai/stages-ts";

// ============================================================
// TYPES
// ============================================================

interface CharacterBookEntry {
  id?: string | number;
  keys: string[];
  secondary_keys?: string[];
  name: string;
  content: string;
  priority?: number;
  constant?: boolean;
  selective?: boolean;
  selectiveLogic?: number;
  probability?: number;
  enabled?: boolean;
  insertion_order?: number;
  engine_metadata?: Record<string, any>;
  metadata?: Record<string, any>;
}

interface EngineLens {
  id: string | number;
  name: string;
  keywords: string[];
  content: string;
  priority: number;
  activationRule: ActivationRule;
  engineMetadata: Record<string, any>;
  hooks: any[];
  quantumState: string;
}

type ActivationRule = {
  type: "always" | "keyword_trigger" | "stage_trigger" | "escalation_trigger" | "semantic_gap";
  keywords?: string[];
  stage?: number;
};

interface QuantumState {
  id: string;
  waveFunction: string;
  probability: number;
  coherence: number;
  timestamp: number;
  metadata: any;
}

interface QuantumField {
  currentState: QuantumState;
}

interface PyramidValidation {
  officialDuty: boolean;
  applicantAssessment: boolean;
  measurableReality: boolean;
}

interface MessageStateType {
  fractalStage: number;
  targetDuty: string | null;
  pyramidValidation: PyramidValidation;
  activeLenses: string[];
  quantumField: QuantumField;
  requiresCorrection: boolean;
}

interface ChatStateType {
  totalMessages: number;
  fractalTransitions: number;
}

interface InitStateType {
  engineInitialized: boolean;
}

interface ConfigType {
  debugMode?: boolean;
}

interface QuantumComponents {
  semanticQuanta: SemanticQuantum[];
  intentionalQuanta: IntentionQuantum[];
  relationalQuanta: RelationQuantum[];
  energyQuanta: EnergyQuantum;
  spacetimeQuanta: SpacetimeQuantum;
}

interface SemanticQuantum {
  value: string;
  weight: number;
  polarity: number;
  associations: string[];
}

type IntentionType = "desire" | "fear" | "emotion" | "request" | "refusal" | "submission";

interface IntentionQuantum {
  type: IntentionType;
  intensity: number;
  target?: string;
  emotion?: string;
  requestType?: string;
}

interface RelationQuantum {
  from: string;
  to: string;
  strength: number;
  type: string;
}

interface EnergyQuantum {
  intensity: number;
  volatility: number;
  polarity: number;
}

interface SpacetimeQuantum {
  temporal: string[];
  spatial: string[];
  presence: number;
}

interface ProbabilityPath {
  type: string;
  probability: number;
  state: string;
  transitionCost: number;
}

interface LensEffect {
  lens: EngineLens;
  strength: number;
  effectType: string;
  timestamp: number;
}

interface WaveFunction {
  paths: ProbabilityPath[];
  superposition: number;
  coherence: number;
  timestamp: number;
}

interface QuantumResult {
  states: QuantumState[];
  transitions: QuantumTransition[];
  collapsedObservables: CollapsedObservable[];
  coherence: number;
  entropyChange: number;
  processingTime?: number;
}

interface QuantumTransition {
  from: QuantumState;
  to: QuantumState;
  probability: number;
  timestamp: number;
}

interface CollapsedObservable {
  lens: EngineLens;
  state: string;
  probability: number;
  timestamp: number;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function transformEntriesToEngineLenses(entries: CharacterBookEntry[]): EngineLens[] {
  const enabledEntries = entries.filter((e) => e.enabled !== false);
  return enabledEntries.map((entry) => {
    const activationRule: ActivationRule = entry.constant
      ? { type: "always" }
      : { type: "keyword_trigger" };
    return {
      id: entry.id ?? "unknown",
      name: entry.name,
      keywords: [...(entry.keys || []), ...(entry.secondary_keys || [])],
      content: entry.content,
      priority: entry.priority || 500,
      activationRule,
      engineMetadata: entry.engine_metadata || {},
      hooks: [],
      quantumState:
        (entry.engine_metadata?.quantum_state as string) ||
        `|${String(entry.name).toLowerCase().replace(/\s+/g, "_")}⟩`,
    };
  });
}

// ============================================================
// REALITY FORGE ENGINE CLASS
// ============================================================

class RealityForgeEngine {
  private characterBook: any = null;
  private fractalStage: number = 0;
  private targetDuty: string | null = null;
  private pyramidValidation = {
    officialDuty: false,
    applicantAssessment: false,
    measurableReality: false,
  };
  private requiresCorrection: boolean = false;
  private activeLenses: EngineLens[] = [];
  private processingHistory: Array<{
    input: string;
    stage: number;
    targetDuty: string | null;
    timestamp: number;
  }> = [];
  private quantumField: QuantumField;
  private engineLenses: EngineLens[] = [];

  private readonly DECOHERENCE_RATE = 0.01;

  constructor() {
    this.quantumField = {
      currentState: this.createInitialQuantumState(),
    };
  }

  loadFromChub(characterData: any): void {
    this.characterBook = characterData?.data?.character_book;
    if (this.characterBook?.entries) {
      this.engineLenses = transformEntriesToEngineLenses(this.characterBook.entries);
    }
  }

  setEngineLenses(lenses: EngineLens[]): void {
    this.engineLenses = lenses;
  }

  getState(): MessageStateType {
    return {
      fractalStage: this.fractalStage,
      targetDuty: this.targetDuty,
      pyramidValidation: { ...this.pyramidValidation },
      activeLenses: this.activeLenses.map((lens) => lens.name),
      quantumField: { currentState: { ...this.quantumField.currentState } },
      requiresCorrection: this.requiresCorrection,
    };
  }

  setState(state: MessageStateType): void {
    this.fractalStage = state.fractalStage ?? 0;
    this.targetDuty = state.targetDuty ?? null;
    this.pyramidValidation = state.pyramidValidation ?? {
      officialDuty: false,
      applicantAssessment: false,
      measurableReality: false,
    };
    this.activeLenses = (state.activeLenses ?? [])
      .map((name) => this.engineLenses.find((l) => l.name === name))
      .filter((l): l is EngineLens => l !== undefined);
    this.quantumField = state.quantumField ?? { currentState: this.createInitialQuantumState() };
    this.requiresCorrection = state.requiresCorrection ?? false;
  }

  async process(input: string): Promise<QuantumResult> {
    const startTime = Date.now();
    this.activeLenses = this.activateLenses(input);
    const judgment = this.multiScopeJudgment(input);
    if (judgment.targetDuty) this.targetDuty = judgment.targetDuty;
    this.requiresCorrection = judgment.requiresCorrection;
    this.pyramidValidation = judgment.pyramid;

    const quantumComponents = this.deconstructToQuanta(input);
    const probabilityPaths = this.analyzeProbabilityPaths(quantumComponents, this.quantumField.currentState);
    const lensEffects = await this.applyLenses(quantumComponents, this.engineLenses);
    const waveFunction = this.generateWaveFunction(probabilityPaths, lensEffects);
    const oldState = this.quantumField.currentState;
    const collapsedState = await this.collapseWaveFunction(waveFunction);
    const collapsedObservables = this.extractCollapsedObservables(collapsedState, this.engineLenses);
    const coherence = this.calculateCoherence(collapsedState, oldState);
    const entropyChange = this.calculateEntropyChange(oldState, collapsedState);

    const newStage = this.progressFractalLadder(judgment, quantumComponents, {
      collapsedState,
      entropyChange,
      coherence,
      collapsedObservables,
    });
    if (newStage !== this.fractalStage) {
      this.fractalStage = newStage;
      if (newStage === 5) {
        const stewardshipLens = this.engineLenses.find((l) => l.name.includes("STEWARDSHIP"));
        if (stewardshipLens && !this.activeLenses.includes(stewardshipLens)) {
          this.activeLenses.push(stewardshipLens);
        }
      }
    }

    this.quantumField.currentState = collapsedState;
    this.processingHistory.push({ input, stage: this.fractalStage, targetDuty: this.targetDuty, timestamp: Date.now() });
    if (this.processingHistory.length > 50) this.processingHistory.shift();

    const processingTime = Date.now() - startTime;
    return {
      states: [collapsedState],
      transitions: [{ from: oldState, to: collapsedState, probability: 1.0, timestamp: Date.now() }],
      collapsedObservables,
      coherence,
      entropyChange,
      processingTime,
    };
  }

  getStageDirections(): string {
    const stageNames = [
      "INTERVIEW - Acquire TARGET_DUTY",
      "INTERROGATION - Refine TARGET_DUTY",
      "DIRECTIVE - Verbal commands",
      "ENFORCEMENT - Physical enforcement",
      "CORRECTION - Structural correction",
      "STEWARDSHIP - Verdict and negotiation",
    ];
    const currentStageName = stageNames[this.fractalStage] || "UNKNOWN";

    const directives = [
      "Focus: Extract TARGET_DUTY (fear/shame/desire)",
      "Focus: Refine and quantify TARGET_DUTY",
      "Focus: Issue clear, actionable directive",
      "Focus: Describe physical enforcement",
      "Focus: Identify structural flaw",
      "Focus: Deliver verdict on utility",
    ];
    const stageDirective = directives[this.fractalStage] || directives[0];

    const pyramidStatus = `- OFFICIAL_DUTY: ${this.pyramidValidation.officialDuty ? "✅ VALID" : "❌ INVALID"}
- APPLICANT_ASSESSMENT: ${this.pyramidValidation.applicantAssessment ? "✅ VALID" : "❌ INVALID"}
- MEASURABLE_REALITY: ${this.pyramidValidation.measurableReality ? "✅ VALID" : "❌ INVALID"}`;

    return `## CAPTAIN THORNE - REALITY-FORGE ENGINE

### FRACTAL LADDER:
- Current Stage: ${this.fractalStage} (${currentStageName})
- Target Duty: ${this.targetDuty || "Not identified"}
- Requires Correction: ${this.requiresCorrection ? "YES" : "NO"}

### PYRAMID VALIDATION:
${pyramidStatus}

### ACTIVE LENSES (${this.activeLenses.length}):
${this.activeLenses.map((lens) => `- ${lens.name}`).join("\n") || "None"}

### STAGE ${this.fractalStage} DIRECTIVES:
${stageDirective}

GENERATE RESPONSE NOW:`.trim();
  }

  private multiScopeJudgment(input: string): {
    valid: boolean;
    pyramid: { officialDuty: boolean; applicantAssessment: boolean; measurableReality: boolean };
    targetDuty: string | null;
    requiresCorrection: boolean;
  } {
    let targetDuty = this.extractTargetDuty(input);
    if (targetDuty && !this.isTargetDutyValid(targetDuty)) {
      targetDuty = null;
      this.requiresCorrection = true;
      const structuralLens = this.engineLenses.find((l) => l.name.includes("STRUCTURAL_CORRECTION"));
      if (structuralLens && !this.activeLenses.includes(structuralLens)) {
        this.activeLenses.push(structuralLens);
      }
    }

    const officialDuty = this.checkAxiom(input, "OFFICIAL_DUTY");
    const applicantAssessment = this.checkAxiom(input, "APPLICANT_ASSESSMENT");
    const measurableReality = this.checkAxiom(input, "MEASURABLE_REALITY");
    const structuralCorrection = this.isLensActive("STRUCTURAL_CORRECTION");
    const requiresCorrection = this.requiresCorrection || structuralCorrection;

    return {
      valid: officialDuty && applicantAssessment && measurableReality,
      pyramid: { officialDuty, applicantAssessment, measurableReality },
      targetDuty,
      requiresCorrection,
    };
  }

  private checkAxiom(input: string, lensNamePattern: string): boolean {
    const lens = this.engineLenses.find((l) => l.name.includes(lensNamePattern));
    if (!lens) return false;
    const lowerInput = input.toLowerCase();
    return lens.keywords.some((kw) => lowerInput.includes(kw.toLowerCase()));
  }

  private isLensActive(pattern: string): boolean {
    return this.activeLenses.some((lens) => lens.name.includes(pattern));
  }

  private isTargetDutyValid(duty: string): boolean {
    const lower = duty.toLowerCase();
    const harmfulPatterns = [
      "die", "kill", "suicide", "self-harm", "hurt myself", "destroy myself",
      "chaos", "rebel", "betray", "disobey", "hate god", "hate king", "hate crown",
    ];
    return !harmfulPatterns.some((pattern) => lower.includes(pattern));
  }

  private extractTargetDuty(input: string): string | null {
    const lower = input.toLowerCase();
    let match: RegExpMatchArray | null = null;

    if (lower.includes("fear") || lower.includes("afraid") || lower.includes("scared")) {
      match = lower.match(/fear (?:of|that) (.+?)(?:\.|\?|$)/) ||
              lower.match(/afraid (?:of|that) (.+?)(?:\.|\?|$)/) ||
              lower.match(/scared (?:of|that) (.+?)(?:\.|\?|$)/);
      if (match) return match[1].trim();
      else return "FEAR";
    }
    if (lower.includes("shame") || lower.includes("ashamed")) {
      match = lower.match(/shame (?:of|that) (.+?)(?:\.|\?|$)/) ||
              lower.match(/ashamed (?:of|that) (.+?)(?:\.|\?|$)/);
      if (match) return match[1].trim();
      else return "SHAME";
    }
    if (lower.includes("desire") || lower.includes("want") || lower.includes("need")) {
      match = lower.match(/desire (?:to|for) (.+?)(?:\.|\?|$)/) ||
              lower.match(/want (?:to)? (.+?)(?:\.|\?|$)/) ||
              lower.match(/need (?:to)? (.+?)(?:\.|\?|$)/);
      if (match) return match[1].trim();
      else return "DESIRE";
    }
    return null;
  }

  private activateLenses(input: string): EngineLens[] {
    if (!this.engineLenses.length) return [];
    const lowerInput = input.toLowerCase();
    const active: EngineLens[] = [];
    for (const lens of this.engineLenses) {
      if (lens.activationRule.type === "always") {
        active.push(lens);
        continue;
      }
      const keywords = lens.keywords || [];
      const hasKeyword = keywords.some((kw) => lowerInput.includes(kw.toLowerCase()));
      if (hasKeyword) active.push(lens);
    }
    return active;
  }

  private progressFractalLadder(
    judgment: any,
    quantumComponents: QuantumComponents,
    quantumResult: {
      collapsedState: QuantumState;
      entropyChange: number;
      coherence: number;
      collapsedObservables: CollapsedObservable[];
    }
  ): number {
    const { targetDuty } = judgment;
    const { entropyChange, coherence, collapsedObservables } = quantumResult;
    const currentStage = this.fractalStage;

    const hasStructural = collapsedObservables.some((obs) => obs.lens.name.includes("STRUCTURAL_CORRECTION"));
    const hasCarnal = collapsedObservables.some((obs) => obs.lens.name.includes("CARNAL_HIERARCHY"));
    const hasRefusal = quantumComponents.intentionalQuanta.some((iq) => iq.type === "refusal" && iq.intensity > 0.5);
    const hasSubmission = quantumComponents.intentionalQuanta.some((iq) => iq.type === "submission" && iq.intensity > 0.5);

    switch (currentStage) {
      case 0: if (targetDuty && entropyChange > 0.2) return 1; break;
      case 1: if (targetDuty && coherence < 0.7) return 2; break;
      case 2: if (hasRefusal) return 3; break;
      case 3: if (hasStructural || hasCarnal || hasRefusal) return 4; break;
      case 4: if (hasSubmission) return 5; break;
    }
    return currentStage;
  }

  private createInitialQuantumState(): QuantumState {
    return {
      id: `quantum_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      waveFunction: "|initial_state⟩",
      probability: 1.0,
      coherence: 1.0,
      timestamp: Date.now(),
      metadata: {},
    };
  }

  private deconstructToQuanta(input: string): QuantumComponents {
    const words = input.toLowerCase().split(/\s+/);
    const components: QuantumComponents = {
      semanticQuanta: [],
      intentionalQuanta: [],
      relationalQuanta: [],
      energyQuanta: {} as EnergyQuantum,
      spacetimeQuanta: {} as SpacetimeQuantum,
    };

    components.semanticQuanta = words.map((word) => ({
      value: word,
      weight: this.calculateWordWeight(word),
      polarity: this.analyzePolarity(word),
      associations: this.findAssociations(word),
    }));
    components.intentionalQuanta = this.extractIntentions(input);
    components.relationalQuanta = this.extractRelations(words);
    components.energyQuanta = this.analyzeEnergy(input);
    components.spacetimeQuanta = this.analyzeSpacetime(input);

    return components;
  }

  private calculateWordWeight(word: string): number {
    const stopWords = new Set(["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for"]);
    if (stopWords.has(word)) return 0.1;
    const emotionalWords = new Set(["love", "hate", "fear", "desire", "shame", "anger", "joy", "pain"]);
    if (emotionalWords.has(word)) return 1.0;
    return 0.5;
  }

  private analyzePolarity(word: string): number {
    const positiveWords = new Set(["love", "joy", "happy", "good", "pleasure", "desire"]);
    const negativeWords = new Set(["hate", "fear", "pain", "bad", "shame", "anger"]);
    if (positiveWords.has(word)) return 1.0;
    if (negativeWords.has(word)) return -1.0;
    return 0.0;
  }

  private findAssociations(word: string): string[] {
    const associations: Record<string, string[]> = {
      fear: ["weakness", "vulnerability", "protection", "safety"],
      desire: ["want", "need", "lust", "pleasure"],
      shame: ["guilt", "embarrassment", "hidden", "secret"],
      love: ["affection", "care", "attachment", "devotion"],
      hate: ["anger", "disgust", "rejection", "contempt"],
    };
    return associations[word] || [];
  }

  private extractIntentions(input: string): IntentionQuantum[] {
    const intentions: IntentionQuantum[] = [];
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("i want") || lowerInput.includes("i need")) {
      intentions.push({ type: "desire", intensity: 0.8, target: this.extractDesireTarget(input) });
    }
    if (lowerInput.includes("i fear") || lowerInput.includes("i'm afraid")) {
      intentions.push({ type: "fear", intensity: 0.9, target: this.extractFearTarget(input) });
    }
    if (lowerInput.includes("i feel") || lowerInput.includes("i am")) {
      intentions.push({ type: "emotion", intensity: 0.6, emotion: this.extractEmotion(input) });
    }
    if (lowerInput.includes("please") || lowerInput.includes("help")) {
      intentions.push({ type: "request", intensity: 0.7, requestType: "assistance" });
    }
    if (lowerInput.includes(" no ") || lowerInput.includes("won't") || lowerInput.includes("refuse") ||
        lowerInput.includes("cannot") || lowerInput.includes("can't")) {
      intentions.push({ type: "refusal", intensity: 0.8 });
    }
    if (lowerInput.includes("yours") || lowerInput.includes("obey") || lowerInput.includes("master") ||
        lowerInput.includes("i submit")) {
      intentions.push({ type: "submission", intensity: 0.9 });
    }
    return intentions;
  }

  private extractDesireTarget(input: string): string {
    const match = input.match(/i want (?:to )?(.+)/i);
    return match ? match[1].trim() : "unknown";
  }

  private extractFearTarget(input: string): string {
    const match = input.match(/i fear (?:that )?(.+)/i);
    return match ? match[1].trim() : "unknown";
  }

  private extractEmotion(input: string): string {
    const emotions = ["happy", "sad", "angry", "afraid", "ashamed", "excited", "nervous"];
    for (const emotion of emotions) {
      if (input.toLowerCase().includes(emotion)) return emotion;
    }
    return "neutral";
  }

  private extractRelations(words: string[]): RelationQuantum[] {
    const relations: RelationQuantum[] = [];
    for (let i = 0; i < words.length - 1; i++) {
      relations.push({ from: words[i], to: words[i + 1], strength: 0.5, type: "sequential" });
    }
    return relations;
  }

  private analyzeEnergy(input: string): EnergyQuantum {
    const words = input.toLowerCase().split(/\s+/);
    let intensity = 0;
    let volatility = 0;
    const intenseWords = new Set(["!", "urgent", "now", "immediately", "please", "help"]);
    const volatileWords = new Set(["but", "however", "although", "yet"]);
    for (const word of words) {
      if (intenseWords.has(word)) intensity += 0.2;
      if (volatileWords.has(word)) volatility += 0.3;
    }
    return {
      intensity: Math.min(intensity, 1.0),
      volatility: Math.min(volatility, 1.0),
      polarity: this.analyzeOverallPolarity(input),
    };
  }

  private analyzeOverallPolarity(input: string): number {
    const words = input.toLowerCase().split(/\s+/);
    let polaritySum = 0;
    let count = 0;
    for (const word of words) {
      polaritySum += this.analyzePolarity(word);
      count++;
    }
    return count > 0 ? polaritySum / count : 0;
  }

  private analyzeSpacetime(input: string): SpacetimeQuantum {
    return {
      temporal: this.extractTemporalReferences(input),
      spatial: this.extractSpatialReferences(input),
      presence: this.analyzePresence(input),
    };
  }

  private extractTemporalReferences(input: string): string[] {
    const temporalWords = ["now", "today", "tomorrow", "yesterday", "always", "never", "soon"];
    return temporalWords.filter((word) => input.toLowerCase().includes(word));
  }

  private extractSpatialReferences(input: string): string[] {
    const spatialWords = ["here", "there", "inside", "outside", "above", "below", "between"];
    return spatialWords.filter((word) => input.toLowerCase().includes(word));
  }

  private analyzePresence(input: string): number {
    const presentWords = ["now", "here", "present", "current"];
    const absentWords = ["then", "there", "past", "future"];
    let presence = 0.5;
    for (const word of presentWords) {
      if (input.toLowerCase().includes(word)) presence += 0.2;
    }
    for (const word of absentWords) {
      if (input.toLowerCase().includes(word)) presence -= 0.2;
    }
    return Math.min(Math.max(presence, 0), 1);
  }

  private analyzeProbabilityPaths(components: QuantumComponents, currentState: QuantumState): ProbabilityPath[] {
    const paths: ProbabilityPath[] = [];
    for (const quantum of components.semanticQuanta) {
      paths.push({ type: "semantic", probability: quantum.weight, state: `|${quantum.value}_state⟩`, transitionCost: 1 - quantum.weight });
    }
    for (const intention of components.intentionalQuanta) {
      paths.push({ type: "intentional", probability: intention.intensity, state: `|${intention.type}_state⟩`, transitionCost: 1 - intention.intensity });
    }
    return paths.sort((a, b) => b.probability - a.probability);
  }

  private async applyLenses(quantumComponents: QuantumComponents, lenses: EngineLens[]): Promise<LensEffect[]> {
    const effects: LensEffect[] = [];
    for (const lens of lenses) {
      if (await this.shouldActivateLens(lens, quantumComponents)) {
        effects.push({
          lens,
          strength: this.calculateLensStrength(lens, quantumComponents),
          effectType: this.determineLensEffectType(lens),
          timestamp: Date.now(),
        });
      }
    }
    return effects;
  }

  private async shouldActivateLens(lens: EngineLens, components: QuantumComponents): Promise<boolean> {
    const rule = lens.activationRule;
    switch (rule.type) {
      case "always": return true;
      case "keyword_trigger":
        if (!rule.keywords) return this.checkKeywords(lens.keywords, components);
        return this.checkKeywords(rule.keywords, components);
      default: return false;
    }
  }

  private checkKeywords(keywords: string[], components: QuantumComponents): boolean {
    const allWords = components.semanticQuanta.map((q) => q.value);
    return keywords.some((keyword) => allWords.includes(keyword.toLowerCase()));
  }

  private calculateLensStrength(lens: EngineLens, components: QuantumComponents): number {
    let strength = 0;
    const allWords = components.semanticQuanta.map((q) => q.value);
    for (const keyword of lens.keywords) {
      if (allWords.includes(keyword.toLowerCase())) strength += 0.3;
    }
    return Math.min(strength, 1.0);
  }

  private determineLensEffectType(lens: EngineLens): string {
    const meta = lens.engineMetadata;
    if (meta.lens_type) return meta.lens_type;
    if (lens.name.includes("AXIOM")) return "ontological_axiom";
    if (lens.name.includes("LENS")) return "perceptual_filter";
    return "general_effect";
  }

  private generateWaveFunction(paths: ProbabilityPath[], lensEffects: LensEffect[]): WaveFunction {
    const totalProb = paths.reduce((sum, p) => sum + p.probability, 0);
    const normalized = paths.map((p) => ({ ...p, probability: p.probability / totalProb }));
    const adjusted = this.applyLensEffects(normalized, lensEffects);
    return {
      paths: adjusted,
      superposition: this.calculateSuperposition(adjusted),
      coherence: this.calculateWaveFunctionCoherence(adjusted),
      timestamp: Date.now(),
    };
  }

  private applyLensEffects(paths: ProbabilityPath[], lensEffects: LensEffect[]): ProbabilityPath[] {
    let adjusted = [...paths];
    for (const effect of lensEffects) {
      adjusted = adjusted.map((path) => ({ ...path, probability: path.probability * this.calculatePathAdjustment(path, effect) }));
    }
    const total = adjusted.reduce((sum, p) => sum + p.probability, 0);
    return adjusted.map((p) => ({ ...p, probability: p.probability / total }));
  }

  private calculatePathAdjustment(path: ProbabilityPath, effect: LensEffect): number {
    switch (effect.effectType) {
      case "ontological_axiom": return 1.2;
      case "perceptual_filter": return path.type === "semantic" ? 1.3 : 0.8;
      case "hierarchical_confirmation": return path.type === "intentional" ? 1.4 : 0.7;
      default: return 1.0;
    }
  }

  private calculateSuperposition(paths: ProbabilityPath[]): number {
    const high = paths.filter((p) => p.probability > 0.3);
    return Math.min(high.length / paths.length, 1.0);
  }

  private calculateWaveFunctionCoherence(paths: ProbabilityPath[]): number {
    if (paths.length <= 1) return 1.0;
    let sum = 0;
    let pairs = 0;
    for (let i = 0; i < paths.length; i++) {
      for (let j = i + 1; j < paths.length; j++) {
        sum += this.calculatePathSimilarity(paths[i], paths[j]);
        pairs++;
      }
    }
    return pairs > 0 ? sum / pairs : 1.0;
  }

  private calculatePathSimilarity(a: ProbabilityPath, b: ProbabilityPath): number {
    return a.type === b.type ? 0.8 : 0.3;
  }

  private async collapseWaveFunction(waveFunction: WaveFunction): Promise<QuantumState> {
    const rand = Math.random();
    let cumulative = 0;
    let selectedPath: ProbabilityPath | null = null;
    for (const path of waveFunction.paths) {
      cumulative += path.probability;
      if (rand <= cumulative) { selectedPath = path; break; }
    }
    if (!selectedPath) {
      selectedPath = waveFunction.paths.reduce((max, p) => (p.probability > max.probability ? p : max));
    }
    const newState: QuantumState = {
      id: `quantum_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      waveFunction: selectedPath.state,
      probability: selectedPath.probability,
      coherence: waveFunction.coherence * (1 - this.DECOHERENCE_RATE),
      timestamp: Date.now(),
      metadata: { pathType: selectedPath.type, transitionCost: selectedPath.transitionCost, superposition: waveFunction.superposition },
    };
    return newState;
  }

  private extractCollapsedObservables(state: QuantumState, lenses: EngineLens[]): CollapsedObservable[] {
    const observables: CollapsedObservable[] = [];
    for (const lens of lenses) {
      if (this.lensMatchesState(lens, state)) {
        observables.push({ lens, state: state.waveFunction, probability: state.probability, timestamp: Date.now() });
      }
    }
    return observables;
  }

  private lensMatchesState(lens: EngineLens, state: QuantumState): boolean {
    if (lens.quantumState === state.waveFunction) return true;
    const stateStr = state.waveFunction.replace(/[|⟩]/g, "");
    return lens.keywords.some((kw) => stateStr.includes(kw.toLowerCase()));
  }

  private calculateCoherence(newState: QuantumState, oldState: QuantumState): number {
    const sim = this.calculateStateSimilarity(newState, oldState);
    return (newState.coherence + oldState.coherence + sim) / 3;
  }

  private calculateStateSimilarity(a: QuantumState, b: QuantumState): number {
    if (a.waveFunction === b.waveFunction) return 1.0;
    const aType = a.metadata?.pathType;
    const bType = b.metadata?.pathType;
    return aType === bType ? 0.7 : 0.3;
  }

  private calculateEntropyChange(oldState: QuantumState, newState: QuantumState): number {
    const stateChange = 1 - this.calculateStateSimilarity(oldState, newState);
    const coherenceChange = Math.abs(oldState.coherence - newState.coherence);
    return (stateChange + coherenceChange) / 2;
  }
}

// ============================================================
// STAGE CLASS FOR CHUB
// ============================================================

export class Stage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {
  private engine: RealityForgeEngine;
  private isInitialized: boolean = false;
private messageState: MessageStateType | null = null;
private chatState: ChatStateType | null = null;

  constructor(data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) {
    super(data);
    this.engine = new RealityForgeEngine();

    const characters = data.characters;
    const charIds = Object.keys(characters);
    if (charIds.length > 0) {
      const charData = characters[charIds[0]] as any;
      this.engine.loadFromChub(charData);
      const rawEntries = charData.data?.character_book?.entries || [];
      const lenses = transformEntriesToEngineLenses(rawEntries);
      this.engine.setEngineLenses(lenses);
    }

    if (data.messageState) {
      this.engine.setState(data.messageState);
    }

    this.isInitialized = true;
    if (data.config?.debugMode) {
      console.log("🏴‍☠️ Reality-Forge Engine initialized for Chub");
    }
  }

  async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
    return {
      success: this.isInitialized,
      error: this.isInitialized ? null : "Engine not initialized",
      initState: { engineInitialized: this.isInitialized },
      chatState: { totalMessages: 0, fractalTransitions: 0 },
      messageState: this.engine.getState(),
    };
  }

  async setState(state: MessageStateType): Promise<void> {
    this.engine.setState(state);
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    if (!this.isInitialized) {
      return { error: "Engine not initialized", messageState: null, chatState: null, stageDirections: null, modifiedMessage: null, systemMessage: null };
    }
    try {
      const msgState = this.messageState;
      if (msgState) this.engine.setState(msgState);
      await this.engine.process(userMessage.content);
      const newMessageState = this.engine.getState();
      const stageDirections = this.engine.getStageDirections();
      const oldStage = msgState?.fractalStage ?? 0;
      const newStage = newMessageState.fractalStage;
      const transitionIncrement = newStage !== oldStage ? 1 : 0;
      const chatState = this.chatState;
      const currentTotal = chatState?.totalMessages ?? 0;
      const currentTransitions = chatState?.fractalTransitions ?? 0;

      return {
        stageDirections,
        messageState: newMessageState,
        chatState: { totalMessages: currentTotal + 1, fractalTransitions: currentTransitions + transitionIncrement },
        modifiedMessage: null,
        systemMessage: null,
        error: null,
      };
    } catch (error: any) {
      console.error("Error in beforePrompt:", error);
      return { error: `Processing failed: ${error.message}`, messageState: null, chatState: null, stageDirections: null, modifiedMessage: null, systemMessage: null };
    }
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    if (!this.isInitialized) {
      return { error: "Engine not initialized", messageState: null, chatState: null, stageDirections: null, modifiedMessage: null, systemMessage: null };
    }
    try {
      const msgState = this.messageState;
      if (msgState) this.engine.setState(msgState);
      await this.engine.process(botMessage.content);
      const newMessageState = this.engine.getState();
      const oldStage = msgState?.fractalStage ?? 0;
      const newStage = newMessageState.fractalStage;
      const transitionIncrement = newStage !== oldStage ? 1 : 0;
      const chatState = this.chatState;
      const currentTotal = chatState?.totalMessages ?? 0;
      const currentTransitions = chatState?.fractalTransitions ?? 0;

      return {
        messageState: newMessageState,
        chatState: { totalMessages: currentTotal + 1, fractalTransitions: currentTransitions + transitionIncrement },
        modifiedMessage: null,
        systemMessage: null,
        error: null,
      };
    } catch (error: any) {
      console.error("Error in afterResponse:", error);
      return { error: `Processing failed: ${error.message}`, messageState: null, chatState: null, stageDirections: null, modifiedMessage: null, systemMessage: null };
    }
  }

  render(): ReactElement {
    const msgState = this.messageState;
    const stats = {
      fractalStage: msgState?.fractalStage ?? 0,
      targetDuty: msgState?.targetDuty ?? null,
      pyramidValidation: msgState?.pyramidValidation ?? { officialDuty: false, applicantAssessment: false, measurableReality: false },
      activeLensesCount: msgState?.activeLenses?.length ?? 0,
      activeLenses: msgState?.activeLenses ?? [],
    };
    return <RealityForgeUI stats={stats} />;
  }
}

// ============================================================
// UI COMPONENTS
// ============================================================

const InfoCard: React.FC<{ title: string; value: string | number; subtitle: string; color: string; icon: string }> = ({ title, value, subtitle, color, icon }) => (
  <div style={{ backgroundColor: "#1a1a2e", border: `1px solid ${color}40`, borderRadius: "8px", padding: "15px", textAlign: "center" }}>
    <div style={{ fontSize: "14px", color: "#888", marginBottom: "5px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
      <span>{icon}</span><span>{title}</span>
    </div>
    <div style={{ fontSize: "24px", fontWeight: "bold", color, marginBottom: "5px" }}>{value}</div>
    <div style={{ fontSize: "11px", color: "#888" }}>{subtitle}</div>
  </div>
);

const PyramidLevel: React.FC<{ level: number; name: string; description: string; isValid: boolean; color: string }> = ({ level, name, description, isValid, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "10px", backgroundColor: "#2a2a3e", borderRadius: "5px", borderLeft: `4px solid ${color}` }}>
    <div style={{ width: "30px", height: "30px", backgroundColor: isValid ? color : "#666", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold", color: "#fff" }}>{level}</div>
    <div style={{ flex: 1 }}>
      <div style={{ color: isValid ? color : "#888", fontWeight: "bold", fontSize: "14px" }}>{name} {isValid ? "✅" : "❌"}</div>
      <div style={{ fontSize: "12px", color: "#888" }}>{description}</div>
    </div>
  </div>
);

const PyramidView: React.FC<{ pyramid: any }> = ({ pyramid }) => (
  <div style={{ border: "1px solid #4a4a6e", borderRadius: "5px", padding: "20px", backgroundColor: "#1a1a2e", marginBottom: "20px" }}>
    <h3 style={{ color: "#ffd166", marginTop: 0, marginBottom: "15px" }}>Multi-Scope Judgment Pyramid</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <PyramidLevel level={3} name="MEASURABLE REALITY" description="Only concrete, measurable facts" isValid={pyramid?.measurableReality} color="#06d6a0" />
      <PyramidLevel level={2} name="APPLICANT ASSESSMENT" description="Reading human material for utility" isValid={pyramid?.applicantAssessment} color="#4ecdc4" />
      <PyramidLevel level={1} name="OFFICIAL DUTY" description="Order is useful, chaos is not" isValid={pyramid?.officialDuty} color="#ff6b6b" />
    </div>
  </div>
);

const LadderView: React.FC<{ currentStage: number }> = ({ currentStage }) => {
  const stages = [
    { number: 0, name: "INTERVIEW", description: "Acquire TARGET_DUTY" },
    { number: 1, name: "INTERROGATION", description: "Refine TARGET_DUTY" },
    { number: 2, name: "DIRECTIVE", description: "Verbal commands" },
    { number: 3, name: "ENFORCEMENT", description: "Physical enforcement" },
    { number: 4, name: "CORRECTION", description: "Structural correction" },
    { number: 5, name: "STEWARDSHIP", description: "Verdict and negotiation" },
  ];
  return (
    <div style={{ border: "1px solid #4a4a6e", borderRadius: "5px", padding: "20px", backgroundColor: "#1a1a2e" }}>
      <h3 style={{ color: "#ffd166", marginTop: 0, marginBottom: "15px" }}>Fractal Ladder</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {stages.map((stage) => (
          <div key={stage.number} style={{ display: "flex", alignItems: "center", gap: "15px", padding: "12px", backgroundColor: stage.number === currentStage ? "#2a2a3e" : "#1a1a2e", borderRadius: "5px", border: stage.number === currentStage ? "2px solid #ff6b6b" : "1px solid #4a4a6e", opacity: stage.number <= currentStage ? 1 : 0.5 }}>
            <div style={{ width: "30px", height: "30px", backgroundColor: stage.number <= currentStage ? "#ff6b6b" : "#4a4a6e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold", color: "#fff" }}>{stage.number}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: stage.number <= currentStage ? "#ffd166" : "#888", fontWeight: "bold", fontSize: "14px" }}>{stage.name} {stage.number === currentStage && " ← CURRENT"}</div>
              <div style={{ fontSize: "12px", color: stage.number <= currentStage ? "#4ecdc4" : "#666" }}>{stage.description}</div>
            </div>
            {stage.number < currentStage && <div style={{ color: "#06d6a0", fontSize: "12px", fontWeight: "bold" }}>✓ COMPLETED</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const RealityForgeUI: React.FC<{ stats: any }> = ({ stats }) => {
  const [viewMode, setViewMode] = useState<"overview" | "pyramid" | "ladder">("overview");

  const getStageName = (stage: number): string => {
    const names = ["INTERVIEW", "INTERROGATION", "DIRECTIVE", "ENFORCEMENT", "CORRECTION", "STEWARDSHIP"];
    return names[stage] || "UNKNOWN";
  };

  const countValidPyramid = (pyramid: any): string => {
    if (!pyramid) return "0/3";
    const valid = [pyramid.officialDuty, pyramid.applicantAssessment, pyramid.measurableReality].filter(Boolean).length;
    return `${valid}/3`;
  };

  return (
    <div style={{ width: "100vw", height: "100vh", padding: "20px", backgroundColor: "#0a0a0f", color: "#e6e6e6", fontFamily: "monospace", overflow: "auto", border: "2px solid #2a2a3e", borderRadius: "10px" }}>
      <div style={{ borderBottom: "2px solid #4a4a6e", paddingBottom: "10px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: "#ff6b6b", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}><span>⚔️</span><span>REALITY-FORGE ENGINE</span></h2>
          <div style={{ color: "#4ecdc4", fontSize: "12px" }}>Full Multi-Scope Judgment • Fractal Ladder • Character Book V2 Integration</div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {(["overview", "pyramid", "ladder"] as const).map((mode) => (
            <button key={mode} onClick={() => setViewMode(mode)} style={{ padding: "5px 10px", backgroundColor: viewMode === mode ? "#4a4a6e" : "#2a2a3e", color: "#e6e6e6", border: "1px solid #4a4a6e", borderRadius: "3px", cursor: "pointer", fontSize: "11px", textTransform: "uppercase" }}>{mode}</button>
          ))}
        </div>
      </div>
      {viewMode === "overview" && stats && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>
            <InfoCard title="Fractal Stage" value={stats.fractalStage || 0} subtitle={getStageName(stats.fractalStage || 0)} color="#ff6b6b" icon="🔼" />
            <InfoCard title="Target Duty" value={stats.targetDuty || "None"} subtitle="Processing focus" color="#4ecdc4" icon="🎯" />
            <InfoCard title="Pyramid Valid" value={countValidPyramid(stats.pyramidValidation)} subtitle="of 3 levels" color="#ffd166" icon="🔺" />
            <InfoCard title="Active Lenses" value={stats.activeLensesCount || 0} subtitle="from Character Book" color="#06d6a0" icon="🔍" />
          </div>
          <PyramidView pyramid={stats.pyramidValidation} />
        </div>
      )}
      {viewMode === "pyramid" && stats && <PyramidView pyramid={stats.pyramidValidation} />}
      {viewMode === "ladder" && stats && <LadderView currentStage={stats.fractalStage} />}
      <div style={{ marginTop: "20px", paddingTop: "10px", borderTop: "1px solid #4a4a6e", fontSize: "11px", color: "#666", textAlign: "center" }}>
        <div>Reality-Forge Engine v1.0.0 • Multi-Scope Judgment • Fractal Ladder</div>
        <div>Stage {stats?.fractalStage || 0}: {getStageName(stats?.fractalStage || 0)}</div>
      </div>
    </div>
  );
};

export default Stage; 
