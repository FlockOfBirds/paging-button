import { createElement } from "react";
import { configure, shallow } from "enzyme";
import Adapter = require("enzyme-adapter-react-16");
import * as classNames from "classnames";

import { PageNumberView } from "../PageNumberView";

configure({ adapter: new Adapter() });

describe("PageNumberView", () => {

    it("renders the active structure correctly", () => {
        const pageNumber = 2;

        const pageNumberView = shallow(createElement(PageNumberView, {
            onClick: () => jasmine.any(Function),
            page: pageNumber,
            selected: true
        }));

        expect(pageNumberView).toBeElement(
            createElement("li", {
                    className: classNames(
                        "active",
                        "single-digit"
                    ),
                    onClick: jasmine.any(Function)
                },
                pageNumber
            )
        );
    });

    it("renders the disabled structure correctly", () => {
        const pageNumber = 20;

        const pageNumberView = shallow(createElement(PageNumberView, {
            onClick: () => jasmine.any(Function),
            page: pageNumber,
            selected: false
        }));

        expect(pageNumberView).toBeElement(
            createElement("li", {
                    className: "",
                    onClick: jasmine.any(Function)
                },
                pageNumber
            )
        );
    });
});
