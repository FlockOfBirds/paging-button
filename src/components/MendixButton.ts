import { SFC, createElement } from "react";
import * as classNames from "classnames";

import { ButtonType } from "../utils/ContainerUtils";

interface MendixButtonProps {
    buttonType: ButtonType;
    className?: string;
    glyphIcon: string;
    onClickAction: () => void;
}

export const MendixButton: SFC<MendixButtonProps> = (props) =>
    createElement("button", {
            className: classNames(`btn mx-button mx-name-paging-${props.buttonType}`, props.className),
            onClick: props.onClickAction
        },
        createElement("span", {
            className: `glyphicon glyphicon-${props.glyphIcon}`
        })
    );

MendixButton.displayName = "MendixButton";
