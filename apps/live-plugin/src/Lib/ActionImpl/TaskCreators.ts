import {
  Action,
  ActionMap,
  ArmTrackAction,
  FireClipAction,
  FireSceneAction,
  MetronomeAction,
  OverdubLoopAction,
  RecordLoopAction,
  StopClipAction,
  Task,
  TempoAction,
  TransportAction,
  barsToBeats,
  getNextBarTime,
} from "@loop-conductor/common";
import { getIdGenerator, getLive } from "../Globals";

type taskCreators = {
  [key in Action["type"]]:
    | undefined
    | ((action: ActionMap[key], sequenceId: string) => Task[]);
};

export const taskCreators: taskCreators = {
  wait: undefined,
  memo: undefined,
  armTrack: (action: ArmTrackAction, sequenceId: string) => {
    const tSig = getLive().getCurrentTimeSignature();
    const currentBeat = getLive().getCurrentBeat();
    return [
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: getNextBarTime({
          at: action.startBar ?? 0,
          currentBeat,
          tSig,
        }),
        callback: () => {
          getLive().getTrack(action.trackName).arm(action.armed);
        },
      },
    ];
  },
  fireClip: (action: FireClipAction, sequenceId: string) => {
    const tSig = getLive().getCurrentTimeSignature();
    const currentBeat = getLive().getCurrentBeat();
    return [
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: getNextBarTime({
          at: action.startBar ?? 0,
          currentBeat,
          tSig,
        }),
        callback: () => {
          getLive()
            .getTrack(action.trackName)
            .getClipSlot(action.sceneName)
            .fire();
        },
      },
    ];
  },
  stopClip: (action: StopClipAction, sequenceId: string) => {
    const tSig = getLive().getCurrentTimeSignature();
    const currentBeat = getLive().getCurrentBeat();
    return [
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: getNextBarTime({
          at: action.startBar ?? 0,
          currentBeat,
          tSig,
        }),
        callback: () => {
          getLive()
            .getTrack(action.trackName)
            .getClipSlot(action.sceneName)
            .stop();
        },
      },
    ];
  },
  overdubLoop: (action: OverdubLoopAction, sequenceId: string) => {
    const tSig = getLive().getCurrentTimeSignature();
    const currentBeat = getLive().getCurrentBeat();

    const startTime = getNextBarTime({
      at: action.startBar ?? 0,
      currentBeat,
      tSig,
    });
    const stopTime = getNextBarTime({
      at: (action.startBar ?? 0) + action.barCount,
      currentBeat,
      tSig,
    });

    const unarmOnStop = action.unarmOnStop ?? 1;

    return [
      // Start recording task
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: startTime,
        callback: () => {
          const track = getLive().getTrack(action.trackName);
          const clipSlot = track.getClipSlot(action.sceneName);
          const isPlaying = clipSlot.getClip()?.isPlaying();
          if (!isPlaying) {
            return;
          }
          getLive().setSessionRecord(true);
          track.arm(true);
        },
      },
      // Stop recording task
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: stopTime,
        callback: () => {
          const track = getLive().getTrack(action.trackName);
          const clipSlot = track.getClipSlot(action.sceneName);
          const isPlaying = clipSlot.getClip()?.isPlaying();
          if (!isPlaying) {
            return;
          }
          getLive().setSessionRecord(false);
          if (unarmOnStop) {
            getLive().getTrack(action.trackName).arm(false);
          }
        },
      },
    ];
  },
  tempo: (action: TempoAction, sequenceId: string) => {
    const tSig = getLive().getCurrentTimeSignature();
    const currentBeat = getLive().getCurrentBeat();
    return [
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: getNextBarTime({
          at: action.startBar ?? 0,
          currentBeat,
          tSig,
        }),
        callback: () => {
          getLive().setTempo(action.tempo);
        },
      },
    ];
  },
  recordLoop: (action: RecordLoopAction, sequenceId: string) => {
    const tSig = getLive().getCurrentTimeSignature();
    const currentBeat = getLive().getCurrentBeat();

    const trackIndex = getLive().getTrackIndex(action.trackName);
    const startTime = getNextBarTime({
      at: action.startBar ?? 0,
      currentBeat,
      tSig,
    });

    const stopTime = getNextBarTime({
      at: (action.startBar ?? 0) + action.barCount,
      currentBeat,
      tSig,
    });

    const recordLength = barsToBeats(action.barCount, tSig);
    const unarmOnStop = action.unarmOnStop ?? 1;
    const unarmOthersOnStart = action.unarmOthersOnStart ?? 1;

    return [
      // Start recording task
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: startTime,
        callback: () => {
          // First unarm all other tracks
          if (unarmOthersOnStart) {
            for (let i = 0; i < getLive().getTrackCount(); i++) {
              if (i !== trackIndex) {
                getLive().getTrack(i).arm(false);
              }
            }
          }

          // Then arm the track
          const track = getLive().getTrack(action.trackName);
          track.arm(true);

          // Then delete any existing clip
          const clipSlot = track.getClipSlot(action.sceneName);
          if (clipSlot.hasClip()) {
            clipSlot.deleteClip();
          }

          // Then start recording
          clipSlot.fire(recordLength);
        },
      },
      // Stop recording task
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: stopTime,
        callback: () => {
          if (unarmOnStop) {
            getLive().getTrack(action.trackName).arm(false);
          }
        },
      },
    ];
  },
  metronome: (action: MetronomeAction, sequenceId: string) => {
    const tSig = getLive().getCurrentTimeSignature();
    const currentBeat = getLive().getCurrentBeat();
    return [
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: getNextBarTime({
          at: action.startBar ?? 0,
          currentBeat,
          tSig,
        }),
        callback: () => {
          getLive().setMetronome(action.enable);
        },
      },
    ];
  },
  transport: (action: TransportAction, sequenceId: string) => {
    const tSig = getLive().getCurrentTimeSignature();
    const currentBeat = getLive().getCurrentBeat();
    return [
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: getNextBarTime({
          at: action.startBar ?? 0,
          currentBeat,
          tSig,
        }),
        callback: () => {
          getLive().setIsPlaying(action.isPlaying);
        },
      },
    ];
  },
  fireScene: (action: FireSceneAction, sequenceId: string) => {
    const tSig = getLive().getCurrentTimeSignature();
    const currentBeat = getLive().getCurrentBeat();
    return [
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: getNextBarTime({
          at: action.startBar ?? 0,
          currentBeat,
          tSig,
        }),
        callback: () => {
          getLive().getScene(action.sceneName).fire();
        },
      },
    ];
  },
};
