/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />

angular.module('schemaForm').config(['schemaFormProvider',
    'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {




        // Second, we want it to show if someone have explicitly set the form type
        schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'complex-ui',
            'directives/decorators/bootstrap/complex-ui/angular-schema-form-complex-ui.html');
    }]);

interface ComplexModel {
    options : {};
}
interface DirectiveScope extends ng.IScope {
    ngModel : any[];
    form : ComplexModel;
    parentController : ComplexUIController;
    showModal : boolean;
}



// Declare a controller, this is used in the typescriptDirective below
class ComplexUIController {

    directiveScope:DirectiveScope;
    form: {};
    schema:{};
    model:any;

    $broadcast:any;

    toggleModal = function () {
        this.directiveScope.showModal = !this.directiveScope.showModal;
    };

    getDefinitions = () => {
        if (this.directiveScope.form["options"]) {
            if ("schemaRef" in this.directiveScope.form["options"]) {
                var schemaRef:string = this.directiveScope.form["options"]["schemaRef"]
            }
            else {
                var schemaRef:string = null
            }
            var _defs:{} = this.directiveScope.form["options"]["definitionsCallback"](schemaRef);
            if ("form" in _defs) {
                this.form = _defs["form"];
            } else
            if ("complexForm" in this.directiveScope.form["options"]) {
                this.form = this.directiveScope.form["options"]["complexForm"];
            } else {
                this.form = ["*"];
            }
            this.schema = _defs["schema"];
        }
    };

    innerSubmit = (form) => {
        this.directiveScope.$broadcast("schemaFormValidate");
        console.log(this.model);
    };

    constructor(private $scope:DirectiveScope, element:JQuery) {
        console.log("Initiating the ComplexUI controller" + $scope.toString());
        $scope.parentController = this;
        this.directiveScope = $scope;


    }
};


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
            scope.parentController.getDefinitions();

        }
    }

});

angular.module('schemaForm').directive('script',():ng.IDirective => {
    return {
        restrict: 'E',
        scope: false,
        link: function (scope :ng.IScope, elem: JQuery, attr: ng.IAttributes) {
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