angular.module('pulseApp', ['angularResizable']).controller('DiagramDemoCtrl', function DiagramDemoCtrl($interval, $log) {
    var vm = this;
    vm.lines = [
        {
            name: 'SDA',
            // input: '4 4 4 4 4 4 8 16 1000',
            input: '1',
            color: '#33CC33',
            height: 3,
            xOffset: 1,
            yOffset: 1
        },
        {
            name: 'SCL',
            input: '6 3 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 3 1000',
            color: '#3399FF',
            height: 3,
            xOffset: 1,
            yOffset: 5
        },
        {
            name: 'Demo',
            input: '1000',
            color: '#FF3333',
            height: 3,
            xOffset: 1,
            yOffset: 10
        }
    ];

    // vm.test
    $interval(function () {
        // $log.info(new Date());
        vm.lines[0].name = new Date();
        vm.lines[0].input += ' 1';
    }, 1000);
});