import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import { PageButton } from "./components/PageButton";
import { ValidateConfigs } from "./components/ValidateConfigs";
import { PageButtonContainerProps, PageButtonContainerState, WrapperProps } from "./utils/ContainerUtils";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends Component<PageButtonContainerProps, PageButtonContainerState> {
    constructor(props: PageButtonContainerProps) {
        super(props);

        this.state = { findingListviewWidget: true, statusMessage: "--" };
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
            createElement(PageButton, {
                onClickAction: () => { return; },
                statusMessage: `[ 1 to 5 of 20 ]`
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
            queryNode: this.state.targetNode,
            targetListview: this.state.targetListView,
            validate: !this.state.findingListviewWidget
        });
        this.setState({ findingListviewWidget: false, validationPassed: !validateMessage });
    }

    private transformListView(targetNode: HTMLElement) {
        const buttonNode = targetNode.querySelector(".mx-listview-loadMore") as HTMLButtonElement;

        if (buttonNode) {
            buttonNode.style.display = "none";
        }
        if (this.props.hideUnusedPaging === true) {
            this.setState({ hidePageButton: true });

        }else {
            this.setState({ hidePageButton: false });
        }
    }
}

export function getPreviewCss() {
    return require("./ui/PageButton.css");
}
