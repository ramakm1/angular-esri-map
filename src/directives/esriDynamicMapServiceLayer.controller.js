(function(angular) {
    'use strict';

    angular.module('esri.map').controller('esriDynamicMapServiceLayerController', function EsriDynamicMapServiceLayerController(esriLayerUtils) {

        var layerPromise;

        // get feature layer options from layer controller properties
        this.getLayerOptions = function() {
            return esriLayerUtils.getLayerOptions(this);
        };

        // return the defered that will be resolved with the dynamic layer
        this.getLayer = function () {
            return layerPromise;
        };

        // set the info template for a layer
        this.setInfoTemplate = function(layerId, infoTemplate) {
            return this.getLayer().then(function(layer) {
                return esriLayerUtils.createInfoTemplate(infoTemplate).then(function(infoTemplateObject) {
                    // check if layer has info templates defined
                    var infoTemplates = layer.infoTemplates;
                    if (!angular.isObject(infoTemplates)) {
                        // create a new info templates hash
                        infoTemplates = {};
                    }
                    // set the info template for sublayer
                    // NOTE: ignoring layerUrl and resourceInfo for now
                    // https://developers.arcgis.com/javascript/jsapi/arcgisdynamicmapservicelayer-amd.html#arcgisdynamicmapservicelayer1
                    infoTemplates[layerId] = {
                        infoTemplate: infoTemplateObject
                    };
                    layer.setInfoTemplates(infoTemplates);
                    return infoTemplates;
                });
            });
        };

        // create the layer
        layerPromise = esriLayerUtils.createDynamicMapServiceLayer(this.url, this.getLayerOptions(), this.visibleLayers);
    });

})(angular);