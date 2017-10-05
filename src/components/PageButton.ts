import { SFC, createElement } from "react";
import * as classNames from "classnames";

export interface PageButtonProps {
    cssClass?: string;
    displayOption?: string;
    iconClass?: string;
    onClickAction: () => void;
    isDisabled: boolean;
    text?: string;
}

const cssClassNames = (props: PageButtonProps) => classNames(props.cssClass, { disabled: props.isDisabled });

export const PageButton: SFC<PageButtonProps> = (props) => {
    if (props.displayOption === "icon") {
        return createElement("button", {
                className: cssClassNames(props),
                onClick: props.onClickAction
            },
            createElement("span", {
                className: props.iconClass
            })
        );
    }

    if (props.displayOption === "text") {
        return createElement("label", {
                className: cssClassNames(props),
                onClick: props.onClickAction
            },
            props.text
        );
    }

    return createElement("button", {
            className: cssClassNames(props),
            onClick: props.onClickAction
        },
        createElement("span", {
            className: props.iconClass
        }),
        createElement("label", {},
            props.text
        )
    );
};

PageButton.displayName = "PageButton";
