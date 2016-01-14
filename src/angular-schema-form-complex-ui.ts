
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />

angular.module('schemaForm').config(['schemaFormProvider',
    'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

        // Second, we want it to show if someone have explicitly set the form type
        schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'complex-ui',
            'directives/decorators/bootstrap/complex-ui/angular-schema-form-complex-ui.html');
    }]);


interface DirectiveScope extends ng.IScope {
    ngModel : any[];
    controller : ComplexUIController;

}

// Declare a controller, this is used in the typescriptDirective below
class ComplexUIController {

    directiveScope : DirectiveScope;
    complexForm : any[];
    complexSchema : {};
    complexModel : any;

    camelCase = (input:string):string => {
        // Turn the input value into typescript and return it.
        return input.toLowerCase().replace(/[- ](.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
    };

    makeCamelCase = () => {
        // This is invoked by the ng-click
        // The ngModel in ASF is an array, we want to access the actual value
        var leaf_model = this.directiveScope.ngModel[this.directiveScope.ngModel.length - 1];
        if (leaf_model.$modelValue) {
            // If there is something to camel case, do it!
            leaf_model.$setViewValue(this.camelCase(leaf_model.$modelValue));
        };
    };
    alertObj = (obj) => {
        window.alert(JSON.stringify(obj));
    };

    constructor(private $scope:DirectiveScope, element:JQuery) {
        console.log("Initiating the process controller" + $scope.toString());
        $scope.controller = this;
        this.directiveScope = $scope;


    }
};

// Create a directive to properly access the ngModel set in the view (src/angular-schema-form-typescript.html)
angular.module('schemaForm').directive('complexUiDirective', ():ng.IDirective => {
    return {
        // The directive needs the ng-model to be set, look at the <div>
        require: ['ngModel'],
        restrict: 'A',
        // Do not create a isolate scope, makeCamelCase should be available to the button element
        scope: false,
        // Define a controller, use the function from above, inject the scope
        controller : ['$scope', ComplexUIController],
        link: function(scope: DirectiveScope, iElement, iAttrs, ngModelCtrl) {
            scope.controller.complexModel = ngModelCtrl;
            scope.controller.complexForm = [
                {
                    "key": "test1",
                    "title": "Inside the schema form.",
                    "type": "string"
                },
                {
                    type: "submit",
                    style: "btn-info",
                    title: "OK"
                }
            ];
            scope.controller.complexSchema = {
                type: "object",
                title: "Complex UI test",
                properties: {
                    test1: {
                        type: "string",
                        description: "So this is inside the nested ASF instance"
                    }
                },
                required: ["test1"]
            };


        }
    }

});


