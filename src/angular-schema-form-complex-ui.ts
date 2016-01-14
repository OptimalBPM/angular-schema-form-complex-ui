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
    form : any[];
    controller : ComplexUIController;
    showModal : boolean;
}

interface ComplexModel {
    options : {};
}

// Declare a controller, this is used in the typescriptDirective below
class ComplexUIController {

    directiveScope:DirectiveScope;
    complexForm:ComplexModel;
    complexSchema:{};
    $broadcast:any;
    complexModel:any;

    camelCase = (input:string):string => {
        // Turn the input value into typescript and return it.
        return input.toLowerCase().replace(/[- ](.)/g, function (match, group1) {
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
        }
        ;
    };
    alertObj = (obj) => {
        window.alert(JSON.stringify(obj));
    };

    toggleModal = function () {
        this.directiveScope.showModal = !this.directiveScope.showModal;
    };

    getDefinitions = () => {
        if (this.directiveScope.form["options"]) {
            var _defs:{} = this.directiveScope.form["options"]["definitionsCallback"]();
            this.complexForm = _defs["form"];
            this.complexSchema = _defs["schema"];
        }
    };

    innerSubmit = (form) => {
        this.directiveScope.$broadcast("schemaFormValidate");
        console.log(this.complexModel);
    };

    constructor(private $scope:DirectiveScope, element:JQuery) {
        console.log("Initiating the process controller" + $scope.toString());
        $scope.controller = this;
        this.directiveScope = $scope;


    }
}
;


interface modalScope extends ng.IScope {
    title : string;
}


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
        link: function postLink(scope : modalScope, element : JQuery, attrs : ng.IAttributes) {
            scope.title = attrs["title"];

            scope.$watch((<any>(attrs)).visible, function (value) {
                if (value == true)
                    (<any>$(element)).modal('show');
                else
                    (<any>$(element)).modal('hide');
            });


        }
    };
});


// Create a directive to properly access the ngModel set in the view (src/angular-schema-form-typescript.html)
angular.module('schemaForm').directive('complexUiDirective', ():ng.IDirective => {
    return {

        require: [],
        restrict: 'A',
        // Do not create a isolate scope, makeCamelCase should be available to the button element
        scope: false,
        // Define a controller, use the function from above, inject the scope
        controller: ['$scope', ComplexUIController],
        link: function (scope:DirectiveScope, iElement, iAttrs, ngModelCtrl) {
            scope.controller.getDefinitions();

        }
    }

});


