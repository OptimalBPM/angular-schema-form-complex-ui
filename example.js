/**
 * Created by Nicklas B on 2016-01-13.
 */

/*global angular */
"use strict";

/**
 * The main app module
 * @name exampleApp
 * @type {angular.Module}
 */

var exampleApp = angular.module("exampleApp", ["schemaForm"]);

exampleApp.controller("exampleController", ["$scope", function ($scope) {

    // This function returns the schema and form for the field.
    $scope.getDefinitions = function(_ref) {
        return {
            schema:
            {
                type: "object",
                title: "Complex UI test",
                properties: {
                    test1: {
                        "properties": {
                            "delete": {
                                "type": "boolean"
                            },
                            "insert": {
                                "type": "boolean"
                            },
                            "mappings": {
                                "items": {
                                    "properties": {
                                        "dest_reference": {
                                            "type": "string"
                                        },
                                        "is_key": {
                                            "type": "boolean"
                                        },
                                        "src_datatype": {
                                            "type": "string"
                                        },
                                        "src_reference": {
                                            "type": "string"
                                        },
                                        "substitution": {
                                            "properties": {},
                                            "type": "object"
                                        }
                                    },
                                    "type": "object"
                                },
                                "type": "array"
                            },
                            "post_execute_sql": {
                                "type": "string"
                            },
                            "update": {
                                "type": "boolean"
                            }
                        },
                        "type": "object"
                    },
                    test2: {
                        type: "string",
                        description: "...second field"
                    }
                },
                required: ["test1"]
            },
            form : ["*"]

            }
    };

    // This is the schema definition for the whole thing.
    $scope.schema = {
        type: "object",
        title: "Complex UI ",
        properties: {
            complexUIField: {
                type: "object",
                format: "",
                description: "So this is a complex UI field."
            },
            anyfield: {
                type: "string",
                format: "",
                description: "This is just a run-of-the-mill string field."
            }
        },
        required: ["complexUIField"]
    };

    // Define all UI aspects of the form
    $scope.form = [

        {
            "key": "complexUIField",
            "title": "Example of complex structure editor",
            "type": "complex-ui",
            "options": {
                "definitionsCallback": "getDefinitions",
                "modal": true,
                "buttonCaption": "..",
                "includeURI": "example_include.html"
            },
            "onChange": $scope.onChange

        },
        {
            "key": "anyfield",
            "title": "A string",
            "options": {
                "definitionsCallback": "getDefinitions"
            },
            "onChange": $scope.onChange
        },
        {
            type: "submit",
            style: "btn-ok",
            title: "OK outer"
        }
    ];

    $scope.onChange =  function (modelValue, key) {
        console.log("Value: " + modelValue +  " Key:" + key)
    };

    // This is called by asf on submit, specified in example.html, ng-submit.
    $scope.submitted = function (form) {
        $scope.$broadcast("schemaFormValidate");
        console.log($scope.model);
    };
}]);
