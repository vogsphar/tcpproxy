let localhost='0.0.0.0'
let hosts = [
  [2222, '127.0.0.1', 22] // tunnel port 2222 to 22
]

if(process.env.LOCALHOST)
{
	localhost=process.env.LOCALHOST
}
if(process.env.RULES)
{
	hosts=process.env.RULES.split(',').map(line => line.split(':'))
}
var net = require('net')

let count = {}

function proxy (localport, remotehost, remoteport) {
  var server = net.createServer(function (socket) {
    var client = new net.Socket()
    console.log(new Date(), socket.remoteAddress)
    client.connect(remoteport, remotehost, function () {
      count[localport] = 1 + (count[localport] || 0)
      socket.pipe(client)
      client.pipe(socket)
    })
  })
  console.log(localhost+":"+localport+"->"+remotehost+":"+remoteport)
  server.listen({host:localhost,port:localport})
  return server // can be used to shut down server
}

hosts.forEach(x => { proxy(x[0], x[1], x[2]) })

setInterval(function () {
  console.log(new Date(), count)
}, 60 * 60 * 1000)

console.log('READY.')

process.on('uncaughtException', function (err) {
  console.error(err)
  console.log('Node NOT Exiting...')
})
