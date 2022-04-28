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

            //TODO: GOAL modularizar, combinar filtros. 

            onSearchNames: function (oEvent) {
                let sQuery = oEvent.getSource().getValue(),
                    oTable = this.byId("idVeterinaryTable"),
                    oBinding = oTable.getBinding("items"),
                    oSearchFilter;

                if (sQuery) {
                    oSearchFilter = new Filter("name", FilterOperator.Contains, sQuery);
                } else {
                    oSearchFilter = null;
                }

                oBinding.filter(oSearchFilter, "Application");
            },

            onSearchBreeds: function (oEvent) {
                let sQuery = oEvent.getSource().getValue(),
                    oTable = this.byId("idVeterinaryTable"),
                    oBinding = oTable.getBinding("items"),
                    oSearchFilter;
                if (sQuery) {
                    oSearchFilter = new Filter("breed", FilterOperator.Contains, sQuery);
                } else {
                    oSearchFilter = null;
                }
                oBinding.filter(oSearchFilter, "Application");
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

