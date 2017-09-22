import { Component, createElement } from "react";
import * as classNames from "classnames";

import { MendixButton } from "./MendixButton";

export interface PaginationProps {
    maxPageSize: number;
    offSet: number;
    onClickAction: (offSet: number) => void;
    showPageButton?: boolean;
    setMessageStatus: (currentOffSet: number, offSet: number, maxPageSize: number) => string;
}

interface PaginationState {
    currentOffSet: number;
    isVisible?: boolean;
    statusMessage: string;
    previousIsDisabled: boolean;
    nextIsDisabled: boolean;
}

export class Pagination extends Component<PaginationProps, PaginationState> {
    constructor(props: PaginationProps) {
        super(props);

        this.state = {
            currentOffSet: 0,
            isVisible: this.props.showPageButton,
            nextIsDisabled: false,
            previousIsDisabled: true,
            statusMessage: ""

        };

        this.firstPageClickAction = this.firstPageClickAction.bind(this);
        this.lastPageClickAction = this.lastPageClickAction.bind(this);
        this.nextPageClickAction = this.nextPageClickAction.bind(this);
        this.previousPageClickAction = this.previousPageClickAction.bind(this);
        this.callOnClickAction = this.callOnClickAction.bind(this);
    }

    render() {
        return createElement("div", {
                className: classNames("page-button",
                    `visible: ${this.state.isVisible ? "visible" : "hidden"}`
                )
            },
            createElement(MendixButton, {
                buttonType: "first",
                glyphIcon: "step-backward",
                isDisabled: this.state.previousIsDisabled,
                onClickAction: this.firstPageClickAction
            }),
            createElement(MendixButton, {
                buttonType: "previous",
                glyphIcon: "backward",
                isDisabled: this.state.previousIsDisabled,
                onClickAction: this.previousPageClickAction
            }),
            createElement("span", { className: "paging-status" },
                this.state.statusMessage
            ),
            createElement(MendixButton, {
                buttonType: "next",
                glyphIcon: "forward",
                isDisabled: this.state.nextIsDisabled,
                onClickAction: this.nextPageClickAction
            }),
            createElement(MendixButton, {
                buttonType: "last",
                glyphIcon: "step-forward",
                isDisabled: this.state.nextIsDisabled,
                onClickAction: this.lastPageClickAction
            })
        );
    }

    componentDidMount() {
        const { maxPageSize, offSet } = this.props;

        this.setState({
            statusMessage: this.props.setMessageStatus(this.state.currentOffSet, this.props.offSet, maxPageSize)
        });

        if (maxPageSize === 0 || offSet >= maxPageSize) {
            this.setState({ nextIsDisabled: true });
        }
    }

    componentWillReceiveProps(nextProps: PaginationProps) {
        this.setState({
            statusMessage: this.props.setMessageStatus(this.state.currentOffSet, nextProps.offSet, nextProps.maxPageSize)
        });
    }

    componentDidUpdate(_prevProps: PaginationProps, _prevState: PaginationState) {
        this.callOnClickAction();
    }

    private firstPageClickAction() {
        const { maxPageSize, offSet } = this.props;
        const currentOffSet = 0;

        this.setState({
            currentOffSet,
            nextIsDisabled: false,
            previousIsDisabled: true,
            statusMessage: this.props.setMessageStatus(currentOffSet, offSet, maxPageSize)
        });
    }

    private nextPageClickAction() {
        const { maxPageSize, offSet } = this.props;
        const currentOffSet = this.state.currentOffSet + offSet;

        if ((maxPageSize - currentOffSet) <= offSet) {
            this.setState({
                currentOffSet,
                nextIsDisabled: true,
                statusMessage: this.props.setMessageStatus(currentOffSet, offSet, maxPageSize)
            });
        } else if (currentOffSet < maxPageSize) {
            this.setState({
                currentOffSet,
                previousIsDisabled: false,
                statusMessage: this.props.setMessageStatus(currentOffSet, offSet, maxPageSize)
            });
        }
    }

    private previousPageClickAction() {
        const currentOffSet = this.state.currentOffSet - this.props.offSet;
        const { offSet, maxPageSize } = this.props;

        if (currentOffSet > 0) {
            this.setState({
                currentOffSet,
                nextIsDisabled: false,
                statusMessage: this.props.setMessageStatus(currentOffSet, offSet, maxPageSize)
            });
        } else if (currentOffSet === 0) {
            this.setState({
                currentOffSet,
                previousIsDisabled: true,
                statusMessage: this.props.setMessageStatus(currentOffSet, offSet, maxPageSize)
            });
        }
    }

    private lastPageClickAction() {
        const { offSet, maxPageSize } = this.props;
        const currentOffSet = (maxPageSize % offSet) === 0
         ? maxPageSize - offSet
         : maxPageSize - (maxPageSize % offSet);

        if (currentOffSet > 0) {
            this.setState({
                currentOffSet,
                nextIsDisabled: true,
                previousIsDisabled: false,
                statusMessage: this.props.setMessageStatus(currentOffSet, offSet, maxPageSize)
            });
        }
    }

    private callOnClickAction() {
        this.props.onClickAction(this.state.currentOffSet);
    }
}
