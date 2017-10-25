[![Build Status](https://travis-ci.org/mendixlabs/paging-button.svg?branch=master)](https://travis-ci.org/mendixlabs/paging-button)
[![Dependency Status](https://david-dm.org/mendixlabs/paging-button.svg)](https://david-dm.org/mendixlabs/paging-button)
[![Dev Dependency Status](https://david-dm.org/mendixlabs/paging-button.svg#info=devDependencies)](https://david-dm.org/mendixlabs/paging-button#info=devDependencies)
[![codecov](https://codecov.io/gh/mendixlabs/pagination/branch/master/graph/paging-button.svg)](https://codecov.io/gh/mendixlabs/paging-button)
![badge](https://img.shields.io/badge/mendix-7.7.1-green.svg)

# PAGINATION

Add bootstrap like paging to your list view similar to the built-in data grid. The widget also supports page numbers.

## Features
* Add pagination navigation buttons to the list view 
ie:
  * First button
  * Last button
  * Next button
  * Previous button
  * Hide unused buttons.
  * Page numbers as buttons  
  * Page numbers with text as buttons
  * Page text that can be added to pagination in combination with the follow place holders.
  {firstItem} {lastItem} {totalItems} {currentPageNumber} {totalPages}

## Dependencies
Mendix 7.7.1

## Demo project

[https://pagination100.mxapps.io/](https://pagination100.mxapps.io/)

![Demo](/assets/demo.gif)

## Usage

### Appearance configuration

![Data source](/assets/Appearance.png)
 - On the `Auto hide first and last button` option of the `Appearance` 
 tab, specify if the two buttons should be hidden when they are not need.
 For example when the records are few

## Issues, suggestions and feature requests
Please report issues at [https://github.com/mendixlabs/paging-button/issues](https://github.com/mendixlabs/paging-button/issues).

## Development and contribution
Please follow [development guide](/development.md).
