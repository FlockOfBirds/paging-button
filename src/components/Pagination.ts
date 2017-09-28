import { Component, createElement } from "react";
import * as classNames from "classnames";

import { MendixButton } from "./MendixButton";

export interface PaginationProps {
    hideUnusedPaging: boolean;
    maxPageSize: number;
    offset: number;
    onClickAction: (offset: number) => void;
    setMessageStatus: (currentOffset: number, offset: number, maxPageSize: number) => string;
}

interface PaginationState {
    currentOffset: number;
    isVisible?: boolean;
    statusMessage: string;
    previousIsDisabled: boolean;
    nextIsDisabled: boolean;
}

export class Pagination extends Component<PaginationProps, PaginationState> {
    constructor(props: PaginationProps) {
        super(props);

        this.state = {
            currentOffset: 0,
            isVisible: !this.props.hideUnusedPaging,
            nextIsDisabled: false,
            previousIsDisabled: true,
            statusMessage: ""

        };

        this.firstPageClickAction = this.firstPageClickAction.bind(this);
        this.lastPageClickAction = this.lastPageClickAction.bind(this);
        this.nextPageClickAction = this.nextPageClickAction.bind(this);
        this.previousPageClickAction = this.previousPageClickAction.bind(this);
    }

    render() {
        return createElement("div",
            { className: classNames("pagination", `${this.state.isVisible ? "visible" : "hidden"}`) },
            this.createFirstButton(),
            this.createPreviousButton(),
            createElement("span", { className: "paging-status" }, this.state.statusMessage),
            this.createNextButton(),
            this.createLastButton()
        );
    }

    componentDidMount() {
        const { maxPageSize, offset } = this.props;

        this.setState({
            statusMessage: this.props.setMessageStatus(this.state.currentOffset, offset, maxPageSize)
        });

        if (maxPageSize === 0 || offset >= maxPageSize) {
            this.setState({ nextIsDisabled: true });
        }
    }

    componentWillReceiveProps(nextProps: PaginationProps) {
        this.setState({
            statusMessage: this.props.setMessageStatus(this.state.currentOffset, nextProps.offset, nextProps.maxPageSize)
        });
    }

    private createLastButton() {
        return createElement(MendixButton, {
            buttonType: "last",
            glyphIcon: "step-forward",
            isDisabled: this.state.nextIsDisabled,
            onClickAction: this.lastPageClickAction
        });
    }

    private createNextButton() {
        return createElement(MendixButton, {
            buttonType: "next",
            glyphIcon: "forward",
            isDisabled: this.state.nextIsDisabled,
            onClickAction: this.nextPageClickAction
        });
    }

    private createPreviousButton() {
        return createElement(MendixButton, {
            buttonType: "previous",
            glyphIcon: "backward",
            isDisabled: this.state.previousIsDisabled,
            onClickAction: this.previousPageClickAction
        });
    }

    private createFirstButton() {
        return createElement(MendixButton, {
            buttonType: "first",
            glyphIcon: "step-backward",
            isDisabled: this.state.previousIsDisabled,
            onClickAction: this.firstPageClickAction
        });
    }

    private firstPageClickAction() {
        const currentOffset = 0;

        this.setState({
            currentOffset,
            nextIsDisabled: false,
            previousIsDisabled: true,
            statusMessage: this.props.setMessageStatus(currentOffset, this.props.offset, this.props.maxPageSize)
        });
        this.props.onClickAction(currentOffset);
    }

    private nextPageClickAction() {
        const { maxPageSize, offset } = this.props;
        const currentOffset = this.state.currentOffset + offset;

        this.setState({
            currentOffset,
            nextIsDisabled: (maxPageSize - currentOffset) <= offset,
            previousIsDisabled: currentOffset > maxPageSize,
            statusMessage: this.props.setMessageStatus(currentOffset, offset, maxPageSize)
        });
        this.props.onClickAction(currentOffset);
    }

    private previousPageClickAction() {
        const currentOffset = this.state.currentOffset - this.props.offset;
        const { offset, maxPageSize } = this.props;

        this.setState({
            currentOffset,
            nextIsDisabled: currentOffset > 0,
            previousIsDisabled: currentOffset === 0,
            statusMessage: this.props.setMessageStatus(currentOffset, offset, maxPageSize)
        });
        this.props.onClickAction(currentOffset);
    }

    private lastPageClickAction() {
        const { offset, maxPageSize } = this.props;
        const currentOffset = (maxPageSize % offset) === 0
            ? maxPageSize - offset
            : maxPageSize - (maxPageSize % offset);

        if (currentOffset > 0) {
            this.setState({
                currentOffset,
                nextIsDisabled: true,
                previousIsDisabled: false,
                statusMessage: this.props.setMessageStatus(currentOffset, offset, maxPageSize)
            });
        }
        this.props.onClickAction(currentOffset);
    }
}
