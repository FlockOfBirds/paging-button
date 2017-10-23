class Home {
    public get paginationOne() { return browser.element(".mx-name-pagination9"); }

    public get listViewOne() { return browser.element(".mx-name-listView1"); }

    public get nextButton() { return browser.element(".mx-name-pagination9 > div > button.btn.mx-button.mx-name-paging-next"); }

    public get firstButton() { return browser.element(".mx-name-pagination9 > div > button.btn.mx-button.mx-name-paging-first"); }

    public get previousButton() { return browser.element(".mx-name-pagination9 > div > button.btn.mx-button.mx-name-paging-previous"); }

    public get customButtonSeven() { return browser.element(".mx-name-pagination9 > div > ul > li:nth-child(7)"); }

    public get lastButton() { return browser.element(".mx-name-pagination9 > div > button.btn.mx-button.mx-name-paging-last"); }

    public get listViewFirstItem() { return browser.elements(".mx-name-listView1 > ul > li.mx-listview-item.mx-name-index-0 > div > div > span"); }

    public get listViewFifthItem() { return browser.elements(".mx-name-listView1 > ul > li.mx-listview-item.mx-name-index-4 > div > div > span"); }

    public get listViewSeventhItem() { return browser.elements(".mx-name-listView1 > ul > li.mx-listview-item.mx-name-index-6 > div > div > span"); }

    public get listViewThirteenthItem() {
        return browser.elements(".mx-name-listView1 > ul > li.mx-listview-item.mx-name-index-12 > div > div > span");
    }

    public get listViewLastItem() { return browser.elements(".mx-name-listView1 > ul > li.mx-listview-item.mx-name-index-30 > div > div > span"); }

    public open(): void {
        browser.url("/p/home");
    }
}
const home = new Home();
export default home;
