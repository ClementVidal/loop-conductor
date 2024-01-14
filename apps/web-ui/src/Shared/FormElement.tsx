import { PropsWithChildren } from "react";
import { classNames } from "./Utils";

interface Props {
  className?: string;
}

export function FormElement({ children, className }: PropsWithChildren<Props>) {
  return (
    <div className={classNames("flex pt-1 pb-1 gap-2 items-center", className)}>
      {children}
    </div>
  );
}
