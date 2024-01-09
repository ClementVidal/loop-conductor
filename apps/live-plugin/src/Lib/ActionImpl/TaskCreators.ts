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

    return [
      // Start recording task
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: startTime,
        callback: () => {
          // First unarm all other tracks
          const trackIndex = getLive().getTrackIndex(action.trackName);
          if (action.unarmOthersOnStart) {
            for (let i = 0; i < getLive().getTrackCount(); i++) {
              if (i !== trackIndex) {
                getLive().getTrackByIndex(i).arm(false);
              }
            }
          }
          const track = getLive().getTrack(action.trackName);
          const clipSlot = track.getClipSlot(action.sceneName);
          const isPlaying = clipSlot.getClip()?.isPlaying();
          if (!isPlaying) {
            return;
          }
          getLive().setSessionRecord(true);
          if (action.select) {
            track.select();
          }
          track.arm(true);
        },
      },
      // Stop recording task
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: stopTime,
        callback: () => {
          const trackIndex = getLive().getTrackIndex(action.trackName);
          const track = getLive().getTrack(action.trackName);
          const clipSlot = track.getClipSlot(action.sceneName);
          const isPlaying = clipSlot.getClip()?.isPlaying();

          if (!isPlaying) {
            return;
          }
          track.arm(!action.unarmOnStop);
          getLive().setSessionRecord(false);
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

    return [
      // Start recording task
      {
        id: getIdGenerator().id(),
        sequenceId,
        timepoint: startTime,
        callback: () => {
          const trackIndex = getLive().getTrackIndex(action.trackName);
          // First unarm all other tracks
          if (action.unarmOthersOnStart) {
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

          if (action.select) {
            track.select();
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
          getLive().getTrack(action.trackName).arm(!action.unarmOnStop);
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
