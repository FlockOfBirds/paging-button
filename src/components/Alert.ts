import { SFC, createElement } from "react";
import * as classNames from "classnames";

type bootstrapStyle = "danger" | "info" | "success" | "inverse" | "warning";
export const Alert: SFC<{ bootstrapStyle?: bootstrapStyle, message?: string, className?: string }> = (props) =>
    props.message
        ? createElement("div",
            { className: classNames(`alert alert-${props.bootstrapStyle}`, props.className) },
            props.message
        )
        : null;

Alert.displayName = "Alert";
Alert.defaultProps = {
    bootstrapStyle: "danger"
};
