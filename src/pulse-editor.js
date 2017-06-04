angular.module('pulseApp').component('pulseEditor', {
    templateUrl: 'src/pulse-editor.html',
    controller: function ($scope, $rootScope, $location, $log) {
        var vm = this;

        const HEIGHT = 3;
        const COLORS = ['#FF3333', '#33CC33', '#3399FF', '#333333'];


        vm.lines = [];
        vm.diagramApi = null;
        var locationHash;

        function encodeLines(lines) {
            return _.map(lines, function (v) {
                return {n: v.name, i: v.input, c: v.color, h: v.height, x: v.xOffset, y: v.yOffset};
            });
        }

        function decodeLines(lines) {
            return _.map(lines, function (v) {
                return {name: v.n, input: v.i, color: v.c, height: v.h, xOffset: v.x, yOffset: v.y};
            });
        }

        function saveLines() {
            var data = encodeLines(vm.lines);
            data = angular.toJson(data, false);
            data = pako.deflate(data);
            data = base64js.fromByteArray(data);
            locationHash = data;
            $location.hash(data);
        }

        function loadLines() {
            if ($location.hash()) {
                try {
                    var data = $location.hash();
                    data = base64js.toByteArray(data);
                    data = pako.inflate(data, {to: 'string'});
                    data = angular.fromJson(data);
                    data = decodeLines(data);
                    vm.lines = data;
                    return;
                } catch (err) {
                    $log.error(err);
                }
            }
            vm.lines = [];
            vm.lines.push(createDefaultLine());
        }

        function getRandomColor() {
            return COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        function createDefaultLine() {
            return {
                name: 'Line' + vm.lines.length,
                input: '5 1 1',
                color: getRandomColor(),
                height: HEIGHT,
                xOffset: 1,
                yOffset: 1 + (HEIGHT + 1) * vm.lines.length
            };
        }

        vm.createLine = function () {
            var line = createDefaultLine();
            vm.lines.push(line);
            saveLines();
            vm.diagramApi.addLine(line);
        };

        vm.removeLine = function (index) {
            vm.lines.splice(index, 1);
            saveLines();
            vm.diagramApi.removeLine(index);
        };

        vm.lineChanged = function (index) {
            saveLines();
            vm.diagramApi.changeLine(index, vm.lines[index]);
        };

        $scope.$on('$locationChangeSuccess', function () {
            //handle browser's history events but prevent internal changes
            if ($location.hash() !== locationHash) {
                locationHash = $location.hash();
                $log.info('Restore lines from the hash');
                loadLines();
            }
        });
    }
});