import { Component, createElement } from "react";
import * as classNames from "classnames";

import { ButtonType } from "../utils/ContainerUtils";

interface MendixButtonProps {
    buttonType: ButtonType;
    className?: string;
    glyphIcon: string;
    onClickAction: () => void;
    isDisabled: boolean;
}

export class MendixButton extends Component<MendixButtonProps, {}> {
    render() {
        return createElement("button", {
            className: classNames(`btn mx-button mx-name-paging-${this.props.buttonType}`, this.props.className,
                {
                    disabled: this.props.isDisabled
                }
            ),
            onClick: this.props.onClickAction
        },
            createElement("span", {
                className: `glyphicon glyphicon-${this.props.glyphIcon}`
            })
        );
    }
}
