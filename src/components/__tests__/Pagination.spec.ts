import { shallow } from "enzyme";
import { createElement } from "react";

import { Pagination, PaginationProps } from "../Pagination";
import { PageButton, PageButtonProps } from "../PageButton";
import { IconType } from "../../utils/ContainerUtils";
import { PageNumberView } from "../PageNumberView";
import { BreakView } from "../BreakView";

describe("Pagination", () => {

    describe("when default", () => {

        it("renders the structure", () => {
            const pagination = shallowRenderPagination(defaultProps);

            expect(pagination).toBeElement(
                createElement("div", { className: "pagination visible" },
                    getDefaultPageButtons(defaultPageButtonProps)
                )
            );
        });

        it("is not visible when hide un-used property is set", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                hideUnusedPaging: true
            };

            const pagination = shallowRenderPagination(paginationProps);

            expect(pagination).toBeElement(
                createElement("div", { className: "pagination hidden" },
                    getDefaultPageButtons(defaultPageButtonProps)
                )
            );
        });

        it("renders the structure as disabled when list view is empty", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                listViewSize: 0
            };

            const pagination = shallowRenderPagination(paginationProps);
            const paginationInstance = pagination.instance() as Pagination;
            paginationInstance.componentDidMount();

            expect(pagination).toBeElement(
                createElement("div", { className: "pagination visible" },
                    getDefaultPageButtons(defaultPageButtonProps)
                )
            );
        });
    });

    describe("when custom", () => {

        it("renders the entire structure when the page count is less then maximum number of buttons ", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                pagingStyle: "custom"
            };
            const pageButtonProps = {
                ...defaultPageButtonProps,
                isDisabled: true,
                message: "",
                showIcon: "default" as IconType
            };

            const pagination = shallowRenderPagination(paginationProps);

            expect(pagination).toBeElement(
                createElement("div", { className: "pagination visible" },
                    getCustomPageButtons(pageButtonProps, defaultItemProps)
                )
            );
        });

        it("renders with custom message status", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                pagingStyle: "custom"
            };
            const pageButtonProps = {
                ...defaultPageButtonProps,
                isDisabled: true,
                showIcon: "default" as IconType
            };

            const pagination = shallowRenderPagination(paginationProps);

            expect(pagination).toBeElement(
                createElement("div", { className: "pagination visible" },
                    getCustomPageButtons(pageButtonProps, defaultItemProps)
                )
            );
        });

        it("renders the structure with one break view when selected item is less than max page buttons", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                listViewSize: 32,
                maxPageButtons: 7,
                pagingStyle: "custom"
            };
            const pageButtonProps = {
                ...defaultPageButtonProps,
                isDisabled: true,
                message: "",
                showIcon: "default" as IconType
            };

            const pagination = shallowRenderPagination(paginationProps);
            const paginationInstance = pagination.instance() as Pagination;
            paginationInstance.componentDidMount();
            const breakViews = pagination.find(BreakView);

            expect(pagination).toBeElement(
                createElement("div", { className: "pagination visible" },
                    getCustomPageButtons(pageButtonProps, defaultItemProps)
                )
            );
            expect(breakViews.length).toBe(1);
        });

        it("renders the structure with two break views when page number is more than max page buttons", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                listViewSize: 20,
                maxPageButtons: 7,
                pagingStyle: "custom"
            };
            const pageButtonProps = {
                ...defaultPageButtonProps,
                isDisabled: true,
                message: "",
                showIcon: "default" as IconType
            };

            const pagination = shallowRenderPagination(paginationProps);
            const paginationInstance = pagination.instance() as Pagination;
            paginationInstance.componentDidMount();
            paginationInstance.setState({ currentOffset: 2, selectedPageNumber: 6 });
            const breakViews = pagination.find(BreakView);

            expect(pagination).toBeElement(
                createElement("div", { className: "pagination visible" },
                    getCustomPageButtons(pageButtonProps, defaultItemProps)
                )
            );
            expect(breakViews.length).toBe(2);
        });

        it("renders the structure with correct custom message when list view is empty", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                listViewSize: 0,
                offset: 0,
                pagingStyle: "custom"
            };
            const pageButtonProps = {
                ...defaultPageButtonProps,
                isDisabled: true,
                showIcon: "default" as IconType
            };

            const pagination = shallowRenderPagination(paginationProps);
            // check if message contains zero
            expect(pagination).toBeElement(
                createElement("div", { className: "pagination visible" },
                    getCustomPageButtons(pageButtonProps, pageButtonProps)
                )
            );
        });
    });

    describe("on navigation", () => {

        it("when first button is clicked set page to 1", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                onClickAction: jasmine.createSpy("onClick")
            };
            const pagination = shallowRenderPagination(paginationProps);
            const paginationInstance = pagination.instance() as Pagination;
            paginationInstance.setState({ selectedPageNumber: 8 });

            const firstPageButton = pagination.find(PageButton).at(0);
            firstPageButton.props().onClickAction();

            expect(paginationProps.onClickAction).toHaveBeenCalled();
            expect(paginationInstance.state.selectedPageNumber).toBe(1);
            expect(paginationInstance.state.nextIsDisabled).toBe(false);
            expect(paginationInstance.state.previousIsDisabled).toBe(true);
            expect(paginationInstance.state.currentOffset).toBe(0);
        });

        it("when previous button is clicked and page is 8, set page to 7", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                onClickAction: jasmine.createSpy("onClick")
            };
            const pagination = shallowRenderPagination(paginationProps);
            const paginationInstance = pagination.instance() as Pagination;
            paginationInstance.setState({ currentOffset: 14, selectedPageNumber: 8 });

            const previousPageButton = pagination.find(PageButton).at(1);
            previousPageButton.props().onClickAction();

            expect(paginationProps.onClickAction).toHaveBeenCalled();
            expect(paginationInstance.state.selectedPageNumber).toBe(7);
            expect(paginationInstance.state.nextIsDisabled).toBe(false);
            expect(paginationInstance.state.previousIsDisabled).toBe(true);
            expect(paginationInstance.state.currentOffset).toBe(12);
        });

        it("when previous button is clicked and page number is at start, disable previous button", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                onClickAction: jasmine.createSpy("onClick")
            };

            const pagination = shallowRenderPagination(paginationProps);
            const paginationInstance = pagination.instance() as Pagination;
            paginationInstance.setState({ currentOffset: 2, selectedPageNumber: 2 });
            const previousPageButton = pagination.find(PageButton).at(1);
            previousPageButton.props().onClickAction();

            expect(paginationProps.onClickAction).toHaveBeenCalled();
            expect(paginationInstance.state.selectedPageNumber).toBe(1);
            expect(paginationInstance.state.nextIsDisabled).toBe(false);
            expect(paginationInstance.state.previousIsDisabled).toBe(true);
            expect(paginationInstance.state.currentOffset).toBe(0);
        });

        it("when next button is clicked and page is 4, set page to 5", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                onClickAction: jasmine.createSpy("onClick")
            };

            const pagination = shallowRenderPagination(paginationProps);
            const paginationInstance = pagination.instance() as Pagination;
            paginationInstance.setState({ currentOffset: 6, selectedPageNumber: 4 });
            const nextPageButton = pagination.find(PageButton).at(2);
            nextPageButton.props().onClickAction();

            expect(paginationProps.onClickAction).toHaveBeenCalled();
            expect(paginationInstance.state.selectedPageNumber).toBe(5);
            expect(paginationInstance.state.nextIsDisabled).toBe(false);
            expect(paginationInstance.state.previousIsDisabled).toBe(false);
            expect(paginationInstance.state.currentOffset).toBe(8);
        });

        it("when last button is clicked set page to page count", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                onClickAction: jasmine.createSpy("onClick")
            };

            const pagination = shallowRenderPagination(paginationProps);
            const paginationInstance = pagination.instance() as Pagination;
            paginationInstance.setState({ currentOffset: 6, selectedPageNumber: 4 });
            const lastPageButton = pagination.find(PageButton).at(3);
            lastPageButton.props().onClickAction();

            expect(paginationProps.onClickAction).toHaveBeenCalled();
            expect(paginationInstance.state.selectedPageNumber).toBe(16);
            expect(paginationInstance.state.nextIsDisabled).toBe(true);
            expect(paginationInstance.state.previousIsDisabled).toBe(false);
            expect(paginationInstance.state.currentOffset).toBe(30);
        });

        it("with non even number of page items, when last button is clicked set page to page count", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                listViewSize: 33,
                onClickAction: jasmine.createSpy("onClick")
            };

            const pagination = shallowRenderPagination(paginationProps);
            const paginationInstance = pagination.instance() as Pagination;
            paginationInstance.setState({ currentOffset: 6, selectedPageNumber: 4 });
            const lastPageButton = pagination.find(PageButton).at(3);
            lastPageButton.props().onClickAction();

            expect(paginationProps.onClickAction).toHaveBeenCalled();
            expect(paginationInstance.state.selectedPageNumber).toBe(17);
            expect(paginationInstance.state.nextIsDisabled).toBe(true);
            expect(paginationInstance.state.previousIsDisabled).toBe(false);
            expect(paginationInstance.state.currentOffset).toBe(32);
        });

        it("when custom page button 6 is clicked, set page to 6", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                onClickAction: jasmine.createSpy("onClick"),
                pagingStyle: "custom"
            };

            const pagination = shallowRenderPagination(paginationProps);
            const paginationInstance = pagination.instance() as Pagination;
            paginationInstance.setState({ currentOffset: 2, selectedPageNumber: 5 });
            const pageNumberButton = pagination.find(PageNumberView).at(5);
            pageNumberButton.simulate("click");

            expect(paginationProps.onClickAction).toHaveBeenCalled();
            expect(paginationInstance.state.selectedPageNumber).toBe(6);
            expect(paginationInstance.state.nextIsDisabled).toBe(false);
            expect(paginationInstance.state.previousIsDisabled).toBe(false);
            expect(paginationInstance.state.currentOffset).toBe(10);
        });

        it("when same custom page button 5 is clicked do nothing", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                onClickAction: jasmine.createSpy("onClick"),
                pagingStyle: "custom"
            };

            const pagination = shallowRenderPagination(paginationProps);
            const paginationInstance = pagination.instance() as Pagination;
            paginationInstance.setState({ currentOffset: 2, selectedPageNumber: 5 });
            const pageNumberButton = pagination.find(PageNumberView).at(4);
            pageNumberButton.simulate("click");

            expect(paginationProps.onClickAction).not.toHaveBeenCalled();
            expect(paginationInstance.state.selectedPageNumber).toBe(5);
        });

        it("when a high custom page button 14 is clicked, set page to 14, remove last break view", () => {
            const paginationProps: PaginationProps = {
                ...defaultProps,
                listViewSize: 32,
                maxPageButtons: 7,
                onClickAction: jasmine.createSpy("onClick"),
                pagingStyle: "custom"
            };

            const pagination = shallowRenderPagination(paginationProps);
            const paginationInstance = pagination.instance() as Pagination;
            paginationInstance.setState({ currentOffset: 6, selectedPageNumber: 13 });
            const pageNumberButton = pagination.find(PageNumberView).at(13);
            pageNumberButton.simulate("click");
            const breakViews = pagination.find(BreakView);

            expect(breakViews.length).toBe(1);
        });
    });

    const shallowRenderPagination = (props: PaginationProps) => shallow(createElement(Pagination, props));
    const defaultPageButtonProps: PageButtonProps = {
        buttonType: "firstButton",
        isDisabled: true,
        onClickAction: jasmine.any(Function)
    };

    const getMessageStatus = (fromValue: number, toValue: number, maxPageSize: number): string => {
        return `${fromValue} to ${toValue} of ${maxPageSize}`;
    };

    const defaultItemProps = {
        item: "firstButton",
        showIcon: "default" as IconType,
        text: ""
    };

    const defaultProps: PaginationProps = {
        getMessageStatus: (fromValue: number, toValue: number, maxPageSize: number) => {
            return getMessageStatus(fromValue, toValue, maxPageSize);
        },
        hideUnusedPaging: false,
        items: [
            {
                ...defaultItemProps,
                item: "firstButton"
            },
            {
                ...defaultItemProps,
                item: "previousButton"
            },
            {
                ...defaultItemProps,
                item: "text",
                showIcon: "none",
                text: "From {firstItem} to {lastItem} of {totalItems}, page {currentPageNumber} of pages {totalPages}"
            },
            {
                ...defaultItemProps,
                item: "nextButton"
            },
            {
                ...defaultItemProps,
                item: "lastButton"
            },
            {
                ...defaultItemProps,
                item: "pageNumberButtons"
            }
        ],
        listViewSize: 32,
        maxPageButtons: 16,
        offset: 2,
        onClickAction: jasmine.any(Function),
        pagingStyle: "default"
    };

    const createButton = (buttonProps?: PageButtonProps) => createElement(PageButton, {
        ...buttonProps
    });

    const getDefaultPageButtons = (pageButtonProps: PageButtonProps) => [
        createButton({ ...pageButtonProps, buttonType: "firstButton" }),
        createButton({ ...pageButtonProps, buttonType: "previousButton" }),
        createButton({ ...pageButtonProps, buttonType: "text" }),
        createButton({ ...pageButtonProps, buttonType: "nextButton" }),
        createButton({ ...pageButtonProps, buttonType: "lastButton" })
    ];

    const getCustomPageButtons = (leftPageButtonProps: PageButtonProps, rightPageButtonProps: PageButtonProps) => [
        createButton({ ...leftPageButtonProps, buttonType: "firstButton", message: "" }),
        createButton({ ...leftPageButtonProps, buttonType: "previousButton", message: "" }),
        createButton({ ...leftPageButtonProps, buttonType: "text", message: "From 1 to 2 of 32, page 1 of pages 16" }),
        createButton({ ...rightPageButtonProps, buttonType: "nextButton", message: "" }),
        createButton({ ...rightPageButtonProps, buttonType: "lastButton", message: "" }),
        createButton({ ...rightPageButtonProps, buttonType: "pageNumberButtons" })
    ];
});
