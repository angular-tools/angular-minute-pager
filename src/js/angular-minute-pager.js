(function () {
    'use strict';

    angular.module('angularMinutePager', [])
        .directive('angularMinutePager', ['$timeout', '$http', function ($timeout, $http) {
            return {
                restrict: 'A',
                replace: true,
                scope: {angularMinutePager: '='},
                template: '<div class="angular-pager"><div class="pull-left"><div class="numitems">' +
                '<select class="form-control input-sm simple" ng-model="obj.limit" ng-show="obj.limit" ng-options="item as format(item) for item in obj.limits | orderBy: item"></select>' +
                '</div></div><div class="pull-right"><nav ng-show="obj.total > 1"><ul class="pagination">' +
                '<li ng-class="{disabled: obj.page == 1}"><a href="" ng-click="obj.page = 1"><i class="fa fa-step-backward fa-lg"></i></a></li>' +
                '<li ng-class="{disabled: obj.page == 1}"><a href="" ng-click="goto(-1)"><i class="fa fa-caret-left fa-lg"></i></a></li><li><a href="">Page ' +
                '<select class="form-control input-sm simple" ng-model="obj.page" ng-options="item as item for item in obj.pages"></select>' +
                'of {{obj.total}}</a></li>' +
                '<li ng-class="{disabled: obj.page == obj.total}"><a href="" ng-click="goto(1)"><i class="fa fa-caret-right fa-lg"></i></a></li>' +
                '<li ng-class="{disabled: obj.page == obj.total}"><a href="" ng-click="obj.page = obj.total"><i class="fa fa-step-forward fa-lg"></i></a></li></ul>' +
                '</nav><div class="numitems text-muted" ng-show="!obj.total || (obj.total < 2)">{{obj.count || 0}} items.</div></div><div class="clearfix"></div></div>',
                link: function ($scope, element, attrs) {
                    $scope.obj = {limits: [5, 10, 15, 20, 25, 30, 1000], total: 0};

                    $scope.format = function (num) {
                        return 'Show ' + (num > 999 ? 'all items' : num + ' items / page');
                    };

                    $scope.goto = function (delta) {
                        $scope.obj.page = Math.max(1, Math.min($scope.obj.total, $scope.obj.page + delta));
                    };

                    $scope.$watch('angularMinutePager', function (v) {
                        if (v) {
                            angular.extend($scope.obj, {
                                count: v.getTotalItems(),
                                limit: $scope.obj.limit || v.getItemsPerPage(),
                                total: v.getTotalPages() + 1,
                                page: $scope.obj.page || v.getCurrentPage(),
                                pages: []
                            });

                            for (var i = 1; i <= $scope.obj.total; i++) {
                                $scope.obj.pages.push(i);
                            }

                            if ($scope.obj.limits.indexOf($scope.obj.limit) == -1) {
                                $scope.obj.limits.push($scope.obj.limit);
                            }
                        }
                    }, true);

                    $scope.$watch('obj.page', function (a, b) {
                        if (a != b) {
                            $scope.angularMinutePager.loadPage(a - 1, true, true);
                        }
                    });

                    $scope.$watch('obj.limit', function (a, b) {
                        if (a != b) {
                            $scope.angularMinutePager.setLimit(a);
                        }
                    });
                }
            };
        }]);
})();
