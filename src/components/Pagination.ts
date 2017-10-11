import { Component, ReactElement, createElement } from "react";
import * as classNames from "classnames";
// import ReactPaginate from "react-paginate";

import { PageButton, PageButtonProps } from "./PageButton";
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
    pageCount: number;
}

export class Pagination extends Component<PaginationProps, PaginationState> {
    constructor(props: PaginationProps) {
        super(props);

        this.state = {
            currentOffset: 0,
            isVisible: !this.props.hideUnusedPaging,
            nextIsDisabled: false,
            pageCount: 0,
            previousIsDisabled: true,
            statusMessage: ""

        };

        this.firstPageClickAction = this.firstPageClickAction.bind(this);
        this.lastPageClickAction = this.lastPageClickAction.bind(this);
        this.nextPageClickAction = this.nextPageClickAction.bind(this);
        this.previousPageClickAction = this.previousPageClickAction.bind(this);
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
            pageCount: Math.ceil(maxPageSize / offset),
            statusMessage: this.setMessageStatus(this.state.currentOffset, offset, maxPageSize)
        });

        if (maxPageSize === 0 || offset >= maxPageSize) {
            this.setState({ nextIsDisabled: true });
        }
    }

    componentWillReceiveProps(nextProps: PaginationProps) {
        this.setState({
            statusMessage: this.setMessageStatus(this.state.currentOffset, nextProps.offset, nextProps.maxPageSize)
        });
    }

    private renderDefault(): Array<ReactElement<{}>> {
        return [
            this.createFirstButton(),
            this.createPreviousButton(),
            this.createMessage(),
            this.createNextButton(),
            this.createLastButton()
        ];
    }

    private renderCustom() {
        return this.props.items.map(option => {
            const buttonProps = {
                buttonType: option.item,
                message: option.text,
                showIcon: option.showIcon
            };

            if (buttonProps.buttonType === "firstButton") {
                return this.createFirstButton(buttonProps);
            }

            if (buttonProps.buttonType === "nextButton") {
               return this.createNextButton(buttonProps);
            }

            if (buttonProps.buttonType === "previousButton") {
                return this.createPreviousButton(buttonProps);
            }

            if (buttonProps.buttonType === "lastButton") {
                return this.createLastButton(buttonProps);
            }

            if (buttonProps.buttonType === "text" && !option.showIcon) {
                return this.createMessage();
            }
            //
            // if (buttonProps.buttonType === "more") {
            //     return createElement(ReactPaginate, {
            //         breakLabel: createElement("a", {}, "..."),
            //         marginPagesDisplayed: 5,
            //         pageCount: this.props.maxPageSize,
            //         pageRangeDisplayed: 5
            //     });
            // }
        });
    }

    private createFirstButton(buttonProps?: PageButtonProps) {
        return createElement(PageButton, {
            ...buttonProps,
            buttonType: "firstButton",
            isDisabled: this.state.previousIsDisabled,
            onClickAction: this.firstPageClickAction
        });
    }

    private createPreviousButton(buttonProps?: PageButtonProps) {
        return createElement(PageButton, {
            ...buttonProps,
            buttonType: "previousButton",
            isDisabled: this.state.previousIsDisabled,
            onClickAction: this.previousPageClickAction
        });
    }

    private createNextButton(buttonProps?: PageButtonProps) {
        return createElement(PageButton, {
            ...buttonProps,
            buttonType: "nextButton",
            isDisabled: this.state.nextIsDisabled,
            onClickAction: this.nextPageClickAction
        });
    }

    private createLastButton(buttonProps?: PageButtonProps) {
        return createElement(PageButton, {
            ...buttonProps,
            buttonType: "lastButton",
            isDisabled: this.state.nextIsDisabled,
            onClickAction: this.lastPageClickAction
        });
    }

    private createMessage() {
        return createElement("span", { className: "paging-status" }, this.state.statusMessage);
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

        // this.setState({
        //     currentOffset,
        //     nextIsDisabled: currentOffset > 0,
        //     previousIsDisabled: currentOffset === 0,
        //     statusMessage: this.setMessageStatus(currentOffset, offset, maxPageSize)
        // });
        if (currentOffset > 0) {
            this.setState({
                currentOffset,
                nextIsDisabled: false,
                statusMessage: this.props.setMessageStatus(currentOffset, offset, maxPageSize)
            });
        } else if (currentOffset === 0) {
            this.setState({
                currentOffset,
                previousIsDisabled: true,
                statusMessage: this.props.setMessageStatus(currentOffset, offset, maxPageSize)
            });
        }
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
        let fromValue = currentOffset + 1;
        let toValue = 0;

        if (maxPageSize === 0) {
            fromValue = 0;
        } else if (maxPageSize < offset || (currentOffset + offset) > maxPageSize) {
            toValue = maxPageSize;
        } else {
            toValue = currentOffset + offset;
        }

        if (this.props.caption) {
            return this.props.caption
                .replace("{firstItem}", fromValue.toString())
                .replace("{lastItem}", toValue.toString())
                .replace("{totalItems}", maxPageSize.toString());
        }

        return this.props.setMessageStatus(fromValue, toValue, maxPageSize);
    }
}
