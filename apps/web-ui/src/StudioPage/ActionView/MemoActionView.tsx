import { MemoAction } from "@loop-conductor/common";
import { FormElement, TextArea } from "../../Shared";

interface Props {
  action: MemoAction;
  onChange: (action: MemoAction) => void;
}

export function MemoActionView({ action, onChange }: Props) {
  return (
    <div className="flex-grow">
      <FormElement className="h-full">
        <TextArea
          placeholder="Scene name"
          className="w-full h-full resize-none min-h-[150px]"
          value={action.memo}
          onChange={(memo) => onChange({ ...action, memo })}
        />
      </FormElement>
    </div>
  );
}
