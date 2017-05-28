angular.module('pulseEditorApp').component('pulseDiagram', {
    templateUrl: 'pulse-diagram.component.html',
    controller: function ($scope, $rootScope, $log, $location) {

        const SCALE = 10;
        const HEIGHT = 3;
        $scope.lines = [];

        var locationHash;

        function encodeLines(lines) {
            return lines.map(function (v) {
                return {n: v.name, i: v.input, c: v.color, h: v.height, x: v.xOffset, y: v.yOffset};
            });
        }

        function decodeLines(lines) {
            return lines.map(function (v) {
                return {name: v.n, input: v.i, color: v.c, height: v.h, xOffset: v.x, yOffset: v.y};
            });
        }

        function saveLines() {
            var data = encodeLines($scope.lines);
            data = angular.toJson(data, false);
            data = pako.deflate(data);
            data = base64js.fromByteArray(data);
            // $log.info(data);
            locationHash = data;
            $location.hash(data);
        }

        function loadDefaultLines() {
            $scope.lines = [
                {
                    name: 'SDA',
                    input: '4 4 4 4 4 4 8 16 100',
                    color: '#32CD32',
                    height: HEIGHT,
                    xOffset: 1,
                    yOffset: 1

                },
                {
                    name: 'SCL',
                    input: '6 3 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 3 100',
                    color: '#1E90FF',
                    height: HEIGHT,
                    xOffset: 1,
                    yOffset: HEIGHT + 2
                }
            ];
        }

        function loadLines() {
            if ($location.hash()) {
                try {
                    var data = $location.hash();
                    data = base64js.toByteArray(data);
                    data = pako.inflate(data, {to: 'string'});
                    data = angular.fromJson(data);
                    data = decodeLines(data);
                    $scope.lines = data;
                    return;
                } catch (err) {
                    $log.error(err);
                }
            }
            loadDefaultLines();
        }

        function calculateLine(line) {
            var values = line.input.split(' ');

            var out = ['M 0 0'];

            angular.forEach(values, function (value, i) {
                out.push('h' + value * SCALE);

                if ((i + 1) % 2 == 0) {
                    out.push('v-' + line.height * SCALE);
                } else {
                    out.push('v' + line.height * SCALE);
                }
            });
            line.path = out.join(' ');
            line.top = line.yOffset * SCALE;
            line.left = line.xOffset * SCALE;
            line.textTop = (line.height / 2) * SCALE;
        }

        $scope.addLine = function () {
            var line = {
                name: 'New',
                input: '3 1 1',
                color: '#1E90FF',
                height: HEIGHT,
                xOffset: 1,
                yOffset: 1 + (HEIGHT + 1) * $scope.lines.length
            };

            calculateLine(line);
            $scope.lines.push(line);
            saveLines();
        };

        $scope.removeLine = function (index) {
            $scope.lines.splice(index, 1);
            saveLines();
        };

        $scope.lineChanged = function (line) {
            calculateLine(line);
            saveLines();
        };

        function refreshLines() {
            loadLines();
            angular.forEach($scope.lines, function (line) {
                calculateLine(line);
            });
        }

        // refreshLines();

        $scope.$on('$locationChangeSuccess', function () {
            //handle browser's history events but prevent internal changes
            if ($location.hash() != locationHash) {
                $log.info('Restore lines from the history');
                refreshLines()
            }
        });
    }
});