import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import { Pagination } from "./components/Pagination";
import { ValidateConfigs } from "./components/ValidateConfigs";
import { PaginationContainerProps, PaginationContainerState, WrapperProps } from "./utils/ContainerUtils";
import PageButtonContainer from "./components/PaginationContainer";

declare function require(name: string): string;
type VisibilityMap = {
    [ P in keyof PaginationContainerProps ]: boolean;
    };
// tslint:disable-next-line class-name
export class preview extends Component<PaginationContainerProps, PaginationContainerState> {
    constructor(props: PaginationContainerProps) {
        super(props);

        this.state = { findingListviewWidget: true, maxPageSize: 0, offSet: 1 };
        this.transformListView = this.transformListView.bind(this);
    }

    render() {
        return createElement("div", { className: "widget-page-button" },
            createElement(ValidateConfigs, {
                ...this.props as WrapperProps,
                inWebModeler: true,
                queryNode: this.state.targetNode,
                targetListview: this.state.targetListView,
                validate: !this.state.findingListviewWidget
            }),
            createElement(Pagination, {
                maxPageSize: this.state.maxPageSize,
                offSet: this.state.offSet,
                onClickAction: () => { return; },
                setMessageStatus: PageButtonContainer.setMessageStatus,
                showPageButton: true
            })
        );
    }

    componentDidMount() {
        this.validateConfigs(this.props);
    }

    componentWillReceiveProps(newProps: WrapperProps) {
        this.validateConfigs(newProps);
    }

    private validateConfigs(props: WrapperProps) {
        const queryNode = findDOMNode(this) as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(queryNode);

        if (targetNode) {
            this.transformListView(targetNode);
            this.setState({ targetNode });
        }
        const validateMessage = ValidateConfigs.validate({
            ...props as WrapperProps,
            inWebModeler: true,
            queryNode: this.state.targetNode,
            targetListview: this.state.targetListView,
            validate: !this.state.findingListviewWidget
        });
        this.setState({
            findingListviewWidget: false,
            maxPageSize: 10,
            offSet: 1,
            validationPassed: !validateMessage
        });
    }

    private transformListView(targetNode: HTMLElement) {
        const buttonNode = targetNode.querySelector(".mx-listview-loadMore") as HTMLButtonElement;

        if (buttonNode) {
            buttonNode.style.display = "none";
        }
        if (this.props.hideUnusedPaging === true) {
            this.setState({ showPageButton: true });

        }else {
            this.setState({ showPageButton: false });
        }
    }
}

export function getVisibleProperties(valueMap: PaginationContainerProps, visibilityMap: VisibilityMap) {
    valueMap.hideUnusedPaging = visibilityMap.hideUnusedPaging = false;

    return visibilityMap;
}

export function getPreviewCss() {
    return require("./ui/Pagination.css");
}
