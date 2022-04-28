/* eslint-disable no-param-reassign */
/* eslint-disable max-params */
/* eslint-disable valid-jsdoc */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/core/Fragment",
    "acc/veterinary/utils/Services",
    "acc/veterinary/utils/Formatter"
],
    function (
        Controller,
        JSONModel,
        MessageToast,
        Filter,
        FilterOperator,
        Sorter,
        Fragment,
        Services,
        Formatter
    ) {
        "use strict";

        return Controller.extend("acc.veterinary.controller.MainView", {
            formatter: Formatter,

            onInit: async function () {
                await this.loadModel("Veterinary.json", "VeterinaryModel");
            },

            onFilterChange: function (oTable, aFilters) {
                let oBinding = oTable.getBinding("items"),
                    oFilter;

                if (aFilters) {
                    oFilter = new Filter(aFilters, true);
                    oBinding.filter(oFilter, "Application");
                }
            },

            getFilters: function () {
                let aFilters = [];

                if (this.oSearchName) {
                    aFilters.push(this.oSearchName);
                }

                if (this.oSearchBreed) {
                    aFilters.push(this.oSearchBreed);
                }

                return aFilters;
            },

            getSearchFilter: function (sField, sQuery, oFilterOperator) {
                let oFilter;
                if (sQuery) {
                    oFilter = new Filter(sField, oFilterOperator, sQuery);
                } else {
                    oFilter = null;
                }
                return oFilter;
            },

            onSearchNames: function (oEvent) {
                this.oSearchName = this.getSearchFilter(
                    "name",
                    oEvent.getSource().getValue(),
                    FilterOperator.Contains
                );
                this.onFilterChange(this.byId("idVeterinaryTable"), this.getFilters());
            },

            onSearchBreeds: function (oEvent) {
                this.oSearchBreed = this.getSearchFilter(
                    "breed",
                    oEvent.getSource().getValue(),
                    FilterOperator.Contains
                );
                this.onFilterChange(this.byId("idVeterinaryTable"), this.getFilters());
            },

            onSortVeterinaryConfirm: function (oEvent) {
                let oMParams = oEvent.getParameters(),
                    oTable = this.byId("idVeterinaryTable"),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    oSorter,
                    bDescending;

                sPath = oMParams.sortItem.getKey();
                bDescending = oMParams.sortDescending;
                oSorter = new Sorter(sPath, bDescending);
                oBinding.sort(oSorter);
            },

            onOpenSortPopUp: function (oEvent) {
                this.openDialog(this.byId("sortDialog"), this.getView(), "acc.veterinary.view.fragments.sorterPopup");
            },

            openDialog: function (oCurrentDialog, oCurrentView, sDialogPath) {
                if (!oCurrentDialog) {
                    oCurrentDialog = Fragment.load({
                        id: oCurrentView.getId(),
                        name: sDialogPath,
                        controller: this
                    }).then(function (oDialog) {
                        oCurrentView.addDependent(oDialog);
                        oDialog.open();
                        return oDialog;
                    });
                } else {
                    oCurrentDialog.open();
                }
            },

            loadModel: async function (json, path) {
                const oResponse = await Services.getLocalJSON(
                    json
                );
                const oDataOrders = oResponse[0];
                let oModel = new JSONModel();
                oModel.setData(oDataOrders);
                this.getView().setModel(oModel, path);
            }

        });
    });

