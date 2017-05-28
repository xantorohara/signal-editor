angular.module('pulseEditorApp').component('pulseDiagram', {
    templateUrl: 'pulse-diagram.component.html',
    controller: function ($scope) {
        const SCALE = 10;
        const HEIGHT = 3;
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

        $scope.addLine = function () {
            var line = {
                name: 'New',
                input: '3 1 1',
                color: '#1E90FF',
                height: HEIGHT,
                xOffset: 1,
                yOffset: 1 + (HEIGHT + 1) * $scope.lines.length
            };

            $scope.lineChanged(line);
            $scope.lines.push(line);
        };

        $scope.removeLine = function (index) {
            $scope.lines.splice(index, 1);
        };

        $scope.lineChanged = function (line) {
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
            line.textTop = (line.height/2) * SCALE;
        };


        angular.forEach($scope.lines, function (line, i) {
            $scope.lineChanged(line);
        });
    }
});