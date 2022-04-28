sap.ui.define(
    [],
    function () {
        "use strict";
        return {
            formatSpecieColor: function (sSpecie) {
                let sState;
                switch (sSpecie) {
                    case "dog":
                        sState = "Success";
                        break;
                    case "exotic":
                        sState = "Warning";
                        break;
                    case "cat":
                        sState = "Error";
                        break;
                    default:
                        sState = "None";
                        break;
                }
                return sState;
            }
        };
    },
    true
);