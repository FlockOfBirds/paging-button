import { Component, createElement } from "react";
import * as classNames from "classnames";

import { MendixButton } from "./MendixButton";
import { ButtonType } from "../utils/ContainerUtils";

export interface PageButtonProps {
    onClickAction: (buttonClicked: string) => void;
    hidePageButton?: boolean;
    statusMessage: string;
}

export interface PageButtonState {
    buttonClicked?: ButtonType;
    isVisible?: boolean;
    statusMessage: string;
}

export class PageButton extends Component<PageButtonProps, PageButtonState> {
    constructor(props: PageButtonProps) {
        super(props);

        this.state = {
            buttonClicked: "first",
            isVisible: this.props.hidePageButton,
            statusMessage: this.props.statusMessage
        };
        this.firstPageClickAction = this.firstPageClickAction.bind(this);
        this.lastPageClickAction = this.lastPageClickAction.bind(this);
        this.nextPageClickAction = this.nextPageClickAction.bind(this);
        this.previousPageClickAction = this.previousPageClickAction.bind(this);
        this.callOnClickAction = this.callOnClickAction.bind(this);
    }

    render() {
        return createElement("div", {
                className:  classNames("page-button",
                    `visible: ${this.state.isVisible ? "visible" : "hidden"}`
                )
            },
            createElement(MendixButton, {
                buttonType: "first",
                glyphIcon: "backward",
                onClickAction: this.firstPageClickAction
            }),
            createElement(MendixButton, {
                buttonType: "previous",
                glyphIcon: "backward",
                onClickAction: this.previousPageClickAction
            }),
            createElement("span", { className: "paging-status" },
                this.state.statusMessage
            ),
            createElement(MendixButton, {
                buttonType: "next",
                glyphIcon: "forward",
                onClickAction: this.nextPageClickAction
            }),
            createElement(MendixButton, {
                buttonType: "last",
                glyphIcon: "forward",
                onClickAction: this.lastPageClickAction
            })
        );
    }

    componentWillReceiveProps(nextProps: PageButtonProps) {
        this.setState({ statusMessage: nextProps.statusMessage });
    }

    componentDidUpdate(_prevProps: PageButtonProps, _prevState: PageButtonState) {
        this.callOnClickAction();
    }

    private firstPageClickAction() {
        this.setState({ buttonClicked: "first" });
    }

    private nextPageClickAction() {
        this.setState({ buttonClicked: "next" });
    }

    private previousPageClickAction() {
        this.setState({ buttonClicked: "previous" });
    }

    private lastPageClickAction() {
        this.setState({ buttonClicked: "last" });
    }

    private callOnClickAction() {
        if (this.state.buttonClicked) {
            this.props.onClickAction(this.state.buttonClicked);
        }
    }
}
