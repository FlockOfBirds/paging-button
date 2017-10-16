import { SFC, createElement } from "react";
import * as classNames from "classnames";

export interface BreakViewProps {
    className?: string;
}

export const BreakView: SFC<BreakViewProps> = (props) => {
    return createElement("li", { className: classNames(props.className) },
        "..."
    );
};

BreakView.displayName = "BreakView";
