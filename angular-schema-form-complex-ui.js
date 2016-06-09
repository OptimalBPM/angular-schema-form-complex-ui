angular.module("schemaForm").run(["$templateCache", function($templateCache) {$templateCache.put("directives/decorators/bootstrap/complex-ui/angular-schema-form-complex-ui.html","<div ng-class=\"{\'has-error\': hasError()}\"><div ng-init=\"parentController.model=$$value$$\" complex-ui-directive=\"\"><div ng-if=\"form.options.modal == true\"><label>{{form.title}}</label>&nbsp;<button ng-click=\"parentController.toggleModal()\">{{form.options.buttonCaption}}</button><modal title=\"{{form.title}}\" visible=\"showModal\"><div ng-if=\"form.options.includeURI != \'\'\"><ng-include src=\"form.options.includeURI\"></ng-include></div><div ng-if=\"form.options.includeURI == null || form.options.includeURI == \'\'\"><div name=\"\" sf-schema=\"parentController.schema\" sf-form=\"parentController.form\" sf-model=\"parentController.model\"></div></div></modal></div><div ng-if=\"form.options.modal != true\"><label ng-show=\"showTitle()\">{{form.title}}</label><div ng-if=\"form.options.includeURI != \'\'\"><ng-include src=\"form.options.includeURI\"></ng-include></div><div ng-if=\"form.options.includeURI == null || form.options.includeURI == \'\'\"><div name=\"\" sf-schema=\"parentController.schema\" sf-form=\"parentController.form\" sf-model=\"parentController.model\"></div></div></div></div><span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span><br><span ng-show=\"form.some_setting\">The some setting-setting is true for the model at $$value$$!</span></div>");}]);
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
        this.getCallback = function (callback) {
            if (typeof (callback) == "string") {
                var _result = _this.directiveScope.$parent.evalExpr(callback);
                if (typeof (_result) == "function") {
                    return _result;
                }
                else {
                    throw ("A callback string must match name of a function in the parent scope");
                }
            }
            else if (typeof (callback) == "function") {
                return callback;
            }
            else {
                throw ("A callback must either be a string matching the name of a function in the parent scope or a " +
                    "direct function reference");
            }
        };
        this.applyDefinitions = function (defs) {
            // TODO: This is probably in the wrong order, it should be possible to read form and schema the usual way.
            // How can some get a form and some not.
            if ("form" in defs) {
                _this.form = defs["form"];
            }
            else if ("complexForm" in _this.directiveScope.form["options"]) {
                _this.form = _this.directiveScope.form["options"]["complexForm"];
            }
            else {
                _this.form = ["*"];
            }
            _this.form.onChange = _this.directiveScope.form.onChange;
            _this.schema = defs["schema"];
        };
        this.getDefinitions = function () {
            if (_this.directiveScope.form["options"]) {
                var schemaRef = void 0;
                if ("schemaRef" in _this.directiveScope.form["options"]) {
                    schemaRef = _this.directiveScope.form["options"]["schemaRef"];
                }
                else {
                    schemaRef = null;
                }
                if ("definitionsCallback" in _this.directiveScope.form["options"]) {
                    var callback = _this.getCallback(_this.directiveScope.form["options"]["definitionsCallback"]);
                    var _ret = callback(schemaRef);
                    if ('function' === typeof _ret.then) {
                        _ret.then(_this.applyDefinitions);
                    }
                    else {
                        _this.applyDefinitions(_ret);
                    }
                }
            }
        };
        this.innerSubmit = function (form) {
            _this.directiveScope.$broadcast("schemaFormValidate");
            console.log(_this.model);
        };
        console.log("Initiating the ComplexUI controller" + $scope.toString());
        $scope.parentController = this;
        this.directiveScope = $scope;
    }
    return ComplexUIController;
}());
;
angular.module('schemaForm').directive('modal', function () {
    // TODO: Add setting for class
    return {
        template: '<div class="modal fade">' +
            '<div class="{{ form.htmlClass ? form.htmlClass: \'modal-dialog\'}}">' +
            '<div class="modal-content" style="overflow:auto;">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" ng-click="parentController.toggleModal()" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title">{{ form.title }}</h4>' +
            '</div>' +
            '<div class="{{ form.fieldHtmlClass ? form.fieldHtmlClass: \'modal-body\'}} " ng-transclude></div>' +
            '</div>' +
            '</div>' +
            '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: false,
        link: function postLink(scope, element, attrs) {
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
        // Do not create a isolate scope, pass on
        scope: false,
        // Define a controller, use the function from above, inject the scope
        controller: ['$scope', ComplexUIController],
        link: function (scope, iElement, iAttrs, ngModelCtrl) {
            scope.parentController.getDefinitions();
        }
    };
});
angular.module('schemaForm').directive('script', function () {
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
});
