const grpc = require('grpc');

const server = new grpc.Server();
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');

var packageDefinition = protoLoader.loadSync(
    __dirname + '/../../googleapis/google/spanner/v1/spanner.proto',
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: [
            __dirname + '/../../googleapis',
            __dirname + '/../../protobuf/src'
        ]
    });

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

var result = [
    {
        "metadata": {
            "row_type": {
                "fields": [{
                    "name": "foo",
                    "type": {
                        "code": 6
                    }
                },
                {
                    "name": "barlist",
                    "type": {
                        "code": 8,
                        "array_element_type": {
                            "code": 9,
                            "struct_type": {
                                "fields": [{
                                    "name": "bar1",
                                    "type": {
                                        "code": 6
                                    }
                                }, {
                                    "name": "bar2",
                                    "type": {
                                        "code": 6
                                    }
                                }]
                            }
                        }
                    }
                }]
            },
            "transaction": {
                "id": 0
            }
        },
        "values": [
            {"string_value": "foo-1"},
            // [[
            //     [
            //         "bar1-1",
            //         "bar2-1"
            //     ]
            // ]],
            // ["foo-2"],
            // [[
            //     [
            //         "bar1-2",
            //         "bar2-2"
            //     ],
            //     [
            //         "bar1-3",
            //         "bar2-3"
            //     ]
            // ]]
        ],
        "chunkedValue": false,
        "resumeToken": ""
    // }, {
    //     "values": [
    //         [[
    //             [],
    //             [
    //                 "bar1-4",
    //                 "bar2-4"
    //             ]
    //         ]]
    //     ],
    //     "chunkedValue": false,
    //     "resumeToken": ""
    }
];

server.addService(protoDescriptor.google.spanner.v1.Spanner.service, {
    executeStreamingSql: (call) => {
        _.each(result, function (res) {
            call.write(res);
        });

        call.end();
    },
    createSession: (_, callback) => {
        callback(null, {name: 'projects/test/instances/a/databases/b/sessions/c'});
    }
});

server.bind('0.0.0.0:8080',
    grpc.ServerCredentials.createInsecure());

console.log('server started.');
server.start();
