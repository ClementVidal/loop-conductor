import {
  Action,
  ArmTrackAction,
  FireClipAction,
  FireSceneAction,
  MemoAction,
  MetronomeAction,
  OverdubLoopAction,
  RecordLoopAction,
  StopClipAction,
  TempoAction,
  TransportAction,
  WaitAction,
} from "@loop-conductor/common";
import { useCallback, useMemo } from "react";
import { MenuButton, MenuItem, getUUID } from "../../Shared";

interface Props {
  onAddAction: (action: Action) => void;
  startBar: number;
}

function createDefaultAction(type: Action["type"], startBar: number): Action {
  const map: Record<Action["type"], Action> = {
    wait: {
      id: getUUID(),
      barCount: 4,
      type: "wait",
      startBar,
    } satisfies WaitAction,
    armTrack: {
      id: getUUID(),
      trackName: 1,
      type: "armTrack",
      armed: true,
      startBar,
    } satisfies ArmTrackAction,
    fireClip: {
      id: getUUID(),
      trackName: 1,
      sceneName: 1,
      type: "fireClip",
      startBar,
    } satisfies FireClipAction,
    fireScene: {
      id: getUUID(),
      sceneName: 1,
      type: "fireScene",
      startBar,
    } satisfies FireSceneAction,
    metronome: {
      id: getUUID(),
      type: "metronome",
      enable: true,
      startBar,
    } satisfies MetronomeAction,
    overdubLoop: {
      id: getUUID(),
      trackName: 1,
      sceneName: 1,
      type: "overdubLoop",
      unarmOnStop: false,
      barCount: 1,
      startBar,
    } satisfies OverdubLoopAction,
    recordLoop: {
      id: getUUID(),
      trackName: 1,
      sceneName: 1,
      type: "recordLoop",
      barCount: 1,
      unarmOnStop: false,
      unarmOthersOnStart: false,
      startBar,
    } satisfies RecordLoopAction,
    stopClip: {
      id: getUUID(),
      trackName: 1,
      sceneName: 1,
      type: "stopClip",
      startBar,
    } satisfies StopClipAction,
    tempo: {
      id: getUUID(),
      type: "tempo",
      startBar,
      tempo: 120,
    } satisfies TempoAction,
    memo: {
      id: getUUID(),
      type: "memo",
      startBar,
      memo: "",
    } satisfies MemoAction,
    transport: {
      id: getUUID(),
      type: "transport",
      isPlaying: true,
      startBar,
    } satisfies TransportAction,
  };

  return map[type];
}

export function AddActionMenu({ onAddAction, startBar }: Props) {
  const onAdd = useCallback(
    (type: Action["type"]) => {
      const action = createDefaultAction(type, startBar);
      onAddAction(action);
      if (document.activeElement instanceof HTMLElement)
        document.activeElement?.blur();
    },
    [onAddAction]
  );

  const items: MenuItem[] = useMemo(() => {
    return [
      {
        label: "Arm track",
        onClick: () => onAdd("armTrack"),
      },
      {
        label: "Fire clip",
        onClick: () => onAdd("fireClip"),
      },
      {
        label: "Fire scene",
        onClick: () => onAdd("fireScene"),
      },
      {
        label: "Metronome",
        onClick: () => onAdd("metronome"),
      },
      {
        label: "Overdub loop",
        onClick: () => onAdd("overdubLoop"),
      },
      {
        label: "Record loop",
        onClick: () => onAdd("recordLoop"),
      },
      {
        label: "Stop clip",
        onClick: () => onAdd("stopClip"),
      },
      {
        label: "Tempo",
        onClick: () => onAdd("tempo"),
      },
      {
        label: "Wait",
        onClick: () => onAdd("wait"),
      },
      {
        label: "Memo",
        onClick: () => onAdd("memo"),
      },
      {
        label: "Transport",
        onClick: () => onAdd("transport"),
      },
    ];
  }, [onAdd]);

  return <MenuButton items={items} iconName="add" />;
}
