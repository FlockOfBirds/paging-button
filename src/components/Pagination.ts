import { Component, ReactElement, createElement } from "react";
import * as classNames from "classnames";

import { PageButton } from "./PageButton";
import { ItemType, PageStyleType } from "../utils/ContainerUtils";

export interface PaginationProps {
    caption: string;
    hideUnusedPaging: boolean;
    items: ItemType;
    maxPageSize: number;
    offset: number;
    onClickAction: (offset: number) => void;
    pagingStyle: PageStyleType;
    setMessageStatus: (currentOffset: number, offset: number, maxPageSize: number) => string;
}

interface PaginationState {
    currentOffset: number;
    isVisible?: boolean;
    statusMessage: string;
    previousIsDisabled: boolean;
    nextIsDisabled: boolean;
}

interface ButtonProps {
    cssClass?: string;
    displayOption?: string;
    iconClass?: string;
    text?: string;
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
        this.createFirstButton = this.createFirstButton.bind(this);
        this.createNextButton = this.createNextButton.bind(this);
        this.createPreviousButton = this.createPreviousButton.bind(this);
        this.createLastButton = this.createLastButton.bind(this);
        this.createPageButton = this.createPageButton.bind(this);
        this.setMessageStatus = this.setMessageStatus.bind(this);
    }

    render() {
        return createElement("div",
            { className: classNames("pagination", `${this.state.isVisible ? "visible" : "hidden"}`) },
            this.props.pagingStyle === "default" ? this.renderDefault() : this.renderCustom()
        );
    }

    componentDidMount() {
        const { maxPageSize, offset } = this.props;

        this.setState({
            statusMessage: this.setMessageStatus(this.state.currentOffset, offset, maxPageSize)
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

    private renderDefault(): Array<ReactElement<{}>> {
        return [
            this.createFirstButton(),
            this.createPreviousButton(),
            createElement("span", { className: "paging-status" }, this.state.statusMessage),
            this.createNextButton(),
            this.createLastButton()
        ];
    }

    private renderCustom() {
        return this.props.items.map(option => {
            const buttonProps = {
                cssClass: option.cssClass,
                displayOption: option.displayOption,
                iconClass: option.iconClass,
                text: option.text
            };

            if (option.item === "firstButton") {
                return this.createFirstButton(buttonProps);
            }

            if (option.item === "nextButton") {
                return this.createNextButton(buttonProps);
            }

            if (option.item === "previousButton") {
                return this.createPreviousButton(buttonProps);
            }

            if (option.item === "lastButton") {
                return this.createLastButton(buttonProps);
            }

            if (option.item === "text") {
                return createElement("span", { className: option.cssClass }, this.state.statusMessage);
            }
        });
    }

    private createFirstButton(buttonProps?: ButtonProps) {
        if (!buttonProps) {
            buttonProps = {
                cssClass: "btn mx-button mx-name-paging-first",
                iconClass: "glyphicon glyphicon-step-backward"
            };
            return this.createPageButton(this.state.previousIsDisabled, this.firstPageClickAction, buttonProps);
        }

        return this.createPageButton(this.state.previousIsDisabled, this.firstPageClickAction, buttonProps);
    }

    private createNextButton(buttonProps?: ButtonProps) {
        if (!buttonProps) {
            buttonProps = {
                cssClass: "btn mx-button mx-name-paging-next",
                iconClass: "glyphicon glyphicon-forward"
            };
            return this.createPageButton(this.state.nextIsDisabled, this.nextPageClickAction, buttonProps);
        }

        return this.createPageButton(this.state.nextIsDisabled, this.nextPageClickAction, buttonProps);
    }

    private createLastButton(buttonProps?: ButtonProps) {
        if (!buttonProps) {
            buttonProps = {
                cssClass: "btn mx-button mx-name-paging-last",
                iconClass: "glyphicon glyphicon-step-forward"
            };
            return this.createPageButton(this.state.nextIsDisabled, this.lastPageClickAction, buttonProps);
        }

        return this.createPageButton(this.state.nextIsDisabled, this.lastPageClickAction, buttonProps);
    }

    private createPreviousButton(buttonProps?: ButtonProps) {
        if (!buttonProps) {
            buttonProps = {
                cssClass: "btn mx-button mx-name-paging-previous",
                iconClass: "glyphicon glyphicon-backward"
            };
            return this.createPageButton(this.state.previousIsDisabled, this.previousPageClickAction, buttonProps);
        }

        return this.createPageButton(this.state.previousIsDisabled, this.previousPageClickAction, buttonProps);
    }

    private createPageButton(isDisabled: boolean, onClickAction: () => void, buttonProps?: ButtonProps) {
        return createElement(PageButton, {
            ...buttonProps,
            isDisabled,
            onClickAction
        });
    }

    private firstPageClickAction() {
        const currentOffset = 0;

        this.setState({
            currentOffset,
            nextIsDisabled: false,
            previousIsDisabled: true,
            statusMessage: this.setMessageStatus(currentOffset, this.props.offset, this.props.maxPageSize)
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
            statusMessage: this.setMessageStatus(currentOffset, offset, maxPageSize)
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
            statusMessage: this.setMessageStatus(currentOffset, offset, maxPageSize)
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
                statusMessage: this.setMessageStatus(currentOffset, offset, maxPageSize)
            });
        }

        this.props.onClickAction(currentOffset);
    }

    private setMessageStatus(currentOffset: number, offset: number, maxPageSize: number): string {
        if (this.props.caption) {
            return this.props.caption
                .replace("{firstItem}", currentOffset.toString())
                .replace("{lastItem}", offset.toString())
                .replace("{totalItems}", maxPageSize.toString());
        }

        return this.props.setMessageStatus(currentOffset, offset, maxPageSize);
    }
}
