import { Action } from "@loop-conductor/common";
import { classNames } from "../../Shared";
import { AddActionMenu } from "./AddActionMenu";

interface Props {
  startBar: number;
  alwaysVisible?: boolean;
  onAddAction: (action: Action) => void;
}

export function Separator({
  startBar,
  onAddAction,
  alwaysVisible = false,
}: Props) {
  return (
    <div
      className={classNames(
        !alwaysVisible ? "hover:w-[35px] w-[10px]" : "w-[35px]",
        "min-h-[200px] bg-gray-100 bg-opacity-30 mt-2 mb-2 rounded-sm",
        "flex-grow-0 flex-shrink-0 flex duration-200 flex-col justify-center delay-300 items-center border-gray-300 group  overflow-hidden"
      )}
    >
      <div
        className={classNames(
          !alwaysVisible ? "opacity-0 group-hover:opacity-100" : "",
          " delay-300 duration-200"
        )}
      >
        <AddActionMenu onAddAction={onAddAction} startBar={startBar} />
      </div>
    </div>
  );
}
