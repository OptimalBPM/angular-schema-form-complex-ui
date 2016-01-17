angular.module("schemaForm").run(["$templateCache", function($templateCache) {$templateCache.put("directives/decorators/bootstrap/complex-ui/angular-schema-form-complex-ui.html","<div ng-class=\"{\'has-error\': hasError()}\"><div ng-init=\"controller.model=$$value$$\" complex-ui-directive=\"\"><div ng-if=\"form.options.modal == true\"><label>{{form.title}}</label>&nbsp;<button ng-click=\"controller.toggleModal()\">{{form.options.buttonCaption}}</button><modal title=\"{{form.title}}\" visible=\"showModal\"><div ng-if=\"form.options.includeURI != \'\'\"><ng-include src=\"form.options.includeURI\"></ng-include></div><div ng-if=\"form.options.includeURI == null\"><div name=\"\" sf-schema=\"controller.schema\" sf-form=\"controller.form\" sf-model=\"controller.model\"></div></div></modal></div><div ng-if=\"form.options.modal != true\"><label ng-show=\"showTitle()\">{{form.title}}</label><div ng-if=\"form.options.includeURI != \'\'\"><ng-include src=\"form.options.includeURI\"></ng-include></div><div ng-if=\"form.options.includeURI == null\"><div name=\"\" sf-schema=\"controller.schema\" sf-form=\"controller.form\" sf-model=\"controller.model\"></div></div></div></div><span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span><br><span ng-show=\"form.some_setting\">The some setting-setting is true for the model at $$value$$!</span></div>");}]);
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
        this.toggleModal = function () {
            this.directiveScope.showModal = !this.directiveScope.showModal;
        };
        this.getDefinitions = function () {
            if (_this.directiveScope.form["options"]) {
                var _defs = _this.directiveScope.form["options"]["definitionsCallback"]();
                _this.form = _defs["form"];
                _this.schema = _defs["schema"];
            }
        };
        this.innerSubmit = function (form) {
            _this.directiveScope.$broadcast("schemaFormValidate");
            console.log(_this.model);
        };
        console.log("Initiating the process controller" + $scope.toString());
        $scope.controller = this;
        this.directiveScope = $scope;
    }
    return ComplexUIController;
})();
;
angular.module('schemaForm').directive('modal', function () {
    return {
        template: '<div class="modal fade">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" ng-click="controller.toggleModal()" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title">{{ title }}</h4>' +
            '</div>' +
            '<div class="modal-body" ng-transclude></div>' +
            '</div>' +
            '</div>' +
            '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs["title"];
            scope.$watch((attrs).visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });
        }
    };
});
// Create a directive to properly access the ngModel set in the view (src/angular-schema-form-typescript.html)
angular.module('schemaForm').directive('complexUiDirective', function () {
    return {
        require: [],
        restrict: 'A',
        // Do not create a isolate scope, makeCamelCase should be available to the button element
        scope: false,
        // Define a controller, use the function from above, inject the scope
        controller: ['$scope', ComplexUIController],
        link: function (scope, iElement, iAttrs, ngModelCtrl) {
            scope.parentController.getDefinitions();
        }
    };
});
angular.module('schemaForm').directive('script', ["$timeout", function ($timeout) {
        return {
            restrict: 'E',
            scope: false,
            link: function (scope, elem, attr) {
                if (attr["type"] == 'text/javascript-lazy') {
                    var s = document.createElement("script");
                    s.type = "text/javascript";
                    var src = elem.attr('src');
                    if (src !== undefined) {
                        s.src = src;
                    }
                    else {
                        var code = elem.text();
                        s.text = code;
                    }
                    document.head.appendChild(s);
                    elem.remove();
                }
            }
        };
    }]);
