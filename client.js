const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

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

const client = new protoDescriptor.google.spanner.v1.Spanner('localhost:8080',
    grpc.credentials.createInsecure());

var call = client.executeStreamingSql({
    session: "dfd"
});
call.on('data', function (res) {
    console.log(res);
});
