import { SFC, createElement } from "react";
import * as classNames from "classnames";

import { ButtonType, IconType } from "../utils/ContainerUtils";

export interface PageButtonProps {
    buttonType?: ButtonType;
    showIcon?: IconType;
    onClickAction?: () => void;
    isDisabled?: boolean;
    message?: string;
}

export const PageButton: SFC<PageButtonProps> = (props) => {
    let iconClass = "";
    let cssClass = "";
    const disabledClass = { disabled: props.isDisabled };
    const onClick = !props.isDisabled ? props.onClickAction : () => { return; };

    if (props.buttonType === "firstButton") {
        cssClass = "btn mx-button mx-name-paging-first";
        iconClass = "glyphicon glyphicon-step-backward";
    }

    if (props.buttonType === "previousButton") {
        cssClass = "btn mx-button mx-name-paging-previous";
        iconClass = "glyphicon glyphicon-backward";
    }

    if (props.buttonType === "nextButton") {
        cssClass = "btn mx-button mx-name-paging-next";
        iconClass = "glyphicon glyphicon-forward";
    }

    if (props.buttonType === "lastButton") {
        cssClass = "btn mx-button mx-name-paging-last";
        iconClass = "glyphicon glyphicon-step-forward";
    }

    if (props.showIcon === "default") {
        return createElement("button", {
                className: classNames(cssClass, disabledClass),
                onClick
            },
            createElement("span", { className: iconClass })
        );
    }

    if (props.buttonType === "firstButton" || props.buttonType === "previousButton") {
        return createElement("span", {
                className: classNames(disabledClass),
                onClick
            },
            createElement("button", { className: classNames(cssClass, disabledClass) },
                createElement("span", { className: iconClass })
            ),
            createElement("span", { className: "button-text" },
                props.message
            )
        );
    }

    return createElement("span", {
            className: classNames(disabledClass),
            onClick
        },
        createElement("span", { className: "button-text" }, props.message),
        createElement("button", { className: classNames(cssClass, disabledClass) },
            createElement("span", {})
        )
    );

};

PageButton.displayName = "PageButton";
