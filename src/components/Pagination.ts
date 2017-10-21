import { Component, ReactElement, createElement } from "react";
import * as classNames from "classnames";

import { PageButton, PageButtonProps } from "./PageButton";
import { ItemType, PageStyleType } from "../utils/ContainerUtils";
import { PageNumberView } from "./PageNumberView";
import { BreakView } from "./BreakView";

export interface PaginationProps {
    hideUnusedPaging: boolean;
    items: ItemType;
    listViewSize: number;
    maxPageButtons: number;
    offset: number;
    onClickAction: (offset: number) => void;
    getMessageStatus: (currentOffset: number, offset: number, maxPageSize: number) => string;
    pagingStyle: PageStyleType;
}

export interface PaginationState {
    currentOffset: number;
    isVisible?: boolean;
    previousIsDisabled: boolean;
    nextIsDisabled: boolean;
    pageCount: number;
    selectedPageNumber: number;
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
            selectedPageNumber: 1

        };

        this.firstPageClickAction = this.firstPageClickAction.bind(this);
        this.lastPageClickAction = this.lastPageClickAction.bind(this);
        this.nextPageClickAction = this.nextPageClickAction.bind(this);
        this.previousPageClickAction = this.previousPageClickAction.bind(this);
        this.getMessageStatus = this.getMessageStatus.bind(this);
        this.createPageNumberViews = this.createPageNumberViews.bind(this);
        this.handleSelectedPage = this.handleSelectedPage.bind(this);
    }

    render() {
        return createElement("div",
            { className: classNames("pagination", `${this.state.isVisible ? "visible" : "hidden"}`) },
            this.props.pagingStyle === "default" ? this.renderDefault() : this.renderCustom()
        );
    }

    componentDidMount() {
        const { listViewSize, offset } = this.props;

        this.setState({
            pageCount: Math.ceil(listViewSize / offset)
        });

        if (listViewSize === 0 || offset >= listViewSize) {
            this.setState({ nextIsDisabled: true });
        }
    }

    componentWillReceiveProps(_nextProps: PaginationProps) {
        this.setState({
            currentOffset: 0,
            selectedPageNumber: 1
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

            if (buttonProps.buttonType === "text" && option.showIcon === "none") {
                return this.createMessage(buttonProps.message);
            }

            if (buttonProps.buttonType === "pageNumberButtons") {
                return createElement("ul", {}, this.createPageNumberViews());
            }
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

    private createMessage(message?: string) {
        message = this.getMessageStatus(message);

        return createElement("span", { className: "paging-status" }, message);
    }

    private firstPageClickAction() {
        const currentOffset = 0;

        this.setState({
            currentOffset,
            nextIsDisabled: false,
            previousIsDisabled: true,
            selectedPageNumber: currentOffset + 1
        });

        this.props.onClickAction(currentOffset);
    }

    private nextPageClickAction() {
        const { listViewSize, offset } = this.props;
        const currentOffset = this.state.currentOffset + offset;

        this.setState({
            currentOffset,
            nextIsDisabled: (listViewSize - currentOffset) <= offset,
            previousIsDisabled: currentOffset > listViewSize,
            selectedPageNumber: this.state.selectedPageNumber + 1
        });

        this.props.onClickAction(currentOffset);
    }

    private previousPageClickAction() {
        const currentOffset = this.state.currentOffset - this.props.offset;

        if (currentOffset > 0) {
            this.setState({
                currentOffset,
                nextIsDisabled: false,
                selectedPageNumber: this.state.selectedPageNumber - 1
            });
        } else if (currentOffset <= 0) {
            this.setState({
                currentOffset,
                previousIsDisabled: true,
                selectedPageNumber: currentOffset + 1
            });
        }
        this.props.onClickAction(currentOffset);
    }

    private lastPageClickAction() {
        const { offset, listViewSize } = this.props;
        const currentOffset = (listViewSize % offset) === 0
            ? listViewSize - offset
            : listViewSize - (listViewSize % offset);

        if (currentOffset > 0) {
            this.setState({
                currentOffset,
                nextIsDisabled: true,
                previousIsDisabled: false,
                selectedPageNumber: Math.ceil(this.props.listViewSize / offset)
            });
        }

        this.props.onClickAction(currentOffset);
    }

    private createPageNumberViews(): Array<ReactElement<any>> {
        const pageItems: Array<ReactElement<any>> = [];
        const margin = 1;
        let leftSide;
        let rightSide;
        const maxPageButtons = this.props.maxPageButtons;
        let breakViewAdded = false;
        const divider = Math.ceil(maxPageButtons / 2);

        const pageCount = this.props.offset && this.props.offset !== 0
            ? Math.ceil(this.props.listViewSize / this.props.offset)
            : this.props.listViewSize;

        if (pageCount <= maxPageButtons) {
            for (let pageIndex = 1; pageIndex <= pageCount; pageIndex++) {
                pageItems.push(this.getPageNumberView(pageIndex));
            }
        } else {
            leftSide = divider;
            rightSide = (maxPageButtons - leftSide);

            if (this.state.selectedPageNumber > pageCount - divider) {
                rightSide = pageCount - this.state.selectedPageNumber;
                leftSide = maxPageButtons - rightSide;
            } else if (this.state.selectedPageNumber < divider) {
                leftSide = this.state.selectedPageNumber;
                rightSide = maxPageButtons - leftSide;
            }

            for (let page = 1; page <= pageCount; page++) {
                if (page <= margin) {
                    pageItems.push(this.getPageNumberView(page));
                    continue;
                }

                if (page === pageCount) {
                    pageItems.push(this.getPageNumberView(page));
                    continue;
                }

                if ((page > this.state.selectedPageNumber - leftSide) && (page < this.state.selectedPageNumber + rightSide)) {
                    if (this.state.selectedPageNumber + rightSide >= pageCount) {
                        pageItems.push(this.getPageNumberView(page));
                        continue;
                    }
                    if (breakViewAdded) {
                        breakViewAdded = false;
                    }else {
                        pageItems.push(this.getPageNumberView(page));
                    }
                    continue;
                }

                if (page === 2) {
                    pageItems.push(createElement(BreakView, {}));
                    breakViewAdded = true;
                    continue;
                }

                if (this.state.selectedPageNumber <= leftSide && page === maxPageButtons) {
                    pageItems.push(this.getPageNumberView(page));
                    continue;
                }

                if (page === pageCount - 1) {
                    pageItems.push(createElement(BreakView, {}));
                }
            }
        }

        return pageItems;
    }

    private getPageNumberView(pageNumber: number) {
        return createElement(PageNumberView, {
            key: `key${pageNumber}`,
            onClick: () => this.handleSelectedPage(pageNumber),
            page: pageNumber,
            selected: this.state.selectedPageNumber === pageNumber
        });
    }

    private handleSelectedPage(selectedPageNumber: number) {
        const currentOffset = (selectedPageNumber - 1) * this.props.offset;

        if (this.state.selectedPageNumber === selectedPageNumber) {
            return;
        }

        this.setState({
            currentOffset,
            nextIsDisabled: (currentOffset + this.props.offset) === this.props.listViewSize,
            previousIsDisabled: currentOffset === 0,
            selectedPageNumber
        });

        this.props.onClickAction(currentOffset);
    }

    private getMessageStatus(message?: string): string {
        const currentOffset = this.state.currentOffset;
        const { listViewSize, offset } = this.props;
        let fromValue = currentOffset + 1;
        let toValue = 0;

        if (listViewSize === 0) {
            fromValue = 0;
        } else if (listViewSize < offset || (currentOffset + offset) > listViewSize) {
            toValue = listViewSize;
        } else {
            toValue = currentOffset + offset;
        }

        if (message) {
            return message
                .replace("{firstItem}", fromValue.toString())
                .replace("{lastItem}", toValue.toString())
                .replace("{totalItems}", listViewSize.toString())
                .replace("{currentPageNumber}", this.state.selectedPageNumber.toString())
                .replace("{totalPages}",
                    (
                        offset && offset !== 0
                            ? Math.ceil(listViewSize / offset)
                            : listViewSize
                    ).toString());
        }

        return this.props.getMessageStatus(fromValue, toValue, listViewSize);
    }
}
