/**
 * Created by nibo on 2016-01-15.
 */

var exampleApp = angular.module("exampleApp");

var exampleIncludeController = function ($scope) {
    $scope.showMoreInfo = false;
    $scope.moreInfoCaption = "show more";

    $scope.testController = function (message) {
        window.alert(message);
    };

    $scope.toggleMoreInfo = function() {
        $scope.showMoreInfo = !$scope.showMoreInfo;
        if ($scope.showMoreInfo) {
            $scope.moreInfoCaption = "show less"
        }
        else {
            $scope.moreInfoCaption = "show more"
        }
    }
};


exampleApp.directive('exampleIncludeDirective', function () {

    return {
        require: [],
        restrict: 'A',
        scope: false,
        // Define a controller, use the function from above, inject the scope
        controller: ['$scope', exampleIncludeController],
        link: function (scope, iElement, iAttrs, ngModelCtrl) {
           console.log("ssss");
        }
    };
});


