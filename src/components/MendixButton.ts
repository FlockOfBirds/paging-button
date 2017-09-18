import {SFC, createElement} from "react";
import * as classNames from "classnames";

export type ButtonType = "first" | "next" | "previous" | "last"

export interface PageButtonProps {
    buttonType: ButtonType;
    className?: string;
    glyphIcon: string;
    onClickAction: () => void;
}

export const MendixButton: SFC<PageButtonProps> = (props) =>
    createElement("button", {
            className: classNames(`btn mx-button mx-name-paging-${props.buttonType}`, props.className),
            onClick: props.onClickAction,
        },
        createElement("span", {
            className: `glyphicon glyphicon-step-${props.glyphIcon}`,
        })
    )

MendixButton.displayName = "MendixButton";
