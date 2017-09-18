import {Component, createElement} from "react";
import {MendixButton} from "./MendixButton";

export interface PageButtonProps {
    onClickAction: (pageNumber: number) => void;
    pageSize: number;
}

export interface PageButtonState {
    pageNumber: number;
    status: string;
}


export class PageButton extends Component<PageButtonProps, PageButtonState> {
    constructor(props: PageButtonProps) {
        super(props);

        this.state = {pageNumber: 1, status};
        this.firstPageClickAction = this.firstPageClickAction.bind(this);
        this.lastPageClickAction = this.lastPageClickAction.bind(this);
        this.nextPageClickAction = this.nextPageClickAction.bind(this);
        this.nextPageClickAction = this.nextPageClickAction.bind(this);

    }

    render() {
        return createElement("div", {className: "mx-grid-pagingbar"},
            createElement(MendixButton, {
                buttonType: "first",
                glyphIcon: "backward" ,
                onClickAction: this.firstPageClickAction
            }),
            createElement(MendixButton, {
                buttonType: "previous",
                glyphIcon: "backward",
                onClickAction: this.previousPageClickAction
            }),
            createElement("div", {className: "dijitInline mx-grid-paging-status"},
                this.state.status
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
            }),
        );
    }

    componentDidMount() {
        this.setState({ status: this.getPagingStatus()})
    }

    componentDidUpdate(_prevProps: PageButtonProps, _prevState: PageButtonState){
        this.setState({ status: this.getPagingStatus()})
        this.props.onClickAction(this.state.pageNumber);
    }

    private firstPageClickAction() {
        this.setState({ pageNumber: 1 })
    }

    private nextPageClickAction() {
        this.setState({ pageNumber: this.state.pageNumber + 1})
    }

    private previousPageClickAction() {
        this.setState({ pageNumber: this.state.pageNumber - 1})
    }
    private lastPageClickAction() {
        this.setState({ pageNumber: this.props.pageSize})
    }

    private getPagingStatus(){
        const from = 1;
        const to = 2;
        return `${from} to ${to} of ${this.props.pageSize}`
    }
}
