module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.ts?(x)',
            'src/**/*.snap',
            '!src/**/*.test.ts?(x)'
        ],
        tests: [
            'src/**/*.test.ts?(x)'
        ],

        env: {
            type: 'node',
            runner: 'node'
        },

        testFramework: 'jest',

        debug: true
    };
};