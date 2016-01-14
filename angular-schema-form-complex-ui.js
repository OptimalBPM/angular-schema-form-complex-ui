angular.module("schemaForm").run(["$templateCache", function($templateCache) {$templateCache.put("directives/decorators/bootstrap/complex-ui/angular-schema-form-complex-ui.html","<div ng-class=\"{\'has-error\': hasError()}\"><label ng-show=\"showTitle()\">{{form.title}}</label><div ng-model=\"$$value$$\" ng-init=\"controller.complexModel=$$value$$\" complex-ui-directive=\"\"><div name=\"controller.complexForm\" sf-schema=\"controller.complexSchema\" sf-form=\"controller.complexForm\" sf-model=\"controller.complexModel\"></div></div><span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span><br><span ng-show=\"form.some_setting\">The some setting-setting is true for the model at $$value$$!</span></div>");}]);
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
angular.module('schemaForm').config(['schemaFormProvider',
    'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {
        // Second, we want it to show if someone have explicitly set the form type
        schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'complex-ui', 'directives/decorators/bootstrap/complex-ui/angular-schema-form-complex-ui.html');
    }]);
// Declare a controller, this is used in the typescriptDirective below
var ComplexUIController = (function () {
    function ComplexUIController($scope, element) {
        var _this = this;
        this.$scope = $scope;
        this.camelCase = function (input) {
            // Turn the input value into typescript and return it.
            return input.toLowerCase().replace(/[- ](.)/g, function (match, group1) {
                return group1.toUpperCase();
            });
        };
        this.makeCamelCase = function () {
            // This is invoked by the ng-click
            // The ngModel in ASF is an array, we want to access the actual value
            var leaf_model = _this.directiveScope.ngModel[_this.directiveScope.ngModel.length - 1];
            if (leaf_model.$modelValue) {
                // If there is something to camel case, do it!
                leaf_model.$setViewValue(_this.camelCase(leaf_model.$modelValue));
            }
            ;
        };
        this.alertObj = function (obj) {
            window.alert(JSON.stringify(obj));
        };
        this.getDefinitions = function () {
            if (_this.directiveScope.form["options"]) {
                var _defs = _this.directiveScope.form["options"]["definitionsCallback"]();
                _this.complexForm = _defs["form"];
                _this.complexSchema = _defs["schema"];
            }
        };
        this.innerSubmit = function (form) {
            _this.directiveScope.$broadcast("schemaFormValidate");
            console.log(_this.complexModel);
        };
        console.log("Initiating the process controller" + $scope.toString());
        $scope.controller = this;
        this.directiveScope = $scope;
    }
    return ComplexUIController;
})();
;
// Create a directive to properly access the ngModel set in the view (src/angular-schema-form-typescript.html)
angular.module('schemaForm').directive('complexUiDirective', function () {
    return {
        // The directive needs the ng-model to be set, look at the <div>
        require: ['ngModel'],
        restrict: 'A',
        // Do not create a isolate scope, makeCamelCase should be available to the button element
        scope: false,
        // Define a controller, use the function from above, inject the scope
        controller: ['$scope', ComplexUIController],
        link: function (scope, iElement, iAttrs, ngModelCtrl) {
            scope.controller.getDefinitions();
        }
    };
});
