import { Component, createElement } from "react";
import * as classNames from "classnames";

import { MendixButton } from "./MendixButton";

export interface PageButtonProps {
    maxPageSize: number;
    offSet: number;
    onClickAction: (offSet: number) => void;
    showPageButton?: boolean;
}

export interface PageButtonState {
    currentOffSet: number;
    isVisible?: boolean;
    statusMessage: string;
}

export class PageButton extends Component<PageButtonProps, PageButtonState> {
    constructor(props: PageButtonProps) {
        super(props);

        this.state = {
            currentOffSet: 1,
            isVisible: this.props.showPageButton,
            statusMessage: ""
        };
        this.firstPageClickAction = this.firstPageClickAction.bind(this);
        this.lastPageClickAction = this.lastPageClickAction.bind(this);
        this.nextPageClickAction = this.nextPageClickAction.bind(this);
        this.previousPageClickAction = this.previousPageClickAction.bind(this);
        this.callOnClickAction = this.callOnClickAction.bind(this);
        this.setMessageStatus = this.setMessageStatus.bind(this);
    }

    render() {
        return createElement("div", {
                className: classNames("page-button",
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

    componentDidMount() {
        this.setMessageStatus(this.state.currentOffSet, this.props.offSet, this.props.maxPageSize);
    }

    componentWillReceiveProps(nextProps: PageButtonProps) {
        this.setMessageStatus(this.state.currentOffSet, nextProps.offSet, nextProps.maxPageSize);
    }

    componentDidUpdate(_prevProps: PageButtonProps, _prevState: PageButtonState) {
        this.callOnClickAction();
    }

    private firstPageClickAction() {
        const { maxPageSize, offSet } = this.props;
        const currentOffSet = 1;

        this.setState({ currentOffSet });
        this.setMessageStatus(currentOffSet, offSet, maxPageSize);
    }

    private nextPageClickAction() {
        const { maxPageSize, offSet } = this.props;
        const currentOffSet = this.state.currentOffSet + offSet;

        if (currentOffSet < maxPageSize) {
            this.setState({ currentOffSet });
            this.setMessageStatus(currentOffSet, offSet, maxPageSize);
        }
    }

    private previousPageClickAction() {
        const currentOffSet = this.state.currentOffSet - this.props.offSet;
        const { offSet, maxPageSize } = this.props;

        if (currentOffSet > 0) {
            this.setState({ currentOffSet });
            this.setMessageStatus(currentOffSet, offSet, maxPageSize);
        }
    }

    private lastPageClickAction() {
        const currentOffSet = this.props.maxPageSize - this.props.offSet;
        const { offSet, maxPageSize } = this.props;

        if (currentOffSet > 0) {
            this.setState({ currentOffSet });
            this.setMessageStatus(currentOffSet, offSet, maxPageSize);
        }
    }

    private setMessageStatus(currentOffSet: number, offSet: number, maxPageSize: number) {
        const statusMessage = window.mx.ui.translate(
            "mxui.lib.MxDataSource",
            "status",
            [ currentOffSet, currentOffSet - 1 + offSet, maxPageSize ]);
        this.setState({ statusMessage });
    }

    private callOnClickAction() {
        this.props.onClickAction(this.state.currentOffSet);
    }
}
