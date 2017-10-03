import { Component, createElement } from "react";
import * as classNames from "classnames";

// export type ButtonType = "firstButton" | "nextButton" | "previousButton" | "lastButton";

export interface PageButtonProps {
    cssClass?: string;
    displayOption?: string;
    iconClass?: string;
    onClickAction: () => void;
    isDisabled: boolean;
    text?: string;
}

export class PageButton extends Component<PageButtonProps, {}> {
    private css = (props: PageButtonProps) => classNames(props.cssClass, { disabled: props.isDisabled });

    render() {
        if (this.props.displayOption === "icon") {
            return createElement("button", {
                    className: this.css(this.props),
                    onClick: this.props.onClickAction
                },
                createElement("span", {
                    className: this.props.iconClass
                })
            );
        }

        if (this.props.displayOption === "text") {
            return createElement("label", {
                    className: this.css(this.props),
                    onClick: this.props.onClickAction
                },
                this.props.text
            );
        }

        return createElement("button", {
                className: this.css(this.props),
                onClick: this.props.onClickAction
            },
            createElement("span", {
                className: this.props.iconClass
            }),
            createElement("label", {},
                this.props.text
            )
        );
    }
}
