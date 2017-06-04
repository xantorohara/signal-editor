angular.module('pulseApp').component('pulseDiagram', {
    templateUrl: 'src/pulse-diagram.html',
    bindings: {
        lines: '<',
        api: '=?',
        standalone: '<?'
    },

    controller: function ($log) {
        var vm = this;

        vm.$onInit = function () {
            vm.api = {
                addLine: function (line) {
                    vm.lines.push(mapLine(line));
                },
                removeLine: function (index) {
                    vm.lines.splice(index, 1);
                },
                changeLine: function (index, line) {
                    vm.lines[index] = mapLine(line);
                }
            };
        };

        vm.$onChanges = function (changes) {
            if (changes.lines) {
                vm.lines = changes.lines.currentValue.map(function (line) {
                    return mapLine(line);
                });
            }
        };

        function mapLine(line) {
            const SCALE = 10;

            const rising = 'v' + line.height * SCALE;
            const falling = 'v-' + line.height * SCALE;

            var values = line.input.split(' ');

            var out = ['M 0 0'];

            values.forEach(function (value, i) {
                out.push('h' + value * SCALE);
                out.push((i + 1) % 2 == 0 ? falling : rising);
            });

            return {
                name: line.name,
                color: line.color,
                path: out.join(' '),
                top: line.top * SCALE,
                left: line.left * SCALE,
                textTop: (line.height / 2) * SCALE
            }
        }
    }
});