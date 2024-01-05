import { TransportAction } from "@loop-conductor/common";
import { Checkbox, FormElement, Label } from "../../Shared";

interface Props {
  action: TransportAction;
  onChange: (action: TransportAction) => void;
}

export function TransportActionView({ action, onChange }: Props) {
  return (
    <div className="">
      <FormElement>
        <Label text="Is playing" />
        <Checkbox
          value={action.isPlaying}
          onChange={(isPlaying) => onChange({ ...action, isPlaying })}
        />
      </FormElement>
    </div>
  );
}
