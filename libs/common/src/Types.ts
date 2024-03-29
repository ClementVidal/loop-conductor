/**
 * General types used throughout the library.
 */

export const PadCountX = 4;
export const PadCountY = 4;
export const PadCount = PadCountX * PadCountY;

/**
 * A track name.
 * May be either a 1-indexed number or a string representing the name of the track.
 */
export type TrackName = string | number;
/**
 * A scene name.
 * May be either a 1-indexed number or a string representing the name of the track.
 */
export type SceneName = string | number;

export interface ValidationError {
  Conductor?: string;
  Sequence?: string;
  ActionIndex?: number;
  Error: string;
}

export interface Clip {
  trackName: TrackName;
  sceneName: SceneName;
}

/**
 * Time types
 */

export interface Time {
  bar: number;
  beat: number;
  unit: number;
}

export type Duration =
  | number
  | "1nd"
  | "1n"
  | "1nt"
  | "2nd"
  | "2n"
  | "2nt"
  | "4nd"
  | "4n"
  | "4nt"
  | "8nd"
  | "8n"
  | "8nt"
  | "16nd"
  | "16n"
  | "16nt"
  | "32nd"
  | "32n"
  | "32nt"
  | "64nd"
  | "64n"
  | "128n"
  | "-1nd"
  | "-1n"
  | "-1nt"
  | "-2nd"
  | "-2n"
  | "-2nt"
  | "-4nd"
  | "-4n"
  | "-4nt"
  | "-8nd"
  | "-8n"
  | "-8nt"
  | "-16nd"
  | "-16n"
  | "-16nt"
  | "-32nd"
  | "-32n"
  | "-32nt"
  | "-64nd"
  | "-64n"
  | "-128n";

export const InvalidTime = {
  bar: -1,
  beat: -1,
  unit: -1,
};

export type TimeBeatValue = 1 | 2 | 4 | 8 | 16;
export interface TimeSignature {
  beatsPerBar: number;
  beatValue: TimeBeatValue;
}

/**
 * Tasks types
 */

export interface Task {
  id: number;
  /**
   * A precise timepoint when the task should be executed.
   */
  timepoint: Time;
  /**
   * A callback to execute when the task is executed.
   */
  callback: TaskCallback;
  /**
   * The sequence id of the sequence that created the task.
   * Mainly used to identify which "pad" should be lit when the task is executed.
   */
  sequenceId: string;
}

export type TaskCallback = () => void;

/**
 * Conductor types
 */

export interface BaseAction<Name extends string = string> {
  // A unique id to identify the action
  id: string;
  type: Name;
  /**
   * The start bar, relative to the start of the sequence.
   */
  startBar: number;
}

export interface RecordLoopAction extends BaseAction<"recordLoop"> {
  barCount: number;
  trackName: TrackName;
  sceneName: SceneName;
  // Wether or not the track should be selected when the action start
  select: boolean;
  // Wether the track should be un armed when the loop is done recording
  unarmOnStop: boolean;
  // Wether ALL Others tracks should be un armed when the loop start recording
  unarmOthersOnStart: boolean;
}

export interface ArmTrackAction extends BaseAction<"armTrack"> {
  trackName: TrackName;
  // Default to true
  armed: boolean;
}

export interface FireClipAction extends BaseAction<"fireClip"> {
  sceneName: SceneName;
  trackName: TrackName;
}

export interface FireSceneAction extends BaseAction<"fireScene"> {
  sceneName: SceneName;
}

export interface MetronomeAction extends BaseAction<"metronome"> {
  enable: boolean;
}

export interface OverdubLoopAction extends BaseAction<"overdubLoop"> {
  barCount: number;
  trackName: TrackName;
  sceneName: SceneName;
  // Wether or not the track should be selected when the action start
  select: boolean;
  // Wether the track should be un armed when the loop is done recording
  unarmOnStop: boolean;
  // Wether ALL Others tracks should be un armed when the loop start recording
  unarmOthersOnStart: boolean;
}

export interface StopClipAction extends BaseAction<"stopClip"> {
  sceneName: SceneName;
  trackName: TrackName;
}

export interface WaitAction extends BaseAction<"wait"> {
  barCount: number;
}

export interface MemoAction extends BaseAction<"memo"> {
  memo: string;
}

export interface TempoAction extends BaseAction<"tempo"> {
  tempo: number;
}

export interface TransportAction extends BaseAction<"transport"> {
  isPlaying: boolean;
}

export type Action =
  | ArmTrackAction
  | FireClipAction
  | FireSceneAction
  | MetronomeAction
  | OverdubLoopAction
  | RecordLoopAction
  | StopClipAction
  | TempoAction
  | MemoAction
  | TransportAction
  | WaitAction;

export type ActionMap = {
  armTrack: ArmTrackAction;
  fireClip: FireClipAction;
  stopClip: StopClipAction;
  overdubLoop: OverdubLoopAction;
  tempo: TempoAction;
  recordLoop: RecordLoopAction;
  metronome: MetronomeAction;
  fireScene: FireSceneAction;
  wait: WaitAction;
  memo: MemoAction;
  transport: TransportAction;
};

export interface Sequence {
  // A unique id to identify the sequence
  id: string;
  // An optional name display in the pad matrix
  name?: string;
  // An id to identify the sequence in the pad matrix
  // Pad Id Are 1 based
  padId: number;
  // The ordered list of actions to execute
  actions: Action[];
  // Wether to start the main transport when the sequence is started
  startPlaying: boolean;
}

export interface Conductor {
  id: string;
  name: string;
  sequences: Sequence[];
}

/**
 * Midi command
 */

export interface LoadConductorMidiCommand {
  type: "loadConductor";
  conductor: Conductor;
}

export type MidiCommand = LoadConductorMidiCommand;
