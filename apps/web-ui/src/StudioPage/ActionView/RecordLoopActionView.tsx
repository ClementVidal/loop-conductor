import { RecordLoopAction } from "@loop-conductor/common";
import { Checkbox, FormElement, Input, Label } from "../../Shared";

interface Props {
  action: RecordLoopAction;
  onChange: (action: RecordLoopAction) => void;
}

export function RecordLoopActionView({ action, onChange }: Props) {
  return (
    <div className="">
      <FormElement>
        <Label text="Scene name" />
        <Input
          type="text"
          placeholder="Scene name"
          className="w-20"
          onChange={(sceneName) => onChange({ ...action, sceneName })}
          value={action.sceneName.toString()}
        />
      </FormElement>
      <FormElement>
        <Label text="Track name" />
        <Input
          type="text"
          placeholder="Scene name"
          className="w-20"
          value={action.trackName.toString()}
          onChange={(trackName) => onChange({ ...action, trackName })}
        />
      </FormElement>
      <FormElement>
        <Label text="Bar count" />
        <Input
          type="number"
          placeholder="Scene name"
          className="w-20"
          value={action.barCount}
          onChange={(barCount) => onChange({ ...action, barCount })}
        />
      </FormElement>
      <FormElement>
        <Label text="Unarm on stop" />
        <Checkbox
          value={!!action.unarmOnStop}
          onChange={(unarmOnStop) => onChange({ ...action, unarmOnStop })}
        />
      </FormElement>
      <FormElement>
        <Label text="Unarm others on start" />
        <Checkbox
          value={!!action.unarmOthersOnStart}
          onChange={(unarmOthersOnStart) =>
            onChange({
              ...action,
              unarmOthersOnStart,
            })
          }
        />
      </FormElement>
    </div>
  );
}
